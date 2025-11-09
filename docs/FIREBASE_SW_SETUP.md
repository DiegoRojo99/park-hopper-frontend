# Firebase Service Worker Setup

## Overview
The Firebase Cloud Messaging service worker (`firebase-messaging-sw.js`) is automatically generated from a template to keep Firebase credentials secure.

## Files
- **`public/firebase-messaging-sw.template.js`** - Template file with placeholders (tracked in git)
- **`public/firebase-messaging-sw.js`** - Generated file with actual credentials (ignored by git)
- **`scripts/generate-sw.js`** - Script that generates the service worker from template

## How It Works
1. The template file contains `{{PLACEHOLDER}}` values
2. The generation script reads environment variables from `.env`
3. Placeholders are replaced with actual Firebase config values
4. The final service worker is written to `public/firebase-messaging-sw.js`

## Development
The service worker is automatically generated:
- **Before `npm start`** - via the `prestart` script
- **Before `npm run build`** - via the `prebuild` script

To manually regenerate:
```bash
npm run generate-sw
```

## Production/Deployment
Make sure your deployment environment has the required environment variables:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

The build process will automatically generate the service worker with these values.

## Security
⚠️ **Never commit `firebase-messaging-sw.js` to git!**
- This file is listed in `.gitignore`
- Only commit the template file
- Credentials are injected at build time from environment variables
