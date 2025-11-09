const fs = require('fs');
const path = require('path');
require('dotenv').config();

const templatePath = path.join(__dirname, '../public/firebase-messaging-sw.template.js');
const outputPath = path.join(__dirname, '../public/firebase-messaging-sw.js');

// Read the template
const template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders with environment variables
const serviceWorker = template
  .replace('{{FIREBASE_API_KEY}}', process.env.REACT_APP_FIREBASE_API_KEY || '')
  .replace('{{FIREBASE_AUTH_DOMAIN}}', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '')
  .replace('{{FIREBASE_PROJECT_ID}}', process.env.REACT_APP_FIREBASE_PROJECT_ID || '')
  .replace('{{FIREBASE_STORAGE_BUCKET}}', process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '')
  .replace('{{FIREBASE_MESSAGING_SENDER_ID}}', process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '')
  .replace('{{FIREBASE_APP_ID}}', process.env.REACT_APP_FIREBASE_APP_ID || '');

// Write the generated service worker
fs.writeFileSync(outputPath, serviceWorker, 'utf8');

console.log('✅ Firebase service worker generated successfully!');
