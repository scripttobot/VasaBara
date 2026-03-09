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
- **Subcollections**: `users/{uid}/savedProperties`
- **Auth Methods**: Email/Password, Google Sign-In (web only)
- **Environment Variables**: All prefixed with `EXPO_PUBLIC_FIREBASE_*`
- **Important**: Firestore rules must allow read/write; Replit domain must be added to Firebase Auth authorized domains

## Three User Roles
1. **Client (ভাড়াটিয়া)**: Search and browse rental properties
2. **Owner (বাড়িওয়ালা)**: List and manage rental properties
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
  property/[id].tsx        # Property detail screen
  (auth)/
    _layout.tsx            # Auth stack layout
    login.tsx              # Login screen (with secret admin check)
    register-client.tsx    # Client registration (Firebase Auth)
    register-owner.tsx     # Owner registration (Firebase Auth)
  (client)/
    _layout.tsx            # Client tab layout (Home, Chat, Saved, Profile)
    index.tsx              # Client home/dashboard
    chat.tsx               # Chat inbox
    saved.tsx              # Saved properties
    profile.tsx            # Client profile & settings
  (owner)/
    _layout.tsx            # Owner tab layout (Dashboard, Add, Properties, Profile)
    index.tsx              # Owner dashboard
    add-property.tsx       # Multi-step add property form
    my-properties.tsx      # Owner's property list
    owner-profile.tsx      # Owner profile & settings
  (admin)/
    _layout.tsx            # Admin tab layout (Dashboard, Users, Properties, Settings)
    index.tsx              # Admin dashboard with stats
    users.tsx              # User management (KYC verify, view)
    properties.tsx         # Property moderation (approve/reject/feature)
    settings.tsx           # Admin settings & logout

constants/
  colors.ts                # Theme colors
  locations.ts             # Bangladesh divisions/districts/upazilas data
  types.ts                 # TypeScript interfaces (UserRole includes 'admin')
  mock-data.ts             # Sample property data (used for Firestore seeding)

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
- Firestore real-time property listings
- 4-level location selector (Division > District > Upazila)
- Property details with contact options (Call, WhatsApp)
- Save/favorite properties (Firestore subcollection)
- Chat inbox (Firestore real-time)
- Multi-step property add form for owners
- Owner dashboard with stats
- Secret admin panel with user/property management
- Auto-seed sample data to Firestore on first load
