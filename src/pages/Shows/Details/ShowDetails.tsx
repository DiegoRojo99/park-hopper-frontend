import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeftIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { BookmarkButton } from '../../../components/BookmarkButton';
import AlertButton from '../../../components/AlertButton';
import VisitButton from '../../../components/VisitButton';
import { ShowTimeElement } from '../ShowTimeElement';
import { LiveShow } from '../../../types/db';
import formatTime from '../../../lib/time';

const ShowDetails: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const [show, setShow] = useState<LiveShow | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Helper functions
  const getNextShowtime = (show: LiveShow) => {
    if (!show.showtimes || show.showtimes.length === 0) return null;
    
    const now = new Date();
    for (const time of show.showtimes) {
      const showtimeDate = new Date(time.startTime);
      if (showtimeDate > now) {
        return {
          time: formatTime(time.startTime, show.timezone),
          startTime: time.startTime,
          endTime: time.endTime
        };
      }
    }
    return null;
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    return durationMinutes;
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration} minutes`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const getTimeUntilShowtime = (startTime: string) => {
    const now = new Date();
    const showTime = new Date(startTime);
    const diffMs = showTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Show started';
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getShowtimeStatus = (startTime: string) => {
    const now = new Date();
    const showTime = new Date(startTime);
    const diffMs = showTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return { status: 'Finished', color: 'text-gray-500' };
    if (diffMs <= 30 * 60 * 1000) return { status: 'Next', color: 'text-blue-600' }; // Next 30 minutes
    return { status: 'Upcoming', color: 'text-green-600' };
  };

  // Update countdown every minute
  useEffect(() => {
    if (!show) return;
    
    const updateCountdown = () => {
      const nextShow = getNextShowtime(show);
      if (nextShow) {
        setTimeUntilNext(getTimeUntilShowtime(nextShow.startTime));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [show]);

  // Fetch show data (mock for now - replace with actual API call)
  useEffect(() => {
    const fetchShow = async () => {
      // TODO: Replace with actual API call
      // Mock data structure based on your existing types
      const mockShow: LiveShow = {
        id: showId || '',
        name: 'The Lion King Musical Spectacular',
        showtimes: [
          {
            id: '1',
            startTime: '2024-03-13T14:00:00Z',
            endTime: '2024-03-13T15:45:00Z'
          },
          {
            id: '2', 
            startTime: '2024-03-13T16:00:00Z',
            endTime: '2024-03-13T17:45:00Z'
          },
          {
            id: '3',
            startTime: '2024-03-13T18:00:00Z', 
            endTime: '2024-03-13T19:45:00Z'
          },
          {
            id: '4',
            startTime: '2024-03-13T20:00:00Z',
            endTime: '2024-03-13T21:45:00Z'
          }
        ],
        timezone: 'UTC',
        venue: 'Theater of Dreams'
      };
      
      setShow(mockShow);
      setLoading(false);
    };

    fetchShow();
  }, [showId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Show not found</h2>
          <Link to="/parks" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Parks
          </Link>
        </div>
      </div>
    );
  }

  const nextShow = getNextShowtime(show);
  const firstShowtime = show.showtimes?.[0];
  const duration = firstShowtime ? calculateDuration(firstShowtime.startTime, firstShowtime.endTime) : null;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/parks" className="p-1">
              <ChevronLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {show.name}
              </h1>
              {nextShow && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next show at {nextShow.time}
                </p>
              )}
            </div>
          </div>

          {/* Next Showtime Section */}
          {nextShow ? (
            <div className="bg-blue-600 text-white rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-sm font-medium mb-1 opacity-90">NEXT SHOWTIME</div>
                <div className="text-4xl font-bold mb-2">{nextShow.time}</div>
                <div className="text-lg font-medium opacity-90">
                  Starts in {timeUntilNext}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">No upcoming shows today</div>
              </div>
            </div>
          )}

          {/* Show Information */}
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-4">
              {show.venue && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{show.venue}</span>
                </div>
              )}
              {duration && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>Duration: {formatDuration(duration)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="mb-2">
                <BookmarkButton entityId={show.id} entityType="SHOW" size="lg" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Bookmark</span>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <AlertButton entityId={show.id} entityType="SHOW" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Set Alert</span>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <VisitButton 
                  entityType="show"
                  entityId={show.id}
                  entityName={show.name}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Log Visit</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Today's Showtimes */}
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          All Today's Showtimes
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          {show.showtimes && show.showtimes.length > 0 ? (
            show.showtimes.map((showtime, index) => {
              const status = getShowtimeStatus(showtime.startTime);
              const isNext = status.status === 'Next';
              
              return (
                <div 
                  key={index}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                    isNext ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatTime(showtime.startTime, show.timezone)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {show.venue}
                        {isNext && ' • Next Show'}
                        {status.status === 'Finished' && ' • Finished'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isNext && (
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                          Next
                        </span>
                      )}
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.status === 'Upcoming' ? 'Upcoming' : 
                         status.status === 'Finished' ? '✓ Finished' : 
                         '▶ Next'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No showtimes available for today
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;