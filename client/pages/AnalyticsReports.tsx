import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  Recycle, 
  Leaf, 
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

interface ChartData {
  month: string;
  pickups: number;
  recycled: number;
  issues: number;
}

interface WasteTypeData {
  type: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface CommunityStats {
  totalPickups: number;
  completedPickups: number;
  recyclingRate: number;
  issuesResolved: number;
  activeUsers: number;
  totalWasteCollected: number;
}

export default function AnalyticsReports() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const [chartData] = useState<ChartData[]>([
    { month: 'Jul', pickups: 45, recycled: 78, issues: 5 },
    { month: 'Aug', pickups: 52, recycled: 82, issues: 3 },
    { month: 'Sep', pickups: 48, recycled: 85, issues: 7 },
    { month: 'Oct', pickups: 61, recycled: 89, issues: 4 },
    { month: 'Nov', pickups: 55, recycled: 91, issues: 2 },
    { month: 'Dec', pickups: 58, recycled: 88, issues: 6 },
  ]);

  const [wasteTypeData] = useState<WasteTypeData[]>([
    { type: 'Recyclables', amount: 2450, percentage: 35, trend: 'up' },
    { type: 'Organic Waste', amount: 1890, percentage: 27, trend: 'up' },
    { type: 'General Waste', amount: 1560, percentage: 22, trend: 'down' },
    { type: 'Electronic Waste', amount: 680, percentage: 10, trend: 'stable' },
    { type: 'Hazardous Waste', amount: 420, percentage: 6, trend: 'down' },
  ]);

  const [communityStats] = useState<CommunityStats>({
    totalPickups: 342,
    completedPickups: 326,
    recyclingRate: 78.5,
    issuesResolved: 89,
    activeUsers: 245,
    totalWasteCollected: 7850
  });

  const [performanceData] = useState([
    { location: 'Green Valley Block A', score: 95, pickups: 48, issues: 1 },
    { location: 'Central District', score: 87, pickups: 52, issues: 3 },
    { location: 'Eco Park Area', score: 92, pickups: 45, issues: 2 },
    { location: 'Green Valley Block B', score: 83, pickups: 41, issues: 4 },
    { location: 'Green Valley Block C', score: 88, pickups: 39, issues: 2 },
  ]);

  const calculateTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  const completionRate = Math.round((communityStats.completedPickups / communityStats.totalPickups) * 100);
  const issueResolutionRate = 94; // Mock data
  
  const getMaxValue = () => {
    switch (selectedMetric) {
      case 'pickups': return Math.max(...chartData.map(d => d.pickups));
      case 'recycled': return Math.max(...chartData.map(d => d.recycled));
      case 'issues': return Math.max(...chartData.map(d => d.issues));
      default: return 100;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const generateReport = () => {
    // In a real app, this would generate and download a comprehensive PDF report
    alert('Comprehensive analytics report would be generated and downloaded here!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p className="text-xl text-gray-600">
            Generate visual reports for recycling rates, issue statistics, and pickup performance
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="pickups">Pickup Volume</SelectItem>
                <SelectItem value="recycled">Recycling Rate</SelectItem>
                <SelectItem value="issues">Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generateReport} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Total Pickups</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    {communityStats.totalPickups}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-semibold">+12% vs last period</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Recycling Rate</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {communityStats.recyclingRate}%
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600 font-semibold">+5.2% vs last period</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Leaf className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {communityStats.activeUsers}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="text-sm text-purple-600 font-semibold">+8% vs last period</span>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Waste Collected</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                    {(communityStats.totalWasteCollected / 1000).toFixed(1)}t
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
                    <span className="text-sm text-orange-600 font-semibold">+15% vs last period</span>
                  </div>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Monthly Performance Trends
            </CardTitle>
            <CardDescription>
              Track pickup volumes, recycling rates, and issue resolution over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((data, index) => {
                const maxValue = getMaxValue();
                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-700">{data.month} 2024</span>
                      <div className="flex items-center space-x-4">
                        {(selectedMetric === 'all' || selectedMetric === 'pickups') && (
                          <span className="text-green-600 font-semibold">{data.pickups} pickups</span>
                        )}
                        {(selectedMetric === 'all' || selectedMetric === 'recycled') && (
                          <span className="text-blue-600 font-semibold">{data.recycled}% recycled</span>
                        )}
                        {(selectedMetric === 'all' || selectedMetric === 'issues') && (
                          <span className="text-orange-600 font-semibold">{data.issues} issues</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {(selectedMetric === 'all' || selectedMetric === 'pickups') && (
                        <Progress value={(data.pickups / maxValue) * 100} className="h-2 bg-green-100" />
                      )}
                      {(selectedMetric === 'all' || selectedMetric === 'recycled') && (
                        <Progress value={data.recycled} className="h-2 bg-blue-100" />
                      )}
                      {(selectedMetric === 'all' || selectedMetric === 'issues') && (
                        <Progress value={(data.issues / 10) * 100} className="h-2 bg-orange-100" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Waste Type Breakdown */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Waste Type Analysis
              </CardTitle>
              <CardDescription>
                Breakdown of waste collection by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wasteTypeData.map((waste) => (
                  <div key={waste.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">{waste.type}</span>
                        {getTrendIcon(waste.trend)}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{waste.amount} kg</p>
                        <p className="text-sm text-gray-600">{waste.percentage}%</p>
                      </div>
                    </div>
                    <Progress value={waste.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Performance */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                Location Performance
              </CardTitle>
              <CardDescription>
                Performance scores by community area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((location, index) => (
                  <div key={location.location} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-purple-50">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-purple-500 to-green-500 p-2 rounded-full">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{location.location}</p>
                        <p className="text-sm text-gray-600">{location.pickups} pickups, {location.issues} issues</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getScoreColor(location.score)}`}>
                        {location.score}
                      </p>
                      <p className="text-xs text-gray-500">Performance Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Community Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Pickup Completion Rate</span>
                <div className="flex items-center space-x-2">
                  <Progress value={completionRate} className="w-24 h-2" />
                  <span className="font-bold text-green-600">{completionRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Issue Resolution Rate</span>
                <div className="flex items-center space-x-2">
                  <Progress value={issueResolutionRate} className="w-24 h-2" />
                  <span className="font-bold text-blue-600">{issueResolutionRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Recycling Achievement</span>
                <div className="flex items-center space-x-2">
                  <Progress value={communityStats.recyclingRate} className="w-24 h-2" />
                  <span className="font-bold text-purple-600">{communityStats.recyclingRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Key Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 font-semibold">95% average pickup success rate</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 font-semibold">78% community recycling participation</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 font-semibold">7.8 tons of waste diverted from landfills</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700 font-semibold">Goal: Reduce general waste by 15%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
