import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  Calendar,
  AlertTriangle,
  BarChart3,
  Bell,
  Users,
  CheckCircle,
  MapPin,
  Clock,
  Leaf,
  LogOut,
  User,
  Info,
  Mail,
  Phone,
  Award,
  Shield,
  Heart
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-ocean-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-eco-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-eco-600 p-2 rounded-lg">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-eco-800">CleanCycle</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-eco-800 font-bold hover:font-black transition-colors">About</a>
              <a href="#features" className="text-gray-700 hover:text-eco-800 font-bold hover:font-black transition-colors">Features</a>
              <a href="#contact" className="text-gray-700 hover:text-eco-800 font-bold hover:font-black transition-colors">Contact</a>
              <Link to="/login" className="text-gray-700 hover:text-eco-800 font-bold hover:font-black transition-colors">Sign In</Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-3 bg-eco-100 text-eco-800 hover:bg-eco-200">
                🌱 Sustainable Communities
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Smart Waste Management for
                <span className="text-eco-700 font-black"> Cleaner Communities</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                CleanCycle revolutionizes community waste management through efficient scheduling,
                real-time reporting, and data-driven insights. Join the movement towards a cleaner,
                more sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/register">
                  <Button size="lg" className="bg-eco-600 hover:bg-eco-700 text-white w-full sm:w-auto">
                    Start Managing Waste
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-eco-700 text-eco-800 hover:bg-eco-50 w-full sm:w-auto font-bold">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-eco-600" />
                  <span>Real-time tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-eco-600" />
                  <span>Community driven</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-eco-600" />
                  <span>Analytics powered</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-eco-500 to-ocean-500 rounded-2xl p-6 shadow-xl">
                <div className="bg-white rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
                    <Badge className="bg-eco-100 text-eco-800">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-eco-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-eco-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Recyclables Pickup</p>
                        <p className="text-xs text-gray-600">9:00 AM - 11:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-ocean-50 rounded-lg">
                      <Clock className="h-4 w-4 text-ocean-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Organic Waste</p>
                        <p className="text-xs text-gray-600">2:00 PM - 4:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About <span className="text-eco-700 font-black">CleanCycle</span>
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                CleanCycle is a comprehensive waste management platform designed to empower communities
                with efficient, transparent, and sustainable waste collection solutions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-eco-100 p-1.5 rounded-full">
                    <Award className="h-4 w-4 text-eco-600" />
                  </div>
                  <p className="text-gray-700 text-sm">Founded in 2024 with a mission to create cleaner communities</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-eco-100 p-1.5 rounded-full">
                    <Users className="h-4 w-4 text-eco-600" />
                  </div>
                  <p className="text-gray-700 text-sm">Serving 500+ communities worldwide</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-eco-100 p-1.5 rounded-full">
                    <Shield className="h-4 w-4 text-eco-600" />
                  </div>
                  <p className="text-gray-700 text-sm">Built with cutting-edge technology and security</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-eco-100 p-1.5 rounded-full">
                    <Heart className="h-4 w-4 text-eco-600" />
                  </div>
                  <p className="text-gray-700 text-sm">Committed to environmental sustainability</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-eco-500 to-ocean-500 rounded-2xl p-6 shadow-xl">
                <div className="bg-white rounded-xl p-4 space-y-4">
                  <h3 className="font-bold text-gray-900">Our Mission</h3>
                  <p className="text-gray-700 text-sm">
                    To revolutionize waste management through technology, making it easier for
                    communities to maintain clean, sustainable environments while reducing
                    environmental impact.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-eco-50 p-2 rounded-lg">
                      <p className="text-xl font-bold text-eco-600">1,200+</p>
                      <p className="text-xs text-gray-600">Tons Recycled</p>
                    </div>
                    <div className="bg-ocean-50 p-2 rounded-lg">
                      <p className="text-xl font-bold text-ocean-600">95%</p>
                      <p className="text-xs text-gray-600">Efficiency Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Comprehensive Waste Management Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline waste collection, engage communities,
              and create a sustainable environment through technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-eco-200">
              <CardHeader className="pb-4">
                <div className="bg-eco-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="h-5 w-5 text-eco-600" />
                </div>
                <CardTitle className="text-lg">Smart Scheduling</CardTitle>
                <CardDescription className="text-sm">
                  Schedule waste pickups by type, date, and location with intelligent routing optimization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-ocean-200">
              <CardHeader className="pb-4">
                <div className="bg-ocean-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-ocean-600" />
                </div>
                <CardTitle className="text-lg">Issue Reporting</CardTitle>
                <CardDescription className="text-sm">
                  Report missed pickups, overflowing bins, and illegal dumping with real-time notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-eco-200">
              <CardHeader className="pb-4">
                <div className="bg-eco-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="h-5 w-5 text-eco-600" />
                </div>
                <CardTitle className="text-lg">Analytics & Reports</CardTitle>
                <CardDescription className="text-sm">
                  Generate insights on recycling rates, pickup performance, and community impact metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-ocean-200">
              <CardHeader className="pb-4">
                <div className="bg-ocean-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-ocean-600" />
                </div>
                <CardTitle className="text-lg">Community Management</CardTitle>
                <CardDescription className="text-sm">
                  Manage user registrations, community profiles, and role-based access controls.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-eco-200">
              <CardHeader className="pb-4">
                <div className="bg-eco-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Bell className="h-5 w-5 text-eco-600" />
                </div>
                <CardTitle className="text-lg">Smart Notifications</CardTitle>
                <CardDescription className="text-sm">
                  Receive timely alerts for pickups, schedule changes, and community announcements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-ocean-200">
              <CardHeader className="pb-4">
                <div className="bg-ocean-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="h-5 w-5 text-ocean-600" />
                </div>
                <CardTitle className="text-lg">Pickup History</CardTitle>
                <CardDescription className="text-sm">
                  Track complete pickup history with filterable views by date, waste type, and status.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-eco-600 to-ocean-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Making a Real Impact</h2>
            <p className="text-lg text-eco-100">
              Join thousands of communities already using CleanCycle
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-eco-100">Pickups Scheduled</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-eco-100">Communities Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-eco-100">Recycling Rate Increase</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200</div>
              <div className="text-eco-100">Tons Waste Diverted</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <Leaf className="h-12 w-12 text-eco-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Community?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Start managing waste more efficiently today. Join the CleanCycle community
              and make a positive environmental impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-eco-600 hover:bg-eco-700 text-white">
                  Get Started Free
                </Button>
              </Link>
              <a href="#contact">
                <Button size="lg" variant="outline" className="border-eco-700 text-eco-800 hover:bg-eco-50 font-bold">
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-gradient-to-r from-eco-600 to-ocean-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Get in Touch</h2>
            <p className="text-lg text-eco-100">
              Ready to transform your community's waste management? Contact us today!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="py-6 text-center">
                <div className="bg-white/20 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Email Us</h3>
                <p className="text-eco-100 mb-3 text-sm">Get in touch for support or inquiries</p>
                <p className="font-semibold text-sm">contact@cleancycle.com</p>
                <p className="text-xs">support@cleancycle.com</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="py-6 text-center">
                <div className="bg-white/20 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Call Us</h3>
                <p className="text-eco-100 mb-3 text-sm">Speak with our team directly</p>
                <p className="font-semibold text-sm">+1 (555) 123-4567</p>
                <p className="text-xs">Mon-Fri, 9AM-6PM EST</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="py-6 text-center">
                <div className="bg-white/20 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Info className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Visit Us</h3>
                <p className="text-eco-100 mb-3 text-sm">Come see us at our headquarters</p>
                <p className="font-semibold text-sm">123 Green Street</p>
                <p className="text-xs">Eco City, EC 12345</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
              <p className="text-eco-100 mb-4 text-sm">
                Join thousands of communities already using CleanCycle to manage their waste more efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-eco-800 hover:bg-gray-100 font-black">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-eco-600 p-2 rounded-lg">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CleanCycle</span>
            </div>
            <div className="text-gray-400">
              © 2024 CleanCycle. Building sustainable communities.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
