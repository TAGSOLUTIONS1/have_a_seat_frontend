import axios from 'axios';
import { Base_Url } from '@/baseUrl';

class NotificationService {
  constructor() {
    this.baseURL = Base_Url;
  }

  // Get auth headers with passed auth state
  getAuthHeaders(authState) {
    return {
      'Authorization': `Bearer ${authState?.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // GET User Notifications
  async getNotifications(authState, page = 1, size = 20, unreadOnly = false) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      if (unreadOnly) {
        params.append('unread_only', 'true');
      }

      const response = await axios.get(
        `${this.baseURL}/api/v1/notifications?${params}`,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // GET Single Notification
  async getNotification(authState, notificationId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/notifications/${notificationId}`,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  }

  // MARK Notification as Read
  async markAsRead(authState, notificationId) {
    try {
      const response = await axios.patch(
        `${this.baseURL}/api/v1/notifications/${notificationId}/read`,
        {},
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // MARK ALL Notifications as Read
  async markAllAsRead(authState) {
    try {
      const response = await axios.patch(
        `${this.baseURL}/api/v1/notifications/read-all`,
        {},
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // GET Notification Statistics
  async getNotificationStats(authState) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/notifications/stats`,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  // GET User Notification Preferences
  async getPreferences(authState) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/preferences`,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  }

  // UPDATE User Notification Preferences
  async updatePreference(authState, notificationType, preferences) {
    try {
      const response = await axios.put(
        `${this.baseURL}/api/v1/preferences/${notificationType}`,
        preferences,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  // CREATE New Notification
  async createNotification(authState, notificationData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/notifications/create/`,
        notificationData,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // WebSocket connection for real-time notifications
  connectWebSocket(token) {
    const wsUrl = `ws://localhost:8000/ws/notifications/${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to notifications WebSocket');
      // Request recent notifications
      ws.send(JSON.stringify({
        type: 'get_notifications'
      }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return ws;
  }
}

export default new NotificationService(); 