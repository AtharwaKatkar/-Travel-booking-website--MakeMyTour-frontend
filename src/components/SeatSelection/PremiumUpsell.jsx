import React, { useState } from 'react';
import { 
  Crown, 
  Star, 
  Zap, 
  Wifi, 
  Coffee, 
  Users, 
  Eye, 
  Navigation,
  Bed,
  Bath,
  Wind,
  Waves,
  Building,
  Check,
  X,
  ArrowRight,
  Gift,
  Clock,
  Shield
} from 'lucide-react';

const PremiumUpsell = ({ 
  currentSelection, 
  type = 'flight', 
  onUpgrade, 
  onDecline,
  availableUpgrades = []
}) => {
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  // Mock upgrade options
  const getUpgradeOptions = () => {
    if (type === 'flight') {
      return [
        {
          id: 'premium-economy',
          name: 'Premium Economy',
          currentPrice: currentSelection?.price || 0,
          upgradePrice: 8000,
          totalPrice: (currentSelection?.price || 0) + 8000,
          savings: 2000,
          originalPrice: 10000,
          class: 'premium',
          features: [
            { icon: Users, text: 'Extra legroom (6+ inches)', highlight: true },
            { icon: Coffee, text: 'Premium meal service', highlight: true },
            { icon: Zap, text: 'Power outlets at every seat', highlight: false },
            { icon: Wifi, text: 'Complimentary WiFi', highlight: false },
            { icon: Gift, text: 'Priority boarding', highlight: true },
            { icon: Shield, text: 'Free seat selection', highlight: false }
          ],
          benefits: [
            'Skip the line with priority check-in',
            'Extra baggage allowance (30kg)',
            'Premium lounge access',
            'Dedicated cabin crew service'
          ],
          badge: 'Most Popular',
          badgeColor: 'bg-blue-600'
        },
        {
          id: 'business-class',
          name: 'Business Class',
          currentPrice: currentSelection?.price || 0,
          upgradePrice: 15000,
          totalPrice: (currentSelection?.price || 0) + 15000,
          savings: 5000,
          originalPrice: 20000,
          class: 'business',
          features: [
            { icon: Crown, text: 'Lie-flat seats', highlight: true },
            { icon: Coffee, text: 'Gourmet dining experience', highlight: true },
            { icon: Gift, text: 'Priority everything', highlight: true },
            { icon: Wifi, text: 'High-speed WiFi included', highlight: false },
            { icon: Shield, text: 'Flexible booking changes', highlight: true },
            { icon: Clock, text: 'Fast-track security', highlight: false }
          ],
          benefits: [
            'Access to premium business lounges',
            'Chauffeur service (select cities)',
            'Extra baggage allowance (40kg)',
            'Dedicated check-in counters',
            'Premium amenity kit',
            'Noise-canceling headphones'
          ],
          badge: 'Luxury',
          badgeColor: 'bg-purple-600'
        }
      ];
    } else {
      return [
        {
          id: 'deluxe-room',
          name: 'Deluxe Room',
          currentPrice: currentSelection?.price || 0,
          upgradePrice: 5000,
          totalPrice: (currentSelection?.price || 0) + 5000,
          savings: 1500,
          originalPrice: 6500,
          type: 'deluxe',
          features: [
            { icon: Bed, text: 'King-size bed', highlight: true },
            { icon: Eye, text: 'City/Ocean view', highlight: true },
            { icon: Wind, text: 'Private balcony', highlight: false },
            { icon: Wifi, text: 'High-speed WiFi', highlight: false },
            { icon: Coffee, text: 'In-room coffee machine', highlight: false },
            { icon: Bath, text: 'Premium bathroom amenities', highlight: false }
          ],
          benefits: [
            'Room service available 24/7',
            'Daily housekeeping',
            'Welcome fruit basket',
            'Late checkout (2 PM)'
          ],
          badge: 'Great Value',
          badgeColor: 'bg-green-600'
        },
        {
          id: 'executive-suite',
          name: 'Executive Suite',
          currentPrice: currentSelection?.price || 0,
          upgradePrice: 15000,
          totalPrice: (currentSelection?.price || 0) + 15000,
          savings: 5000,
          originalPrice: 20000,
          type: 'suite',
          features: [
            { icon: Crown, text: 'Separate living area', highlight: true },
            { icon: Waves, text: 'Premium ocean view', highlight: true },
            { icon: Wind, text: 'Large private balcony', highlight: true },
            { icon: Coffee, text: 'Butler service', highlight: true },
            { icon: Gift, text: 'Executive lounge access', highlight: false },
            { icon: Shield, text: 'Concierge service', highlight: false }
          ],
          benefits: [
            'Complimentary breakfast for 2',
            'Airport transfer included',
            'Spa treatment discount (20%)',
            'Priority restaurant reservations',
            'Welcome champagne',
            'Express laundry service'
          ],
          badge: 'Luxury',
          badgeColor: 'bg-purple-600'
        }
      ];
    }
  };

  const upgradeOptions = getUpgradeOptions();

  const handleUpgradeSelect = (upgrade) => {
    setSelectedUpgrade(upgrade);
  };

  const handleConfirmUpgrade = () => {
    if (selectedUpgrade) {
      onUpgrade(selectedUpgrade);
    }
  };

  const ComparisonTable = () => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 p-3 text-left">Feature</th>
            <th className="border border-gray-200 p-3 text-center">Current</th>
            {upgradeOptions.map(option => (
              <th key={option.id} className="border border-gray-200 p-3 text-center">
                {option.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {type === 'flight' ? (
            <>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">Seat Space</td>
                <td className="border border-gray-200 p-3 text-center">Standard</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">Extra Legroom</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">Lie-flat</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">Meal Service</td>
                <td className="border border-gray-200 p-3 text-center">Basic</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">Premium</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">Gourmet</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">Priority Boarding</td>
                <td className="border border-gray-200 p-3 text-center text-red-600">✗</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">✓</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">Lounge Access</td>
                <td className="border border-gray-200 p-3 text-center text-red-600">✗</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">✓</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">✓</td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">Room Size</td>
                <td className="border border-gray-200 p-3 text-center">25 sqm</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">35 sqm</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">60 sqm</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">View</td>
                <td className="border border-gray-200 p-3 text-center">Courtyard</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">City/Ocean</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">Premium Ocean</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">Balcony</td>
                <td className="border border-gray-200 p-3 text-center text-red-600">✗</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">✓</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">Large ✓</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">Butler Service</td>
                <td className="border border-gray-200 p-3 text-center text-red-600">✗</td>
                <td className="border border-gray-200 p-3 text-center text-red-600">✗</td>
                <td className="border border-gray-200 p-3 text-center text-green-600">✓</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Upgrade Your Experience</h2>
            <p className="text-purple-100 mt-1">
              Enhance your {type === 'flight' ? 'flight' : 'stay'} with premium options
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-100">Limited Time Offer</div>
            <div className="text-lg font-bold">Save up to ₹5,000</div>
          </div>
        </div>
      </div>

      {/* Current Selection */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Current Selection</h3>
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <div>
            <div className="font-medium text-gray-900">
              {type === 'flight' 
                ? `Seat ${currentSelection?.id} - ${currentSelection?.class?.charAt(0).toUpperCase() + currentSelection?.class?.slice(1)} Class`
                : `Room ${currentSelection?.id} - ${currentSelection?.name}`
              }
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {type === 'flight' 
                ? `${currentSelection?.type} seat`
                : `${currentSelection?.size} • Floor ${currentSelection?.floor}`
              }
            </div>
          </div>
          <div className="text-right">
            {currentSelection?.price > 0 ? (
              <div className="text-lg font-bold text-gray-900">
                ₹{currentSelection.price.toLocaleString()}
              </div>
            ) : (
              <div className="text-lg font-bold text-gray-600">Included</div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Available Upgrades</h3>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {upgradeOptions.map((option) => (
            <div
              key={option.id}
              className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedUpgrade?.id === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleUpgradeSelect(option)}
            >
              {/* Badge */}
              {option.badge && (
                <div className={`absolute -top-3 left-4 px-3 py-1 ${option.badgeColor} text-white text-xs font-medium rounded-full`}>
                  {option.badge}
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{option.name}</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{option.upgradePrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">upgrade</span>
                  </div>
                </div>
                {selectedUpgrade?.id === option.id && (
                  <Check className="w-6 h-6 text-blue-600" />
                )}
              </div>

              {/* Savings */}
              {option.savings > 0 && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  Save ₹{option.savings.toLocaleString()}
                </div>
              )}

              {/* Features */}
              <div className="space-y-2 mb-4">
                {option.features.slice(0, 4).map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center">
                      <IconComponent className={`w-4 h-4 mr-3 ${
                        feature.highlight ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm ${
                        feature.highlight ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Benefits Preview */}
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-1">Includes:</div>
                <div>{option.benefits.slice(0, 2).join(' • ')}</div>
                {option.benefits.length > 2 && (
                  <div className="text-blue-600 mt-1">+{option.benefits.length - 2} more benefits</div>
                )}
              </div>

              {/* Total Price */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Price:</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{option.totalPrice.toLocaleString()}
                    </div>
                    {option.originalPrice > option.totalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        ₹{option.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {showComparison && <ComparisonTable />}

        {/* Selected Upgrade Details */}
        {selectedUpgrade && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              {selectedUpgrade.name} - Complete Benefits
            </h4>
            
            {/* All Features */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="font-medium text-blue-900 mb-2">Features:</h5>
                <div className="space-y-1">
                  {selectedUpgrade.features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-center text-sm text-blue-800">
                        <IconComponent className="w-4 h-4 mr-2" />
                        {feature.text}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-blue-900 mb-2">Additional Benefits:</h5>
                <div className="space-y-1">
                  {selectedUpgrade.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-sm text-blue-800">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upgrade Summary */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Upgrade to {selectedUpgrade.name}</div>
                  <div className="text-sm text-gray-600">
                    Additional cost: ₹{selectedUpgrade.upgradePrice.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ₹{selectedUpgrade.totalPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">total price</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onDecline}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Keep Current Selection
          </button>
          
          <div className="flex items-center space-x-3">
            {selectedUpgrade && (
              <div className="text-right mr-4">
                <div className="text-sm text-gray-600">You'll pay:</div>
                <div className="text-xl font-bold text-green-600">
                  ₹{selectedUpgrade.totalPrice.toLocaleString()}
                </div>
              </div>
            )}
            
            <button
              onClick={handleConfirmUpgrade}
              disabled={!selectedUpgrade}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {selectedUpgrade ? (
                <>
                  Upgrade to {selectedUpgrade.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'Select an upgrade option'
              )}
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center">
              <Gift className="w-4 h-4 mr-2 text-purple-600" />
              <span>Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpsell;