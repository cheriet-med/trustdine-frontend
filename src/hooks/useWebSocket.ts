// hooks/useWebSocket.ts
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { Message, User, WebSocketMessage } from '@/types/chat';

interface UseWebSocketReturn {
  messages: Message[];
  onlineUsers: User[];
  typingUsers: User[];
  isConnected: boolean;
  sendMessage: (content: string, messageType?: string, parentMessageId?: string | null) => boolean;
  sendTyping: (isTyping: boolean) => void;
  sendReadReceipt: (messageId: string) => void;
  reconnect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (roomName?: string): UseWebSocketReturn => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wsUrl = `ws://api.goamico.com/ws/chat/${roomName}/`;

  const connect = useCallback(() => {
    if (!roomName || status !== 'authenticated' || !session?.user?.id) {
      console.log('Cannot connect: missing requirements', { 
        roomName, 
        status, 
        userId: session?.user?.id 
      });
      return;
    }

    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log('Connected to WebSocket');
        
        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            const heartbeatMessage: WebSocketMessage = {
              type: 'heartbeat',
              user_id: session.user.id
            };
            ws.current.send(JSON.stringify(heartbeatMessage));
          }
        }, 30000); // 30 seconds
      };

      ws.current.onmessage = (event: MessageEvent) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          switch (data.type) {
            case 'message':
              if (data.data) {
                setMessages(prev => {
                  // Avoid duplicates
                  if (prev.find(msg => msg.id === data.data!.id)) {
                    return prev;
                  }
                  return [...prev, data.data!];
                });
              }
              break;
              
            case 'typing':
              if (data.user && data.is_typing !== undefined) {
                setTypingUsers(prev => {
                  const filtered = prev.filter(u => u.id !== data.user!.id);
                  if (data.is_typing) {
                    return [...filtered, data.user!];
                  }
                  return filtered;
                });
              }
              break;
              
            case 'user_status':
              if (data.user_data && data.action) {
                if (data.action === 'joined') {
                  setOnlineUsers(prev => {
                    if (!prev.find(u => u.id === data.user_data!.id)) {
                      return [...prev, data.user_data!];
                    }
                    return prev;
                  });
                } else if (data.action === 'left') {
                  setOnlineUsers(prev => prev.filter(u => u.id !== data.user_data!.id));
                  setTypingUsers(prev => prev.filter(u => u.id !== data.user_data!.id));
                }
              }
              break;
              
            case 'error':
              console.error('WebSocket error:', data.message);
              break;
              
            case 'heartbeat_ack':
              // Heartbeat acknowledged
              break;
              
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event: CloseEvent) => {
        setIsConnected(false);
        console.log('Disconnected from WebSocket', { 
          code: event.code, 
          reason: event.reason 
        });
        
        // Clear intervals
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        
        // Attempt to reconnect after 3 seconds if not a normal close
        if (event.code !== 1000 && status === 'authenticated') {
          console.log('Attempting to reconnect in 3 seconds...');
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }
      };

      ws.current.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [roomName, session?.user?.id, status, wsUrl]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close(1000); // Normal close
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
  }, []);

  const sendMessage = useCallback((
    content: string, 
    messageType: string = 'text', 
    parentMessageId: string | null = null
  ): boolean => {
    if (ws.current && isConnected && content.trim() && session?.user?.id) {
      const messageData: WebSocketMessage = {
        type: 'message',
        message: content,
        message_type: messageType,
        parent_message_id: parentMessageId,
        user_id: session.user.id
      };
      ws.current.send(JSON.stringify(messageData));
      return true;
    }
    return false;
  }, [isConnected, session?.user?.id]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (ws.current && isConnected && session?.user?.id) {
      const typingMessage: WebSocketMessage = {
        type: 'typing',
        is_typing: isTyping,
        user_id: session.user.id
      };
      ws.current.send(JSON.stringify(typingMessage));
      
      // Auto-stop typing after 3 seconds
      if (isTyping) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(false);
        }, 3000);
      }
    }
  }, [isConnected, session?.user?.id]);

  const sendReadReceipt = useCallback((messageId: string) => {
    if (ws.current && isConnected && session?.user?.id) {
      const receiptMessage: WebSocketMessage = {
        type: 'read_receipt',
        message_id: messageId,
        user_id: session.user.id
      };
      ws.current.send(JSON.stringify(receiptMessage));
    }
  }, [isConnected, session?.user?.id]);

  // Connect when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      connect();
    }
    return disconnect;
  }, [connect, disconnect, status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [disconnect]);

  return {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    sendTyping,
    sendReadReceipt,
    reconnect: connect,
    disconnect
  };
};