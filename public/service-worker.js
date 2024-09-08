import { sendLogToServer } from "../src/functions/logs";
const apiUrl = process.env.REACT_APP_API_URL;

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title || 'Default Title';
  const options = {
    body: data.body || 'Default body',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    data: {
      attractionId: data.attractionId
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  const attractionId = event?.notification?.data?.attractionId;
  event.notification.close();
  if (attractionId) {
    sendLogToServer(`Notification clicked. Attraction ID: ${attractionId}`);
    // clients.openWindow("https://parkhopper.live/");
  } else {
    sendLogToServer('Missing attractionId on click');
  }
});

self.addEventListener('notificationclose', function(event) {
  const attractionId = event?.notification?.data?.attractionId;
  if (attractionId) {
    // markNotificationAsSeen(attractionId, userId);
    sendLogToServer('Notification close triggered');
  } else {
    sendLogToServer('Missing attractionId on close');
  }
});

// Function to mark the notification as seen
// async function markNotificationAsSeen(attractionId, userId) {
//   if (!attractionId || !userId) return;

//   try {
//     const response = await fetch(`${apiUrl}/notifications/seen`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ attraction: attractionId, user: userId })
//     });

//     if (response.ok) {
//       sendLogToServer(`Notification marked as seen. Attraction ID: ${attractionId}, User ID: ${userId}`);
//     } else {
//       sendLogToServer(`Failed to mark notification as seen: ${response.status}`);
//     }
//   } catch (error) {
//     sendLogToServer(`Failed to mark notification as seen: ${error}`);
//   }
// };