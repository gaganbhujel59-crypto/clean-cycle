import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target: 'all' | 'users' | 'admins' | 'specific';
  targetUsers?: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledDate?: string;
  sentDate?: string;
  createdBy: string;
  createdAt: string;
  readBy: string[];
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'readBy'>) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  deleteNotification: (id: string) => void;
  markAsRead: (notificationId: string, userId: string) => void;
  getUserNotifications: (userId: string, userRole: string) => Notification[];
  getUnreadCount: (userId: string, userRole: string) => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize with default notifications
  useEffect(() => {
    const defaultNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to CleanCycle!',
        message: 'Thank you for joining our community waste management system. Start by scheduling your first pickup!',
        type: 'info',
        priority: 'medium',
        target: 'all',
        status: 'sent',
        sentDate: '2024-01-14T09:00:00Z',
        createdBy: 'Admin User',
        createdAt: '2024-01-14T08:30:00Z',
        readBy: ['user1']
      },
      {
        id: '2',
        title: 'Weekly Recycling Reminder',
        message: 'Tomorrow is recycling day! Please sort your recyclables and place them outside by 8:00 AM.',
        type: 'info',
        priority: 'medium',
        target: 'all',
        status: 'sent',
        sentDate: '2024-01-15T18:00:00Z',
        createdBy: 'Admin User',
        createdAt: '2024-01-15T17:45:00Z',
        readBy: []
      },
      {
        id: '3',
        title: 'Schedule Change Alert',
        message: 'Due to weather conditions, organic waste pickup has been rescheduled from Tuesday to Wednesday this week.',
        type: 'warning',
        priority: 'high',
        target: 'all',
        status: 'sent',
        sentDate: '2024-01-13T16:00:00Z',
        createdBy: 'Admin User',
        createdAt: '2024-01-13T15:45:00Z',
        readBy: ['user1', 'user2']
      },
      {
        id: '4',
        title: 'New Community Guidelines',
        message: 'We have updated our community waste management guidelines. Please review the new policies in your dashboard.',
        type: 'info',
        priority: 'medium',
        target: 'users',
        status: 'sent',
        sentDate: '2024-01-12T10:00:00Z',
        createdBy: 'Admin User',
        createdAt: '2024-01-12T09:45:00Z',
        readBy: ['user2']
      },
      {
        id: '5',
        title: 'Admin Training Session',
        message: 'Mandatory training session for all administrators on new waste categorization protocols.',
        type: 'info',
        priority: 'high',
        target: 'admins',
        status: 'sent',
        sentDate: '2024-01-11T14:00:00Z',
        createdBy: 'System Admin',
        createdAt: '2024-01-11T13:30:00Z',
        readBy: ['admin']
      }
    ];

    // Load notifications from localStorage or use defaults
    const storedNotifications = localStorage.getItem('cleancycle_notifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
        setNotifications(defaultNotifications);
        localStorage.setItem('cleancycle_notifications', JSON.stringify(defaultNotifications));
      }
    } else {
      setNotifications(defaultNotifications);
      localStorage.setItem('cleancycle_notifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('cleancycle_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'readBy'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      readBy: []
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(notification =>
        notification.id === id
          ? { ...notification, ...updates }
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAsRead = (notificationId: string, userId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? {
              ...notification,
              readBy: notification.readBy.includes(userId)
                ? notification.readBy
                : [...notification.readBy, userId]
            }
          : notification
      )
    );
  };

  const getUserNotifications = (userId: string, userRole: string): Notification[] => {
    return notifications.filter(notification => {
      // Only show sent notifications to users
      if (notification.status !== 'sent') return false;

      // Check target audience
      if (notification.target === 'all') return true;
      if (notification.target === 'users' && userRole === 'user') return true;
      if (notification.target === 'admins' && userRole === 'admin') return true;
      if (notification.target === 'specific' && notification.targetUsers?.includes(userId)) return true;

      return false;
    });
  };

  const getUnreadCount = (userId: string, userRole: string): number => {
    const userNotifications = getUserNotifications(userId, userRole);
    return userNotifications.filter(notification => 
      !notification.readBy.includes(userId)
    ).length;
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    getUserNotifications,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
