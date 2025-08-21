import { useNotifications } from '@/contexts/notificationContext/NotificationProvider';

export const useNotificationToast = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    loadNotifications,
    loadStats 
  } = useNotifications();

  const showNotification = (type, title, message, data = {}) => {
    // This would typically call an API to create a notification
    // For now, we'll just log it
    console.log('Notification:', { type, title, message, data });
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead();
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  };

  const refreshNotifications = async () => {
    try {
      await loadNotifications();
      await loadStats();
      return true;
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
      return false;
    }
  };

  return {
    notifications,
    unreadCount,
    showNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshNotifications
  };
}; 