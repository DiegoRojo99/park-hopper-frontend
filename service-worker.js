const apiUrl = process.env.REACT_APP_API_URL; 

self.addEventListener('push', function(event) {

  const data = event.data.json();
  const title = data.title || 'Default Title';
  const options = {
      body: data.body || 'Default body',
      icon: data.icon || '/favicon.ico',
      badge: data.badge || '/favicon.ico',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  const attractionId = event.notification.data.attractionId;
  const userId = event.notification.data.userId;
  event.notification.close();

  // You can open the app or a specific URL if needed
  // event.waitUntil(
  //   clients.openWindow('/some-url')
  // );

  markNotificationAsSeen(attractionId, userId);
});

self.addEventListener('notificationclose', function(event) {
  const attractionId = event.notification.data.attractionId;
  const userId = event.notification.data.userId;
  markNotificationAsSeen(attractionId, userId);
});

// Function to mark the notification as seen
async function markNotificationAsSeen(attractionId, userId) {
  if (!attractionId || !userId) return;

  try {
    await fetch(`${apiUrl}/notifications/seen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attraction: attractionId, user: userId })
    });
    console.log('Notification marked as seen:', subscriptionId);
  } catch (error) {
    console.error('Error marking notification as seen:', error);
  }
}