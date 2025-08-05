import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, ArrowLeft, Construction, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PlaceholderPageProps {
  title: string;
  description: string;
  currentPath: string;
}

export default function PlaceholderPage({ title, description, currentPath }: PlaceholderPageProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-ocean-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-eco-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-eco-600 p-2 rounded-lg">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-eco-800">CleanCycle</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`${currentPath === '/dashboard' ? 'text-eco-600 font-medium' : 'text-gray-700 hover:text-eco-600'} transition-colors`}
              >
                Dashboard
              </Link>
              <Link
                to="/schedule"
                className={`${currentPath === '/schedule' ? 'text-eco-600 font-medium' : 'text-gray-700 hover:text-eco-600'} transition-colors`}
              >
                Schedule
              </Link>
              <Link
                to="/reports"
                className={`${currentPath === '/reports' ? 'text-eco-600 font-medium' : 'text-gray-700 hover:text-eco-600'} transition-colors`}
              >
                Reports
              </Link>
              <Link
                to="/community"
                className={`${currentPath === '/community' ? 'text-eco-600 font-medium' : 'text-gray-700 hover:text-eco-600'} transition-colors`}
              >
                Community
              </Link>
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.name}</span>
                {user?.role === 'admin' && (
                  <span className="text-xs bg-eco-100 text-eco-800 px-2 py-1 rounded-full">Admin</span>
                )}
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-eco-600 text-eco-600 hover:bg-eco-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Link to="/" className="text-gray-700 hover:text-eco-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardHeader className="pb-8">
            <div className="bg-gradient-to-r from-eco-500 to-ocean-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </CardTitle>
            <CardDescription className="text-lg">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-eco-100 to-ocean-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🚧 Feature Under Development</h3>
              <p className="text-gray-600 mb-4">
                This page is part of the comprehensive CleanCycle waste management system. 
                Continue prompting to help build out specific CRUD functionality for this feature.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-4 border border-eco-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">What's Coming</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full CRUD operations</li>
                  <li>• Real-time updates</li>
                  <li>• Data visualization</li>
                  <li>• Mobile optimization</li>
                </ul>
              </div>
              <div className="p-4 border border-ocean-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Tech Stack</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React + TypeScript</li>
                  <li>• Express.js backend</li>
                  <li>• RESTful APIs</li>
                  <li>• TailwindCSS design</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/">
                <Button variant="outline" className="border-eco-600 text-eco-600 hover:bg-eco-50">
                  Return to Homepage
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-eco-600 hover:bg-eco-700">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
