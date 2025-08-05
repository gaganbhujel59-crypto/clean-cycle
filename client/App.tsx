import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScheduleManagement from "./pages/ScheduleManagement";
import IssueReporting from "./pages/IssueReporting";
import PickupHistory from "./pages/PickupHistory";
import SmartNotifications from "./pages/SmartNotifications";
import UserNotifications from "./pages/UserNotifications";
import AnalyticsReports from "./pages/AnalyticsReports";
import CommunityManagement from "./pages/CommunityManagement";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/schedule"
                  element={
                    <ProtectedRoute>
                      <ScheduleManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/issues"
                  element={
                    <ProtectedRoute>
                      <IssueReporting />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/history"
                  element={
                    <ProtectedRoute>
                      <PickupHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/notifications"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <SmartNotifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/user-notifications"
                  element={
                    <ProtectedRoute>
                      <UserNotifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/reports"
                  element={
                    <ProtectedRoute>
                      <AnalyticsReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/community"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <CommunityManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute>
                      <Schedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Community />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
