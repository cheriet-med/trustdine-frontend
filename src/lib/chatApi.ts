// lib/chatApi.ts
import { getSession } from 'next-auth/react';
import type { 
  ChatRoom, 
  Message, 
  User, 
  OnlineUser, 
  CreateChatRoomData, 
  CreateMessageData,
  ChatApiResponse,
  PaginatedResponse
} from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.goamico.com';

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Helper function to get auth headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (session?.user?.access_token) {
    headers.Authorization = `JWT ${session.user.access_token}`;
  }
  
  return headers;
}

// Generic API request function
async function apiRequest<T = any>(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api/chat${endpoint}`;
  const headers = await getAuthHeaders();
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized');
      }
      
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      
      throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response as any;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

export const chatApi = {
  // Chat room operations
  async getChatRooms(): Promise<ChatRoom[]> {
    return apiRequest<ChatRoom[]>('/chatrooms/');
  },

  async getChatRoom(roomId: string): Promise<ChatRoom> {
    return apiRequest<ChatRoom>(`/chatrooms/${roomId}/`);
  },

  async createChatRoom(roomData: CreateChatRoomData): Promise<ChatRoom> {
    return apiRequest<ChatRoom>('/chatrooms/', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  async updateChatRoom(roomId: string, roomData: Partial<CreateChatRoomData>): Promise<ChatRoom> {
    return apiRequest<ChatRoom>(`/chatrooms/${roomId}/`, {
      method: 'PATCH',
      body: JSON.stringify(roomData),
    });
  },

  async deleteChatRoom(roomId: string): Promise<void> {
    return apiRequest<void>(`/chatrooms/${roomId}/`, {
      method: 'DELETE',
    });
  },

  // Room membership
  async joinRoom(roomId: string): Promise<ChatApiResponse> {
    return apiRequest<ChatApiResponse>(`/chatrooms/${roomId}/join/`, {
      method: 'POST',
    });
  },

  async leaveRoom(roomId: string): Promise<ChatApiResponse> {
    return apiRequest<ChatApiResponse>(`/chatrooms/${roomId}/leave/`, {
      method: 'POST',
    });
  },

  async getRoomMembers(roomId: string): Promise<User[]> {
    return apiRequest<User[]>(`/chatrooms/${roomId}/members/`);
  },

  async getOnlineUsers(roomId: string): Promise<OnlineUser[]> {
    return apiRequest<OnlineUser[]>(`/chatrooms/${roomId}/online_users/`);
  },

  async markOnline(roomId: string): Promise<ChatApiResponse> {
    return apiRequest<ChatApiResponse>(`/chatrooms/${roomId}/mark_online/`, {
      method: 'POST',
    });
  },

  // Message operations
  async getRoomMessages(
    roomId: string, 
    params: Record<string, string | number> = {}
  ): Promise<Message[]> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const endpoint = `/chatrooms/${roomId}/messages/${queryString ? `?${queryString}` : ''}`;
    return apiRequest<Message[]>(endpoint);
  },

  async sendMessageViaAPI(roomId: string, messageData: CreateMessageData): Promise<Message> {
    return apiRequest<Message>(`/chatrooms/${roomId}/send_message/`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  async getMessages(params: Record<string, string | number> = {}): Promise<Message[]> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    const endpoint = `/messages/${queryString ? `?${queryString}` : ''}`;
    return apiRequest<Message[]>(endpoint);
  },

  async createMessage(messageData: CreateMessageData & { room: string }): Promise<Message> {
    return apiRequest<Message>('/messages/', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  async markMessageRead(messageId: string): Promise<ChatApiResponse> {
    return apiRequest<ChatApiResponse>(`/messages/${messageId}/mark_read/`, {
      method: 'POST',
    });
  },

  async editMessage(messageId: string, content: string): Promise<Message> {
    return apiRequest<Message>(`/messages/${messageId}/edit/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async deleteMessage(messageId: string): Promise<ChatApiResponse> {
    return apiRequest<ChatApiResponse>(`/messages/${messageId}/soft_delete/`, {
      method: 'DELETE',
    });
  },

  // User search
  async searchUsers(query: string): Promise<User[]> {
    return apiRequest<User[]>(`/users/search/?q=${encodeURIComponent(query)}`);
  }
};