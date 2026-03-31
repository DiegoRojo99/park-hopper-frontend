import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { BookmarkButton } from '../../../components/BookmarkButton';
import VisitButton from '../../../components/VisitButton';
import { CompleteShowData } from '../../../types/db';
import formatTime from '../../../lib/time';

const ShowDetails: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const [show, setShow] = useState<CompleteShowData | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const apiUrl = process.env.REACT_APP_API_URL;

  // Helper functions
  const getNextShowtime = (show: CompleteShowData) => {
    if (!show.showtimes || show.showtimes.length === 0) return null;
    
    const now = new Date();
    for (const time of show.showtimes) {
      const showtimeDate = new Date(time.startTime);
      if (showtimeDate > now) {
        return {
          time: formatTime(time.startTime, show.timezone || 'UTC'),
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

  // Fetch show data
  useEffect(() => {
    const fetchShow = async () => {
      if (!apiUrl || !showId) {
        setError('Missing configuration or show ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/shows/${showId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch show: ${response.status}`);
        }
        
        const showData: CompleteShowData = await response.json();
        setShow(showData);
        setError('');
      } catch (err) {
        console.error('Error fetching show:', err);
        setError(err instanceof Error ? err.message : 'Failed to load show');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [apiUrl, showId]);

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {error || 'Show not found'}
          </h2>
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
        <div className="w-full p-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {show.name}
            </h1>
            {nextShow && (
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Next show at {nextShow.time}
              </p>
            )}
          </div>

          {/* Next Showtime Section */}
          {nextShow ? (
            <div className="bg-blue-600 text-white rounded-2xl p-6 mb-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-sm font-medium mb-1 opacity-90">NEXT SHOWTIME</div>
                <div className="text-4xl font-bold mb-2">{nextShow.time}</div>
                <div className="text-lg font-medium opacity-90">
                  Starts in {timeUntilNext}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl p-6 mb-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">No upcoming shows today</div>
              </div>
            </div>
          )}

          {/* Show Information */}
          {!!duration && (
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>Duration: {formatDuration(duration)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md">
              <BookmarkButton entityId={show.id} entityType="SHOW" size="lg" />
            </div>
            <VisitButton 
              entityType="show"
              entityId={show.id}
              entityName={show.name}
              hideLabel={true}
              className="w-full h-14 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* All Today's Showtimes */}
      <div className="w-full p-6">
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
                        {formatTime(showtime.startTime, show.timezone || 'UTC')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {show.name}
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