import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Settings } from 'lucide-react';
import { useNotifications } from '@/contexts/notificationContext/NotificationProvider';
import './notificationPreferences.css';

const NotificationPreferences = () => {
  const { preferences, updatePreference, loading } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preferences.length > 0) {
      setLocalPreferences([...preferences]);
    }
  }, [preferences]);

  const handlePreferenceChange = (type, key, value) => {
    setLocalPreferences(prev => 
      prev.map(pref => 
        pref.type === type 
          ? { ...pref, [key]: value }
          : pref
      )
    );
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      // Save each preference individually
      for (const pref of localPreferences) {
        await updatePreference(pref.type, {
          email_enabled: pref.email_enabled,
          push_enabled: pref.push_enabled,
          sms_enabled: pref.sms_enabled
        });
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const getNotificationTypeLabel = (type) => {
    const labels = {
      'reservation_confirmation': 'Reservation Confirmations',
      'reservation_reminder': 'Reservation Reminders',
      'reservation_cancellation': 'Reservation Cancellations',
      'reservation_modification': 'Reservation Modifications',
      'restaurant_updates': 'Restaurant Updates',
      'special_offers': 'Special Offers & Promotions',
      'system_announcement': 'System Announcements',
      'account_updates': 'Account Updates'
    };
    return labels[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getNotificationTypeDescription = (type) => {
    const descriptions = {
      'reservation_confirmation': 'Get notified when your reservation is confirmed',
      'reservation_reminder': 'Receive reminders before your upcoming reservations',
      'reservation_cancellation': 'Stay informed about reservation cancellations',
      'reservation_modification': 'Get updates when reservations are modified',
      'restaurant_updates': 'Learn about restaurant changes and updates',
      'special_offers': 'Discover exclusive deals and promotions',
      'system_announcement': 'Important system updates and maintenance notices',
      'account_updates': 'Security alerts and account-related notifications'
    };
    return descriptions[type] || 'Manage your notification preferences';
  };

  if (loading) {
    return (
      <div className="notification-preferences-loading">
        <div className="loading-spinner"></div>
        <p>Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="notification-preferences">
      <div className="preferences-header">
        <div className="header-icon">
          <Settings className="settings-icon" />
        </div>
        <div className="header-content">
          <h2 className="preferences-title">Notification Preferences</h2>
          <p className="preferences-subtitle">
            Choose how you want to receive notifications
          </p>
        </div>
      </div>

      <div className="preferences-content">
        {localPreferences.length === 0 ? (
          <div className="no-preferences">
            <Bell className="no-preferences-icon" />
            <p>No notification preferences found</p>
          </div>
        ) : (
          <>
            <div className="preferences-list">
              {localPreferences.map((pref) => (
                <div key={pref.id} className="preference-item">
                  <div className="preference-header">
                    <h3 className="preference-type-title">
                      {getNotificationTypeLabel(pref.type)}
                    </h3>
                    <p className="preference-description">
                      {getNotificationTypeDescription(pref.type)}
                    </p>
                  </div>
                  
                  <div className="preference-options">
                    <label className="preference-option">
                      <input
                        type="checkbox"
                        checked={pref.email_enabled}
                        onChange={(e) => handlePreferenceChange(pref.type, 'email_enabled', e.target.checked)}
                      />
                      <Mail className="option-icon" />
                      <span>Email</span>
                    </label>
                    
                    <label className="preference-option">
                      <input
                        type="checkbox"
                        checked={pref.push_enabled}
                        onChange={(e) => handlePreferenceChange(pref.type, 'push_enabled', e.target.checked)}
                      />
                      <Bell className="option-icon" />
                      <span>Push Notifications</span>
                    </label>
                    
                    <label className="preference-option">
                      <input
                        type="checkbox"
                        checked={pref.sms_enabled}
                        onChange={(e) => handlePreferenceChange(pref.type, 'sms_enabled', e.target.checked)}
                      />
                      <Smartphone className="option-icon" />
                      <span>SMS</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="preferences-actions">
              <button
                className="save-preferences-button"
                onClick={handleSavePreferences}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPreferences; 