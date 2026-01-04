import React from 'react';
import { Clock, Plane, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const FlightStatusCard = ({ flight, onTrack }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ON_TIME':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'DELAYED':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'IN_FLIGHT':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'LANDED':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ON_TIME':
        return <CheckCircle className="w-5 h-5" />;
      case 'DELAYED':
        return <AlertTriangle className="w-5 h-5" />;
      case 'IN_FLIGHT':
        return <Plane className="w-5 h-5" />;
      case 'LANDED':
        return <CheckCircle className="w-5 h-5" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ON_TIME':
        return 'On Time';
      case 'DELAYED':
        return `Delayed ${flight.delayDuration}min`;
      case 'IN_FLIGHT':
        return 'In Flight';
      case 'LANDED':
        return 'Landed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{flight.flightNumber}</h3>
          <p className="text-sm text-gray-600">{flight.airline}</p>
        </div>
        <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(flight.status)}`}>
          {getStatusIcon(flight.status)}
          <span className="text-sm font-medium">{getStatusText(flight.status)}</span>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{flight.from.split('(')[1]?.replace(')', '') || flight.from}</p>
          <p className="text-sm text-gray-600">{flight.from.split('(')[0]?.trim()}</p>
        </div>
        <div className="flex-1 mx-4 relative">
          <div className="border-t-2 border-dashed border-gray-300"></div>
          <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-400 w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{flight.to.split('(')[1]?.replace(')', '') || flight.to}</p>
          <p className="text-sm text-gray-600">{flight.to.split('(')[0]?.trim()}</p>
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Departure</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatTime(flight.actualDeparture || flight.scheduledDeparture)}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(flight.scheduledDeparture)}
          </p>
          {flight.status === 'DELAYED' && !flight.actualDeparture && (
            <p className="text-xs text-orange-600">
              Originally: {formatTime(flight.scheduledDeparture)}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600">Arrival</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatTime(flight.estimatedArrival)}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(flight.estimatedArrival)}
          </p>
          {flight.status === 'DELAYED' && (
            <p className="text-xs text-orange-600">
              Originally: {formatTime(flight.scheduledArrival)}
            </p>
          )}
        </div>
      </div>

      {/* Gate and Terminal */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <div>
          <span className="text-gray-600">Gate: </span>
          <span className="font-medium text-gray-900">{flight.gate}</span>
        </div>
        <div>
          <span className="text-gray-600">Terminal: </span>
          <span className="font-medium text-gray-900">{flight.terminal}</span>
        </div>
        <div>
          <span className="text-gray-600">Aircraft: </span>
          <span className="font-medium text-gray-900">{flight.aircraft}</span>
        </div>
      </div>

      {/* Delay Reason */}
      {flight.delayReason && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-orange-800">Delay Reason</p>
              <p className="text-sm text-orange-700">{flight.delayReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {new Date(flight.lastUpdated).toLocaleTimeString()}
        </p>
        <button
          onClick={() => onTrack && onTrack(flight.flightNumber)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Track Flight
        </button>
      </div>
    </div>
  );
};

export default FlightStatusCard;