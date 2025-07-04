
import React from 'react';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, TrendingUp, AlertCircle, Clock, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications = () => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bet_update': return 'bg-green-600';
      case 'value_bet': return 'bg-blue-600';
      case 'system': return 'bg-purple-600';
      case 'promotion': return 'bg-orange-600';
      case 'payment': return 'bg-yellow-600';
      case 'verification': return 'bg-cyan-600';
      default: return 'bg-gray-600';
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

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Bell className="mr-3 h-8 w-8 text-blue-600" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-3 bg-red-600 text-white">
                    {unreadCount} unread
                  </Badge>
                )}
              </h1>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" disabled={isLoading}>
                Mark All as Read
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">Stay updated with your betting activity and new opportunities</p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up! New notifications will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => {
                  if (!notification.read) markAsRead(notification.id);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className={`text-lg ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </CardTitle>
                          <Badge className={`${getTypeColor(notification.type)} text-white text-xs`}>
                            {notification.type.replace('_', ' ')}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeAgo(notification.created_at)}</span>
                    </div>
                  </div>
                </CardHeader>
                {notification.details && (
                  <CardContent>
                    <div className={`text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.details}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
