import React, { useState, useEffect } from 'react';
import { Plane, Clock, Bell, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const FlightStatusDemo = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate notifications
    const notificationTimer = setInterval(() => {
      const sampleNotifications = [
        { id: 1, flight: 'AI101', message: 'Delayed by 30 minutes', type: 'delay', time: new Date() },
        { id: 2, flight: '6E205', message: 'Gate changed to B12', type: 'gate', time: new Date() },
        { id: 3, flight: 'SG8157', message: 'Now boarding', type: 'boarding', time: new Date() },
      ];
      
      const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      setNotifications(prev => [{ ...randomNotification, id: Date.now() }, ...prev.slice(0, 4)]);
    }, 10000); // New notification every 10 seconds

    return () => {
      clearInterval(timer);
      clearInterval(notificationTimer);
    };
  }, []);

  const mockFlights = [
    {
      id: 'AI101',
      flightNumber: 'AI101',
      airline: 'Air India',
      from: 'Delhi (DEL)',
      to: 'Mumbai (BOM)',
      status: 'DELAYED',
      delay: 60,
      scheduledDeparture: '10:30 AM',
      estimatedDeparture: '11:30 AM',
      gate: 'A12',
      reason: 'Weather conditions at departure airport'
    },
    {
      id: '6E205',
      flightNumber: '6E205',
      airline: 'IndiGo',
      from: 'Bangalore (BLR)',
      to: 'Chennai (MAA)',
      status: 'ON_TIME',
      delay: 0,
      scheduledDeparture: '2:15 PM',
      estimatedDeparture: '2:15 PM',
      gate: 'B7',
      reason: null
    },
    {
      id: 'UK955',
      flightNumber: 'UK955',
      airline: 'Vistara',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      status: 'IN_FLIGHT',
      delay: 0,
      scheduledDeparture: '7:30 PM',
      estimatedDeparture: '7:25 PM',
      gate: 'D9',
      reason: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ON_TIME': return 'text-green-600 bg-green-50 border-green-200';
      case 'DELAYED': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'IN_FLIGHT': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ON_TIME': return <CheckCircle className="w-4 h-4" />;
      case 'DELAYED': return <AlertTriangle className="w-4 h-4" />;
      case 'IN_FLIGHT': return <Plane className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Live Flight Status Demo</h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Real-time flight tracking with push notifications and delay updates
          </p>
          <p className="text-sm text-gray-500">
            Current Time: {currentTime.toLocaleTimeString()} | Auto-refreshing every 30 seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Flight Status Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Live Flight Updates</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Live updates</span>
              </div>
            </div>

            {mockFlights.map((flight) => (
              <div key={flight.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                {/* Flight Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{flight.flightNumber}</h3>
                    <p className="text-sm text-gray-600">{flight.airline}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(flight.status)}`}>
                    {getStatusIcon(flight.status)}
                    <span className="text-sm font-medium">
                      {flight.status === 'DELAYED' ? `Delayed ${flight.delay}min` : 
                       flight.status === 'ON_TIME' ? 'On Time' : 
                       flight.status === 'IN_FLIGHT' ? 'In Flight' : flight.status}
                    </span>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{flight.from.split('(')[1]?.replace(')', '')}</p>
                    <p className="text-sm text-gray-600">{flight.from.split('(')[0]?.trim()}</p>
                  </div>
                  <div className="flex-1 mx-4 relative">
                    <div className="border-t-2 border-dashed border-gray-300"></div>
                    <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-400 w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{flight.to.split('(')[1]?.replace(')', '')}</p>
                    <p className="text-sm text-gray-600">{flight.to.split('(')[0]?.trim()}</p>
                  </div>
                </div>

                {/* Times and Gate */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="font-semibold">{flight.scheduledDeparture}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated</p>
                    <p className="font-semibold">{flight.estimatedDeparture}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gate</p>
                    <p className="font-semibold">{flight.gate}</p>
                  </div>
                </div>

                {/* Delay Reason */}
                {flight.reason && (
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">Delay Reason</p>
                        <p className="text-sm text-orange-700">{flight.reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Notifications Panel */}
          <div className="space-y-6">
            {/* Live Notifications */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Live Notifications</h3>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                    <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">{notification.flight}</p>
                      <p className="text-sm text-blue-800">{notification.message}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {notification.time.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Waiting for notifications...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features List */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Real-time status updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Push notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-700">Delay reasons & estimates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Gate & terminal info</span>
                </div>
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Flight tracking</span>
                </div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Demo Mode</p>
                  <p className="text-sm text-yellow-700">
                    This is a demonstration using mock data. Notifications appear every 10 seconds to showcase the feature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-blue-600 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to track your flights?</h2>
            <p className="text-blue-100 mb-6">
              Get real-time updates, delay notifications, and never miss important flight information again.
            </p>
            <a
              href="/flight-status"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              <Plane className="w-5 h-5" />
              Try Flight Status Tracker
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightStatusDemo;