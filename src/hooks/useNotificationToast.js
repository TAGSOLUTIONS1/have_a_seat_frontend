import { useNotifications } from '@/contexts/notificationContext/NotificationProvider';
import notificationService from '@/services/notificationService';
import { useAuth } from '@/contexts/authContext/AuthProvider';

export const useNotificationToast = () => {
  const { authState } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    loadNotifications,
    loadStats 
  } = useNotifications();

  const showNotification = async (type, title, message, data = {}) => {
    try {
      // Create notification in backend
      const notificationData = {
        title: title,
        message: message,
        notification_type: type,
        reservation_id: data.reservation_id || null,
        user_id: data.user_id || null,
        metadata: data // Store additional data
      };

      const result = await notificationService.createNotification(authState, notificationData);
      
      // Refresh notifications to show the new one
      await loadNotifications();
      await loadStats();
      
      console.log('Notification created successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to create notification:', error);
      // You could show a toast error here if you want
      throw error;
    }
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