import React, { useEffect, useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useNotifications } from '@/contexts/notificationContext/NotificationProvider';
import './notificationToast.css';

const NotificationToast = () => {
  const { notifications } = useNotifications();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      // Check if this is a new notification (within last 5 seconds)
      const now = new Date();
      const notificationTime = new Date(latestNotification.sent_at);
      const timeDiff = (now - notificationTime) / 1000;
      
      if (timeDiff < 5 && latestNotification.status === 'unread') {
        // Add new toast
        const newToast = {
          id: Date.now(),
          notification: latestNotification,
          visible: true
        };
        
        setToasts(prev => [newToast, ...prev.slice(0, 2)]); // Keep max 3 toasts
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setToasts(prev => 
            prev.map(toast => 
              toast.id === newToast.id 
                ? { ...toast, visible: false }
                : toast
            )
          );
          
          // Remove after animation
          setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
          }, 300);
        }, 5000);
      }
    }
  }, [notifications]);

  const handleClose = (toastId) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === toastId 
          ? { ...toast, visible: false }
          : toast
      )
    );
    
    // Remove after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== toastId));
    }, 300);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'reservation_confirmation': '✅',
      'reservation_reminder': '⏰',
      'reservation_cancellation': '❌',
      'reservation_modification': '✏️',
      'restaurant_updates': '🏪',
      'special_offers': '🎉',
      'system_announcement': '📢',
      'account_updates': '🔒'
    };
    return icons[type] || '🔔';
  };

  const getNotificationTypeLabel = (type) => {
    const labels = {
      'reservation_confirmation': 'Reservation Confirmed',
      'reservation_reminder': 'Reservation Reminder',
      'reservation_cancellation': 'Reservation Cancelled',
      'reservation_modification': 'Reservation Modified',
      'restaurant_updates': 'Restaurant Update',
      'special_offers': 'Special Offer',
      'system_announcement': 'System Announcement',
      'account_updates': 'Account Update'
    };
    return labels[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (toasts.length === 0) return null;

  return (
    <div className="notification-toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`notification-toast ${toast.visible ? 'visible' : 'hidden'}`}
        >
          <div className="toast-header">
            <div className="toast-icon">
              {getNotificationIcon(toast.notification.type)}
            </div>
            <div className="toast-type">
              {getNotificationTypeLabel(toast.notification.type)}
            </div>
            <button
              className="toast-close"
              onClick={() => handleClose(toast.id)}
              aria-label="Close notification"
            >
              <X className="close-icon" />
            </button>
          </div>
          
          <div className="toast-content">
            <h4 className="toast-title">
              {toast.notification.title}
            </h4>
            <p className="toast-message">
              {toast.notification.message}
            </p>
          </div>
          
          <div className="toast-actions">
            <button className="toast-action-button">
              <Check className="action-icon" />
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast; 