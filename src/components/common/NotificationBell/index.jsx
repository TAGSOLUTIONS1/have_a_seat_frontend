import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useNotifications } from '@/contexts/notificationContext/NotificationProvider';

const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  // Debug logging to see what we're getting
  // console.log("NotificationBell - notifications:", notifications);
  // console.log("NotificationBell - unreadCount:", unreadCount);
  // console.log("NotificationBell - unreadCount type:", typeof unreadCount);
  // console.log("NotificationBell - unreadCount > 0:", unreadCount > 0);

  const handleNotificationClick = async (notification) => {
    // Handle both field name variations
    const status = notification.status || notification.is_read || 'unread';
    if (status === 'unread') {
      await markAsRead(notification.id);
    }
    // Handle notification action based on type
    handleNotificationAction(notification);
  };

  const handleNotificationAction = (notification) => {
    switch (notification.notification_type || notification.type) {
      case 'reservation_confirmation':
        // Navigate to reservation details
        console.log('Navigate to reservation:', notification.metadata || notification.data);
        break;
      case 'reservation_cancellation':
        // Handle reservation cancellation
        console.log('Reservation cancelled:', notification.metadata || notification.data);
        break;
      case 'reservation_reminder':
        // Navigate to reservation details
        console.log('Navigate to reservation:', notification.metadata || notification.data);
        break;
      case 'system_announcement':
        // Show announcement modal
        console.log('Show announcement:', notification.message);
        break;
      default:
        console.log('Unknown notification type:', notification.notification_type || notification.type);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Update local state immediately to prevent flickering
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        status: 'read',
        is_read: 'read'
      }));
      
      // Optimistically update the UI
      // Note: This will be overridden when the context updates, but prevents flickering
      
      // Call the API
      await markAllAsRead();
      
      console.log('All notifications marked as read successfully');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Just now';
    }
  };

  // Helper function to get notification status
  const getNotificationStatus = (notification) => {
    return notification.status || notification.is_read || 'unread';
  };

  // Helper function to get notification time
  const getNotificationTime = (notification) => {
    return notification.sent_at || notification.created_at || notification.updated_at;
  };

  // Helper function to get notification type
  const getNotificationType = (notification) => {
    return notification.notification_type || notification.type || 'unknown';
  };

  return (
    <div className="relative inline-block">
      {/* Notification Bell Button */}
      <button
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {/* Show badge if unreadCount > 0 OR if there are unread notifications */}
        {(unreadCount > 0 || notifications.some(n => (n.status || n.is_read) === 'unread')) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount || notifications.filter(n => (n.status || n.is_read) === 'unread').length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button
              className="p-1 hover:bg-purple-600 rounded-full transition-colors duration-200"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          {(() => {
            // Calculate unread count from actual notifications for more stable display
            const actualUnreadCount = notifications.filter(n => (n.status || n.is_read) === 'unread').length;
            return actualUnreadCount > 0 ? (
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={handleMarkAllAsRead}
                >
                  <Check className="w-4 h-4" />
                  Mark all as read ({actualUnreadCount})
                </button>
              </div>
            ) : null;
          })()}

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    getNotificationStatus(notification) === 'unread' ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Time - Top Right */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {notification.title}
                      </h4>
                    </div>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTime(getNotificationTime(notification))}
                    </span>
                  </div>
                  
                  {/* Message */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {notification.message}
                  </p>
                  
                  {/* Unread Indicator */}
                  {getNotificationStatus(notification) === 'unread' && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-purple-600 font-medium">New</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button className="w-full text-center text-purple-600 hover:text-purple-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 