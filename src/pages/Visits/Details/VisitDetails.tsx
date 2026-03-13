import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useVisits } from '../../../context/VisitContext';
import { VisitWithDetails } from '../../../types/visit';
import { Loader } from '../../../components/Loader';
import DiaryEntry, { Activity } from '../../../components/DiaryEntry';
import EditEntryModal from '../../../components/EditEntryModal';

const VisitDetails: React.FC = () => {
  const { visitId } = useParams<{ visitId: string }>();
  const { getVisit } = useVisits();
  const [visit, setVisit] = useState<VisitWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Combine all activities and sort by timestamp
  const getAllActivities = (): Activity[] => {
    if (!visit) return [];

    const activities = [];

    // Add park entry
    activities.push({
      id: `park-entry-${visit.id}`,
      type: 'park' as const,
      name: visit.park?.name || 'Park Visit',
      timestamp: visit.entryTime,
      notes: visit.notes,
      isEntry: true
    });

    // Add attraction visits
    visit.attractionVisits?.forEach(av => {
      activities.push({
        id: av.id,
        type: 'attraction' as const,
        name: av.attraction?.name || 'Unknown Attraction',
        timestamp: av.visitedAt,
        rating: av.rating,
        notes: av.notes,
        waitTime: av.waitTime
      });
    });

    // Add show visits
    visit.showVisits?.forEach(sv => {
      activities.push({
        id: sv.id,
        type: 'show' as const,
        name: sv.show?.name || 'Unknown Show',
        timestamp: sv.visitedAt,
        rating: sv.rating,
        notes: sv.notes
      });
    });

    // Add restaurant visits
    visit.restaurantVisits?.forEach(rv => {
      activities.push({
        id: rv.id,
        type: 'restaurant' as const,
        name: rv.restaurant?.name || 'Unknown Restaurant',
        timestamp: rv.createdAt,
        rating: rv.rating,
        notes: rv.notes
      });
    });

    // Add park exit if it exists
    if (visit.exitTime) {
      activities.push({
        id: `park-exit-${visit.id}`,
        type: 'park' as const,
        name: visit.park?.name || 'Park Visit',
        timestamp: visit.exitTime,
        isExit: true
      });
    }

    // Sort by timestamp
    return activities.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const activities = getAllActivities();

  // Handle editing an activity
  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleSaveActivity = (updatedActivity: Activity) => {
    // TODO: Implement API call to update the activity
    // For now, just close the modal
    console.log('Updated activity:', updatedActivity);
    setIsEditModalOpen(false);
    setEditingActivity(null);
  };

  // Calculate total visit duration
  const getVisitDuration = () => {
    if (!visit?.entryTime || !visit?.exitTime) return null;
    const entry = new Date(visit.entryTime);
    const exit = new Date(visit.exitTime);
    const diffMs = exit.getTime() - entry.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffHours > 0 ? `${diffHours}h ${diffMins}m` : `${diffMins}m`;
  };

  useEffect(() => {
    const fetchVisitDetails = async () => {
      if (!visitId) {
        setError('Visit ID not provided');
        setLoading(false);
        return;
      }

      try {
        const visitData = await getVisit(visitId);
        setVisit(visitData);
        setError('');
      } catch (err) {
        console.error('Error fetching visit:', err);
        setError(err instanceof Error ? err.message : 'Failed to load visit');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitDetails();
  }, [visitId, getVisit]);

  if (loading) return <Loader />;

  if (error || !visit) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Visit not found'}
          </h2>
        </div>
      </div>
    );
  }

  const duration = getVisitDuration();

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="w-full p-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {visit.park?.name} Visit Diary
            </h1>
            
            {/* Visit Info in rows */}
            <div className="space-y-2 text-lg text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span>{formatDate(visit.visitDate)}</span>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span>Entry: {formatTime(visit.entryTime)}</span>
                </div>
                {visit.exitTime && (
                  <div className="flex items-center gap-2">
                    <span>Exit: {formatTime(visit.exitTime)}</span>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center gap-2">
                    <span>Duration: {duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="w-full px-3 py-6">
        <div className="space-y-4">
          {activities.map((activity) => 
            <DiaryEntry 
              key={activity.id} 
              activity={activity} 
              onEdit={() => handleEditActivity(activity)}
            />
          )}
        </div>

        {/* Visit Summary */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Visit Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{visit.attractionVisits?.length || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Attractions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{visit.showVisits?.length || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Shows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{visit.restaurantVisits?.length || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{duration || 'Ongoing'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      <EditEntryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingActivity(null);
        }}
        activity={editingActivity}
        onSave={handleSaveActivity}
      />
    </div>
  );
};

export default VisitDetails;