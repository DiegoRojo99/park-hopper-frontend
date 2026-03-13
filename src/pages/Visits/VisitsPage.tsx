import React, { useState } from 'react';
import { useVisits } from '../../context/VisitContext';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/Loader';
import { Link } from 'react-router-dom';
import ChildrenTab, { TabOption } from '../../components/ChildrenTab';
import { AttractionVisitWithDetails, RestaurantVisitWithDetails, ShowVisitWithDetails } from '../../types/visit';

const VisitsPage: React.FC = () => {
  const { visits, attractionVisits, showVisits, restaurantVisits, stats, loading } = useVisits();
  const { user, userLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TabOption>('All');
  
  if (loading || userLoading) return <Loader />;

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-4 pt-8">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to view your park visits
          </p>
          <Link 
            to="/login" 
            className="bg-light-primary hover:bg-light-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const displayAttractions = selectedTab === 'Attractions' || selectedTab === 'All';
  const displayShows = selectedTab === 'Shows' || selectedTab === 'All';
  const displayRestaurants = selectedTab === 'Restaurants' || selectedTab === 'All';

  return (
    <div className="w-full min-h-screen p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Visits</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your park adventures and experiences
          </p>
        </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Parks</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalVisits.parks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attractions</h3>
            <p className="text-2xl font-bold text-green-600">{stats.totalVisits.attractions}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shows</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.totalVisits.shows}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Restaurants</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.totalVisits.restaurants}</p>
          </div>
        </div>
      )}

      <ChildrenTab selectedTab={selectedTab} setTab={setSelectedTab} showAll={true} />

      {/* Park Visits Section */}
      {selectedTab === 'All' && visits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Park Visits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visits.map((visit) => (
              <Link 
                key={visit.id} 
                to={`/visits/${visit.id}`} 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer group block"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{visit.park?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{new Date(visit.visitDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">
                  {new Date(visit.entryTime).toLocaleTimeString()} - {visit.exitTime ? new Date(visit.exitTime).toLocaleTimeString() : 'Still visiting'}
                </p>
                {visit.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{visit.notes}</p>
                )}
                
                {/* Visit Summary */}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>🎢 {visit.attractionVisits?.length || 0}</span>
                  <span>🎭 {visit.showVisits?.length || 0}</span>
                  <span>🍽️ {visit.restaurantVisits?.length || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Attraction Visits Section */}
      {displayAttractions && attractionVisits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Attraction Visits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attractionVisits.map((av: AttractionVisitWithDetails) => (
              <div key={av.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{av.attraction?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{new Date(av.visitedAt).toLocaleDateString()}</p>
                {av.rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-300">{av.rating}/5</span>
                  </div>
                )}
                {av.waitTime !== undefined && (
                  <p className="text-sm text-gray-500">Wait time: {av.waitTime} minutes</p>
                )}
                {av.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{av.notes}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Show Visits Section */}
      {displayShows && showVisits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Show Visits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {showVisits.map((sv: ShowVisitWithDetails) => (
              <div key={sv.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sv.show?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{new Date(sv.visitedAt).toLocaleDateString()}</p>
                {sv.rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-300">{sv.rating}/5</span>
                  </div>
                )}
                {sv.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{sv.notes}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Restaurant Visits Section */}
      {displayRestaurants && restaurantVisits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Restaurant Visits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurantVisits.map((rv: RestaurantVisitWithDetails) => (
              <div key={rv.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{rv.restaurant?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{new Date(rv.createdAt).toLocaleDateString()}</p>
                {rv.rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-300">{rv.rating}/5</span>
                  </div>
                )}
                {rv.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{rv.notes}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

        {/* Empty States */}
        {visits.length === 0 && attractionVisits.length === 0 && showVisits.length === 0 && restaurantVisits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No visits yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring parks to track your visits
            </p>
            <Link 
              to="/parks" 
              className="bg-light-primary hover:bg-light-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
            >
              Explore Parks
            </Link>
          </div>
        )}

        {/* Tab-specific empty states */}
        {((selectedTab === 'Attractions' && attractionVisits.length === 0) ||
          (selectedTab === 'Shows' && showVisits.length === 0) ||
          (selectedTab === 'Restaurants' && restaurantVisits.length === 0)) && 
          (visits.length > 0 || attractionVisits.length > 0 || showVisits.length > 0 || restaurantVisits.length > 0) && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">
              {`No ${selectedTab.toLowerCase()} visits yet`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {`Start visiting ${selectedTab.toLowerCase()} to see them here`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitsPage;