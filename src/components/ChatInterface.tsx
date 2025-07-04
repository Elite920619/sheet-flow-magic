
import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ContactList from './ContactList';
import MessageBubble from './MessageBubble';
import ChatHeader from './ChatHeader';

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isSent: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isOnline: boolean;
  unreadCount?: number;
}

const ChatInterface = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const contacts: Contact[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2:30 PM',
      avatar: '👨‍💻',
      isOnline: true,
      unreadCount: 3
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      lastMessage: 'Thanks for the update!',
      timestamp: '1:45 PM',
      avatar: '👩‍🎨',
      isOnline: true
    },
    {
      id: 3,
      name: 'Team Chat',
      lastMessage: 'Meeting at 3 PM today',
      timestamp: '12:30 PM',
      avatar: '👥',
      isOnline: false,
      unreadCount: 1
    },
    {
      id: 4,
      name: 'Mike Chen',
      lastMessage: 'Let me know when you\'re free',
      timestamp: '11:15 AM',
      avatar: '👨‍🔬',
      isOnline: false
    },
    {
      id: 5,
      name: 'Design Team',
      lastMessage: 'New mockups are ready',
      timestamp: 'Yesterday',
      avatar: '🎨',
      isOnline: true,
      unreadCount: 5
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      text: 'Hey! How are you doing?',
      timestamp: '2:25 PM',
      isSent: false,
      status: 'read'
    },
    {
      id: 2,
      text: 'I\'m doing great! Just working on some new projects. How about you?',
      timestamp: '2:27 PM',
      isSent: true,
      status: 'read'
    },
    {
      id: 3,
      text: 'That sounds exciting! I\'d love to hear more about it.',
      timestamp: '2:28 PM',
      isSent: false,
      status: 'read'
    },
    {
      id: 4,
      text: 'Sure! I\'m building a chat platform with React. It\'s been really fun to work on.',
      timestamp: '2:30 PM',
      isSent: true,
      status: 'delivered'
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-chat-bg to-slate-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-none focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          <ContactList
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelectContact={setSelectedContact}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <ChatHeader contact={selectedContact} />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-transparent">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12 py-3 rounded-2xl border-gray-200 focus:border-chat-primary transition-colors"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="rounded-full w-12 h-12 bg-chat-primary hover:bg-chat-secondary transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Welcome Screen
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Welcome to Chat
              </h2>
              <p className="text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
