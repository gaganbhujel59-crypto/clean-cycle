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
import { Calendar, Clock, MapPin, Plus, Edit2, Trash2, Eye, Filter, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

interface Schedule {
  id: string;
  wasteType: string;
  location: string;
  date: string;
  time: string;
  frequency: string;
  collector: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export default function ScheduleManagement() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      wasteType: 'Recyclables',
      location: 'Green Valley Block A',
      date: '2024-01-15',
      time: '09:00',
      frequency: 'weekly',
      collector: 'EcoTeam Alpha',
      status: 'scheduled',
      notes: 'Focus on paper and plastic materials',
      createdBy: 'John Smith',
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      wasteType: 'Organic Waste',
      location: 'Central District',
      date: '2024-01-16',
      time: '14:00',
      frequency: 'bi-weekly',
      collector: 'GreenCycle Pro',
      status: 'in-progress',
      notes: 'Kitchen waste and garden trimmings',
      createdBy: 'Admin User',
      createdAt: '2024-01-12T15:30:00Z'
    },
    {
      id: '3',
      wasteType: 'General Waste',
      location: 'Eco Park Area',
      date: '2024-01-14',
      time: '11:00',
      frequency: 'weekly',
      collector: 'CleanSweep Ltd',
      status: 'completed',
      notes: 'Regular household waste collection',
      createdBy: 'John Smith',
      createdAt: '2024-01-09T08:20:00Z'
    }
  ]);

  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>(schedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    wasteType: '',
    location: '',
    date: '',
    time: '',
    frequency: '',
    collector: '',
    notes: ''
  });

  // Filter schedules based on search and filters
  useEffect(() => {
    let filtered = schedules;

    if (searchTerm) {
      filtered = filtered.filter(schedule =>
        schedule.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.collector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(schedule => schedule.status === statusFilter);
    }

    if (wasteTypeFilter !== 'all') {
      filtered = filtered.filter(schedule => schedule.wasteType === wasteTypeFilter);
    }

    setFilteredSchedules(filtered);
  }, [schedules, searchTerm, statusFilter, wasteTypeFilter]);

  const resetForm = () => {
    setFormData({
      wasteType: '',
      location: '',
      date: '',
      time: '',
      frequency: '',
      collector: '',
      notes: ''
    });
  };

  const handleCreate = () => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      ...formData,
      status: 'scheduled',
      createdBy: user?.name || 'Unknown',
      createdAt: new Date().toISOString()
    };

    setSchedules([newSchedule, ...schedules]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      wasteType: schedule.wasteType,
      location: schedule.location,
      date: schedule.date,
      time: schedule.time,
      frequency: schedule.frequency,
      collector: schedule.collector,
      notes: schedule.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedSchedule) return;

    const updatedSchedules = schedules.map(schedule =>
      schedule.id === selectedSchedule.id
        ? { ...schedule, ...formData }
        : schedule
    );

    setSchedules(updatedSchedules);
    setIsEditDialogOpen(false);
    setSelectedSchedule(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: Schedule['status']) => {
    const updatedSchedules = schedules.map(schedule =>
      schedule.id === id ? { ...schedule, status: newStatus } : schedule
    );
    setSchedules(updatedSchedules);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const wasteTypes = ['Recyclables', 'Organic Waste', 'General Waste', 'Electronic Waste', 'Hazardous Waste'];
  const collectors = ['EcoTeam Alpha', 'GreenCycle Pro', 'CleanSweep Ltd', 'WasteWise Services', 'EcoFriendly Collectors'];
  const frequencies = ['daily', 'weekly', 'bi-weekly', 'monthly'];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-eco-600 via-green-600 to-ocean-600 bg-clip-text text-transparent">
            Smart Scheduling
          </h1>
          <p className="text-xl text-gray-600">
            Schedule and manage waste pickups by type, date, and location
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by location, waste type, or collector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {user?.role === 'admin' && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select value={wasteTypeFilter} onValueChange={setWasteTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Waste Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {wasteTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Create Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-eco-600 to-green-600 hover:from-eco-700 hover:to-green-700 text-white font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Pickup
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-eco-600 to-green-600 bg-clip-text text-transparent">
                  Schedule New Pickup
                </DialogTitle>
                <DialogDescription>
                  Create a new waste pickup schedule for your community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wasteType" className="text-eco-800 font-bold">Waste Type</Label>
                    <Select value={formData.wasteType} onValueChange={(value) => setFormData({...formData, wasteType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasteTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency" className="text-eco-800 font-bold">Frequency</Label>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map(freq => (
                          <SelectItem key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-eco-800 font-bold">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Enter pickup location"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-eco-800 font-bold">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-eco-800 font-bold">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collector" className="text-eco-800 font-bold">Collector</Label>
                  <Select value={formData.collector} onValueChange={(value) => setFormData({...formData, collector: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select collector" />
                    </SelectTrigger>
                    <SelectContent>
                      {collectors.map(collector => (
                        <SelectItem key={collector} value={collector}>{collector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-eco-800 font-bold">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Add any special instructions or notes"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="bg-eco-600 hover:bg-eco-700">
                  Create Schedule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Schedule List */}
        <div className="grid gap-4">
          {filteredSchedules.length === 0 ? (
            <Card className="border-eco-200">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No schedules found</h3>
                <p className="text-gray-600">Try adjusting your search or filters, or create a new schedule.</p>
              </CardContent>
            </Card>
          ) : (
            filteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="border-eco-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-eco-500 to-green-500 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {schedule.wasteType}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} pickup
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`font-bold ${getStatusColor(schedule.status)}`}>
                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                      </Badge>
                      {user?.role === 'admin' && (
                        <Select
                          value={schedule.status}
                          onValueChange={(value) => handleStatusChange(schedule.id, value as Schedule['status'])}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-eco-700 font-bold" />
                        <span className="font-semibold">{schedule.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-eco-700 font-bold" />
                        <span className="font-semibold">{new Date(schedule.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-eco-700 font-bold" />
                        <span className="font-semibold">{schedule.time}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Collector:</span> {schedule.collector}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Created by:</span> {schedule.createdBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Created:</span> {new Date(schedule.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {schedule.notes && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-eco-50 to-green-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Notes:</span> {schedule.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
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
                            This action cannot be undone. This will permanently delete the pickup schedule.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(schedule.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-eco-600 to-green-600 bg-clip-text text-transparent">
                Edit Pickup Schedule
              </DialogTitle>
              <DialogDescription>
                Update the pickup schedule details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wasteType" className="text-eco-800 font-bold">Waste Type</Label>
                  <Select value={formData.wasteType} onValueChange={(value) => setFormData({...formData, wasteType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-eco-800 font-bold">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map(freq => (
                        <SelectItem key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-eco-800 font-bold">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Enter pickup location"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-eco-800 font-bold">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-eco-800 font-bold">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collector" className="text-eco-800 font-bold">Collector</Label>
                <Select value={formData.collector} onValueChange={(value) => setFormData({...formData, collector: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select collector" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectors.map(collector => (
                      <SelectItem key={collector} value={collector}>{collector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-eco-800 font-bold">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any special instructions or notes"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-eco-600 hover:bg-eco-700">
                Update Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
