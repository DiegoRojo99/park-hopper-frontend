import React, { useState } from 'react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/Loader';
import { LiveAttraction, LiveShow } from '../../types/db';
import ShowCard from '../Shows/ShowCard';
import AttractionCard from '../Attractions/AttractionCard';
import { Link } from 'react-router-dom';
import ChildrenTab, { TabOption } from '../../components/ChildrenTab';

const BookmarksPage: React.FC = () => {
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  const { user, userLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TabOption>('Attractions');
  
  if (bookmarksLoading || userLoading) return <Loader />;

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Login Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You need to be logged in to view and manage your bookmarks
          </p>
          <Link 
            to="/login" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const attractions = bookmarks.filter(e => e.entityType === 'ATTRACTION');
  const shows = bookmarks.filter(e => e.entityType === 'SHOW');

  const isLiveAttraction = (entity: any): entity is LiveAttraction => {
    return 'waitTime' in entity;
  };

  const isLiveShow = (entity: any): entity is LiveShow => {
    return 'showtimes' in entity;
  };

  const renderTabContent = () => {
    const displayAttractions = selectedTab === 'Attractions';
    const displayShows = selectedTab === 'Shows';

    return (
      <div className="space-y-8 w-full px-4 py-8">
        {/* Attractions Section */}
        {displayAttractions && attractions.length > 0 && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attractions.map((bookmarkedEntity) => {
                const attraction = isLiveAttraction(bookmarkedEntity) ? bookmarkedEntity : null;
                return attraction ? (<AttractionCard attraction={attraction} key={bookmarkedEntity.id} />) : null;
              })}
            </div>
          </section>
        )}

        {/* Shows Section */}
        {displayShows && shows.length > 0 && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shows.map((bookmarkShow) => {
                const show = isLiveShow(bookmarkShow) ? bookmarkShow : null;
                return show ? <ShowCard show={show} key={bookmarkShow.id} /> : null;
              })}
            </div>
          </section>
        )}

        {/* Empty state for selected tab */}
        {((selectedTab === 'Attractions' && attractions.length === 0) ||
          (selectedTab === 'Shows' && shows.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {`No ${selectedTab.toLowerCase()} bookmarked`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {`Start bookmarking ${selectedTab.toLowerCase()} to see them here`}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookmarks</h1>
          <p className="text-blue-100 dark:text-blue-200">
            Keep track of your favorite attractions and shows
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ChildrenTab selectedTab={selectedTab} setTab={setSelectedTab} />

      {/* Content */}
      {renderTabContent()}
    </div>
  );
};

export default BookmarksPage;
