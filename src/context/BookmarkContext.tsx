import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { LiveDataStatus, ShowTimes } from "../types/db";
import { useAuth } from "./AuthContext";

export type BookmarkEntityType = 'ATTRACTION' | 'SHOW' | 'RESTAURANT' | 'PARK';

export interface Bookmark {
  destinationId: string | null;
  entityType: BookmarkEntityType;
  externalId: string;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  parkId: string;
  showtimes?: ShowTimes[];
  waitTime?: number | null;
  status?: LiveDataStatus;
  timezone: string;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  isBookmarked: (entityId: string) => boolean;
  addBookmark: (entityId: string, entityType: BookmarkEntityType) => Promise<void>;
  removeBookmark: (entityId: string) => Promise<void>;
  toggleBookmark: (entityId: string, entityType: BookmarkEntityType) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  loading: false,
  isBookmarked: () => false,
  addBookmark: async () => {},
  removeBookmark: async () => {},
  toggleBookmark: async () => {},
  refreshBookmarks: async () => {},
});

export const useBookmarks = () => useContext(BookmarkContext);

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider = ({ children }: BookmarkProviderProps) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userLoading } = useAuth();

  const fetchBookmarks = useCallback(async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl || !user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/bookmarks/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (userLoading) return;
    
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }
    
    fetchBookmarks();
  }, [user, userLoading, fetchBookmarks]);

  const isBookmarked = (entityId: string): boolean => {
    return bookmarks.some(b => b.id === entityId);
  };

  const addBookmark = async (entityId: string, entityType: BookmarkEntityType) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) return;

    try {
      const response = await fetch(`${apiUrl}/api/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          entityId,
          entityType
        })
      });

      if (response.ok) {
        const newBookmark = await response.json();
        setBookmarks(prev => [...prev, newBookmark]);
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const removeBookmark = async (entityId: string) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) return;
    if (!user) return;

    try {
      const response = await fetch(`${apiUrl}/api/bookmarks/${user.uid}/${entityId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== entityId));
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const toggleBookmark = async (entityId: string, entityType: BookmarkEntityType) => {
    if (isBookmarked(entityId)) {
      await removeBookmark(entityId);
    } else {
      await addBookmark(entityId, entityType);
    }
  };

  const refreshBookmarks = async () => {
    await fetchBookmarks();
  };

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      loading,
      isBookmarked,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      refreshBookmarks
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};
