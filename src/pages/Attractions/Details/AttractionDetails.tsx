import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { BookmarkButton } from '../../../components/BookmarkButton';
import VisitButton from '../../../components/VisitButton';
import AlertButton from '../../../components/AlertButton';
import { CompleteAttractionData } from '../../../types/db';

const AttractionDetails: React.FC = () => {
  const { attractionId } = useParams<{ attractionId: string }>();
  const [attraction, setAttraction] = useState<CompleteAttractionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const apiUrl = process.env.REACT_APP_API_URL;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'OPERATING':
        return { 
          bg: 'bg-green-100 dark:bg-green-900', 
          text: 'text-green-800 dark:text-green-200',
          icon: '●',
          label: 'Operating'
        };
      case 'DOWN':
        return { 
          bg: 'bg-yellow-100 dark:bg-yellow-900', 
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: '⚠',
          label: 'Temporarily Down'
        };
      case 'CLOSED':
        return { 
          bg: 'bg-red-100 dark:bg-red-900', 
          text: 'text-red-800 dark:text-red-200',
          icon: '✕',
          label: 'Closed'
        };
      default:
        return { 
          bg: 'bg-gray-100 dark:bg-gray-700', 
          text: 'text-gray-600 dark:text-gray-400',
          icon: '?',
          label: 'Unknown Status'
        };
    }
  };

  const getWaitTimeConfig = (time: number | null) => {
    if (!time) return null;
    if (time <= 15) return { bg: 'bg-green-100 text-green-800', severity: 'Low' };
    if (time <= 30) return { bg: 'bg-yellow-100 text-yellow-800', severity: 'Moderate' };
    if (time <= 60) return { bg: 'bg-orange-100 text-orange-800', severity: 'High' };
    return { bg: 'bg-red-100 text-red-800', severity: 'Very High' };
  };

  // Fetch attraction data
  useEffect(() => {
    const fetchAttraction = async () => {
      if (!apiUrl || !attractionId) {
        setError('Missing configuration or attraction ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/attractions/${attractionId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch attraction: ${response.status}`);
        }
        
        const attractionData: CompleteAttractionData = await response.json();
        setAttraction(attractionData);
        setError('');
      } catch (err) {
        console.error('Error fetching attraction:', err);
        setError(err instanceof Error ? err.message : 'Failed to load attraction');
      } finally {
        setLoading(false);
      }
    };

    fetchAttraction();
  }, [apiUrl, attractionId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {error || 'Attraction not found'}
          </h2>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(attraction.status || 'unknown');
  const waitTimeConfig = getWaitTimeConfig(attraction.waitTime || null);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="w-full p-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {attraction.name}
            </h1>
            <div className="flex justify-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                <span className="text-lg">{statusConfig.icon}</span>
                <span>{statusConfig.label}</span>
              </div>
            </div>
          </div>

          {/* Current Wait Time Section */}
          <div className="max-w-md mx-auto mb-6">
            {attraction.waitTime ? (
              <div className={`${waitTimeConfig?.bg || 'bg-gray-100'} ${waitTimeConfig && waitTimeConfig.bg.includes('green') ? 'text-green-800' : waitTimeConfig && waitTimeConfig.bg.includes('yellow') ? 'text-yellow-800' : waitTimeConfig && waitTimeConfig.bg.includes('orange') ? 'text-orange-800' : 'text-red-800'} rounded-2xl p-6 mb-6`}>
                <div className="text-center">
                  <div className="text-sm font-medium mb-1 opacity-90">CURRENT WAIT TIME</div>
                  <div className="text-4xl font-bold mb-2">{attraction.waitTime} min</div>
                  {waitTimeConfig && (
                    <div className="text-lg font-medium opacity-90">
                      {waitTimeConfig.severity} Traffic
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">No wait time available</div>
                  <div className="text-sm opacity-75 mt-1">Walk right on!</div>
                </div>
              </div>
            )}
          </div>

          {/* Attraction Information */}
          {attraction.type && (
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>Type: {attraction.type}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <VisitButton 
              entityType="attraction"
              entityId={attraction.id}
              entityName={attraction.name}
              hideLabel={true}
              className="w-full h-14 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
            />
            <div className="flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-2 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md">
              <AlertButton 
                entityId={attraction.id} 
                entityType="ATTRACTION" 
                currentWaitTime={attraction.waitTime}
              />
            </div>
            <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md">
              <BookmarkButton entityId={attraction.id} entityType="ATTRACTION" size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="w-full p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Attraction Information
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Status
                </h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                  <span>{statusConfig.icon}</span>
                  <span>{statusConfig.label}</span>
                </div>
              </div>
              
              {attraction.waitTime && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Current Wait
                  </h3>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {attraction.waitTime} minutes
                    {waitTimeConfig && (
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                        ({waitTimeConfig.severity})
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {attraction.type && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Attraction Type
                  </h3>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {attraction.type}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionDetails;