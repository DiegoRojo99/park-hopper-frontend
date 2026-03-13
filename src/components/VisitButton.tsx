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
}

const VisitButton: React.FC<VisitButtonProps> = ({ 
  entityType, 
  entityId, 
  entityName, 
  parkVisitId,
  className = ""
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
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
        <span className="ml-2 text-sm text-gray-600">{formData.rating}/5</span>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${className}`}
        title={`Track visit to ${entityName}`}
      >
        <PlusIcon className="h-4 w-4" />
        <span>Visit</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Track Visit: {entityName}
            </h2>
            
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
                      onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, entryTime: e.target.value }))}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, exitTime: e.target.value }))}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, visitedAt: e.target.value }))}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, waitTime: e.target.value }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
                  onClick={() => setIsModalOpen(false)}
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