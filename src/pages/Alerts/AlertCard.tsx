import React from 'react';
import { Alert } from '../../types/alert';
import { useAlerts } from '../../context/AlertContext';

interface AlertCardProps {
  alert: Alert;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const { deleteAlert, updateAlert } = useAlerts();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this alert?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAlert(alert.id);
    } catch (error) {
      console.error('Error deleting alert:', error);
      window.alert('Failed to delete alert. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = alert.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await updateAlert(alert.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating alert status:', error);
      window.alert('Failed to update alert. Please try again.');
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'WAIT_TIME_THRESHOLD':
        return 'Wait Time Alert';
      case 'STATUS_CHANGE_UP':
        return 'Reopens / Starts';
      case 'STATUS_CHANGE_DOWN':
        return 'Closes / Canceled';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  const entity = alert.entity;

  // Handle different image property names: StaticParkData uses mainImage, others use image
  const getEntityImage = () => {
    if (!entity) return null;
    
    // Type guard for park data (has mainImage)
    if ('mainImage' in entity && entity.mainImage) {
      return entity.mainImage;
    }
    
    // For attractions, shows, restaurants (have image)
    if ('image' in entity && entity.image) {
      return entity.image;
    }
    
    return null;
  };

  const entityImage = getEntityImage();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 relative">
      {/* Entity Image (if available) */}
      {entityImage && (
        <div className="mb-3 -mx-4 -mt-4">
          <img 
            src={entityImage.url} 
            alt={entity?.name || 'Entity image'}
            className="w-full h-32 object-cover rounded-t-xl"
          />
        </div>
      )}

      {/* Alert icon and status indicator */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg 
            className={`w-6 h-6 ${alert.status === 'ACTIVE' ? 'text-yellow-500' : 'text-gray-400'}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
          <span className={`text-xs px-2 py-1 rounded-full ${
            alert.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {alert.status}
          </span>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleToggleStatus}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title={alert.status === 'ACTIVE' ? 'Pause alert' : 'Activate alert'}
          >
            {alert.status === 'ACTIVE' ? (
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
            title="Delete alert"
          >
            {isDeleting ? (
              <svg className="w-5 h-5 animate-spin text-red-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Alert details */}
      <div className="space-y-2">
        {/* Entity name (if available) */}
        {entity?.name && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {entity.name}
            </h3>
          </div>
        )}

        <div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
            {getAlertTypeLabel(alert.alertType)}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {alert.entityType.charAt(0) + alert.entityType.slice(1).toLowerCase()}
          </p>
        </div>

        {/* Live data (if available) */}
        {entity && 'status' in entity && entity.status && (
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              entity.status === 'OPERATING'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {entity.status}
            </span>
            {/* Wait time for attractions */}
            {'waitTime' in entity && entity.waitTime !== null && entity.waitTime !== undefined && (
              <span className="text-gray-700 dark:text-gray-300">
                Wait: <strong>{entity.waitTime} min</strong>
              </span>
            )}
            {/* Showtimes for shows */}
            {'showtimes' in entity && entity.showtimes && entity.showtimes.length > 0 && (
              <span className="text-gray-700 dark:text-gray-300">
                Next: <strong>{new Date(entity.showtimes[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
              </span>
            )}
          </div>
        )}

        {alert.waitTimeThreshold && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              Threshold: <strong>{alert.waitTimeThreshold} minutes</strong>
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
            {alert.notificationCount > 0 && (
              <span>{alert.notificationCount} notification{alert.notificationCount !== 1 ? 's' : ''}</span>
            )}
          </div>
          {alert.lastTriggered && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last triggered: {new Date(alert.lastTriggered).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
