import { useState, useEffect, useCallback, useRef } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../lib/firebase';

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  const requestFCMToken = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (fcmToken) {
      return;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      });

      if (token) { setFcmToken(token); } 
      else { setError('No registration token available'); }
    } catch (err) {
      console.error('Error getting FCM token:', err);
      setError('Failed to get notification token');
    }
  }, [fcmToken]);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    const initializeFCM = async () => {
      try {
        // Check if notifications are supported
        if (!('Notification' in window)) {
          setError('This browser does not support notifications');
          return;
        }

        // Check current permission
        setNotificationPermission(Notification.permission);

        // If permission already granted, get token
        if (Notification.permission === 'granted' && !fcmToken) {
          await requestFCMToken();
        }
      } catch (err) {
        console.error('Error initializing FCM:', err);
        setError('Failed to initialize notifications');
      }
    };

    initializeFCM();

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Show notification if permission is granted
      if (Notification.permission === 'granted' && payload.notification) {
        new Notification(payload.notification.title || 'Park Hopper Alert', {
          body: payload.notification.body,
          icon: '/favicon.ico',
        });
      }
    });

    return () => unsubscribe();
  }, [fcmToken, requestFCMToken]);

  const requestNotificationPermission = async (): Promise<boolean> => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        await requestFCMToken();
        return true;
      } else {
        setError('Notification permission denied');
        return false;
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      setError('Failed to request notification permission');
      return false;
    }
  };

  return {
    fcmToken,
    notificationPermission,
    error,
    requestNotificationPermission,
    hasPermission: notificationPermission === 'granted',
  };
};
