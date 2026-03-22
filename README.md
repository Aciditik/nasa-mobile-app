# 🌌 NASA Explorer - React Native Mobile App

A comprehensive React Native mobile application built with Expo that integrates with NASA's API to provide astronomy enthusiasts with daily space content, favorites management, notes, and push notifications.

## 🚀 Features

### ✅ Complete CRUD Operations
- **Create**: Add notes for astronomy pictures
- **Read**: View NASA's Astronomy Picture of the Day (APOD) and history
- **Update**: Edit existing notes
- **Delete**: Remove favorites and notes

### 🔐 Authentication
- User registration and login
- Protected routes with authentication context
- Persistent session management using AsyncStorage

### 🌐 API Integration
- NASA APOD (Astronomy Picture of the Day)
- 30-day APOD history
- Near Earth Objects data
- Mars Rover photos
- API Key: `e7nSseioMhSlSXqS9d8heEwRstERuW3K2ALxwhrs`

### 💾 Local Data Storage
- AsyncStorage for offline data persistence
- Favorites management
- Notes with timestamps
- User session data

### 🔔 Push Notifications (Native Functionality)
- Daily APOD notifications at 9:00 AM
- Test notification feature
- Push token registration
- Notification permissions handling

### 🧭 Navigation
- Tab-based navigation (Home, Favorites, Explore, Profile)
- Stack navigation for detailed views
- Protected routes with authentication guards

## 📱 Screens

1. **Authentication**
   - Login Screen
   - Registration Screen

2. **Main Tabs**
   - **Home**: Daily APOD with favorite toggle
   - **Favorites**: Saved astronomy pictures with delete functionality
   - **Explore**: NASA data exploration
   - **Profile**: User settings, notifications, and data management

3. **Additional Screens**
   - APOD History (30 days)
   - APOD Detail View
   - Notes Management (per APOD)

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Notifications**: expo-notifications
- **UI Components**: React Native core components
- **Icons**: @expo/vector-icons (Ionicons)

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 🏗️ Project Structure

```
bg-mobile-app/
├── app/
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home (APOD viewer)
│   │   ├── favorites.tsx    # Favorites list
│   │   ├── explore.tsx      # Explore NASA data
│   │   └── profile.tsx      # User profile & settings
│   ├── auth/                # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── apod/                # APOD related screens
│   │   ├── history.tsx
│   │   └── detail/[date].tsx
│   ├── notes/               # Notes management
│   │   └── [date].tsx
│   └── _layout.tsx          # Root layout with providers
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   └── FavoritesContext.tsx # Favorites management
├── services/                # API and storage services
│   ├── api.service.ts       # NASA API integration
│   ├── storage.service.ts   # AsyncStorage wrapper
│   └── notification.service.ts # Push notifications
├── components/              # Reusable UI components
└── constants/               # App constants and themes
```

## 🔑 Key Features Implementation

### CRUD Operations
- **Notes**: Full CRUD on notes associated with APOD entries
- **Favorites**: Add/remove favorites with persistent storage
- **User Data**: Create/update/delete user session data

### API Calls
- NASA APOD endpoint integration
- Error handling and loading states
- Date-based queries for historical data

### Data Storage
- AsyncStorage for offline-first approach
- Favorites persistence
- Notes with creation/update timestamps
- Authentication tokens

### Authentication
- Mock authentication system (easily replaceable with real backend)
- Protected route navigation
- Session persistence
- Logout functionality

### Push Notifications
- Permission requests (iOS & Android)
- Daily scheduled notifications
- Immediate test notifications
- Push token management

## 🎨 Design

- **Color Scheme**: NASA-inspired (NASA Blue: #0B3D91, NASA Red: #FC3D21)
- **UI/UX**: Clean, modern interface with intuitive navigation
- **Responsive**: Adapts to different screen sizes
- **Dark Mode**: Automatic theme support

## 📝 Usage

1. **First Launch**: Register a new account
2. **Home Screen**: View today's APOD, add to favorites
3. **Favorites**: Manage your saved astronomy pictures
4. **Notes**: Add personal notes to any APOD
5. **History**: Browse past 30 days of APODs
6. **Profile**: Configure notifications, manage data

## 🔔 Notifications Setup

The app requests notification permissions on first launch. Enable them to receive:
- Daily APOD notifications at 9:00 AM
- Custom notifications for special events

## 🚀 Building for Production

```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

## 📄 License

This project is built for educational purposes using NASA's public API.

## 🌟 Credits

- **NASA API**: https://api.nasa.gov/
- **Expo**: https://expo.dev/
- **React Native**: https://reactnative.dev/
