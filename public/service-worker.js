const apiUrl = process.env.REACT_APP_API_URL;

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title || 'Default Title';
  const options = {
    body: data.body || 'Default body',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    data: {
      attractionId: data.attractionId,
      userId: data.userId
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  const attractionId = event.notification.data.attractionId;
  const userId = event.notification.data.userId;
  event.notification.close();

  if (attractionId && userId) {
    markNotificationAsSeen(attractionId, userId);
  } else {
    console.error('Attraction ID or User ID is missing');
  }
});

self.addEventListener('notificationclose', function(event) {
  const attractionId = event.notification.data.attractionId;
  const userId = event.notification.data.userId;
  if (attractionId && userId) {
    markNotificationAsSeen(attractionId, userId);
  } else {
    console.error('Attraction ID or User ID is missing on close');
  }
});

// Function to mark the notification as seen
async function markNotificationAsSeen(attractionId, userId) {
  if (!attractionId || !userId) return;

  try {
    const response = await fetch(`${apiUrl}/notifications/seen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attraction: attractionId, user: userId })
    });

    if (response.ok) {
      console.log('Notification marked as seen for user:', userId);
    } else {
      console.error('Failed to mark notification as seen:', response.status);
    }
  } catch (error) {
    console.error('Error marking notification as seen:', error);
  }
};