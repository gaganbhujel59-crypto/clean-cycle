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
import { AlertTriangle, MapPin, Plus, Edit2, Trash2, Clock, User, Search, Filter, CheckCircle, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

interface Issue {
  id: string;
  title: string;
  description: string;
  issueType: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  location: string;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  images?: string[];
}

export default function IssueReporting() {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      title: 'Overflowing Recycling Bin',
      description: 'The recycling bin at Green Valley Block A is completely full and overflowing. Needs immediate attention.',
      issueType: 'Overflowing Bin',
      priority: 'high',
      status: 'open',
      location: 'Green Valley Block A',
      reportedBy: 'John Smith',
      createdAt: '2024-01-14T09:30:00Z',
      updatedAt: '2024-01-14T09:30:00Z'
    },
    {
      id: '2',
      title: 'Missed Organic Waste Pickup',
      description: 'Scheduled organic waste pickup was missed yesterday. Residents are concerned about hygiene issues.',
      issueType: 'Missed Pickup',
      priority: 'medium',
      status: 'in-progress',
      location: 'Central District',
      reportedBy: 'Emma Wilson',
      assignedTo: 'GreenCycle Pro',
      createdAt: '2024-01-13T14:20:00Z',
      updatedAt: '2024-01-14T08:15:00Z'
    },
    {
      id: '3',
      title: 'Illegal Dumping Spotted',
      description: 'Large amounts of construction waste have been illegally dumped near the community garden area.',
      issueType: 'Illegal Dumping',
      priority: 'urgent',
      status: 'resolved',
      location: 'Community Garden Area',
      reportedBy: 'Mike Brown',
      assignedTo: 'City Council',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-13T10:30:00Z',
      resolvedAt: '2024-01-13T10:30:00Z'
    }
  ]);

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [issueTypeFilter, setIssueTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueType: '',
    priority: 'medium' as Issue['priority'],
    location: ''
  });

  // Filter issues based on search and filters
  useEffect(() => {
    let filtered = issues;

    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    if (issueTypeFilter !== 'all') {
      filtered = filtered.filter(issue => issue.issueType === issueTypeFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, priorityFilter, issueTypeFilter]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      issueType: '',
      priority: 'medium',
      location: ''
    });
  };

  const handleCreate = () => {
    const newIssue: Issue = {
      id: Date.now().toString(),
      ...formData,
      status: 'open',
      reportedBy: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIssues([newIssue, ...issues]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (issue: Issue) => {
    setSelectedIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      issueType: issue.issueType,
      priority: issue.priority,
      location: issue.location
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedIssue) return;

    const updatedIssues = issues.map(issue =>
      issue.id === selectedIssue.id
        ? { 
            ...issue, 
            ...formData,
            updatedAt: new Date().toISOString()
          }
        : issue
    );

    setIssues(updatedIssues);
    setIsEditDialogOpen(false);
    setSelectedIssue(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: Issue['status']) => {
    const updatedIssues = issues.map(issue =>
      issue.id === id 
        ? { 
            ...issue, 
            status: newStatus,
            updatedAt: new Date().toISOString(),
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : issue.resolvedAt
          } 
        : issue
    );
    setIssues(updatedIssues);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const issueTypes = ['Missed Pickup', 'Overflowing Bin', 'Illegal Dumping', 'Damaged Equipment', 'Collection Delay', 'Contamination', 'Other'];
  const collectors = ['EcoTeam Alpha', 'GreenCycle Pro', 'CleanSweep Ltd', 'City Council', 'Community Admin'];

  const getIssueStats = () => {
    const total = issues.length;
    const open = issues.filter(i => i.status === 'open').length;
    const inProgress = issues.filter(i => i.status === 'in-progress').length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const urgent = issues.filter(i => i.priority === 'urgent').length;
    
    return { total, open, inProgress, resolved, urgent };
  };

  const stats = getIssueStats();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            Issue Reporting System
          </h1>
          <p className="text-xl text-gray-600">
            Report and track missed pickups, overflowing bins, and other waste management issues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-gray-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {stats.total}
              </div>
              <p className="text-sm text-gray-600 font-semibold">Total Issues</p>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                {stats.open}
              </div>
              <p className="text-sm text-red-700 font-semibold">Open</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                {stats.inProgress}
              </div>
              <p className="text-sm text-yellow-700 font-semibold">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {stats.resolved}
              </div>
              <p className="text-sm text-green-700 font-semibold">Resolved</p>
            </CardContent>
          </Card>
          <Card className="border-red-300">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-red-700 to-pink-700 bg-clip-text text-transparent">
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
                placeholder="Search issues by title, location, or reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-36">
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

              <Select value={issueTypeFilter} onValueChange={setIssueTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Issue Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {issueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Create Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Report New Issue
                </DialogTitle>
                <DialogDescription>
                  Report a waste management issue in your community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-orange-800 font-bold">Issue Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueType" className="text-orange-800 font-bold">Issue Type</Label>
                    <Select value={formData.issueType} onValueChange={(value) => setFormData({...formData, issueType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-orange-800 font-bold">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as Issue['priority']})}>
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
                  <Label htmlFor="location" className="text-orange-800 font-bold">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Where is the issue located?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-orange-800 font-bold">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Provide detailed information about the issue"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="bg-orange-600 hover:bg-orange-700">
                  Report Issue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Issues List */}
        <div className="grid gap-4">
          {filteredIssues.length === 0 ? (
            <Card className="border-orange-200">
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No issues found</h3>
                <p className="text-gray-600">Try adjusting your search or filters, or report a new issue.</p>
              </CardContent>
            </Card>
          ) : (
            filteredIssues.map((issue) => (
              <Card key={issue.id} className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                          {issue.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mb-2">
                          {issue.issueType}
                        </CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-orange-700 font-bold" />
                            <span className="font-semibold">{issue.location}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-orange-700 font-bold" />
                            <span className="font-semibold">{issue.reportedBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-orange-700 font-bold" />
                            <span className="font-semibold">{new Date(issue.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`font-bold ${getPriorityColor(issue.priority)}`}>
                        {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                      </Badge>
                      <Badge className={`font-bold ${getStatusColor(issue.status)}`}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-gray-700 bg-gradient-to-r from-gray-50 to-orange-50 p-3 rounded-lg">
                      {issue.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {user?.role === 'admin' && (
                        <Select
                          value={issue.status}
                          onValueChange={(value) => handleStatusChange(issue.id, value as Issue['status'])}
                        >
                          <SelectTrigger className="w-36 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {issue.assignedTo && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Assigned to:</span> {issue.assignedTo}
                        </p>
                      )}
                      {issue.resolvedAt && (
                        <p className="text-sm text-green-600">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          <span className="font-semibold">Resolved:</span> {new Date(issue.resolvedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {(user?.role === 'admin' || issue.reportedBy === user?.name) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(issue)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      {user?.role === 'admin' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the issue report.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(issue.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Edit Issue Report
              </DialogTitle>
              <DialogDescription>
                Update the issue details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-orange-800 font-bold">Issue Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Brief description of the issue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueType" className="text-orange-800 font-bold">Issue Type</Label>
                  <Select value={formData.issueType} onValueChange={(value) => setFormData({...formData, issueType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-orange-800 font-bold">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as Issue['priority']})}>
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
                <Label htmlFor="location" className="text-orange-800 font-bold">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Where is the issue located?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-orange-800 font-bold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide detailed information about the issue"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-orange-600 hover:bg-orange-700">
                Update Issue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
