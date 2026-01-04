import React, { useState, useEffect } from 'react';
import { Bell, X, Settings, Volume2, VolumeX } from 'lucide-react';

const NotificationManager = ({ isOpen, onClose, trackedFlights = [] }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: false,
    sound: true,
    statusChanges: true,
    delays: true,
    gateChanges: true,
    boardingAlerts: true,
    minimumDelay: 15 // minutes
  });
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('flightNotificationSettings');
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setNotificationSettings(prev => ({ ...prev, enabled: true }));
        
        // Show test notification
        new Notification('Flight Notifications Enabled', {
          body: 'You will now receive updates about your tracked flights.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const updateSettings = (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    localStorage.setItem('flightNotificationSettings', JSON.stringify(newSettings));
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is how flight updates will appear.',
        icon: '/favicon.ico'
      });
      
      if (notificationSettings.sound) {
        // Play notification sound (you can add an audio file)
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(() => {
          // Fallback if audio file doesn't exist
          console.log('Notification sound played');
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Permission Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Permission Status</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Browser Notifications: 
                <span className={`ml-2 font-medium ${
                  permission === 'granted' ? 'text-green-600' : 
                  permission === 'denied' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {permission === 'granted' ? 'Enabled' : 
                   permission === 'denied' ? 'Blocked' : 'Not Set'}
                </span>
              </span>
              {permission !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Enable
                </button>
              )}
            </div>
          </div>

          {/* Main Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Flight Notifications</h3>
              <p className="text-sm text-gray-600">Receive updates about your tracked flights</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.enabled && permission === 'granted'}
                onChange={(e) => updateSettings('enabled', e.target.checked)}
                disabled={permission !== 'granted'}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Notification Types */}
          {notificationSettings.enabled && permission === 'granted' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notification Types</h4>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Status Changes</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.statusChanges}
                    onChange={(e) => updateSettings('statusChanges', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Flight Delays</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.delays}
                    onChange={(e) => updateSettings('delays', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Gate Changes</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.gateChanges}
                    onChange={(e) => updateSettings('gateChanges', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Boarding Alerts</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.boardingAlerts}
                    onChange={(e) => updateSettings('boardingAlerts', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Minimum Delay Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Delay for Notifications
                </label>
                <select
                  value={notificationSettings.minimumDelay}
                  onChange={(e) => updateSettings('minimumDelay', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              {/* Sound Setting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notificationSettings.sound ? (
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-600" />
                  )}
                  <span className="text-sm text-gray-700">Notification Sound</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.sound}
                    onChange={(e) => updateSettings('sound', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Tracked Flights */}
          {trackedFlights.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tracked Flights</h4>
              <div className="space-y-2">
                {trackedFlights.map((flight, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">{flight}</span>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Notification */}
          {permission === 'granted' && notificationSettings.enabled && (
            <button
              onClick={testNotification}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Test Notification
            </button>
          )}

          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
            <p className="mb-1">💡 <strong>Tip:</strong> Keep this tab open or pinned to receive notifications even when browsing other sites.</p>
            <p>Notifications will appear in your browser and system notification center.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;