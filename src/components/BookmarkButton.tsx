import React from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useBookmarks, BookmarkEntityType } from '../context/BookmarkContext';
import { useAuth } from '../context/AuthContext';

interface BookmarkButtonProps {
  entityId: string;
  entityType: BookmarkEntityType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  entityId, 
  entityType,
  size = 'md',
  showLabel = false
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { user } = useAuth();
  const bookmarked = isBookmarked(entityId);

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Could show a toast or redirect to login
      alert('Please login to bookmark items');
      return;
    }
    
    await toggleBookmark(entityId, entityType);
  };

  if (!user) {
    return null; // Hide bookmark button when not logged in
  }

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 p-2 rounded-lg transition-colors
        ${bookmarked 
          ? 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-500' 
          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }
      `}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <BookmarkSolid className={sizeClasses[size]} />
      ) : (
        <BookmarkOutline className={sizeClasses[size]} />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </button>
  );
};
