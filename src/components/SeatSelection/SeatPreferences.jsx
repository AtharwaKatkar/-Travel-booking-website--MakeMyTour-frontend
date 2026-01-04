import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Eye, 
  Navigation, 
  Users, 
  Crown,
  Star,
  Waves,
  Building,
  Bed,
  Volume2,
  VolumeX,
  Wifi,
  Coffee,
  Car,
  CheckCircle
} from 'lucide-react';

const SeatPreferences = ({ 
  userId, 
  onPreferencesChange, 
  initialPreferences = null,
  type = 'flight' // 'flight' or 'hotel'
}) => {
  const [preferences, setPreferences] = useState({
    flight: {
      preferredClass: 'economy',
      preferredType: 'window',
      extraLegroom: false,
      nearFront: false,
      avoidMiddle: true,
      powerOutlet: false,
      wifi: false,
      meal: false
    },
    hotel: {
      preferredType: 'deluxe',
      preferredFloor: 'high',
      preferredView: 'ocean',
      quietRoom: true,
      balcony: true,
      corner: false,
      nearElevator: false,
      awayFromElevator: true
    }
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (initialPreferences) {
      setPreferences(prev => ({
        ...prev,
        ...initialPreferences
      }));
    } else {
      loadUserPreferences();
    }
  }, [userId, initialPreferences]);

  const loadUserPreferences = async () => {
    try {
      const saved = localStorage.getItem(`userPreferences_${userId}`);
      if (saved) {
        const parsedPreferences = JSON.parse(saved);
        setPreferences(prev => ({
          ...prev,
          ...parsedPreferences
        }));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const handlePreferenceChange = (category, key, value) => {
    const newPreferences = {
      ...preferences,
      [category]: {
        ...preferences[category],
        [key]: value
      }
    };
    
    setPreferences(newPreferences);
    onPreferencesChange && onPreferencesChange(newPreferences);
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to localStorage (in real app, save to database)
      localStorage.setItem(`userPreferences_${userId}`, JSON.stringify(preferences));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetPreferences = () => {
    const defaultPreferences = {
      flight: {
        preferredClass: 'economy',
        preferredType: 'window',
        extraLegroom: false,
        nearFront: false,
        avoidMiddle: true,
        powerOutlet: false,
        wifi: false,
        meal: false
      },
      hotel: {
        preferredType: 'deluxe',
        preferredFloor: 'high',
        preferredView: 'ocean',
        quietRoom: true,
        balcony: true,
        corner: false,
        nearElevator: false,
        awayFromElevator: true
      }
    };
    
    setPreferences(defaultPreferences);
    onPreferencesChange && onPreferencesChange(defaultPreferences);
  };

  const currentPrefs = preferences[type];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {type === 'flight' ? 'Seat Preferences' : 'Room Preferences'}
              </h2>
              <p className="text-gray-600">
                Save your preferences for faster booking
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {showAdvanced ? 'Basic' : 'Advanced'}
            </button>
            <button
              onClick={resetPreferences}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {type === 'flight' ? (
          /* Flight Preferences */
          <div className="space-y-6">
            {/* Class Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Class
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'economy', label: 'Economy', icon: Users, desc: 'Standard seating' },
                  { value: 'premium', label: 'Premium', icon: Star, desc: 'Extra comfort' },
                  { value: 'business', label: 'Business', icon: Crown, desc: 'Premium service' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePreferenceChange('flight', 'preferredClass', option.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      currentPrefs.preferredClass === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                      currentPrefs.preferredClass === option.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seat Type Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Seat Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'window', label: 'Window', icon: Eye, desc: 'Great views' },
                  { value: 'aisle', label: 'Aisle', icon: Navigation, desc: 'Easy access' },
                  { value: 'middle', label: 'Middle', icon: Users, desc: 'Usually cheaper' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePreferenceChange('flight', 'preferredType', option.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      currentPrefs.preferredType === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                      currentPrefs.preferredType === option.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPrefs.extraLegroom}
                  onChange={(e) => handlePreferenceChange('flight', 'extraLegroom', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Extra Legroom</div>
                  <div className="text-xs text-gray-500">More comfortable seating</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPrefs.nearFront}
                  onChange={(e) => handlePreferenceChange('flight', 'nearFront', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Near Front</div>
                  <div className="text-xs text-gray-500">Faster boarding/exit</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPrefs.avoidMiddle}
                  onChange={(e) => handlePreferenceChange('flight', 'avoidMiddle', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Avoid Middle Seats</div>
                  <div className="text-xs text-gray-500">Skip middle seat options</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPrefs.powerOutlet}
                  onChange={(e) => handlePreferenceChange('flight', 'powerOutlet', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Power Outlet</div>
                  <div className="text-xs text-gray-500">Charge devices</div>
                </div>
              </label>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPrefs.wifi}
                      onChange={(e) => handlePreferenceChange('flight', 'wifi', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Wifi className="w-4 h-4 ml-3 mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">WiFi Required</div>
                      <div className="text-xs text-gray-500">Internet connectivity</div>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPrefs.meal}
                      onChange={(e) => handlePreferenceChange('flight', 'meal', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Coffee className="w-4 h-4 ml-3 mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Meal Service</div>
                      <div className="text-xs text-gray-500">In-flight dining</div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Hotel Preferences */
          <div className="space-y-6">
            {/* Room Type Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Room Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'standard', label: 'Standard', icon: Bed, desc: 'Basic comfort' },
                  { value: 'deluxe', label: 'Deluxe', icon: Star, desc: 'Enhanced amenities' },
                  { value: 'suite', label: 'Suite', icon: Crown, desc: 'Spacious luxury' },
                  { value: 'presidential', label: 'Presidential', icon: Crown, desc: 'Ultimate luxury' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePreferenceChange('hotel', 'preferredType', option.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      currentPrefs.preferredType === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                      currentPrefs.preferredType === option.value ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Floor Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Lower Floors', desc: '1-2 floors' },
                  { value: 'mid', label: 'Middle Floors', desc: '3-4 floors' },
                  { value: 'high', label: 'Higher Floors', desc: '5+ floors' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePreferenceChange('hotel', 'preferredFloor', option.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      currentPrefs.preferredFloor === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* View Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred View
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'ocean', label: 'Ocean View', icon: Waves, desc: 'Waterfront views' },
                  { value: 'city', label: 'City View', icon: Building, desc: 'Urban landscape' },
                  { value: 'courtyard', label: 'Courtyard', icon: Car, desc: 'Quiet interior' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePreferenceChange('hotel', 'preferredView', option.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      currentPrefs.preferredView === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                      currentPrefs.preferredView === option.value ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPrefs.quietRoom}
                  onChange={(e) => handlePreferenceChange('hotel', 'quietRoom', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <VolumeX className="w-4 h-4 ml-3 mr-2 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Quiet Room</div>
                  <div className="text-xs text-gray-500">Away from noise</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPrefs.balcony}
                  onChange={(e) => handlePreferenceChange('hotel', 'balcony', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Balcony</div>
                  <div className="text-xs text-gray-500">Private outdoor space</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPrefs.corner}
                  onChange={(e) => handlePreferenceChange('hotel', 'corner', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Corner Room</div>
                  <div className="text-xs text-gray-500">More space and privacy</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPrefs.awayFromElevator}
                  onChange={(e) => handlePreferenceChange('hotel', 'awayFromElevator', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Away from Elevator</div>
                  <div className="text-xs text-gray-500">Quieter location</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </>
            )}
          </button>
        </div>

        {/* Preference Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Current Preferences Summary</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {type === 'flight' ? (
              <>
                <div>Class: <span className="font-medium capitalize">{currentPrefs.preferredClass}</span></div>
                <div>Seat Type: <span className="font-medium capitalize">{currentPrefs.preferredType}</span></div>
                <div>
                  Features: {[
                    currentPrefs.extraLegroom && 'Extra Legroom',
                    currentPrefs.nearFront && 'Near Front',
                    currentPrefs.avoidMiddle && 'Avoid Middle',
                    currentPrefs.powerOutlet && 'Power Outlet',
                    currentPrefs.wifi && 'WiFi',
                    currentPrefs.meal && 'Meal Service'
                  ].filter(Boolean).join(', ') || 'None selected'}
                </div>
              </>
            ) : (
              <>
                <div>Room Type: <span className="font-medium capitalize">{currentPrefs.preferredType}</span></div>
                <div>Floor: <span className="font-medium capitalize">{currentPrefs.preferredFloor}</span></div>
                <div>View: <span className="font-medium capitalize">{currentPrefs.preferredView}</span></div>
                <div>
                  Features: {[
                    currentPrefs.quietRoom && 'Quiet Room',
                    currentPrefs.balcony && 'Balcony',
                    currentPrefs.corner && 'Corner Room',
                    currentPrefs.awayFromElevator && 'Away from Elevator'
                  ].filter(Boolean).join(', ') || 'None selected'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatPreferences;