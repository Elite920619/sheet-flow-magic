
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

const ProfileAvatar = ({ size = 'md', showStatus = false }: ProfileAvatarProps) => {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-400';
      case 'busy': return 'bg-orange-400';
      case 'do-not-disturb': return 'bg-red-400';
      case 'away': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const userStatus = profile?.status || 'available';

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} relative`}>
        <AvatarImage src={profile?.avatar_url || undefined} />
        <AvatarFallback className="bg-blue-100 text-blue-700">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
        
        {showStatus && (
          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(userStatus)}`} />
        )}
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
