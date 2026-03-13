import React from 'react';

export interface Activity {
  id: string;
  type: 'park' | 'attraction' | 'show' | 'restaurant';
  name: string;
  timestamp: string;
  rating?: number;
  notes?: string;
  waitTime?: number;
  isEntry?: boolean;
  isExit?: boolean;
}

interface DiaryEntryProps {
  activity: Activity;
  onEdit?: () => void;
}

const DiaryEntry: React.FC<DiaryEntryProps> = ({ activity, onEdit }) => {
  // Helper function to get entity type configuration
  const getEntityTypeConfig = (type: 'park' | 'attraction' | 'show' | 'restaurant') => {
    switch (type) {
      case 'park':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-l-blue-500',
          icon: '🏰',
          color: 'text-blue-700 dark:text-blue-300',
          label: 'Park Visit'
        };
      case 'attraction':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-l-green-500',
          icon: '🎢',
          color: 'text-green-700 dark:text-green-300',
          label: 'Attraction'
        };
      case 'show':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-l-purple-500',
          icon: '🎭',
          color: 'text-purple-700 dark:text-purple-300',
          label: 'Show'
        };
      case 'restaurant':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-l-orange-500',
          icon: '🍽️',
          color: 'text-orange-700 dark:text-orange-300',
          label: 'Restaurant'
        };
    }
  };

  // Helper function to get rating background color
  const getRatingConfig = (rating: number) => {
    if (rating >= 4.5) return { bg: 'bg-blue-500', color: 'text-white' }; // Blue for excellent
    if (rating >= 3.5) return { bg: 'bg-green-500', color: 'text-white' }; // Green for good
    if (rating >= 2.5) return { bg: 'bg-yellow-500', color: 'text-white' }; // Yellow for okay
    return { bg: 'bg-red-500', color: 'text-white' }; // Red for poor
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const config = getEntityTypeConfig(activity.type);
  const isParkActivity = activity.type === 'park';
  const ratingConfig = activity.rating ? getRatingConfig(activity.rating) : null;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow p-3 cursor-pointer mb-2"
      onClick={onEdit}
    >
      <div className="flex gap-3 h-full">
        {/* Time & Icon Column */}
        <div className="flex flex-col items-center min-w-[60px]">
          <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">
            {formatTime(activity.timestamp)}
          </div>
          <div className={`p-1.5 rounded-lg ${config.bg}`}>
            <span className="text-xl">{config.icon}</span>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Title and Badge */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {activity.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
              {activity.isEntry ? 'PARK ENTRY' : 
               activity.isExit ? 'PARK EXIT' : 
               config.label}
            </span>
          </div>

          {/* Activity Details */}
          {activity.waitTime !== undefined && activity.waitTime !== null && (
            <div className="mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Wait Time:</span>
              <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                activity.waitTime <= 15 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                activity.waitTime <= 30 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                activity.waitTime <= 60 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {activity.waitTime} min
              </span>
            </div>
          )}

          {activity.notes && (
            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm leading-relaxed">
                {activity.notes}
              </p>
            </div>
          )}
        </div>

        {/* Rating Column */}
        {!isParkActivity && activity.rating && ratingConfig && (
          <div className="flex items-center justify-center min-w-[40px] px-2">
            <div className={`w-10 h-10 rounded-lg ${ratingConfig.bg} ${ratingConfig.color} flex items-center justify-center font-bold text-sm shadow-lg`}>
              {activity.rating}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryEntry;