# BashVara - বাসভাড়া To-Let App

## Overview
A hybrid mobile app (React Native / Expo) for finding rental properties in Bangladesh. Connects tenants (ভাড়াটিয়া) with property owners (বাড়িওয়ালা) directly.

## Tech Stack
- **Frontend**: React Native with Expo Router (file-based routing)
- **Backend**: Express.js with TypeScript (landing page + minimal API)
- **Database**: Firebase Firestore (real-time NoSQL)
- **Auth**: Firebase Authentication (Email/Password)
- **Storage**: Firebase Storage (property images)
- **State Management**: React Context + Firebase real-time listeners
- **UI**: Custom components with Inter font family
- **Icons**: @expo/vector-icons (Ionicons)

## Firebase Configuration
- **Project**: vasabara-9fc81
- **Services Used**: Auth, Firestore, Storage
- **Collections**: `users`, `properties`, `chats`
- **Subcollections**: `users/{uid}/savedProperties`, `chats/{chatId}/messages`
- **Auth Methods**: Email/Password, Google Sign-In (web only)
- **Environment Variables**: All prefixed with `EXPO_PUBLIC_FIREBASE_*`
- **Important**: Firestore rules must allow read/write; Replit domain must be added to Firebase Auth authorized domains

## Three User Roles
1. **Client (ভাড়াটিয়া)**: Search, browse, save properties, chat with owners
2. **Owner (বাড়িওয়ালা)**: List, edit, manage rental properties, view dashboard stats
3. **Admin (গোপন)**: Secret admin panel accessible via special credentials
   - Username: `admin`, Password: `*#*#noraxlab#*#*`
   - In-app admin panel with Dashboard, User Management, Property Management, Settings

## Project Architecture

### File Structure
```
app/
  _layout.tsx              # Root layout (Stack navigator, providers)
  index.tsx                # Welcome/Onboarding screen
  search.tsx               # Advanced search with filters
  edit-profile.tsx         # Edit user profile (shared by client/owner)
  edit-property.tsx        # Edit property details (owners)
  property/[id].tsx        # Property detail screen with image gallery
  chat/[id].tsx            # Individual chat conversation screen
  (auth)/
    _layout.tsx            # Auth stack layout
    login.tsx              # Login screen (with secret admin check)
    register-client.tsx    # Client registration (Firebase Auth)
    register-owner.tsx     # Owner registration (Firebase Auth)
  (client)/
    _layout.tsx            # Client tab layout (Home, Chat, Saved, Profile)
    index.tsx              # Client home/dashboard with property cards
    chat.tsx               # Chat inbox with navigation to chat/[id]
    saved.tsx              # Saved properties
    profile.tsx            # Client profile & settings (all menu items wired)
  (owner)/
    _layout.tsx            # Owner tab layout (Dashboard, Add, Properties, Profile)
    index.tsx              # Owner dashboard with real stats & quick actions
    add-property.tsx       # Multi-step add property form
    my-properties.tsx      # Owner's property list with edit/delete/toggle
    owner-profile.tsx      # Owner profile & settings (all menu items wired)
  (admin)/
    _layout.tsx            # Admin tab layout (Dashboard, Users, Properties, Settings)
    index.tsx              # Admin dashboard with quick actions
    users.tsx              # User management with search (KYC verify)
    properties.tsx         # Property moderation (approve/reject/feature/delete)
    settings.tsx           # Admin settings (all functional)

constants/
  colors.ts                # Theme colors
  locations.ts             # Bangladesh divisions/districts/upazilas data
  types.ts                 # TypeScript interfaces

lib/
  app-context.tsx           # Global app state (Firebase Auth + Firestore listeners)
  firebase.ts               # Firebase initialization (Auth, Firestore, Storage)
  query-client.ts           # React Query setup

components/
  ErrorBoundary.tsx         # Error boundary wrapper
  ErrorFallback.tsx         # Error fallback UI
  KeyboardAwareScrollViewCompat.tsx  # Keyboard handling

server/
  index.ts                 # Express server (landing page)
  routes.ts                # API routes
  storage.ts               # Legacy storage layer
```

### Color Palette
- Primary: #0A8F7F (Teal)
- Secondary: #F26B3A (Orange)
- Accent: #FFB800 (Yellow)
- Admin Accent: #6C5CE7 (Purple)
- Background: #F7F8FA
- Text Primary: #1A202C

### Key Features
- Role-based access (Client / Owner / Admin)
- Firebase Auth with email/password + Google Sign-In (web)
- Graceful fallback when Firestore permissions fail
- Firestore real-time property & chat listings
- 4-level location selector (Division > District > Upazila)
- Property details with image gallery and contact options (Call, Message, WhatsApp)
- Save/favorite properties (Firestore subcollection)
- Real-time chat system (create threads, send messages, Firestore subcollections)
- Edit profile screen (name, phone, whatsapp, gender, occupation, division, NID)
- Edit property screen (title, description, address, rent, deposit, area, bedrooms, bathrooms)
- Multi-step property add form for owners
- Owner dashboard with real stats (properties, views, messages, active count)
- Owner quick actions navigate to correct tabs
- Client profile with real saved count and all settings working
- Owner profile with all settings working
- Secret admin panel with user search, property delete, all settings functional
- Property image display in cards and detail gallery
- No demo/sample data - fully production-ready with Firestore

### App Context Functions
- `login`, `register`, `logout`, `googleLogin`
- `updateUser(updates)` - Update user profile in Firestore
- `updateProperty(id, updates)` - Update property in Firestore
- `addProperty(data)` - Add new property to Firestore
- `deleteProperty(id)` - Delete property from Firestore
- `togglePropertyAvailability(id)` - Toggle property active/paused
- `toggleSaveProperty(id)` - Save/unsave property
- `createChatThread(recipientId, name, propertyId, title)` - Create or find chat thread
- `sendMessage(chatId, text)` - Send message in chat
- `getChatMessages(chatId)` - Get messages for a chat
- `getFilteredProperties()` - Get properties matching search filters
- `getOwnerProperties()` - Get current owner's properties
