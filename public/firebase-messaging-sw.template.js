// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// Note: Service workers can't access process.env, so we inject the config at build time
firebase.initializeApp({
  apiKey: "{{FIREBASE_API_KEY}}",
  authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
  projectId: "{{FIREBASE_PROJECT_ID}}",
  storageBucket: "{{FIREBASE_STORAGE_BUCKET}}",
  messagingSenderId: "{{FIREBASE_MESSAGING_SENDER_ID}}",
  appId: "{{FIREBASE_APP_ID}}"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Park Hopper Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new alert',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Navigate to the app
  event.waitUntil(
    clients.openWindow('/')
  );
});
