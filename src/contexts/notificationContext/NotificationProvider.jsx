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
      const data = await notificationService.getNotifications(page, size, unreadOnly);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [authState.isAuthenticated]);

  // Load notification stats
  const loadStats = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      const data = await notificationService.getNotificationStats();
      setStats(data);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error('Failed to load notification stats:', error);
    }
  }, [authState.isAuthenticated]);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      const data = await notificationService.getPreferences();
      setPreferences(data.preferences || []);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, [authState.isAuthenticated]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status: 'read' }
            : notification
        )
      );
      
      // Refresh stats
      await loadStats();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [loadStats]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, status: 'read' }))
      );
      
      // Refresh stats
      await loadStats();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [loadStats]);

  // Update preference
  const updatePreference = useCallback(async (notificationType, preferenceData) => {
    try {
      await notificationService.updatePreference(notificationType, preferenceData);
      
      // Refresh preferences
      await loadPreferences();
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  }, [loadPreferences]);

  // Setup WebSocket connection
  const setupWebSocket = useCallback(() => {
    if (!authState.isAuthenticated || !authState.accessToken) return;

    const ws = notificationService.connectWebSocket(authState.accessToken);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'notification':
            // New notification received
            setNotifications(prev => [data.notification, ...prev]);
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