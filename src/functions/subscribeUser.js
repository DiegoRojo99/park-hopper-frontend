const apiUrl = process.env.REACT_APP_API_URL; 

const base64ToUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64String = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export async function subscribeUser() {  
  const accessToken = localStorage.getItem('access_token');
  if ('serviceWorker' in navigator && 'PushManager' in window && accessToken) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/vapidPublicKey`);
      const { publicKey } = await response.json();

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(publicKey)
      });

      // Send subscription to your server
      const saveSubscriptionResponse = await fetch(`${apiUrl}/save-subscription`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!saveSubscriptionResponse.ok) {
        throw new Error('Failed to save subscription');
      }

      console.log('User subscribed successfully');
    } catch (error) {
      console.error('Failed to subscribe the user:', error);
    }
  } else {
    console.error('Push notifications are not supported by this browser.');
  }
}
