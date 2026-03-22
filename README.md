# NASA Explorer - Mobile Application

> A cross-platform mobile application exploring the universe through NASA's public APIs, featuring authentication, CRUD operations, and native notifications.

**Built with React Native + Expo | Node.js Backend | TypeScript**

## Features

### Authentication System
### Complete CRUD Operations
### NASA API Integration
### Native Functionality: Push Notifications
### Navigation & Screens
### Data Persistence

## Screenshots
**Note**: Add screenshots to `screenshots/` 

## Demo Video
**Full application demonstration**: [`video/Screen record.mov`]

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

**For this project**: React Native + Expo was the optimal choice for rapid development with native features.

---

## APIs Used

### 1. NASA API (Public)
**Base URL**: `https://api.nasa.gov`

### 2. JWST API (James Webb Space Telescope)
**Base URL**: `https://api.jwstapi.com`

### 3. Custom Backend API

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

#### 3.3 Start the Mobile App

```bash
npx expo start
```
