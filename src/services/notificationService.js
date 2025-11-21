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

  // GET User Notifications (with pagination using limit/offset)
  async getNotifications(authState, limit = 50, offset = 0) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await axios.get(
        `${this.baseURL}/api/v1/notifications/?${params}`,
        { headers: this.getAuthHeaders(authState) }
      );
      // API returns array directly
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // GET Unread Notifications
  async getUnreadNotifications(authState) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/notifications/unread/`,
        { headers: this.getAuthHeaders(authState) }
      );
      // API returns array directly
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  }

  // GET Notification Count
  async getNotificationCount(authState) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/notifications/count/`,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notification count:', error);
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
        `${this.baseURL}/api/v1/notifications/${notificationId}/read/`,
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
        `${this.baseURL}/api/v1/notifications/read-all/`,
        {},
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // DELETE Notification
  async deleteNotification(authState, notificationId) {
    try {
      const response = await axios.delete(
        `${this.baseURL}/api/v1/notifications/${notificationId}/`,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // GET Notification Statistics (legacy - uses count endpoint)
  async getNotificationStats(authState) {
    try {
      // Use the count endpoint which returns unread_count and total_count
      const response = await axios.get(
        `${this.baseURL}/api/v1/notifications/count/`,
        { headers: this.getAuthHeaders(authState) }
      );
      // Transform to match expected format
      return {
        unread_count: response.data.unread_count || 0,
        total_notifications: response.data.total_count || 0,
        total_count: response.data.total_count || 0
      };
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
      // Remove user_id from payload as it's automatically set from authenticated user
      const { user_id, ...payload } = notificationData;
      
      const response = await axios.post(
        `${this.baseURL}/api/v1/notifications/create/`,
        payload,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // REGISTER Device for Push Notifications
  async registerDevice(authState, deviceData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/notifications/register-device`,
        deviceData,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  }

  // REGISTER Device (Legacy Endpoint)
  async registerDeviceLegacy(authState, expoPushToken) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/notifications/register-device-legacy`,
        { expo_push_token: expoPushToken },
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error registering device (legacy):', error);
      throw error;
    }
  }

  // GET Device Status
  async getDeviceStatus(authState) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/notifications/device-status`,
        { headers: this.getAuthHeaders(authState) }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching device status:', error);
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