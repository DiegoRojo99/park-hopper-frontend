import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Alert, CreateAlertRequest, UpdateAlertRequest, AlertType, AlertEntityType, AlertStatus } from "../types/alert";
import { useAuth } from "./AuthContext";

interface AlertContextType {
  alerts: Alert[];
  loading: boolean;
  hasAlert: (entityId: string) => boolean;
  getAlertForEntity: (entityId: string) => Alert | undefined;
  createAlert: (entityId: string, entityType: AlertEntityType, alertType: AlertType, fcmToken: string, waitTimeThreshold?: number) => Promise<void>;
  updateAlert: (alertId: string, updates: UpdateAlertRequest) => Promise<void>;
  refreshAlerts: () => Promise<void>;
}

const AlertContext = createContext<AlertContextType>({
  alerts: [],
  loading: false,
  hasAlert: () => false,
  getAlertForEntity: () => undefined,
  createAlert: async () => {},
  updateAlert: async () => {},
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

  const createAlert = async (
    entityId: string,
    entityType: AlertEntityType,
    alertType: AlertType,
    fcmToken: string,
    waitTimeThreshold?: number
  ) => {
    if (!user) {
      throw new Error('User must be logged in to create alerts');
    }

    try {
      const requestBody: CreateAlertRequest = {
        userId: user.uid,
        entityId,
        entityType,
        alertType,
        fcmToken,
      };

      // Only include waitTimeThreshold if it's provided and alert type is WAIT_TIME_THRESHOLD
      if (alertType === 'WAIT_TIME_THRESHOLD' && waitTimeThreshold !== undefined) {
        requestBody.waitTimeThreshold = waitTimeThreshold;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to create alert');
      }

      const newAlert: Alert = await response.json();
      
      // Optimistically add the alert to the list
      setAlerts(prev => [...prev, newAlert]);
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  };

  const updateAlert = async (alertId: string, updates: UpdateAlertRequest) => {
    if (!user) {
      throw new Error('User must be logged in to update alerts');
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update alert');
      }

      const updatedAlert: Alert = await response.json();
      
      // Optimistically update the alert in the list
      setAlerts(prev => prev.map(alert => alert.id === alertId ? updatedAlert : alert));
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  };

  const refreshAlerts = async () => {
    await fetchAlerts();
  };

  const value: AlertContextType = {
    alerts,
    loading,
    hasAlert,
    getAlertForEntity,
    createAlert,
    updateAlert,
    refreshAlerts,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};
