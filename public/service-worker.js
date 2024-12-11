import { sendLogToServer } from "../src/functions/logs";

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title || 'Park Hopper Alert';
  const options = {
    body: data.body || 'Your attraction has decreased its waiting time',
    icon: data.icon || '/park-hopper.jpeg',
    badge: data.badge || '/park-hopper.jpeg',
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
  } else {
    sendLogToServer('Missing attractionId on click');
  }
});

self.addEventListener('notificationclose', function(event) {
  const attractionId = event?.notification?.data?.attractionId;
  if (attractionId) {
    sendLogToServer('Notification close triggered');
  } else {
    sendLogToServer('Missing attractionId on close');
  }
});