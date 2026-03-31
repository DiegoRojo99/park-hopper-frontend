import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { BookmarkButton } from '../../../components/BookmarkButton';
import VisitButton from '../../../components/VisitButton';
import AlertButton from '../../../components/AlertButton';
import { CompleteAttractionData } from '../../../types/db';
import { Image } from '../../../types/Image';

// Enhanced CompleteAttractionData type that includes image data
const AttractionDetails: React.FC = () => {
  const { attractionId } = useParams<{ attractionId: string }>();
  const [attraction, setAttraction] = useState<CompleteAttractionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const apiUrl = process.env.REACT_APP_API_URL;

  // Helper function to get the main image for background
  const getMainImage = (): string | null => {
    if (!attraction) return null;
    
    // Check for new API images first
    if (attraction.images && attraction.images.length > 0) {
      // Prioritize MAIN image
      const mainImage = attraction.images.find(img => img.type === 'MAIN');
      if (mainImage) return mainImage.url;
      
      // Fall back to first available image
      return attraction.images[0].url;
    }
    
    // Check for legacy WikimediaImage
    if (attraction.image?.url) {
      return attraction.image.url;
    }
    
    return null;
  };

  // Helper function to get gallery images (excluding the main image)
  const getGalleryImages = (): Image[] => {
    if (!attraction || !attraction.images) return [];
    
    const mainImage = attraction.images.find(img => img.type === 'MAIN');
    const mainImageUrl = mainImage?.url;
    
    // Return all images except the main one, or all if no main image
    return attraction.images.filter(img => img.url !== mainImageUrl);
  };

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
  const mainImage = getMainImage();
  const galleryImages = getGalleryImages();

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Background Image */}
      <div className="relative bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        {/* Background Image */}
        {mainImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${mainImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
          </div>
        )}
        
        {/* Content Overlay */}
        <div className={`relative z-10 w-full p-6 ${mainImage ? 'text-white' : ''}`}>
          <div className="text-center mb-6">
            <h1 className={`text-4xl font-bold mb-2 ${mainImage ? 'text-white drop-shadow-lg' : 'text-gray-900 dark:text-white'}`}>
              {attraction.name}
            </h1>
            <div className="flex justify-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                mainImage 
                  ? 'bg-black/30 text-white backdrop-blur-sm' 
                  : `${statusConfig.bg} ${statusConfig.text}`
              }`}>
                <span className="text-lg">{statusConfig.icon}</span>
                <span>{statusConfig.label}</span>
              </div>
            </div>
          </div>

          {/* Current Wait Time Section */}
          <div className="max-w-md mx-auto mb-6">
            {attraction.waitTime ? (
              <div className={`${
                mainImage 
                  ? 'bg-black/30 text-white backdrop-blur-sm' 
                  : `${waitTimeConfig?.bg || 'bg-gray-100'} ${waitTimeConfig && waitTimeConfig.bg.includes('green') ? 'text-green-800' : waitTimeConfig && waitTimeConfig.bg.includes('yellow') ? 'text-yellow-800' : waitTimeConfig && waitTimeConfig.bg.includes('orange') ? 'text-orange-800' : 'text-red-800'}`
              } rounded-2xl p-6 mb-6`}>
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 opacity-90 ${mainImage ? 'text-white' : ''}`}>CURRENT WAIT TIME</div>
                  <div className={`text-4xl font-bold mb-2 ${mainImage ? 'text-white' : ''}`}>{attraction.waitTime} min</div>
                  {waitTimeConfig && (
                    <div className={`text-lg font-medium opacity-90 ${mainImage ? 'text-white' : ''}`}>
                      {waitTimeConfig.severity} Traffic
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`${
                mainImage 
                  ? 'bg-black/30 text-white backdrop-blur-sm' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              } rounded-2xl p-6 mb-6`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${mainImage ? 'text-white' : ''}`}>No wait time available</div>
                  <div className={`text-sm opacity-75 mt-1 ${mainImage ? 'text-white' : ''}`}>Walk right on!</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <VisitButton 
              entityType="attraction"
              entityId={attraction.id}
              entityName={attraction.name}
              hideLabel={true}
              className="w-full h-14 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm"
            />
            <div className="flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-2 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm">
              <AlertButton 
                entityId={attraction.id} 
                entityType="ATTRACTION" 
                currentWaitTime={attraction.waitTime}
              />
            </div>
            <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm">
              <BookmarkButton entityId={attraction.id} entityType="ATTRACTION" size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      {galleryImages.length > 0 && (
        <div className="w-full p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PhotoIcon className="h-5 w-5" />
            Photo Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id || index}
                className="relative group bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square"
              >
                <img 
                  src={image.url} 
                  alt={image.title || image.description || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Hide broken images
                    e.currentTarget.parentElement?.classList.add('hidden');
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Image info overlay */}
                {(image.title || image.description) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.title && (
                      <div className="text-white text-sm font-medium truncate">
                        {image.title}
                      </div>
                    )}
                    {image.description && (
                      <div className="text-white/80 text-xs truncate">
                        {image.description}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Image type badge */}
                {image.type && image.type !== 'GALLERY' && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md backdrop-blur-sm">
                    {image.type.toLowerCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionDetails;