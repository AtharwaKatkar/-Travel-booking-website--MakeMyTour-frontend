import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Snowflake, 
  BarChart3,
  Calendar,
  Zap,
  Shield,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';
import PricingDashboard from '../components/Pricing/PricingDashboard';

const PricingDemoPage: NextPage = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const demoFeatures = [
    {
      id: 'dynamic-pricing',
      title: 'Dynamic Pricing Engine',
      description: 'Real-time price adjustments based on demand, seasonality, and market conditions',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'blue',
      highlights: [
        'Demand-based price adjustments (+20% during holidays)',
        'Real-time occupancy rate monitoring',
        'Seasonal and event-based multipliers',
        'Intelligent price optimization algorithms'
      ]
    },
    {
      id: 'price-history',
      title: 'Price History Tracking',
      description: 'Interactive charts showing price trends and historical data',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'green',
      highlights: [
        'Interactive price history graphs',
        '7-day, 30-day, and 90-day views',
        'Price trend analysis and predictions',
        'Min/max price tracking with statistics'
      ]
    },
    {
      id: 'price-freeze',
      title: 'Price Freeze Protection',
      description: 'Lock in current prices for 24 hours to protect against increases',
      icon: <Snowflake className="w-6 h-6" />,
      color: 'purple',
      highlights: [
        '24-hour price freeze protection',
        'Automatic savings calculation',
        'Real-time countdown timers',
        'One-click freeze activation'
      ]
    },
    {
      id: 'demand-factors',
      title: 'Demand Factor Analysis',
      description: 'Transparent breakdown of factors affecting current pricing',
      icon: <Zap className="w-6 h-6" />,
      color: 'orange',
      highlights: [
        'Seasonal demand multipliers',
        'Event-based price adjustments',
        'Occupancy rate impact analysis',
        'Time-based pricing factors'
      ]
    }
  ];

  const mockStats = {
    totalPriceChanges: 1247,
    averagePriceIncrease: 850,
    activeFreezesCount: 23,
    totalSavings: 125000,
    peakDemandIncrease: 45
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <Head>
        <title>Dynamic Pricing Engine Demo | MakeMyTrip</title>
        <meta 
          name="description" 
          content="Experience MakeMyTrip's intelligent dynamic pricing system with demand-based adjustments, price history tracking, and price freeze protection." 
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
                  <h1 className="text-2xl font-bold text-gray-900">Live Demo: Dynamic Pricing Engine</h1>
                  <p className="text-gray-600">Interactive pricing system with real-time adjustments</p>
                </div>
                <button
                  onClick={() => setActiveDemo(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Back to Overview
                </button>
              </div>
            </div>
            <PricingDashboard />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Dynamic Pricing Engine
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Experience intelligent pricing that adapts to demand, seasonality, and market conditions. 
                Get price freeze protection and transparent pricing insights.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveDemo('dashboard')}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{mockStats.totalPriceChanges}</div>
                <div className="text-sm text-gray-600">Price Updates</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">₹{mockStats.averagePriceIncrease}</div>
                <div className="text-sm text-gray-600">Avg. Increase</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Snowflake className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{mockStats.activeFreezesCount}</div>
                <div className="text-sm text-gray-600">Active Freezes</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">₹{(mockStats.totalSavings / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">Total Savings</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Zap className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{mockStats.peakDemandIncrease}%</div>
                <div className="text-sm text-gray-600">Peak Increase</div>
              </div>
            </div>

            {/* Features Grid */}
            <div id="features" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Intelligent Pricing Features
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

            {/* How It Works */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                How Dynamic Pricing Works
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Monitor Demand</h3>
                    <p className="text-sm text-gray-600">
                      Real-time tracking of occupancy rates, booking trends, and market conditions
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-green-600">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Apply Factors</h3>
                    <p className="text-sm text-gray-600">
                      Seasonal, event-based, and time-sensitive multipliers adjust base prices
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Update Prices</h3>
                    <p className="text-sm text-gray-600">
                      Intelligent algorithms calculate optimal pricing with transparent breakdowns
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-orange-600">4</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Protect Users</h3>
                    <p className="text-sm text-gray-600">
                      Price freeze options allow users to lock in favorable rates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demand Scenarios */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Pricing Scenarios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-red-900">Holiday Peak</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">Base Price:</span>
                      <span className="font-medium text-red-900">₹8,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Holiday Multiplier:</span>
                      <span className="font-medium text-red-900">+60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">High Occupancy:</span>
                      <span className="font-medium text-red-900">+30%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-red-300">
                      <span className="font-semibold text-red-900">Final Price:</span>
                      <span className="font-bold text-red-900">₹17,340</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-blue-900">Normal Period</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Base Price:</span>
                      <span className="font-medium text-blue-900">₹8,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Weekend Premium:</span>
                      <span className="font-medium text-blue-900">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Normal Occupancy:</span>
                      <span className="font-medium text-blue-900">+10%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-300">
                      <span className="font-semibold text-blue-900">Final Price:</span>
                      <span className="font-bold text-blue-900">₹10,625</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <Star className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-green-900">Off-Season</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">Base Price:</span>
                      <span className="font-medium text-green-900">₹8,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Low Season:</span>
                      <span className="font-medium text-green-900">-20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Low Occupancy:</span>
                      <span className="font-medium text-green-900">-15%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-green-300">
                      <span className="font-semibold text-green-900">Final Price:</span>
                      <span className="font-bold text-green-900">₹5,780</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Why Choose Dynamic Pricing?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Fair Market Pricing</h3>
                  <p className="text-gray-600">
                    Prices reflect real market conditions and demand, ensuring fair value for both peak and off-peak periods
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Snowflake className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Price Protection</h3>
                  <p className="text-gray-600">
                    Price freeze feature protects you from sudden increases while you make your booking decision
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparent Insights</h3>
                  <p className="text-gray-600">
                    Complete visibility into pricing factors and historical trends helps you make informed decisions
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Experience Intelligent Pricing Today
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Try our dynamic pricing engine with real-time adjustments and price freeze protection
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveDemo('dashboard')}
                  className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Launch Interactive Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <a
                  href="/pricing"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
                >
                  Go to Pricing Engine
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default PricingDemoPage;