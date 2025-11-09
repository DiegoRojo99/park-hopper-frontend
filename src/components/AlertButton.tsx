import React, { useState } from 'react';
import { useAlerts } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { useFCM } from '../hooks/useFCM';
import { AlertEntityType, AlertType } from '../types/alert';

interface AlertButtonProps {
  entityId: string;
  entityType: AlertEntityType;
}

const AlertButton: React.FC<AlertButtonProps> = ({ entityId, entityType }) => {
  const { user } = useAuth();
  const { hasAlert, getAlertForEntity, createAlert, deleteAlert } = useAlerts();
  const { fcmToken, hasPermission, requestNotificationPermission } = useFCM();
  const [showModal, setShowModal] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('WAIT_TIME_THRESHOLD');
  const [waitTimeThreshold, setWaitTimeThreshold] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  // Don't show button if user is not logged in
  if (!user) return null;

  const isAlertActive = hasAlert(entityId);
  const existingAlert = getAlertForEntity(entityId);

  const handleToggleAlert = async () => {
    if (isAlertActive && existingAlert) {
      // Delete existing alert
      try {
        setLoading(true);
        await deleteAlert(existingAlert.id);
      } catch (error) {
        console.error('Error deleting alert:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Show modal to create new alert
      setShowModal(true);
    }
  };

  const handleCreateAlert = async () => {
    if (!fcmToken) {
      // Request notification permission first
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('Please enable notifications to set up alerts');
        return;
      }
      return;
    }

    try {
      setLoading(true);
      await createAlert(
        entityId,
        entityType,
        alertType,
        fcmToken,
        alertType === 'WAIT_TIME_THRESHOLD' ? waitTimeThreshold : undefined
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggleAlert}
        disabled={loading}
        className="focus:outline-none transition-colors"
        title={isAlertActive ? 'Remove alert' : 'Set up alert'}
      >
        {loading ? (
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg
            className={`w-6 h-6 ${isAlertActive ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            fill={isAlertActive ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        )}
      </button>

      {/* Alert Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Set Up Alert</h3>

            {!hasPermission && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                <p className="text-sm">You need to enable notifications to receive alerts.</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Alert Type</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as AlertType)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                {entityType === 'ATTRACTION' && (
                  <>
                    <option value="WAIT_TIME_THRESHOLD">Wait Time Below Threshold</option>
                    <option value="STATUS_CHANGE_UP">Reopens</option>
                    <option value="STATUS_CHANGE_DOWN">Closes</option>
                  </>
                )}
                {entityType === 'SHOW' && (
                  <>
                    <option value="STATUS_CHANGE_UP">Show Starts</option>
                    <option value="STATUS_CHANGE_DOWN">Show Canceled</option>
                  </>
                )}
              </select>
            </div>

            {alertType === 'WAIT_TIME_THRESHOLD' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Wait Time Threshold (minutes)
                </label>
                <input
                  type="number"
                  value={waitTimeThreshold}
                  onChange={(e) => setWaitTimeThreshold(Number(e.target.value))}
                  min="5"
                  max="120"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  You'll be notified when wait time drops below this value
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlert}
                disabled={loading || (!hasPermission && !fcmToken)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {loading ? 'Creating...' : hasPermission ? 'Create Alert' : 'Enable Notifications'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertButton;
