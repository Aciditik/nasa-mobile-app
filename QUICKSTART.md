# 🚀 Quick Start Guide

## Prerequisites
- Node.js installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Expo Go app on your mobile device (or Android/iOS emulator)

## Running the App

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open on your device**
   - Scan the QR code with Expo Go (Android) or Camera (iOS)
   - Or press `a` for Android emulator / `i` for iOS simulator

## First Time Setup

1. **Register an Account**
   - Open the app and you'll see the login screen
   - Tap "Don't have an account? Register"
   - Fill in your details (any email/password works - it's a mock auth system)

2. **Explore the App**
   - **Home Tab**: View today's Astronomy Picture of the Day
   - **Favorites Tab**: See your saved pictures
   - **Explore Tab**: Browse NASA data
   - **Profile Tab**: Manage settings and notifications

## Key Features to Try

### ✅ CRUD Operations
- **Create**: Add notes to any APOD by tapping "Notes" button
- **Read**: View APOD details and history
- **Update**: Edit existing notes
- **Delete**: Remove favorites or notes

### 🔔 Notifications
1. Go to Profile tab
2. Enable "Daily APOD Notifications"
3. Tap "Send Test Notification" to test immediately

### ⭐ Favorites
1. On Home screen, tap the heart icon to add to favorites
2. View all favorites in the Favorites tab
3. Swipe or tap trash icon to remove

### 📝 Notes
1. From any APOD, tap "Notes" button
2. Add, edit, or delete notes specific to that picture
3. Notes are saved locally with AsyncStorage

### 📅 History
1. From Home screen, tap "History" button
2. Browse the last 30 days of APODs
3. Tap any item to view details

## Troubleshooting

**App won't start?**
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Notifications not working?**
- Ensure you've granted notification permissions
- Notifications work best on physical devices
- For iOS simulator, notifications have limitations

**API errors?**
- Check your internet connection
- NASA API has rate limits (1000 requests/hour)
- The API key is already configured in the app

## Project Structure Overview

```
services/
├── api.service.ts          # NASA API integration
├── storage.service.ts      # Local data persistence
└── notification.service.ts # Push notifications

contexts/
├── AuthContext.tsx         # Authentication state
└── FavoritesContext.tsx    # Favorites management

app/
├── (tabs)/                 # Main navigation tabs
├── auth/                   # Login & Register
├── apod/                   # APOD history & details
└── notes/                  # Notes CRUD
```

## NASA API Endpoints Used

- **APOD**: `https://api.nasa.gov/planetary/apod`
- **Near Earth Objects**: `https://api.nasa.gov/neo/rest/v1/feed`
- **Mars Rover Photos**: `https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/photos`

## Development Tips

- Hot reload is enabled - changes appear instantly
- Check console for errors: Shake device → "Debug Remote JS"
- Use React DevTools for debugging
- AsyncStorage data persists between app restarts

Enjoy exploring the universe! 🌌
