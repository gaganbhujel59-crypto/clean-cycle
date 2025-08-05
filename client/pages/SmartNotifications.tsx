import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Plus, Edit2, Trash2, Send, Clock, Users, Search, Filter, CheckCircle, AlertCircle, Info, AlertTriangle, Shield } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";

export default function SmartNotifications() {
  const { user, allUsers } = useAuth();
  const { notifications, addNotification, updateNotification, deleteNotification } = useNotifications();

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Card className="text-center p-8 border-red-200">
            <div className="bg-red-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
            <p className="text-gray-600 mb-4">
              Only administrators can send notifications to community members.
            </p>
            <p className="text-sm text-gray-500">
              If you need to send notifications, please contact your community administrator.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as Notification['type'],
    priority: 'medium' as Notification['priority'],
    target: 'all' as Notification['target'],
    targetUsers: [] as string[],
    scheduledDate: ''
  });

  // Filter notifications based on search and filters
  useEffect(() => {
    let filtered = notifications;

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(notification => notification.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(notification => notification.priority === priorityFilter);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      target: 'all',
      targetUsers: [],
      scheduledDate: ''
    });
  };

  const handleCreate = () => {
    const now = new Date().toISOString();
    const newNotification = {
      ...formData,
      status: formData.scheduledDate ? 'scheduled' as const : 'sent' as const,
      sentDate: formData.scheduledDate ? undefined : now,
      createdBy: user?.name || 'Unknown'
    };

    addNotification(newNotification);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      target: notification.target,
      targetUsers: notification.targetUsers || [],
      scheduledDate: notification.scheduledDate || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedNotification) return;

    updateNotification(selectedNotification.id, {
      ...formData,
      status: formData.scheduledDate ? 'scheduled' as const : selectedNotification.status
    });

    setIsEditDialogOpen(false);
    setSelectedNotification(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const handleSendNow = (id: string) => {
    updateNotification(id, {
      status: 'sent' as const,
      sentDate: new Date().toISOString(),
      scheduledDate: undefined
    });
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
      case 'info': return <Info className="h-3 w-3 mr-1" />;
      case 'warning': return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'success': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'error': return <AlertCircle className="h-3 w-3 mr-1" />;
      default: return <Info className="h-3 w-3 mr-1" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationStats = () => {
    const total = notifications.length;
    const sent = notifications.filter(n => n.status === 'sent').length;
    const scheduled = notifications.filter(n => n.status === 'scheduled').length;
    const draft = notifications.filter(n => n.status === 'draft').length;
    const urgent = notifications.filter(n => n.priority === 'urgent').length;
    
    return { total, sent, scheduled, draft, urgent };
  };

  const stats = getNotificationStats();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            Smart Notifications
          </h1>
          <p className="text-xl text-gray-600">
            Manage alerts, announcements, and community communication
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-gray-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {stats.total}
              </div>
              <p className="text-sm text-gray-600 font-semibold">Total Notifications</p>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {stats.sent}
              </div>
              <p className="text-sm text-green-700 font-semibold">Sent</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {stats.scheduled}
              </div>
              <p className="text-sm text-blue-700 font-semibold">Scheduled</p>
            </CardContent>
          </Card>
          <Card className="border-gray-300">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
                {stats.draft}
              </div>
              <p className="text-sm text-gray-700 font-semibold">Drafts</p>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
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

          {/* Create Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Create New Notification
                </DialogTitle>
                <DialogDescription>
                  Send announcements and alerts to community members
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-purple-800 font-bold">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter notification title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-purple-800 font-bold">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Enter notification message"
                    rows={3}
                    className="min-h-[60px] max-h-[120px] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-purple-800 font-bold">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as Notification['type']})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-purple-800 font-bold">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as Notification['priority']})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target" className="text-purple-800 font-bold">Target Audience</Label>
                  <Select value={formData.target} onValueChange={(value) => setFormData({...formData, target: value as Notification['target']})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="users">Users Only</SelectItem>
                      <SelectItem value="admins">Admins Only</SelectItem>
                      <SelectItem value="specific">Specific Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate" className="text-purple-800 font-bold">Schedule Date (Optional)</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">Leave empty to send immediately</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
                  {formData.scheduledDate ? 'Schedule' : 'Send Now'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notifications Table */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Notification History
            </CardTitle>
            <CardDescription>
              {filteredNotifications.length} of {notifications.length} notifications shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Title</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Type</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Priority</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Target</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Status</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Date</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50">
                      <TableCell>
                        <div>
                          <p className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {notification.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`font-bold ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`font-bold ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Users className="h-3 w-3 mr-1 text-purple-600" />
                          {notification.target.charAt(0).toUpperCase() + notification.target.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`font-bold ${getStatusColor(notification.status)}`}>
                          {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {notification.sentDate ? (
                            <div className="flex items-center">
                              <Send className="h-3 w-3 mr-1 text-green-600" />
                              {new Date(notification.sentDate).toLocaleDateString()}
                            </div>
                          ) : notification.scheduledDate ? (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-blue-600" />
                              {new Date(notification.scheduledDate).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-gray-400">Not sent</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {notification.status === 'scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendNow(notification.id)}
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              <Send className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(notification)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this notification? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(notification.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredNotifications.length === 0 && (
              <div className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">Try adjusting your search or filters, or create a new notification.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Edit Notification
              </DialogTitle>
              <DialogDescription>
                Update notification details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-purple-800 font-bold">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter notification title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-purple-800 font-bold">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Enter notification message"
                  rows={3}
                  className="min-h-[60px] max-h-[120px] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-purple-800 font-bold">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as Notification['type']})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-purple-800 font-bold">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as Notification['priority']})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target" className="text-purple-800 font-bold">Target Audience</Label>
                <Select value={formData.target} onValueChange={(value) => setFormData({...formData, target: value as Notification['target']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="users">Users Only</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                    <SelectItem value="specific">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledDate" className="text-purple-800 font-bold">Schedule Date (Optional)</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-purple-600 hover:bg-purple-700">
                Update Notification
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
