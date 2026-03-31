import React, { useState } from 'react';
import { useVisits } from '../context/VisitContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { 
  StarIcon as StarIconOutline,
  PlusIcon 
} from '@heroicons/react/24/outline';

interface VisitButtonProps {
  entityType: 'park' | 'attraction' | 'show' | 'restaurant';
  entityId: string;
  entityName: string;
  parkVisitId?: string;
  className?: string;
  hideLabel?: boolean;
}

const VisitButton: React.FC<VisitButtonProps> = ({ 
  entityType, 
  entityId, 
  entityName, 
  parkVisitId,
  className = "",
  hideLabel = false
}) => {
  const { 
    createVisit, 
    createAttractionVisit, 
    createShowVisit, 
    createRestaurantVisit 
  } = useVisits();
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    entryTime: new Date().toISOString().slice(0, 16),
    exitTime: '',
    visitedAt: new Date().toISOString().slice(0, 16),
    rating: 0,
    notes: '',
    waitTime: ''
  });

  if (!user) return null;

  const isRatingValid = (rating: number): boolean => {
    return rating >= 0.25 && rating <= 5 && (rating * 4) % 1 === 0;
  };

  const validateDates = (): string[] => {
    const errors: string[] = [];
    const currentYear = new Date().getFullYear();
    
    if (entityType === 'park') {
      // Validate visit date
      const visitDate = new Date(formData.visitDate);
      if (visitDate.getFullYear() < 1970 || visitDate.getFullYear() > currentYear + 1) {
        errors.push('Visit date must be between 1970 and next year');
      }
      
      // Validate entry and exit times
      const entryTime = new Date(formData.entryTime);
      const exitTime = formData.exitTime ? new Date(formData.exitTime) : null;
      
      // Check if entry time is on the same day as visit date
      const entryDate = entryTime.toISOString().split('T')[0];
      if (entryDate !== formData.visitDate) {
        errors.push('Entry time must be on the same day as visit date');
      }
      
      // Check if exit time is after entry time and on the same day
      if (exitTime) {
        const exitDate = exitTime.toISOString().split('T')[0];
        if (exitDate !== formData.visitDate) {
          errors.push('Exit time must be on the same day as visit date');
        }
        if (exitTime <= entryTime) {
          errors.push('Exit time must be after entry time');
        }
      }
    } else {
      // Validate visitedAt for other entities
      const visitedAt = new Date(formData.visitedAt);
      if (visitedAt.getFullYear() < 1970 || visitedAt.getFullYear() > currentYear + 1) {
        errors.push('Visit date must be between 1970 and next year');
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    // Validate dates first
    const errors = validateDates();
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      return;
    }
    
    setLoading(true);
    try {
      if (entityType === 'park') {
        await createVisit({
          parkId: entityId,
          visitDate: formData.visitDate,
          entryTime: formData.entryTime,
          exitTime: formData.exitTime || undefined,
          notes: formData.notes || undefined
        });
      } 
      else if (entityType === 'attraction') {
        const rating = isRatingValid(formData.rating) ? formData.rating : undefined;
        const waitTime = formData.waitTime ? parseInt(formData.waitTime) : undefined;
        
        await createAttractionVisit({
          attractionId: entityId,
          visitId: parkVisitId,
          visitedAt: formData.visitedAt,
          rating,
          notes: formData.notes || undefined,
          waitTime
        });
      } else if (entityType === 'show') {
        const rating = formData.rating > 0 && formData.rating <= 5 ? formData.rating : undefined;
        
        await createShowVisit({
          showId: entityId,
          visitId: parkVisitId,
          visitedAt: formData.visitedAt,
          rating,
          notes: formData.notes || undefined
        });
      } else if (entityType === 'restaurant') {
        const rating = formData.rating > 0 && formData.rating <= 5 ? formData.rating : undefined;
        
        await createRestaurantVisit({
          restaurantId: entityId,
          visitId: parkVisitId,
          rating,
          notes: formData.notes || undefined
        });
      }
      
      setIsModalOpen(false);
      setValidationErrors([]);
      setFormData({
        visitDate: new Date().toISOString().split('T')[0],
        entryTime: new Date().toISOString().slice(0, 16),
        exitTime: '',
        visitedAt: new Date().toISOString().slice(0, 16),
        rating: 0,
        notes: '',
        waitTime: ''
      });
    } catch (error) {
      console.error('Error creating visit:', error);
      alert('Failed to create visit. Please try again.');
    } finally {
      setLoading(false);
    }
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
              onClick={() => handleFormChange('rating', quarterValue)}
            />
            {/* Half star */}
            <button
              type="button"
              className="relative w-1.5 h-6 z-10"
              onClick={() => handleFormChange('rating', halfValue)}
            />
            {/* Three quarter star */}
            <button
              type="button"
              className="relative w-1.5 h-6 z-10"
              onClick={() => handleFormChange('rating', threeQuarterValue)}
            />
            {/* Full star */}
            <button
              type="button"
              className="relative w-1.5 h-6 z-10"
              onClick={() => handleFormChange('rating', fullValue)}
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
        <span className="ml-2 text-sm text-gray-600">{formData.rating}/5</span>
      </div>
    );
  };

  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
          setValidationErrors([]);
        }}
        className={`flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${className}`}
        title={`Track visit to ${entityName}`}
      >
        <PlusIcon className="h-4 w-4" />
        {!hideLabel && <span>Visit</span>}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Track Visit: {entityName}
            </h2>
            
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {entityType === 'park' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Visit Date
                    </label>
                    <input
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => handleFormChange('visitDate', e.target.value)}
                      min="1970-01-01"
                      max={new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Entry Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.entryTime}
                      onChange={(e) => handleFormChange('entryTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exit Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.exitTime}
                      onChange={(e) => handleFormChange('exitTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </>
              )}

              {entityType !== 'park' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Visited At
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.visitedAt}
                      onChange={(e) => handleFormChange('visitedAt', e.target.value)}
                      min="1970-01-01T00:00"
                      max={new Date(new Date().getFullYear() + 1, 11, 31, 23, 59).toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating (Optional)
                    </label>
                    {renderStarRating()}
                  </div>
                  
                  {entityType === 'attraction' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Wait Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.waitTime}
                        onChange={(e) => handleFormChange('waitTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min="0"
                        placeholder="e.g., 30"
                      />
                    </div>
                  )}
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="Any notes about your visit..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Visit'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setValidationErrors([]);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default VisitButton;