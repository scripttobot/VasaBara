# BashVara - বাসভাড়া To-Let App

## Overview
A hybrid mobile app (React Native / Expo) for finding rental properties in Bangladesh. Connects tenants (ভাড়াটিয়া) with property owners (বাড়িওয়ালা) directly.

## Tech Stack
- **Frontend**: React Native with Expo Router (file-based routing)
- **Backend**: Express.js with TypeScript
- **State Management**: React Context + AsyncStorage
- **UI**: Custom components with Inter font family
- **Icons**: @expo/vector-icons (Ionicons)

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
    login.tsx              # Login screen
    register-client.tsx    # Client registration
    register-owner.tsx     # Owner registration
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

constants/
  colors.ts                # Theme colors
  locations.ts             # Bangladesh divisions/districts/upazilas data
  types.ts                 # TypeScript interfaces
  mock-data.ts             # Sample property data

lib/
  app-context.tsx           # Global app state (user, properties, saved)
  query-client.ts           # React Query setup

components/
  ErrorBoundary.tsx         # Error boundary wrapper
  ErrorFallback.tsx         # Error fallback UI
  KeyboardAwareScrollViewCompat.tsx  # Keyboard handling

server/
  index.ts                 # Express server
  routes.ts                # API routes
  storage.ts               # Data storage layer
```

### Color Palette
- Primary: #0A8F7F (Teal)
- Secondary: #F26B3A (Orange)
- Accent: #FFB800 (Yellow)
- Background: #F7F8FA
- Text Primary: #1A202C

### Key Features (MVP)
- Role-based access (Client / Owner)
- Property listing with search & filters
- 4-level location selector (Division > District > Upazila)
- Property details with contact options (Call, WhatsApp)
- Save/favorite properties
- Chat inbox (UI ready)
- Multi-step property add form for owners
- Owner dashboard with stats
- Profile & settings

### User Preferences
- App language: Bangla (বাংলা) primary, English secondary
- Target users: Bangladesh rental market
