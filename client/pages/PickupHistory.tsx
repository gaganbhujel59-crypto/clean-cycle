import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Filter, Calendar, MapPin, CheckCircle, X, Clock, Download, FileText } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

interface PickupRecord {
  id: string;
  wasteType: string;
  location: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'completed' | 'missed' | 'partial' | 'cancelled';
  collector: string;
  quantity?: string;
  notes?: string;
  rating?: number;
}

export default function PickupHistory() {
  const { user } = useAuth();
  const [pickupRecords] = useState<PickupRecord[]>([
    {
      id: '1',
      wasteType: 'Recyclables',
      location: 'Green Valley Block A',
      scheduledDate: '2024-01-14',
      completedDate: '2024-01-14',
      status: 'completed',
      collector: 'EcoTeam Alpha',
      quantity: '3 bags',
      notes: 'All recyclables properly sorted',
      rating: 5
    },
    {
      id: '2',
      wasteType: 'Organic Waste',
      location: 'Central District',
      scheduledDate: '2024-01-13',
      completedDate: '2024-01-13',
      status: 'completed',
      collector: 'GreenCycle Pro',
      quantity: '2 bins',
      rating: 4
    },
    {
      id: '3',
      wasteType: 'General Waste',
      location: 'Eco Park Area',
      scheduledDate: '2024-01-12',
      status: 'missed',
      collector: 'CleanSweep Ltd',
      notes: 'Collector did not arrive due to vehicle breakdown'
    },
    {
      id: '4',
      wasteType: 'Electronic Waste',
      location: 'Green Valley Block B',
      scheduledDate: '2024-01-11',
      completedDate: '2024-01-11',
      status: 'partial',
      collector: 'TechRecycle Services',
      quantity: '1 box',
      notes: 'Some items could not be collected due to safety concerns',
      rating: 3
    },
    {
      id: '5',
      wasteType: 'Hazardous Waste',
      location: 'Central District',
      scheduledDate: '2024-01-10',
      status: 'cancelled',
      collector: 'SafeDisposal Inc',
      notes: 'Collection cancelled due to improper packaging'
    },
    {
      id: '6',
      wasteType: 'Recyclables',
      location: 'Eco Park Area',
      scheduledDate: '2024-01-09',
      completedDate: '2024-01-09',
      status: 'completed',
      collector: 'EcoTeam Alpha',
      quantity: '4 bags',
      rating: 5
    },
    {
      id: '7',
      wasteType: 'Organic Waste',
      location: 'Green Valley Block C',
      scheduledDate: '2024-01-08',
      completedDate: '2024-01-08',
      status: 'completed',
      collector: 'GreenCycle Pro',
      quantity: '3 bins',
      rating: 4
    },
    {
      id: '8',
      wasteType: 'General Waste',
      location: 'Central District',
      scheduledDate: '2024-01-07',
      completedDate: '2024-01-07',
      status: 'completed',
      collector: 'CleanSweep Ltd',
      quantity: '5 bags',
      rating: 5
    }
  ]);

  const [filteredRecords, setFilteredRecords] = useState<PickupRecord[]>(pickupRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = pickupRecords;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.collector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    if (wasteTypeFilter !== 'all') {
      filtered = filtered.filter(record => record.wasteType === wasteTypeFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'last-week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'last-month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'last-3-months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(record => 
          new Date(record.scheduledDate) >= filterDate
        );
      }
    }

    setFilteredRecords(filtered);
  }, [pickupRecords, searchTerm, statusFilter, wasteTypeFilter, dateFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'missed': return <X className="h-3 w-3 mr-1" />;
      case 'partial': return <Clock className="h-3 w-3 mr-1" />;
      case 'cancelled': return <X className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  const getHistoryStats = () => {
    const total = pickupRecords.length;
    const completed = pickupRecords.filter(r => r.status === 'completed').length;
    const missed = pickupRecords.filter(r => r.status === 'missed').length;
    const partial = pickupRecords.filter(r => r.status === 'partial').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, missed, partial, completionRate };
  };

  const stats = getHistoryStats();
  const wasteTypes = ['Recyclables', 'Organic Waste', 'General Waste', 'Electronic Waste', 'Hazardous Waste'];

  const generateReport = () => {
    // In a real app, this would generate and download a PDF/CSV report
    alert('Report generation feature would be implemented here!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Pickup History
          </h1>
          <p className="text-xl text-gray-600">
            Track all pickup records with filterable views by date, waste type, and status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-gray-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {stats.total}
              </div>
              <p className="text-sm text-gray-600 font-semibold">Total Pickups</p>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {stats.completed}
              </div>
              <p className="text-sm text-green-700 font-semibold">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                {stats.missed}
              </div>
              <p className="text-sm text-red-700 font-semibold">Missed</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                {stats.partial}
              </div>
              <p className="text-sm text-yellow-700 font-semibold">Partial</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {stats.completionRate}%
              </div>
              <p className="text-sm text-blue-700 font-semibold">Success Rate</p>
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
                placeholder="Search by location, waste type, or collector..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

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

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={generateReport}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* History Table */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pickup Records
            </CardTitle>
            <CardDescription>
              {filteredRecords.length} of {pickupRecords.length} records shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Waste Type</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Location</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Scheduled</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Completed</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Status</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Collector</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Quantity</TableHead>
                    <TableHead className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
                      <TableCell>
                        <div className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {record.wasteType}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1 text-blue-600" />
                          {record.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1 text-blue-600" />
                          {new Date(record.scheduledDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.completedDate ? (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-1 text-green-600" />
                            {new Date(record.completedDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`font-bold ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-gray-700">{record.collector}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{record.quantity || '-'}</span>
                      </TableCell>
                      <TableCell>
                        {record.rating ? (
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-yellow-600">
                              {'★'.repeat(record.rating)}{'☆'.repeat(5 - record.rating)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">({record.rating}/5)</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="py-12 text-center">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No pickup records found</h3>
                <p className="text-gray-600">Try adjusting your search or filters to see more results.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Records with Notes */}
        {filteredRecords.filter(r => r.notes).length > 0 && (
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Records with Notes
              </CardTitle>
              <CardDescription>
                Pickup records that include additional notes or comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRecords.filter(r => r.notes).map((record) => (
                  <div key={record.id} className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-yellow-600" />
                        <span className="font-semibold text-gray-800">{record.wasteType} - {record.location}</span>
                        <Badge className={`text-xs ${getStatusColor(record.status)}`}>
                          {record.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(record.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{record.notes}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
