
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, Clock, TrendingUp, AlertCircle, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bet_update': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'value_bet': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'system': return <Bell className="h-4 w-4 text-purple-600" />;
      case 'promotion': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-yellow-600" />;
      case 'verification': return <ShieldCheck className="h-4 w-4 text-cyan-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-96 bg-card border border-border rounded-lg shadow-lg z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-600 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up! New notifications will appear here.</p>
              </div>
            ) : (
              <>
                {notifications.slice(0, 6).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                    }}
                    className={`block p-3 rounded-lg transition-colors cursor-pointer ${
                      notification.read 
                        ? 'bg-muted/30 hover:bg-muted/50' 
                        : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                        </div>
                        <p className={`text-xs mt-1 ${
                          notification.read ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notifications.length > 6 && (
                  <Link
                    to="/notifications"
                    onClick={onClose}
                    className="block p-3 text-center text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    View all {notifications.length} notifications
                  </Link>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || isLoading}
            >
              Mark All as Read
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link to="/notifications" onClick={onClose}>
                View All
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default NotificationPanel;
