// types/chat.ts
export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  username?: string | null;
  display_name?: string;
  avatar?: string | null;
  profile_image?: {
    url: string;
  } | null;
  is_active: boolean;
  title?: string | null;
  location?: string | null;
  is_superuser?: boolean;
  is_staff?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  created_at: string;
  created_by?: User | null;
  members?: User[];
  member_ids?: string[];
  member_count: number;
  is_private: boolean;
  is_active: boolean;
  latest_message?: Message | null;
  message_count: number;
  online_users?: OnlineUser[];
  online_count: number;
  unread_count: number;
  is_favorite?: boolean;
}

export interface Message {
  id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  edited_at?: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  user: User;
  room: string;
  parent_message?: string | null;
  replies?: Message[];
  reply_count: number;
  read_by_users?: User[];
  is_read: boolean;
}

export interface OnlineUser {
  user: User;
  last_seen: string;
}

export interface CreateMessageData {
  content: string;
  message_type?: 'text' | 'image' | 'file' | 'system';
  parent_message?: string | null;
}

export interface CreateChatRoomData {
  name?: string;
  display_name: string;
  description?: string;
  is_private: boolean;
  member_ids?: string[];
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'user_status' | 'error' | 'heartbeat' | 'heartbeat_ack' | 'read_receipt';
  data?: Message;
  message?: string;
  message_type?: string;
  parent_message_id?: string | null;
  user_id?: string;
  user?: User;
  user_data?: User;
  is_typing?: boolean;
  action?: 'joined' | 'left';
  message_id?: string;
}

export interface ChatApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}