import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Alert } from "../types/alert";
import { useAuth } from "./AuthContext";

interface AlertContextType {
  alerts: Alert[];
  loading: boolean;
  hasAlert: (entityId: string) => boolean;
  getAlertForEntity: (entityId: string) => Alert | undefined;
  refreshAlerts: () => Promise<void>;
}

const AlertContext = createContext<AlertContextType>({
  alerts: [],
  loading: false,
  hasAlert: () => false,
  getAlertForEntity: () => undefined,
  refreshAlerts: async () => {},
});

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    if (!user) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/alerts/${user.uid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data: Alert[] = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const hasAlert = (entityId: string): boolean => {
    return alerts.some(alert => alert.entityId === entityId && alert.status === 'ACTIVE');
  };

  const getAlertForEntity = (entityId: string): Alert | undefined => {
    return alerts.find(alert => alert.entityId === entityId && alert.status === 'ACTIVE');
  };

  const refreshAlerts = async () => {
    await fetchAlerts();
  };

  const value: AlertContextType = {
    alerts,
    loading,
    hasAlert,
    getAlertForEntity,
    refreshAlerts,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};
