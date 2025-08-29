// components/ChatRoomManager.tsx
'use client';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import { X, Plus, Search, Users, Lock, Globe } from 'lucide-react';
import { chatApi } from '@/lib/chatApi';
import type { ChatRoom, User, CreateChatRoomData } from '@/types/chat';

interface ChatRoomManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated?: (room: ChatRoom) => void;
}

type ActiveTab = 'create' | 'join';

interface FormData extends CreateChatRoomData {
  name: string;
}

const ChatRoomManager: React.FC<ChatRoomManagerProps> = ({ 
  isOpen, 
  onClose, 
  onRoomCreated 
}) => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    display_name: '',
    description: '',
    is_private: false,
    member_ids: []
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [availableRooms, setAvailableRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && activeTab === 'join') {
      loadAvailableRooms();
    }
  }, [isOpen, activeTab]);

  const loadAvailableRooms = async (): Promise<void> => {
    try {
      setLoading(true);
      const rooms = await chatApi.getChatRooms();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error loading available rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await chatApi.searchUsers(query);
      // Filter out already selected users
      const filteredResults = results.filter(
        user => !selectedUsers.find(selected => selected.id === user.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleUserSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const addUser = (user: User): void => {
    setSelectedUsers(prev => [...prev, user]);
    setFormData(prev => ({
      ...prev,
      member_ids: [...(prev.member_ids || []), user.id]
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeUser = (userId: string): void => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
    setFormData(prev => ({
      ...prev,
      member_ids: (prev.member_ids || []).filter(id => id !== userId)
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateRoomName = (displayName: string): string => {
    // Generate a URL-friendly room name from display name
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  };

  const handleCreateRoom = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.display_name.trim()) {
      setError('Room name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const roomData: CreateChatRoomData = {
        name: formData.name || generateRoomName(formData.display_name),
        display_name: formData.display_name.trim(),
        description: formData.description?.trim() || '',
        is_private: formData.is_private,
        member_ids: formData.member_ids
      };

      const newRoom = await chatApi.createChatRoom(roomData);
      
      // Reset form
      setFormData({
        name: '',
        display_name: '',
        description: '',
        is_private: false,
        member_ids: []
      });
      setSelectedUsers([]);
      
      // Notify parent component
      if (onRoomCreated) {
        onRoomCreated(newRoom);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating room:', error);
      setError(error instanceof Error ? error.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string): Promise<void> => {
    setLoading(true);
    try {
      await chatApi.joinRoom(roomId);
      
      // Refresh available rooms
      await loadAvailableRooms();
      
      // Notify parent component
      if (onRoomCreated) {
        const room = availableRooms.find(r => r.id === roomId);
        if (room) {
          onRoomCreated(room);
        }
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setError(error instanceof Error ? error.message : 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = (user: User): string => {
    return user.full_name || user.username || user.email?.split('@')[0] || 'Unknown User';
  };

  const getUserAvatar = (user: User): string => {
    if (user.profile_image?.url) {
      return user.profile_image.url;
    }
    const initials = getUserDisplayName(user).substring(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=ffffff&size=32`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 font-playfair">
            Chat Rooms
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'create'
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            type="button"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create Room
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'join'
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            type="button"
          >
            <Search className="w-4 h-4 inline mr-2" />
            Join Room
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Create Room Tab */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name *
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                placeholder="Enter room name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="What's this room about?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_private"
                id="is_private"
                checked={formData.is_private}
                onChange={handleInputChange}
                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label htmlFor="is_private" className="ml-2 text-sm text-gray-700 flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Private room
              </label>
            </div>

            {/* Add Members */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Members
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleUserSearch}
                  placeholder="Search users by name or email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
                    {searchResults.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => addUser(user)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <img
                          src={getUserAvatar(user)}
                          alt={getUserDisplayName(user)}
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getUserDisplayName(user)}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                    >
                      <img
                        src={getUserAvatar(user)}
                        alt={getUserDisplayName(user)}
                        className="w-4 h-4 rounded-full"
                      />
                      <span className="text-sm text-gray-700">
                        {getUserDisplayName(user)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeUser(user.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.display_name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </form>
        )}

        {/* Join Room Tab */}
        {activeTab === 'join' && (
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Browse and join public chat rooms
            </p>
            
            <div className="space-y-3">
              {availableRooms.filter(room => !room.is_private).map(room => (
                <div
                  key={room.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {room.display_name || room.name}
                        </h3>
                        <Globe className="w-4 h-4 text-green-500" />
                      </div>
                      {room.description && (
                        <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {room.member_count} members
                        </span>
                        {room.online_count > 0 && (
                          <span className="flex items-center text-green-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            {room.online_count} online
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={loading}
                      className="ml-4 px-3 py-1 text-xs font-medium text-accent border border-accent rounded-md hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                      type="button"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
              
              {availableRooms.filter(room => !room.is_private).length === 0 && (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No public rooms available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomManager;