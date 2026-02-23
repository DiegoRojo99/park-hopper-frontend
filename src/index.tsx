import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service workers for PWA functionality
if ('serviceWorker' in navigator) {
  // Register main PWA service worker for caching and offline functionality
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('✅ PWA Service Worker registered:', registration);
      
      // Also register Firebase messaging service worker for push notifications
      return navigator.serviceWorker.register('/firebase-messaging-sw.js');
    })
    .then((registration) => {
      console.log('✅ Firebase messaging Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('❌ Service Worker registration failed:', error);
    });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
