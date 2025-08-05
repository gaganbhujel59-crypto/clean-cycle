import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  AlertTriangle, 
  BarChart3, 
  Bell, 
  Users, 
  TrendingUp,
  TrendingDown,
  Plus,
  CheckCircle,
  Clock,
  MapPin,
  Recycle,
  Leaf
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPickups: 156,
    completedPickups: 142,
    pendingPickups: 14,
    openIssues: 7,
    resolvedIssues: 23,
    recyclingRate: 78,
    communityScore: 92,
    totalUsers: 245,
    activeUsers: 189
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'pickup',
      title: 'Recyclables pickup completed',
      location: 'Green Valley Block A',
      time: '2 hours ago',
      status: 'completed',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'issue',
      title: 'Overflowing bin reported',
      location: 'Eco Park Street 15',
      time: '4 hours ago',
      status: 'pending',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      id: 3,
      type: 'notification',
      title: 'Weekly recycling reminder sent',
      location: 'All community members',
      time: '6 hours ago',
      status: 'sent',
      icon: Bell,
      color: 'text-blue-600'
    },
    {
      id: 4,
      type: 'pickup',
      title: 'Organic waste scheduled',
      location: 'Central District',
      time: '1 day ago',
      status: 'scheduled',
      icon: Calendar,
      color: 'text-eco-700 font-bold'
    }
  ]);

  const [upcomingPickups] = useState([
    {
      id: 1,
      type: 'Recyclables',
      location: 'Green Valley Block B',
      time: 'Today 2:00 PM',
      status: 'confirmed',
      collector: 'EcoTeam Alpha'
    },
    {
      id: 2,
      type: 'Organic Waste',
      location: 'Central District',
      time: 'Tomorrow 9:00 AM',
      status: 'scheduled',
      collector: 'GreenCycle Pro'
    },
    {
      id: 3,
      type: 'General Waste',
      location: 'Eco Park Area',
      time: 'Tomorrow 3:00 PM',
      status: 'pending',
      collector: 'CleanSweep Ltd'
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        recyclingRate: Math.min(100, prev.recyclingRate + Math.random() * 0.5),
        communityScore: Math.min(100, prev.communityScore + Math.random() * 0.3)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-eco-600 via-green-600 to-ocean-600 bg-clip-text text-transparent">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-xl text-gray-600">
          Here's what's happening in your community today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-eco-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold bg-gradient-to-r from-eco-600 to-green-600 bg-clip-text text-transparent">
              Completed Pickups
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.completedPickups}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Open Issues
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.openIssues}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingDown className="h-4 w-4 mr-1" />
              -5% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold bg-gradient-to-r from-blue-600 to-ocean-600 bg-clip-text text-transparent">
              Recycling Rate
            </CardTitle>
            <Recycle className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.recyclingRate.toFixed(1)}%
            </div>
            <Progress value={stats.recyclingRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold bg-gradient-to-r from-green-600 to-eco-600 bg-clip-text text-transparent">
              Community Score
            </CardTitle>
            <Leaf className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.communityScore}
            </div>
            <p className="text-sm text-green-600 mt-1">Excellent Performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-eco-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-eco-600 to-ocean-600 bg-clip-text text-transparent">
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used actions for waste management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard/schedule">
              <Button className="w-full justify-start bg-gradient-to-r from-eco-600 to-green-600 hover:from-eco-700 hover:to-green-700 text-white font-bold">
                <Plus className="h-4 w-4 mr-3" />
                Schedule New Pickup
              </Button>
            </Link>
            <Link to="/dashboard/issues">
              <Button variant="outline" className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-50 font-bold">
                <AlertTriangle className="h-4 w-4 mr-3" />
                Report Issue
              </Button>
            </Link>
            <Link to="/dashboard/reports">
              <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50 font-bold">
                <BarChart3 className="h-4 w-4 mr-3" />
                View Analytics
              </Button>
            </Link>
            <Link to="/dashboard/notifications">
              <Button variant="outline" className="w-full justify-start border-purple-300 text-purple-700 hover:bg-purple-50 font-bold">
                <Bell className="h-4 w-4 mr-3" />
                Send Notification
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-eco-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-eco-600 to-ocean-600 bg-clip-text text-transparent">
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-eco-50 hover:to-ocean-50 transition-colors">
                    <div className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-full border shadow-sm">
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-600">{activity.location}</p>
                        <Clock className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 'secondary'}
                      className={
                        activity.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : activity.status === 'pending' 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Pickups */}
      <Card className="border-eco-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-eco-600 to-ocean-600 bg-clip-text text-transparent">
            Upcoming Pickups
          </CardTitle>
          <CardDescription>
            Scheduled waste collection activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingPickups.map((pickup) => (
              <div key={pickup.id} className="p-4 border border-eco-200 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-eco-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {pickup.type}
                  </h4>
                  <Badge 
                    variant={pickup.status === 'confirmed' ? 'default' : 'secondary'}
                    className={
                      pickup.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 font-bold' 
                        : pickup.status === 'scheduled' 
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'bg-orange-100 text-orange-800 font-bold'
                    }
                  >
                    {pickup.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-eco-700 font-bold" />
                    <span className="font-semibold">{pickup.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-eco-700 font-bold" />
                    <span className="font-semibold">{pickup.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-eco-700 font-bold" />
                    <span className="font-semibold">{pickup.collector}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
