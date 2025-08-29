'use client';
import { SessionProvider } from 'next-auth/react';
import EnhancedMessagesComponent from '@/components/EnhancedMessagesComponent';

export default function ChatPage() {
  return (
    <SessionProvider>
      <div className="h-screen">
        <EnhancedMessagesComponent />
      </div>
    </SessionProvider>
  );
}