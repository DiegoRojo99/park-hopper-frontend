const apiUrl = process.env.REACT_APP_API_URL;

function sendLogToServer(logMessage) {
  const loggingUrl = `${apiUrl}/log`;

  fetch(loggingUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      log: logMessage,
      timestamp: new Date().toISOString(),
    }),
  }).catch((error) => {
    console.error('Failed to send log:', error);
  });
};

export {
  sendLogToServer
}