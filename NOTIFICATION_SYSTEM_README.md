# 🔔 Notification System Implementation Guide

This document provides a comprehensive guide to the notification system implemented in your Have A Seat frontend application.

## 🏗️ **System Architecture**

The notification system consists of several key components:

- **Notification Service** (`src/services/notificationService.js`) - API communication layer
- **Notification Context** (`src/contexts/notificationContext/NotificationProvider.jsx`) - State management
- **Notification Bell** (`src/components/common/NotificationBell/`) - UI component with dropdown
- **Notification Preferences** (`src/components/common/NotificationPreferences/`) - Settings management
- **Notification Toast** (`src/components/common/NotificationToast/`) - Real-time notifications
- **Notifications Page** (`src/pages/Notifications/`) - Full notification center

## 🚀 **Quick Start**

### 1. **Provider Setup**
The notification system is already integrated into your app via `src/main.jsx`:

```jsx
import { NotificationProvider } from "./contexts/notificationContext/NotificationProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <App />
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>
);
```

### 2. **Using Notifications in Components**

```jsx
import { useNotifications } from '@/contexts/notificationContext/NotificationProvider';

const MyComponent = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  // Your component logic here
};
```

### 3. **Using the Notification Hook**

```jsx
import { useNotificationToast } from '@/hooks/useNotificationToast';

const MyComponent = () => {
  const { 
    showNotification, 
    markNotificationAsRead 
  } = useNotificationToast();

  // Your component logic here
};
```

## 📱 **Components Overview**

### **Notification Bell**
- **Location**: `src/components/common/NotificationBell/`
- **Usage**: Automatically shows unread count badge and dropdown
- **Features**: 
  - Real-time unread count
  - Quick notification preview
  - Mark as read functionality
  - Mark all as read option

### **Notification Preferences**
- **Location**: `src/components/common/NotificationPreferences/`
- **Usage**: Manage notification settings
- **Features**:
  - Email, Push, SMS preferences
  - Per-notification-type settings
  - Real-time updates

### **Notification Toast**
- **Location**: `src/components/common/NotificationToast/`
- **Usage**: Shows real-time notification popups
- **Features**:
  - Auto-dismiss after 5 seconds
  - Smooth animations
  - Type-specific styling
  - Action buttons

### **Notifications Page**
- **Location**: `src/pages/Notifications/`
- **Route**: `/notifications`
- **Features**:
  - Full notification list
  - Filtering (All/Unread/Read)
  - Search functionality
  - Pagination
  - Bulk actions

## 🔌 **API Integration**

### **Base Configuration**
The system automatically uses your `Base_Url` from `src/baseUrl.jsx`:

```javascript
// Current configuration
export const Base_Url = "http://127.0.0.1:8000";
```

### **Available Endpoints**
All notification APIs are implemented in `src/services/notificationService.js`:

- `GET /api/v1/notifications` - Fetch notifications
- `GET /api/v1/notifications/{id}` - Get single notification
- `PATCH /api/v1/notifications/{id}/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read
- `GET /api/v1/notifications/stats` - Get statistics
- `GET /api/v1/preferences` - Get user preferences
- `PUT /api/v1/preferences/{type}` - Update preferences

### **WebSocket Support**
Real-time notifications via WebSocket at `ws://localhost:8000/ws/notifications/{token}`

## 🎨 **Customization**

### **Styling**
All components use CSS modules with responsive design:
- Mobile-first approach
- Tailwind CSS compatible
- Custom color schemes
- Smooth animations

### **Notification Types**
Supported notification types with custom icons and colors:

```javascript
const notificationTypes = {
  'reservation_confirmation': '✅',
  'reservation_reminder': '⏰',
  'reservation_cancellation': '❌',
  'reservation_modification': '✏️',
  'restaurant_updates': '🏪',
  'special_offers': '🎉',
  'system_announcement': '📢',
  'account_updates': '🔒'
};
```

### **Adding New Notification Types**
1. Add to the type mapping in components
2. Update CSS for custom styling
3. Add to preferences if needed

## 📱 **Responsive Design**

All components are fully responsive:
- **Desktop**: Full feature set with side-by-side layouts
- **Tablet**: Optimized spacing and touch targets
- **Mobile**: Stacked layouts with mobile-first navigation

## 🔧 **Configuration Options**

### **Environment Variables**
```bash
# Backend API URL
REACT_APP_API_URL=http://127.0.0.1:8000

# WebSocket URL (for development)
REACT_APP_WS_URL=ws://localhost:8000
```

### **Notification Settings**
```javascript
// In NotificationProvider.jsx
const [pageSize, setPageSize] = useState(20); // Notifications per page
const [autoRefresh, setAutoRefresh] = useState(true); // Auto-refresh enabled
const [toastDuration, setToastDuration] = useState(5000); // Toast display time
```

## 🚨 **Error Handling**

The system includes comprehensive error handling:
- API failure fallbacks
- Network error recovery
- User-friendly error messages
- Graceful degradation

## 📊 **Performance Features**

- **Lazy Loading**: Notifications load on demand
- **Pagination**: Efficient data handling
- **Caching**: Local state management
- **Debouncing**: Search and filter optimization

## 🧪 **Testing**

### **Component Testing**
```bash
# Test notification components
npm test -- --testPathPattern=Notification

# Test with coverage
npm test -- --coverage --testPathPattern=Notification
```

### **Manual Testing**
1. Login to the application
2. Check notification bell in navbar
3. Navigate to `/notifications`
4. Test preference settings
5. Verify real-time updates

## 🔒 **Security Features**

- **Authentication Required**: All endpoints require valid JWT tokens
- **User Isolation**: Users can only access their own notifications
- **Input Validation**: All user inputs are sanitized
- **CSRF Protection**: Built-in protection against cross-site requests

## 📈 **Monitoring & Analytics**

The system provides:
- Real-time notification counts
- User engagement metrics
- Performance monitoring
- Error tracking

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build
```

### **Environment Setup**
```bash
# Production
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_WS_URL=wss://have-a-seatonline.com

# Development
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_WS_URL=ws://localhost:8000
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Notifications not loading**
   - Check authentication status
   - Verify API endpoint accessibility
   - Check browser console for errors

2. **WebSocket connection failed**
   - Verify WebSocket URL configuration
   - Check network connectivity
   - Ensure backend WebSocket service is running

3. **Real-time updates not working**
   - Check WebSocket connection status
   - Verify authentication token
   - Check backend notification service

### **Debug Mode**
Enable debug logging in the browser console:
```javascript
localStorage.setItem('notificationDebug', 'true');
```

## 📚 **Additional Resources**

- **API Documentation**: Backend notification API specs
- **Component Library**: UI component documentation
- **Design System**: Visual design guidelines
- **Accessibility**: WCAG compliance guidelines

## 🤝 **Support**

For technical support or questions:
1. Check this documentation
2. Review component source code
3. Check browser console for errors
4. Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Compatibility**: React 18+, Node.js 16+ 