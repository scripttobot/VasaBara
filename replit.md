# BashVara (বাসভাড়া) - Rental Property App

## Overview

BashVara is a mobile application for Bangladesh's rental property market built with React Native and Expo SDK 54. The app connects tenants (ভাড়াটিয়া) with property owners (বাড়িওয়ালা) through a role-based interface with three distinct user types: clients (tenants), owners (landlords), and admins.

Key features include property listings with advanced search/filter, real-time Firebase-powered chat, KYC verification for owners, saved properties bookmarking, dark mode, bilingual support (Bengali/English), and Google Sign-In.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React Native with Expo SDK 54, targeting iOS, Android, and Web
- **Routing**: Expo Router (file-based routing) with typed routes enabled
  - `app/index.tsx` — Welcome/landing screen with role selection
  - `app/(auth)/` — Authentication screens (login, register-client, register-owner)
  - `app/(client)/` — Tenant tab interface (home, chat, saved, profile)
  - `app/(owner)/` — Landlord tab interface (dashboard, add-property, my-properties, owner-profile)
  - `app/(admin)/` — Admin panel (dashboard, users, properties, settings)
  - `app/chat/[id].tsx` — Real-time individual chat screen
  - `app/property/[id].tsx` — Property detail screen
  - Standalone screens: search, edit-profile, edit-property, notifications, notification-settings, privacy, terms, about, help-center
- **Navigation**: Tab-based navigation per role group; uses native tabs on iOS (via `expo-router/unstable-native-tabs`) with SF Symbols, falls back to classic Expo Router Tabs on Android/Web
- **UI**: Custom components with Inter font family, Ionicons for icons, linear gradients, blur effects, and animated entries via Reanimated
- **State Management**: React Context (`AppProvider`, `ThemeProvider`, `LanguageProvider`) combined with Firebase real-time listeners (`onSnapshot`). TanStack React Query is also configured but primarily used as a supplementary data-fetching layer
- **Platform Compatibility**: Platform-specific code branches handle iOS/Android/Web differences throughout (keyboard handling, tab bar styling, haptics guard)

### State & Context Design

- **AppProvider** (`lib/app-context.tsx`): Central context managing auth state, properties, saved properties, chat threads, notifications, and all Firebase CRUD operations
- **ThemeProvider** (`lib/theme-context.tsx`): Dark/light mode toggle, persisted via AsyncStorage
- **LanguageProvider** (`lib/language-context.tsx`): Bengali/English toggle with inline translation dictionary, persisted via AsyncStorage

### Backend Architecture

The app is **entirely serverless** — Firebase provides all backend functionality:
- **Firebase Authentication**: Email/password and Google OAuth sign-in
- **Firestore**: NoSQL document database for users, properties, chats, messages, notifications
- **Firebase Storage**: Property images and KYC document uploads
- Real-time listeners (`onSnapshot`) used for chat messages, user lists, and property updates

Firebase config is loaded from `EXPO_PUBLIC_*` environment variables defined in `.env`.

### Authentication & Authorization

- Role-based access: three roles — `client`, `owner`, `admin`
- Role is stored in the Firestore `users` collection and loaded on auth state change
- Admin access is gated by a hardcoded credential check (`admin` / `*#*#noraxlab#*#*`) at login
- Google Sign-In uses `expo-auth-session` with `GoogleAuthProvider.credential` passed to Firebase
- Auth persistence uses `getReactNativePersistence(AsyncStorage)` on mobile, `getAuth` on web
- Role-based routing enforced in `app/index.tsx` and each auth screen's `useEffect`

### Data Models

Defined in `constants/types.ts`:
- **User**: id, role, name, email, phone, whatsapp, profileImage, gender, occupation, location fields, nidNumber, kycVerified, createdAt
- **Property**: id, ownerId, title, type, images[], division/district/upazila/address, rent, deposit, serviceCharge, bedrooms, bathrooms, area, furnishing, genderPreference, amenity booleans (parking, gas, water, elevator, generator, security), negotiable, available, verified, featured, views, createdAt
- **ChatThread**: id, participantIds[], participantNames[], propertyId, propertyTitle, lastMessage, lastMessageTime, unreadCount
- **ChatMessage**: id, senderId, text, timestamp, edited flag
- **AppNotification**: id, type (message/new_property/kyc_approved/kyc_declined/system), read, createdAt

### Search & Filtering

Client-side filtering in `app/search.tsx` and `lib/app-context.tsx` using `useMemo`. Filter criteria: text query (title/address/upazila), property type, furnishing type, gender preference, min bedrooms, max rent.

### Location Data

Static hierarchical data in `constants/locations.ts`: Division → District → Upazila for all Bangladesh administrative regions. Used for property filtering and user profile location selection.

### Notification Preferences

Stored locally via AsyncStorage (`@bashvara_notification_prefs`). Notification types: messages, new_property, kyc_approved/declined, system.

## External Dependencies

| Dependency | Purpose |
|---|---|
| **Firebase** (`firebase` v12) | Auth, Firestore database, Cloud Storage — full backend |
| **expo-auth-session** + **expo-web-browser** | Google OAuth flow cross-platform |
| **@react-native-async-storage/async-storage** | Local persistence for theme, language, notification prefs |
| **@tanstack/react-query** | Data-fetching layer (configured with long stale time, no auto-refetch) |
| **expo-image-picker** | Property image uploads and KYC document capture |
| **expo-location** | Device location access |
| **expo-linear-gradient** | UI gradient backgrounds |
| **expo-blur** | Tab bar blur effect (iOS) |
| **expo-glass-effect** | Liquid glass tab bar on supported iOS versions |
| **expo-haptics** | Tactile feedback on native platforms |
| **react-native-reanimated** | Animated list entries and transitions |
| **react-native-gesture-handler** | Gesture support |
| **react-native-keyboard-controller** | Keyboard-aware scroll on native (falls back to ScrollView on web) |
| **@expo-google-fonts/inter** | Inter font family (400, 500, 600, 700) |
| **@expo/vector-icons** (Ionicons) | All app icons |
| **expo-router/unstable-native-tabs** | Native iOS tab bar with SF Symbols |

### Environment Variables Required

```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
```