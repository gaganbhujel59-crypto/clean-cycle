import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  Calendar,
  AlertTriangle,
  BarChart3,
  Bell,
  Users,
  History,
  LogOut,
  User,
  Menu,
  X,
  Home
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getUnreadCount } = useNotifications();
  const location = useLocation();

  const unreadCount = user ? getUnreadCount(user.id, user.role) : 0;

  const navigation = [
    { name: "Dashboard Overview", href: "/dashboard", icon: Home, description: "Main dashboard with overview stats" },
    { name: "Smart Scheduling", href: "/dashboard/schedule", icon: Calendar, description: "Schedule waste pickups by type & date" },
    { name: "Issue Reporting", href: "/dashboard/issues", icon: AlertTriangle, description: "Report missed pickups & problems" },
    { name: "Analytics & Reports", href: "/dashboard/reports", icon: BarChart3, description: "View recycling rates & performance" },
    {
      name: user?.role === 'admin' ? "Send Notifications" : "My Notifications",
      href: user?.role === 'admin' ? "/dashboard/notifications" : "/dashboard/user-notifications",
      icon: Bell,
      description: user?.role === 'admin' ? "Send alerts & announcements to users" : "View notifications from administrators",
      badge: user?.role !== 'admin' && unreadCount > 0 ? unreadCount : undefined
    },
    { name: "Pickup History", href: "/dashboard/history", icon: History, description: "Track all pickup records" },
    ...(user?.role === 'admin' ? [
      { name: "Community Management", href: "/dashboard/community", icon: Users, description: "Manage users & community settings" }
    ] : [])
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-ocean-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-eco-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-eco-200">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-eco-600 to-ocean-600 p-2 rounded-xl shadow-lg">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-eco-600 to-ocean-600 bg-clip-text text-transparent">
                  CleanCycle
                </h1>
                <p className="text-xs text-gray-500">Waste Management System</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-eco-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-eco-500 to-ocean-500 p-2 rounded-full">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {user?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  {user?.role === 'admin' && (
                    <span className="text-xs bg-gradient-to-r from-eco-500 to-ocean-500 text-white px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <h3 className="text-sm font-bold bg-gradient-to-r from-eco-600 to-ocean-600 bg-clip-text text-transparent uppercase tracking-wider mb-4">
              Main Features
            </h3>
            {navigation.map((item) => {
              const Icon = item.icon;
              const current = isCurrentPath(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-start p-3 rounded-xl transition-all duration-200 hover:shadow-md relative",
                    current
                      ? "bg-gradient-to-r from-eco-500 to-ocean-500 text-white shadow-lg"
                      : "hover:bg-gradient-to-r hover:from-eco-50 hover:to-ocean-50 text-gray-700 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={cn(
                    "h-6 w-6 mt-0.5 flex-shrink-0",
                    current ? "text-white" : "text-eco-700 group-hover:text-eco-800 font-bold"
                  )} />
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm font-bold",
                        current
                          ? "text-white"
                          : "bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                      )}>
                        {item.name}
                      </p>
                      {(item as any).badge && (
                        <Badge className="bg-red-500 text-white text-xs font-bold ml-2">
                          {(item as any).badge}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-1",
                      current ? "text-eco-100" : "text-gray-500"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-eco-200 space-y-2">
            <Link to="/">
              <Button
                variant="outline"
                className="w-full justify-start border-eco-200 text-eco-800 hover:bg-eco-50 font-bold"
              >
                <Home className="h-4 w-4 mr-3" />
                <span className="font-semibold">Back to Homepage</span>
              </Button>
            </Link>
            <Button
              onClick={logout}
              variant="outline" 
              className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span className="font-semibold">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-eco-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-eco-600 to-ocean-600 bg-clip-text text-transparent">
            CleanCycle
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
