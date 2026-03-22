# 📦 Installation Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional but recommended)
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your mobile device (for testing)

## Step-by-Step Installation

### 1. Clone or Navigate to Project

```bash
cd /home/mathieu/Desktop/MDS/DevMobile/bg-mobile-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native and Expo
- Navigation libraries
- AsyncStorage for data persistence
- Axios for API calls
- expo-notifications for push notifications
- expo-linear-gradient for the new UI
- And more...

### 3. Start the Development Server

```bash
npm start
```

Or use specific commands:

```bash
# Start with Android
npm run android

# Start with iOS
npm run ios

# Start web version
npm run web
```

### 4. Run on Device/Emulator

#### Option A: Physical Device
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal
3. App will load on your device

#### Option B: Emulator/Simulator
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)

## 🎨 New UI Installation

The app now features a modern dark-themed UI with card-based layouts. The required dependency `expo-linear-gradient` is already included in `package.json`.

If you encounter any issues with gradients:

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

## 🔑 API Configuration

The NASA API key is already configured in the app:
- **API Key**: `e7nSseioMhSlSXqS9d8heEwRstERuW3K2ALxwhrs`
- **Base URL**: `https://api.nasa.gov`

No additional configuration needed!

## 📱 Features to Test

After installation, try these features:

1. **Authentication**
   - Register a new account
   - Login with credentials
   - Session persistence

2. **Home Screen**
   - Horizontal scrolling cards
   - Pull to refresh
   - View different card styles

3. **Favorites**
   - Add items to favorites
   - View in grid layout
   - Remove favorites

4. **Notifications**
   - Enable daily notifications
   - Send test notification
   - Check notification permissions

5. **CRUD Operations**
   - Create notes for APODs
   - Edit existing notes
   - Delete notes
   - View APOD history

## 🐛 Common Issues

### Issue: "Cannot find module 'expo-linear-gradient'"
**Solution:**
```bash
npm install expo-linear-gradient
npx expo start -c
```

### Issue: Metro bundler errors
**Solution:**
```bash
# Clear watchman
watchman watch-del-all

# Clear metro cache
npx expo start -c

# Reset project
rm -rf node_modules
npm install
```

### Issue: Notifications not working
**Solution:**
- Ensure you're testing on a physical device
- Grant notification permissions when prompted
- iOS simulator has limited notification support

### Issue: API requests failing
**Solution:**
- Check internet connection
- Verify NASA API is accessible
- Check API rate limits (1000 requests/hour)

## 📂 Project Structure

```
bg-mobile-app/
├── app/                    # Screens and navigation
│   ├── (tabs)/            # Tab navigation
│   ├── auth/              # Authentication screens
│   ├── apod/              # APOD related screens
│   └── notes/             # Notes management
├── components/            # Reusable UI components
│   ├── NewsCard.tsx       # Card component
│   ├── ArticleCard.tsx    # Article card
│   └── StatCard.tsx       # Stats card
├── contexts/              # React Context providers
├── services/              # API and storage services
└── constants/             # App constants
```

## 🚀 Next Steps

1. Read the [UI_SETUP.md](./UI_SETUP.md) for UI customization
2. Check [QUICKSTART.md](./QUICKSTART.md) for usage guide
3. Review [README.md](./README.md) for full documentation

## 💡 Tips

- Use `npm start` and scan QR code for fastest development
- Enable Fast Refresh for instant updates
- Use React DevTools for debugging
- Check Expo documentation for advanced features

Happy coding! 🌌
