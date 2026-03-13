import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { 
  Visit,
  VisitWithDetails,
  AttractionVisitWithDetails,
  ShowVisitWithDetails,
  RestaurantVisitWithDetails,
  VisitStats,
  CreateVisitRequest,
  UpdateVisitRequest,
  CreateAttractionVisitRequest,
  CreateShowVisitRequest,
  CreateRestaurantVisitRequest
} from "../types/visit";

interface VisitContextType {
  visits: VisitWithDetails[];
  attractionVisits: AttractionVisitWithDetails[];
  showVisits: ShowVisitWithDetails[];
  restaurantVisits: RestaurantVisitWithDetails[];
  stats: VisitStats | null;
  loading: boolean;
  
  // Visit CRUD operations
  createVisit: (visitData: Omit<CreateVisitRequest, 'userId'>) => Promise<Visit>;
  updateVisit: (visitId: string, updateData: UpdateVisitRequest) => Promise<Visit>;
  deleteVisit: (visitId: string) => Promise<void>;
  getVisit: (visitId: string) => Promise<VisitWithDetails>;
  
  // Attraction visit operations
  createAttractionVisit: (visitData: Omit<CreateAttractionVisitRequest, 'userId'>) => Promise<AttractionVisitWithDetails>;
  updateAttractionVisit: (visitId: string, updateData: Partial<CreateAttractionVisitRequest>) => Promise<AttractionVisitWithDetails>;
  deleteAttractionVisit: (visitId: string) => Promise<void>;
  
  // Show visit operations
  createShowVisit: (visitData: Omit<CreateShowVisitRequest, 'userId'>) => Promise<ShowVisitWithDetails>;
  updateShowVisit: (visitId: string, updateData: Partial<CreateShowVisitRequest>) => Promise<ShowVisitWithDetails>;
  deleteShowVisit: (visitId: string) => Promise<void>;
  
  // Restaurant visit operations  
  createRestaurantVisit: (visitData: Omit<CreateRestaurantVisitRequest, 'userId'>) => Promise<RestaurantVisitWithDetails>;
  updateRestaurantVisit: (visitId: string, updateData: Partial<CreateRestaurantVisitRequest>) => Promise<RestaurantVisitWithDetails>;
  deleteRestaurantVisit: (visitId: string) => Promise<void>;
  
  // Helper functions
  refreshVisits: () => Promise<void>;
  getVisitStats: () => Promise<void>;
}

const VisitContext = createContext<VisitContextType>({
  visits: [],
  attractionVisits: [],
  showVisits: [],
  restaurantVisits: [],
  stats: null,
  loading: false,
  createVisit: async () => ({ } as Visit),
  updateVisit: async () => ({ } as Visit),
  deleteVisit: async () => {},
  getVisit: async () => ({} as VisitWithDetails),
  createAttractionVisit: async () => ({} as AttractionVisitWithDetails),
  updateAttractionVisit: async () => ({} as AttractionVisitWithDetails),
  deleteAttractionVisit: async () => {},
  createShowVisit: async () => ({} as ShowVisitWithDetails),
  updateShowVisit: async () => ({} as ShowVisitWithDetails),
  deleteShowVisit: async () => {},
  createRestaurantVisit: async () => ({} as RestaurantVisitWithDetails),
  updateRestaurantVisit: async () => ({} as RestaurantVisitWithDetails),
  deleteRestaurantVisit: async () => {},
  refreshVisits: async () => {},
  getVisitStats: async () => {},
});

export const useVisits = () => {
  const context = useContext(VisitContext);
  if (!context) throw new Error('useVisits must be used within a VisitProvider');
  return context;
};

interface VisitProviderProps {
  children: ReactNode;
}

export const VisitProvider = ({ children }: VisitProviderProps) => {
  const [visits, setVisits] = useState<VisitWithDetails[]>([]);
  const [attractionVisits, setAttractionVisits] = useState<AttractionVisitWithDetails[]>([]);
  const [showVisits, setShowVisits] = useState<ShowVisitWithDetails[]>([]);
  const [restaurantVisits, setRestaurantVisits] = useState<RestaurantVisitWithDetails[]>([]);
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userLoading } = useAuth();

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchVisits = useCallback(async () => {
    if (!apiUrl || !user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/visits/${user.uid}?includeDetails=true`);
      if (response.ok) {
        const data = await response.json();
        setVisits(data);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  }, [user, apiUrl]);

  const fetchAttractionVisits = useCallback(async () => {
    if (!apiUrl || !user) return;

    try {
      const response = await fetch(`${apiUrl}/api/visits/attractions/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setAttractionVisits(data);
      }
    } catch (error) {
      console.error('Error fetching attraction visits:', error);
    }
  }, [user, apiUrl]);

  const fetchShowVisits = useCallback(async () => {
    if (!apiUrl || !user) return;

    try {
      const response = await fetch(`${apiUrl}/api/visits/shows/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setShowVisits(data);
      }
    } catch (error) {
      console.error('Error fetching show visits:', error);
    }
  }, [user, apiUrl]);

  const fetchRestaurantVisits = useCallback(async () => {
    if (!apiUrl || !user) return;

    try {
      const response = await fetch(`${apiUrl}/api/visits/restaurants/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setRestaurantVisits(data);
      }
    } catch (error) {
      console.error('Error fetching restaurant visits:', error);
    }
  }, [user, apiUrl]);

  const getVisitStats = useCallback(async () => {
    if (!apiUrl || !user) return;

    try {
      const response = await fetch(`${apiUrl}/api/visits/${user.uid}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching visit stats:', error);
    }
  }, [user, apiUrl]);

  useEffect(() => {
    if (userLoading) return;
    
    if (!user) {
      setVisits([]);
      setAttractionVisits([]);
      setShowVisits([]);
      setRestaurantVisits([]);
      setStats(null);
      setLoading(false);
      return;
    }
    
    fetchVisits();
    fetchAttractionVisits();
    fetchShowVisits();
    fetchRestaurantVisits();
    getVisitStats();
  }, [user, userLoading, fetchVisits, fetchAttractionVisits, fetchShowVisits, fetchRestaurantVisits, getVisitStats]);

  // Visit CRUD operations
  const createVisit = async (visitData: Omit<CreateVisitRequest, 'userId'>): Promise<Visit> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...visitData,
          userId: user.uid
        })
      });

      if (!response.ok) throw new Error('Failed to create visit');
      
      const newVisit = await response.json();
      await refreshVisits();
      return newVisit;
    } catch (error) {
      console.error('Error creating visit:', error);
      throw error;
    }
  };

  const updateVisit = async (visitId: string, updateData: UpdateVisitRequest): Promise<Visit> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/${visitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update visit');
      
      const updatedVisit = await response.json();
      await refreshVisits();
      return updatedVisit;
    } catch (error) {
      console.error('Error updating visit:', error);
      throw error;
    }
  };

  const deleteVisit = async (visitId: string): Promise<void> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/${visitId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete visit');
      
      await refreshVisits();
    } catch (error) {
      console.error('Error deleting visit:', error);
      throw error;
    }
  };

  const getVisit = async (visitId: string): Promise<VisitWithDetails> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/visit/${visitId}`);
      if (!response.ok) throw new Error('Failed to fetch visit');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching visit details:', error);
      throw error;
    }
  };

  // Attraction visit operations
  const createAttractionVisit = async (visitData: Omit<CreateAttractionVisitRequest, 'userId'>): Promise<AttractionVisitWithDetails> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const endpoint = visitData.visitId 
        ? `${apiUrl}/api/visits/${visitData.visitId}/attractions`
        : `${apiUrl}/api/visits/attractions`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...visitData,
          userId: user.uid
        })
      });

      if (!response.ok) throw new Error('Failed to create attraction visit');
      
      const newVisit = await response.json();
      await fetchAttractionVisits();
      if (visitData.visitId) await refreshVisits();
      return newVisit;
    } catch (error) {
      console.error('Error creating attraction visit:', error);
      throw error;
    }
  };

  const updateAttractionVisit = async (visitId: string, updateData: Partial<CreateAttractionVisitRequest>): Promise<AttractionVisitWithDetails> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/attractions/${visitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update attraction visit');
      
      const updatedVisit = await response.json();
      await fetchAttractionVisits();
      return updatedVisit;
    } catch (error) {
      console.error('Error updating attraction visit:', error);
      throw error;
    }
  };

  const deleteAttractionVisit = async (visitId: string): Promise<void> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/attractions/${visitId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete attraction visit');
      
      await fetchAttractionVisits();
    } catch (error) {
      console.error('Error deleting attraction visit:', error);
      throw error;
    }
  };

  // Show visit operations
  const createShowVisit = async (visitData: Omit<CreateShowVisitRequest, 'userId'>): Promise<ShowVisitWithDetails> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const endpoint = visitData.visitId 
        ? `${apiUrl}/api/visits/${visitData.visitId}/shows`
        : `${apiUrl}/api/visits/shows`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...visitData,
          userId: user.uid
        })
      });

      if (!response.ok) throw new Error('Failed to create show visit');
      
      const newVisit = await response.json();
      await fetchShowVisits();
      if (visitData.visitId) await refreshVisits();
      return newVisit;
    } catch (error) {
      console.error('Error creating show visit:', error);
      throw error;
    }
  };

  const updateShowVisit = async (visitId: string, updateData: Partial<CreateShowVisitRequest>): Promise<ShowVisitWithDetails> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/shows/${visitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update show visit');
      
      const updatedVisit = await response.json();
      await fetchShowVisits();
      return updatedVisit;
    } catch (error) {
      console.error('Error updating show visit:', error);
      throw error;
    }
  };

  const deleteShowVisit = async (visitId: string): Promise<void> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/shows/${visitId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete show visit');
      
      await fetchShowVisits();
    } catch (error) {
      console.error('Error deleting show visit:', error);
      throw error;
    }
  };

  // Restaurant visit operations
  const createRestaurantVisit = async (visitData: Omit<CreateRestaurantVisitRequest, 'userId'>): Promise<RestaurantVisitWithDetails> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const endpoint = visitData.visitId 
        ? `${apiUrl}/api/visits/${visitData.visitId}/restaurants`
        : `${apiUrl}/api/visits/restaurants`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...visitData,
          userId: user.uid
        })
      });

      if (!response.ok) throw new Error('Failed to create restaurant visit');
      
      const newVisit = await response.json();
      await fetchRestaurantVisits();
      if (visitData.visitId) await refreshVisits();
      return newVisit;
    } catch (error) {
      console.error('Error creating restaurant visit:', error);
      throw error;
    }
  };

  const updateRestaurantVisit = async (visitId: string, updateData: Partial<CreateRestaurantVisitRequest>): Promise<RestaurantVisitWithDetails> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/restaurants/${visitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update restaurant visit');
      
      const updatedVisit = await response.json();
      await fetchRestaurantVisits();
      return updatedVisit;
    } catch (error) {
      console.error('Error updating restaurant visit:', error);
      throw error;
    }
  };

  const deleteRestaurantVisit = async (visitId: string): Promise<void> => {
    if (!apiUrl || !user) throw new Error('User must be logged in');

    try {
      const response = await fetch(`${apiUrl}/api/visits/restaurants/${visitId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete restaurant visit');
      
      await fetchRestaurantVisits();
    } catch (error) {
      console.error('Error deleting restaurant visit:', error);
      throw error;
    }
  };

  const refreshVisits = async () => {
    await Promise.all([
      fetchVisits(),
      fetchAttractionVisits(),
      fetchShowVisits(),
      fetchRestaurantVisits(),
      getVisitStats()
    ]);
  };

  return (
    <VisitContext.Provider value={{
      visits,
      attractionVisits,
      showVisits,
      restaurantVisits,
      stats,
      loading,
      createVisit,
      updateVisit,
      deleteVisit,
      getVisit,
      createAttractionVisit,
      updateAttractionVisit,
      deleteAttractionVisit,
      createShowVisit,
      updateShowVisit,
      deleteShowVisit,
      createRestaurantVisit,
      updateRestaurantVisit,
      deleteRestaurantVisit,
      refreshVisits,
      getVisitStats
    }}>
      {children}
    </VisitContext.Provider>
  );
};