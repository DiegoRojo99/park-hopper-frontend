import React from 'react';
import { useBookmarks } from '../../context/BookmarkContext';
import { Loader } from '../../components/Loader';
import { LiveAttraction, LiveShow } from '../../types/db';
import ShowCard from '../Shows/ShowCard';
import AttractionCard from '../Attractions/AttractionCard';

const BookmarksPage: React.FC = () => {
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  if (bookmarksLoading) return <Loader />;

  const attractions = bookmarks.filter(e => e.entityType === 'ATTRACTION');
  const shows = bookmarks.filter(e => e.entityType === 'SHOW');

  const isLiveAttraction = (entity: any): entity is LiveAttraction => {
    return 'waitTime' in entity;
  };

  const isLiveShow = (entity: any): entity is LiveShow => {
    return 'showtimes' in entity;
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookmarks</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Keep track of your favorite attractions and shows
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start bookmarking attractions and shows to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Attractions Section */}
          {attractions.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Attractions ({attractions.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attractions.map((bookmarkedEntity) => {
                  const attraction = isLiveAttraction(bookmarkedEntity) ? bookmarkedEntity : null;
                  return attraction ? (<AttractionCard attraction={attraction} key={bookmarkedEntity.id} />) : null;
                })}
              </div>
            </section>
          )}

          {/* Shows Section */}
          {shows.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Shows ({shows.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shows.map((bookmarkShow) => {
                  const show = isLiveShow(bookmarkShow) ? bookmarkShow : null;
                  return show ? <ShowCard show={show} key={bookmarkShow.id} /> : null;
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
