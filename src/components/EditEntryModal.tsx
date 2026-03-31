import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { Activity } from './DiaryEntry';

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (updatedActivity: Activity) => void;
}

const EditEntryModal: React.FC<EditEntryModalProps> = ({ 
  isOpen, 
  onClose, 
  activity, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    rating: activity?.rating || 0,
    notes: activity?.notes || '',
    waitTime: activity?.waitTime || 0,
    timestampInput: activity ? new Date(activity.timestamp).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  });

  // Reset form when activity changes
  React.useEffect(() => {
    if (activity) {
      setFormData({
        rating: activity.rating || 0,
        notes: activity.notes || '',
        waitTime: activity.waitTime || 0,
        timestampInput: new Date(activity.timestamp).toISOString().slice(0, 16)
      });
    }
  }, [activity]);

  const handleSave = () => {
    if (!activity) return;
    
    // Convert the datetime input to ISO string only when saving
    const timestamp = formData.timestampInput ? new Date(formData.timestampInput).toISOString() : activity.timestamp;
    
    const updatedActivity: Activity = {
      ...activity,
      timestamp: timestamp,
      rating: formData.rating > 0 ? formData.rating : undefined,
      notes: formData.notes || undefined,
      waitTime: formData.waitTime > 0 ? formData.waitTime : undefined
    };
    
    onSave(updatedActivity);
    onClose();
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      // Create clickable regions for quarter increments
      const quarterValue = i - 0.75;
      const halfValue = i - 0.5;
      const threeQuarterValue = i - 0.25;
      const fullValue = i;
      
      stars.push(
        <div key={i} className="relative inline-block">
          <div className="flex">
            {/* Quarter star */}
            <button
              type="button"
              className="relative w-1.5 h-6 z-10"
              onClick={() => setFormData(prev => ({ ...prev, rating: quarterValue }))}
            />
            {/* Half star */}
            <button
              type="button"
              className="relative w-1.5 h-6 z-10"
              onClick={() => setFormData(prev => ({ ...prev, rating: halfValue }))}
            />
            {/* Three quarter star */}
            <button
              type="button"
              className="relative w-1.5 h-6 z-10"
              onClick={() => setFormData(prev => ({ ...prev, rating: threeQuarterValue }))}
            />
            {/* Full star */}
            <button
              type="button"
              className="relative w-1.5 h-6 z-10"
              onClick={() => setFormData(prev => ({ ...prev, rating: fullValue }))}
            />
          </div>
          
          {/* Star background */}
          <div className="absolute inset-0 pointer-events-none">
            {formData.rating >= i ? (
              <StarIconSolid className="h-6 w-6 text-yellow-400" />
            ) : formData.rating >= i - 0.25 ? (
              <div className="relative">
                <StarIconOutline className="h-6 w-6 text-gray-300" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '75%' }}>
                  <StarIconSolid className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            ) : formData.rating >= i - 0.5 ? (
              <div className="relative">
                <StarIconOutline className="h-6 w-6 text-gray-300" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <StarIconSolid className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            ) : formData.rating >= i - 0.75 ? (
              <div className="relative">
                <StarIconOutline className="h-6 w-6 text-gray-300" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '25%' }}>
                  <StarIconSolid className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            ) : (
              <StarIconOutline className="h-6 w-6 text-gray-300" />
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{formData.rating}/5</span>
      </div>
    );
  };

  if (!isOpen || !activity) return null;

  const isParkActivity = activity.type === 'park';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Entry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Activity Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {activity.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activity.isEntry ? 'Park Entry' : activity.isExit ? 'Park Exit' : 'Activity'}
            </p>
          </div>

          {/* Time (for park activities) */}
          {isParkActivity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {activity.isEntry ? 'Entry Time' : activity.isExit ? 'Exit Time' : 'Time'}
              </label>
              <input
                type="datetime-local"
                value={formData.timestampInput}
                onChange={(e) => setFormData(prev => ({ ...prev, timestampInput: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          {/* Rating (only for non-park activities) */}
          {!isParkActivity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating (1-5)
              </label>
              {renderStarRating()}
            </div>
          )}

          {/* Wait Time (only for attractions) */}
          {activity.type === 'attraction' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wait Time (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                value={formData.waitTime}
                onChange={(e) => setFormData(prev => ({ ...prev, waitTime: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter wait time"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Add your notes about this experience..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEntryModal;