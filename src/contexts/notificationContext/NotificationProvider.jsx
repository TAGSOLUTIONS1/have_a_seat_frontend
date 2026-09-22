import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import notificationService from '@/services/notificationService';
import { useAuth } from '@/contexts/authContext/AuthProvider';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { authState } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_notifications: 0,
    unread_count: 0,
    sent_today: 0,
    failed_today: 0
  });
  const [preferences, setPreferences] = useState([]);
  const [websocket, setWebsocket] = useState(null);

  // Load notifications
  const loadNotifications = useCallback(async (page = 1, size = 20, unreadOnly = false) => {
    if (!authState.isAuthenticated) return;
    
    setLoading(true);
    try {
      // Convert page/size to limit/offset for API
      const limit = size;
      const offset = (page - 1) * size;
      
      let data;
      if (unreadOnly) {
        // Use unread endpoint if filtering for unread only
        data = await notificationService.getUnreadNotifications(authState);
      } else {
        // Use paginated endpoint
        data = await notificationService.getNotifications(authState, limit, offset);
      }
      
      // API returns array directly, map is_read to status and created_at to sent_at
      const mappedNotifications = Array.isArray(data) 
        ? data.map(notif => ({
            ...notif,
            status: notif.is_read === 'read' ? 'read' : 'unread',
            type: notif.notification_type || notif.type,
            sent_at: notif.created_at || notif.sent_at // Map created_at to sent_at for compatibility
          }))
        : [];
      
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [authState]);

  // Load notification stats
  const loadStats = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      const data = await notificationService.getNotificationStats(authState);
      setStats({
        total_notifications: data.total_count || data.total_notifications || 0,
        unread_count: data.unread_count || 0,
        sent_today: data.sent_today || 0,
        failed_today: data.failed_today || 0
      });
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error('Failed to load notification stats:', error);
    }
  }, [authState]);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      const data = await notificationService.getPreferences(authState);
      setPreferences(data.preferences || []);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, [authState]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(authState, notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status: 'read', is_read: 'read' }
            : notification
        )
      );
      
      // Refresh stats
      await loadStats();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [authState, loadStats]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead(authState);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, status: 'read', is_read: 'read' }))
      );
      
      // Refresh stats
      await loadStats();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [authState, loadStats]);

  // Update preference
  const updatePreference = useCallback(async (notificationType, preferenceData) => {
    try {
      await notificationService.updatePreference(authState, notificationType, preferenceData);
      
      // Refresh preferences
      await loadPreferences();
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  }, [authState, loadPreferences]);

  // Setup WebSocket connection
  const setupWebSocket = useCallback(() => {
    if (!authState.isAuthenticated || !authState.accessToken) return;

    const ws = notificationService.connectWebSocket(authState.accessToken);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'notification':
            // New notification received - map is_read to status and created_at to sent_at
            const newNotification = {
              ...data.notification,
              status: data.notification.is_read === 'read' ? 'read' : 'unread',
              type: data.notification.notification_type || data.notification.type,
              sent_at: data.notification.created_at || data.notification.sent_at
            };
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            break;
            
          case 'unread_count':
            // Update unread count
            setUnreadCount(data.count);
            break;
            
          case 'connection_established':
            console.log('WebSocket connected');
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setWebsocket(ws);

    // Keep connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'ping',
          timestamp: Date.now()
        }));
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      ws.close();
    };
  }, [authState.isAuthenticated, authState.accessToken]);

  // Initialize when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      loadNotifications();
      loadStats();
      loadPreferences();
      const cleanup = setupWebSocket();
      
      return cleanup;
    } else {
      // Clear state when user logs out
      setNotifications([]);
      setUnreadCount(0);
      setStats({
        total_notifications: 0,
        unread_count: 0,
        sent_today: 0,
        failed_today: 0
      });
      setPreferences([]);
      if (websocket) {
        websocket.close();
        setWebsocket(null);
      }
    }
  }, [authState.isAuthenticated, loadNotifications, loadStats, loadPreferences, setupWebSocket]);

  const value = {
    notifications,
    unreadCount,
    loading,
    stats,
    preferences,
    loadNotifications,
    loadStats,
    loadPreferences,
    markAsRead,
    markAllAsRead,
    updatePreference
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 