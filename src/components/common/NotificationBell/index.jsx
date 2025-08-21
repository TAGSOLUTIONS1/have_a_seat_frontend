import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '@/contexts/notificationContext/NotificationProvider';
import './notificationBell.css';

const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = async (notification) => {
    if (notification.status === 'unread') {
      await markAsRead(notification.id);
    }
    // Handle notification action based on type
    handleNotificationAction(notification);
  };

  const handleNotificationAction = (notification) => {
    switch (notification.type) {
      case 'reservation_confirmation':
        // Navigate to reservation details
        console.log('Navigate to reservation:', notification.data);
        break;
      case 'reservation_reminder':
        // Navigate to reservation details
        console.log('Navigate to reservation:', notification.data);
        break;
      case 'system_announcement':
        // Show announcement modal
        console.log('Show announcement:', notification.message);
        break;
      default:
        console.log('Unknown notification type:', notification.type);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const formatTime = (timestamp) => {
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
  };

  return (
    <div className="notification-bell-container">
      {/* Notification Bell Button */}
      <button
        className="notification-bell-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="notification-bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3 className="notification-title">Notifications</h3>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
            >
              <X className="close-icon" />
            </button>
          </div>

          <div className="notification-actions">
            {unreadCount > 0 && (
              <button
                className="mark-all-read-button"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell className="no-notifications-icon" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.status}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <h4 className="notification-item-title">
                      {notification.title}
                    </h4>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <div className="notification-meta">
                      <span className="notification-type">
                        {notification.type.replace('_', ' ')}
                      </span>
                      <span className="notification-time">
                        {formatTime(notification.sent_at)}
                      </span>
                    </div>
                  </div>
                  {notification.status === 'unread' && (
                    <div className="unread-indicator" />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button className="view-all-button">
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