import React, { useState, useEffect, useRef } from 'react';
import { X, Bell, BellOff, RefreshCw, Clock, Plane } from 'lucide-react';
import { subscribeToFlightUpdates } from '../../api/flightStatus';

const FlightTracker = ({ flightNumber, onClose, onNotificationToggle }) => {
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateHistory, setUpdateHistory] = useState([]);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (!flightNumber) return;

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToFlightUpdates(flightNumber, (updatedFlight) => {
      setFlight(prevFlight => {
        // Check if there's a significant change
        if (prevFlight && (
          prevFlight.status !== updatedFlight.status ||
          prevFlight.delayDuration !== updatedFlight.delayDuration ||
          prevFlight.gate !== updatedFlight.gate
        )) {
          // Add to update history
          const update = {
            timestamp: new Date().toISOString(),
            type: getUpdateType(prevFlight, updatedFlight),
            message: getUpdateMessage(prevFlight, updatedFlight)
          };
          
          setUpdateHistory(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
          setLastUpdate(update);

          // Show notification if enabled
          if (notifications && 'Notification' in window) {
            new Notification(`Flight ${flightNumber} Update`, {
              body: update.message,
              icon: '/favicon.ico'
            });
          }
        }
        
        return updatedFlight;
      });
      setLoading(false);
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [flightNumber, notifications]);

  const getUpdateType = (oldFlight, newFlight) => {
    if (oldFlight.status !== newFlight.status) return 'status';
    if (oldFlight.delayDuration !== newFlight.delayDuration) return 'delay';
    if (oldFlight.gate !== newFlight.gate) return 'gate';
    return 'general';
  };

  const getUpdateMessage = (oldFlight, newFlight) => {
    if (oldFlight.status !== newFlight.status) {
      return `Status changed from ${oldFlight.status.replace('_', ' ')} to ${newFlight.status.replace('_', ' ')}`;
    }
    if (oldFlight.delayDuration !== newFlight.delayDuration) {
      if (newFlight.delayDuration > oldFlight.delayDuration) {
        return `Delay increased to ${newFlight.delayDuration} minutes`;
      } else {
        return `Delay reduced to ${newFlight.delayDuration} minutes`;
      }
    }
    if (oldFlight.gate !== newFlight.gate) {
      return `Gate changed from ${oldFlight.gate} to ${newFlight.gate}`;
    }
    return 'Flight information updated';
  };

  const toggleNotifications = async () => {
    if (!notifications) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotifications(true);
          onNotificationToggle && onNotificationToggle(true);
        }
      }
    } else {
      setNotifications(false);
      onNotificationToggle && onNotificationToggle(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ON_TIME': return 'text-green-600';
      case 'DELAYED': return 'text-orange-600';
      case 'IN_FLIGHT': return 'text-blue-600';
      case 'LANDED': return 'text-gray-600';
      case 'CANCELLED': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading flight tracker...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Flight Tracker</h2>
            <p className="text-gray-600">{flight?.flightNumber} - {flight?.airline}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleNotifications}
              className={`p-2 rounded-md transition-colors ${
                notifications 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={notifications ? 'Disable notifications' : 'Enable notifications'}
            >
              {notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {flight && (
          <div className="p-6">
            {/* Current Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>
                <span className={`text-sm font-medium ${getStatusColor(flight.status)}`}>
                  {flight.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-semibold">{formatTime(flight.actualDeparture || flight.scheduledDeparture)}</p>
                  <p className="text-xs text-gray-500">{flight.from}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-semibold">{formatTime(flight.estimatedArrival)}</p>
                  <p className="text-xs text-gray-500">{flight.to}</p>
                </div>
              </div>

              {flight.delayDuration > 0 && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <p className="text-sm font-medium text-orange-800">
                    Delayed by {flight.delayDuration} minutes
                  </p>
                  {flight.delayReason && (
                    <p className="text-sm text-orange-700 mt-1">{flight.delayReason}</p>
                  )}
                </div>
              )}

              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Gate: {flight.gate}</span>
                <span>Terminal: {flight.terminal}</span>
                <span>Aircraft: {flight.aircraft}</span>
              </div>
            </div>

            {/* Live Updates */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Live Updates</h3>
                <span className="text-sm text-gray-500">
                  (Updates every 30 seconds)
                </span>
              </div>

              {updateHistory.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {updateHistory.map((update, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-900">{update.message}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Plane className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No updates yet. We'll notify you of any changes.</p>
                </div>
              )}
            </div>

            {/* Last Updated */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Last updated: {new Date(flight.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightTracker;