
import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isOnline: boolean;
  unreadCount?: number;
}

interface ChatHeaderProps {
  contact: Contact;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-lg shadow-md">
              {contact.avatar}
            </div>
            {contact.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-semibold text-gray-900">{contact.name}</h2>
            <p className="text-xs text-gray-500">
              {contact.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full w-10 h-10 hover:bg-gray-100 transition-colors"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full w-10 h-10 hover:bg-gray-100 transition-colors"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full w-10 h-10 hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
