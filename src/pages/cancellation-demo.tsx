import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Plane,
  Building,
  Star,
  TrendingUp
} from 'lucide-react';
import CancellationDashboard from '../components/Cancellation/CancellationDashboard';

const CancellationDemoPage: NextPage = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const demoFeatures = [
    {
      id: 'dashboard',
      title: 'Booking Management Dashboard',
      description: 'Comprehensive view of all bookings with filtering and search capabilities',
      icon: <Calendar className="w-6 h-6" />,
      color: 'blue',
      highlights: [
        'View all bookings in one place',
        'Filter by status, type, and search',
        'Real-time booking statistics',
        'Quick access to cancellation and refund tracking'
      ]
    },
    {
      id: 'cancellation',
      title: 'Smart Cancellation System',
      description: 'Intelligent cancellation with real-time refund calculations',
      icon: <XCircle className="w-6 h-6" />,
      color: 'red',
      highlights: [
        'Real-time refund calculation based on policies',
        'Step-by-step cancellation process',
        'Multiple cancellation reasons',
        'Instant confirmation and reference generation'
      ]
    },
    {
      id: 'refund-tracking',
      title: 'Refund Status Tracking',
      description: 'Track refund progress with detailed timeline and status updates',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'green',
      highlights: [
        'Real-time refund status tracking',
        'Detailed progress timeline',
        'Email notifications for status changes',
        'Download refund receipts'
      ]
    },
    {
      id: 'policies',
      title: 'Dynamic Cancellation Policies',
      description: 'Flexible policies based on booking type, timing, and fare rules',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'yellow',
      highlights: [
        'Time-based refund percentages',
        'Different policies for flights and hotels',
        'Transparent fee structure',
        'Policy explanations and breakdowns'
      ]
    }
  ];

  const mockStats = {
    totalBookings: 156,
    cancelledBookings: 23,
    totalRefunded: 245000,
    averageRefundTime: 5,
    cancellationRate: 15
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      red: 'text-red-600 bg-red-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <Head>
        <title>Cancellation & Refunds Demo | MakeMyTrip</title>
        <meta 
          name="description" 
          content="Experience MakeMyTrip's comprehensive cancellation and refund system with real-time calculations, smart policies, and seamless tracking." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {activeDemo === 'dashboard' ? (
          <div>
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Live Demo: Booking Management</h1>
                  <p className="text-gray-600">Interactive cancellation and refund system</p>
                </div>
                <button
                  onClick={() => setActiveDemo(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Back to Overview
                </button>
              </div>
            </div>
            <CancellationDashboard />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Cancellation & Refunds System
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Experience our comprehensive booking management system with intelligent cancellation policies, 
                real-time refund calculations, and seamless tracking capabilities.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveDemo('dashboard')}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Live Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <a
                  href="#features"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{mockStats.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{mockStats.cancelledBookings}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">₹{(mockStats.totalRefunded / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">Total Refunded</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{mockStats.averageRefundTime}</div>
                <div className="text-sm text-gray-600">Avg. Refund Days</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{mockStats.cancellationRate}%</div>
                <div className="text-sm text-gray-600">Cancellation Rate</div>
              </div>
            </div>

            {/* Features Grid */}
            <div id="features" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Comprehensive Cancellation Features
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {demoFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColorClasses(feature.color)}`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {feature.description}
                        </p>
                        <ul className="space-y-2">
                          {feature.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Flow */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Cancellation Process Flow
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Select Booking</h3>
                    <p className="text-sm text-gray-600">
                      Choose the booking you want to cancel from your dashboard
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-red-600">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Review Policy</h3>
                    <p className="text-sm text-gray-600">
                      View cancellation policy and real-time refund calculation
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-yellow-600">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Provide Reason</h3>
                    <p className="text-sm text-gray-600">
                      Select cancellation reason and add optional comments
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-green-600">4</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Track Refund</h3>
                    <p className="text-sm text-gray-600">
                      Monitor refund status with detailed progress tracking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Why Choose Our Cancellation System?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RefreshCw className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Processing</h3>
                  <p className="text-gray-600">
                    Instant refund calculations and immediate confirmation with automated processing
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparent Policies</h3>
                  <p className="text-gray-600">
                    Clear cancellation policies with detailed breakdowns and no hidden fees
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">User-Friendly</h3>
                  <p className="text-gray-600">
                    Intuitive interface with step-by-step guidance and comprehensive tracking
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Experience Hassle-Free Cancellations?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Try our comprehensive booking management system with intelligent cancellation features
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveDemo('dashboard')}
                  className="flex items-center px-8 py-4 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Launch Interactive Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <a
                  href="/cancellation"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-red-600 transition-colors font-semibold"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default CancellationDemoPage;