
import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isSent: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface MessageBubbleProps {
  message: Message;
  animationDelay?: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, animationDelay = 0 }) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-chat-primary" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex animate-bubble-pop",
        message.isSent ? "justify-end" : "justify-start"
      )}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm relative group",
          message.isSent
            ? "bg-chat-bubble-sent text-white rounded-br-md"
            : "bg-chat-bubble-received text-gray-900 border border-gray-200 rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed break-words">{message.text}</p>
        
        <div className={cn(
          "flex items-center justify-end mt-1 space-x-1",
          message.isSent ? "text-blue-100" : "text-gray-500"
        )}>
          <span className="text-xs">{message.timestamp}</span>
          {message.isSent && getStatusIcon()}
        </div>

        {/* Message tail */}
        <div className={cn(
          "absolute top-0 w-3 h-3 transform rotate-45",
          message.isSent
            ? "bg-chat-bubble-sent -right-1"
            : "bg-chat-bubble-received border-r border-b border-gray-200 -left-1"
        )} />
      </div>
    </div>
  );
};

export default MessageBubble;
