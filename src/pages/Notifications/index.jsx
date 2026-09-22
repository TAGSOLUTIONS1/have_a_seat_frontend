import React, { useState, useEffect } from 'react';
import { Bell, Filter, Search, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/contexts/notificationContext/NotificationProvider';
import './notifications.css';

const NotificationsPage = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    stats,
    markAsRead, 
    markAllAsRead,
    loadNotifications 
  } = useNotifications();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadNotifications(currentPage, pageSize, filter === 'unread');
  }, [currentPage, pageSize, filter, loadNotifications]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // Note: Backend search would be implemented here
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return notification.status === 'unread';
    if (filter === 'read') return notification.status === 'read';
    return true;
  });

  const searchedNotifications = filteredNotifications.filter(notification => {
    if (!searchTerm) return true;
    return (
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  if (loading && notifications.length === 0) {
    return (
      <div className="notifications-loading">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-content">
          <div className="header-icon">
            <Bell className="bell-icon" />
          </div>
          <div className="header-text">
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">
              Stay updated with your reservations and important updates
            </p>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total_notifications}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item unread">
            <span className="stat-number">{unreadCount}</span>
            <span className="stat-label">Unread</span>
          </div>
        </div>
      </div>

      <div className="notifications-controls">
        <div className="controls-left">
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            <button
              className={`filter-button ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => handleFilterChange('unread')}
            >
              Unread
            </button>
            <button
              className={`filter-button ${filter === 'read' ? 'active' : ''}`}
              onClick={() => handleFilterChange('read')}
            >
              Read
            </button>
          </div>
        </div>

        <div className="controls-right">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
          
          {unreadCount > 0 && (
            <button
              className="mark-all-read-button"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="button-icon" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-content">
        {searchedNotifications.length === 0 ? (
          <div className="no-notifications">
            <Bell className="no-notifications-icon" />
            <h3>No notifications found</h3>
            <p>
              {searchTerm 
                ? `No notifications match "${searchTerm}"`
                : filter === 'unread' 
                  ? 'You have no unread notifications'
                  : 'You have no notifications yet'
              }
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {searchedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${notification.status}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">
                      {notification.title}
                    </h3>
                    <span className="notification-type">
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                  </div>
                  
                  <p className="notification-message">
                    {notification.message}
                  </p>
                  
                  <div className="notification-meta">
                    <span className="notification-time">
                      {formatTime(notification.sent_at)}
                    </span>
                    
                    {notification.data && Object.keys(notification.data).length > 0 && (
                      <div className="notification-data">
                        {Object.entries(notification.data).map(([key, value]) => (
                          <span key={key} className="data-item">
                            <strong>{key}:</strong> {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="notification-actions">
                  {notification.status === 'unread' && (
                    <button
                      className="mark-read-button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check className="button-icon" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage; 