import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Filter, CheckCircle, AlertCircle, Info, AlertTriangle, Clock, User, Eye } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";

export default function UserNotifications() {
  const { user } = useAuth();
  const { getUserNotifications, markAsRead, getUnreadCount } = useNotifications();

  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Get user notifications
  useEffect(() => {
    if (user) {
      try {
        const notifications = getUserNotifications(user.id, user.role);
        setUserNotifications(notifications);
        console.log('User notifications loaded:', notifications.length); // Debug log
      } catch (error) {
        console.error('Error loading user notifications:', error);
      }
    }
    setIsLoading(false);
  }, [user, getUserNotifications]);

  // Filter notifications based on search and filters
  useEffect(() => {
    let filtered = userNotifications;

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(notification => notification.priority === priorityFilter);
    }

    if (readFilter !== 'all') {
      const isRead = readFilter === 'read';
      filtered = filtered.filter(notification => 
        notification.readBy.includes(user?.id || '') === isRead
      );
    }

    setFilteredNotifications(filtered);
  }, [userNotifications, searchTerm, typeFilter, priorityFilter, readFilter, user?.id]);

  const handleMarkAsRead = (notificationId: string) => {
    if (user) {
      markAsRead(notificationId, user.id);
      // Update local state to reflect the change
      setUserNotifications(prev => 
        prev.map(notification =>
          notification.id === notificationId
            ? {
                ...notification,
                readBy: notification.readBy.includes(user.id)
                  ? notification.readBy
                  : [...notification.readBy, user.id]
              }
            : notification
        )
      );
    }
  };

  const isNotificationRead = (notification: Notification) => {
    return user ? notification.readBy.includes(user.id) : false;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 mr-2" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 mr-2" />;
      case 'success': return <CheckCircle className="h-4 w-4 mr-2" />;
      case 'error': return <AlertCircle className="h-4 w-4 mr-2" />;
      default: return <Info className="h-4 w-4 mr-2" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationStats = () => {
    const total = userNotifications.length;
    const unread = user ? getUnreadCount(user.id, user.role) : 0;
    const urgent = userNotifications.filter(n => n.priority === 'urgent').length;
    
    return { total, unread, urgent };
  };

  const stats = getNotificationStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            My Notifications
          </h1>
          <p className="text-xl text-gray-600">
            Stay updated with community announcements and important alerts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {stats.total}
              </div>
              <p className="text-sm text-gray-600 font-semibold">Total Notifications</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {stats.unread}
              </div>
              <p className="text-sm text-blue-700 font-semibold">Unread</p>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                {stats.urgent}
              </div>
              <p className="text-sm text-red-700 font-semibold">Urgent</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notifications by title or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Read Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="border-blue-200">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">
                  {userNotifications.length === 0 
                    ? "You don't have any notifications yet." 
                    : "Try adjusting your search or filters."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const isRead = isNotificationRead(notification);
              return (
                <Card 
                  key={notification.id} 
                  className={`border-blue-200 hover:shadow-lg transition-shadow ${
                    !isRead ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${getTypeColor(notification.type).replace('text-', 'bg-').replace('bg-100', 'bg-gradient-to-br from-blue-500 to-purple-500')}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className={`text-lg font-bold ${
                              !isRead 
                                ? 'bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent' 
                                : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
                            }`}>
                              {notification.title}
                            </CardTitle>
                            {!isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-blue-700 font-bold" />
                              <span className="font-semibold">{notification.createdBy}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-blue-700 font-bold" />
                              <span className="font-semibold">
                                {notification.sentDate ? new Date(notification.sentDate).toLocaleDateString() : 'Not sent yet'}
                              </span>
                            </div>
                          </div>
                          <p className={`text-gray-700 ${!isRead ? 'font-medium' : ''}`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`font-bold ${getTypeColor(notification.type)}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </Badge>
                        <Badge className={`font-bold ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end">
                      {!isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="border-blue-300 text-blue-800 hover:bg-blue-50 font-bold"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Info Card */}
        <Card className="border-eco-200 bg-gradient-to-r from-eco-50 to-blue-50">
          <CardContent className="py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-eco-500 to-blue-500 p-2 rounded-full">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Community Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Receive important updates, announcements, and alerts from your community administrators. 
                  Stay informed about schedule changes, new guidelines, and community events.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
