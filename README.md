# NASA Explorer - Mobile Application

> A cross-platform mobile application exploring the universe through NASA's public APIs, featuring authentication, CRUD operations, and native notifications.

**Built with React Native + Expo | Node.js Backend | TypeScript**

## Features

### Authentication System

- ✅ User registration with email/password
- ✅ Secure login with JWT tokens
- ✅ Session persistence (AsyncStorage)
- ✅ Protected routes and logout
- ✅ Backend: Node.js + Express + SQLite

### Complete CRUD Operations

- ✅ **Create**: Add favorites and notes
- ✅ **Read**: Browse APOD, favorites, and notes
- ✅ **Update**: Edit existing notes
- ✅ **Delete**: Remove favorites and notes
- ✅ All data persisted to backend database

### NASA API Integration

- ✅ **APOD** (Astronomy Picture of the Day)
- ✅ **Near Earth Objects** (NEO) tracking
- ✅ **James Webb Space Telescope** images
- ✅ Real-time data fetching with loading states
- ✅ Error handling and retry mechanisms

### Native Functionality: Push Notifications

- ✅ Local notifications (expo-notifications)
- ✅ Permission requests (iOS & Android)
- ✅ Daily scheduled notifications at 9:00 AM
- ✅ Test notification feature
- ✅ Graceful handling of permission denial

### Navigation & Screens

- ✅ **5+ screens**: Auth, Home, Favorites, Explore, Profile, Notes, Detail
- ✅ Tab navigation (bottom tabs)
- ✅ Stack navigation (screen transitions)
- ✅ Protected routes (auth required)

### Data Persistence

- ✅ Backend database (SQLite)
- ✅ User-specific data (favorites, notes)
- ✅ JWT authentication tokens
- ✅ Offline-first architecture

## Screens

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

## Tech Stack

### Mobile App (Frontend)

| Technology              | Purpose                         |
| ----------------------- | ------------------------------- |
| **React Native + Expo** | Cross-platform mobile framework |
| **TypeScript**          | Type safety and better DX       |
| **Expo Router**         | File-based navigation           |
| **React Context**       | Global state management         |
| **Axios**               | HTTP client for API calls       |
| **expo-notifications**  | Native push notifications       |
| **AsyncStorage**        | Local token storage             |
| **Ionicons**            | Icon library                    |

### Backend (API Server)

| Technology                  | Purpose               |
| --------------------------- | --------------------- |
| **Node.js + Express**       | REST API server       |
| **SQLite (better-sqlite3)** | Embedded database     |
| **JWT (jsonwebtoken)**      | Secure authentication |
| **bcryptjs**                | Password hashing      |
| **CORS**                    | Cross-origin requests |
| **dotenv**                  | Environment variables |

---

## Why React Native? (Not Flutter)

### Technical Justification

| Criteria           | React Native ✅                                 | Flutter                      |
| ------------------ | ----------------------------------------------- | ---------------------------- |
| **Language**       | JavaScript/TypeScript (web skills transferable) | Dart (new language to learn) |
| **Ecosystem**      | Massive npm ecosystem, reuse web libraries      | Smaller package ecosystem    |
| **Community**      | Larger community, more resources                | Growing but smaller          |
| **Hot Reload**     | ✅ Fast Refresh                                 | ✅ Hot Reload                |
| **Native APIs**    | Expo provides easy access                       | Requires platform channels   |
| **Learning Curve** | Lower (if you know React)                       | Steeper (new paradigm)       |
| **Job Market**     | More React Native jobs                          | Growing Flutter demand       |
| **Code Sharing**   | Share with React web apps                       | Limited web support          |

### Why I Chose React Native for This Project:

1. **JavaScript Expertise**: Leverage existing JS/TS knowledge
2. **Expo Ecosystem**:
   - `expo-notifications` for native features (no native code needed)
   - `expo-router` for file-based routing (like Next.js)
   - Instant preview with Expo Go
3. **npm Packages**: Access to millions of packages (axios, date-fns, etc.)
4. **Web Compatibility**: Same React skills work on web
5. **Faster Development**: Hot reload + familiar React patterns
6. **Industry Standard**: More companies use React Native (Meta, Microsoft, Shopify)

### When Flutter Might Be Better:

- Complex animations and custom UI
- Performance-critical apps (games)
- Teams already using Dart
- Apps needing pixel-perfect design control

**For this project**: React Native + Expo was the optimal choice for rapid development with native features.

---

## APIs Used

### 1. NASA API (Public)

**Base URL**: `https://api.nasa.gov`

#### Endpoints Used:

**APOD (Astronomy Picture of the Day)**

```
GET /planetary/apod?api_key=KEY&date=YYYY-MM-DD
```

- Returns daily astronomy image with title, explanation, and metadata
- Used in: Home screen, Detail screen, Favorites

**APOD Range**

```
GET /planetary/apod?api_key=KEY&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```

- Returns array of APODs for date range
- Used in: Home screen (last 6 days)

**Near Earth Objects (NEO)**

```
GET /neo/rest/v1/feed?api_key=KEY&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```

- Returns asteroids approaching Earth
- Used in: Explore tab

### 2. JWST API (James Webb Space Telescope)

**Base URL**: `https://api.jwstapi.com`

#### Endpoint Used:

**Get JWST Images**

```
GET /all/type/jpg?page=1&perPage=20
```

- Returns James Webb telescope images
- Used in: Explore tab (JWST section)

### 3. Custom Backend API

**Authentication**: JWT Bearer token

#### Endpoints:

**Authentication**

```
POST /auth/register - Create account
POST /auth/login    - Login user
POST /auth/logout   - Logout user
```

**Favorites**

```
GET    /favorites           - Get user's favorites
POST   /favorites           - Add favorite
DELETE /favorites/:date     - Remove favorite
GET    /favorites/check/:date - Check if favorited
```

**Notes**

```
GET    /notes/:date         - Get notes for APOD
POST   /notes               - Create note
PUT    /notes/:id           - Update note
DELETE /notes/:id           - Delete note
```

## Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo Go app (for physical device testing)
- Android Studio / Xcode (for emulator, optional)

---

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd nasa-mobile-app
```

---

### Step 2: Backend Setup (REQUIRED)

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2.2 Create `.env` File

Create `backend/.env` with:

```env
PORT=3000
JWT_SECRET=nasa_explorer_secret_key_change_in_production_2024
NODE_ENV=development
```

**What these do:**

- `PORT`: Server port (default 3000)
- `JWT_SECRET`: Secret key for signing authentication tokens
- `NODE_ENV`: Environment mode (development/production)

#### 2.3 Start the Backend Server

```bash
npm start
```

Server running at: `http://localhost:3000`

**Keep this terminal open** — the backend must run while using the app.

**Detailed backend guide**: See [BACKEND_SETUP.md](BACKEND_SETUP.md)

---

### Step 3: Mobile App Setup

#### 3.1 Install Mobile Dependencies

```bash
# Go back to root directory
cd ..
npm install
```

#### 3.2 Configure Backend URL

Edit `services/backend.service.ts` line 4:

```typescript
// Choose based on your setup:

// For Android Emulator:
const API_URL = "http://10.0.2.2:3000/api";

// For iOS Simulator:
const API_URL = "http://localhost:3000/api";

// For Physical Device (find your IP with ipconfig/ifconfig):
const API_URL = "http://192.168.1.XXX:3000/api";
```

**How to find your IP:**

- Windows: `ipconfig` → look for IPv4 Address
- Mac/Linux: `ifconfig` → look for inet address

#### 3.3 Start the Mobile App

```bash
npx expo start
```

#### 3.4 Run on Device/Emulator

**Option A: Physical Device (Recommended)**

1. Install **Expo Go** from App Store/Play Store
2. Scan the QR code from terminal
3. App will load on your device

**Option B: Emulator**

- Press `a` for Android emulator
- Press `i` for iOS simulator

**Option C: Web (Limited)**

- Press `w` for web browser (some features won't work)

---

### Step 4: Create an Account

1. App opens → Tap **"Sign Up"**
2. Enter name, email, password
3. Tap **"Register"**
4. You're logged in!

---

### Troubleshooting

**Backend not connecting:**

- ✅ Backend server is running (`npm start` in backend/)
- ✅ Correct IP address in `backend.service.ts`
- ✅ Phone and computer on same WiFi network

**App won't load:**

```bash
# Clear cache and restart
npx expo start -c
```

**Database errors:**

```bash
# Delete and recreate database
cd backend
rm nasa_app.db
npm start  # Will recreate automatically
```

---

## Screenshots

**Note**: Add screenshots to `screenshots/` 

## Demo Video

**Full application demonstration**: [`video/Screen record.mov`]
