
import React from 'react';
import { cn } from '@/lib/utils';

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isOnline: boolean;
  unreadCount?: number;
}

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedContact,
  onSelectContact
}) => {
  return (
    <div className="space-y-1 p-2">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => onSelectContact(contact)}
          className={cn(
            "flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]",
            selectedContact?.id === contact.id && "bg-chat-primary/10 border border-chat-primary/20"
          )}
        >
          {/* Avatar */}
          <div className="relative mr-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl shadow-md">
              {contact.avatar}
            </div>
            {contact.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={cn(
                "font-medium text-gray-900 truncate",
                contact.unreadCount && "font-semibold"
              )}>
                {contact.name}
              </h3>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {contact.timestamp}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className={cn(
                "text-sm text-gray-600 truncate",
                contact.unreadCount && "font-medium text-gray-900"
              )}>
                {contact.lastMessage}
              </p>
              {contact.unreadCount && (
                <span className="bg-chat-primary text-white text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0 animate-pulse">
                  {contact.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
