# BashVara - বাসভাড়া To-Let App

## Overview
A hybrid mobile app (React Native / Expo) for finding rental properties in Bangladesh. Connects tenants (ভাড়াটিয়া) with property owners (বাড়িওয়ালা) directly.

## Tech Stack
- **Frontend**: React Native with Expo Router (file-based routing)
- **Backend**: Express.js with TypeScript (landing page + API)
- **Database**: Firebase Firestore (real-time NoSQL)
- **Auth**: Firebase Authentication (Email/Password + Google Sign-In)
- **Storage**: Firebase Storage (property images)
- **State Management**: React Context + Firebase real-time listeners
- **Theme**: ThemeProvider (dark mode) + LanguageProvider (Bengali/English i18n)
- **UI**: Custom components with Inter font family
- **Icons**: @expo/vector-icons (Ionicons)

## Firebase Configuration
- **Project**: vasabara-9fc81
- **Services Used**: Auth, Firestore, Storage
- **Collections**: `users`, `properties`, `chats`, `notifications`
- **Subcollections**: `users/{uid}/savedProperties`, `chats/{chatId}/messages`
- **Auth Methods**: Email/Password, Google Sign-In (web + native via expo-auth-session)
- **Environment Variables**: All prefixed with `EXPO_PUBLIC_FIREBASE_*`, plus `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
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
  _layout.tsx              # Root layout (Stack navigator, providers: Theme, Language, App)
  index.tsx                # Welcome/Onboarding screen
  search.tsx               # Advanced search with filters
  edit-profile.tsx         # Edit user profile (shared by client/owner)
  edit-property.tsx        # Edit property details (owners)
  property/[id].tsx        # Property detail screen with image gallery
  chat/[id].tsx            # Chat screen (FB Messenger-style delete/edit)
  notifications.tsx        # Notification list screen with real-time updates
  notification-settings.tsx # Notification toggle preferences
  privacy.tsx              # Privacy policy screen
  help-center.tsx          # Help center with FAQ accordions
  terms.tsx                # Terms & conditions screen
  about.tsx                # About app screen
  (auth)/
    _layout.tsx            # Auth stack layout
    login.tsx              # Login screen (with secret admin check)
    register-client.tsx    # Client registration (Firebase Auth)
    register-owner.tsx     # Owner registration (Firebase Auth)
  (client)/
    _layout.tsx            # Client tab layout (Home, Chat, Saved, Profile)
    index.tsx              # Client home/dashboard with notification bell badge
    chat.tsx               # Chat inbox with navigation to chat/[id]
    saved.tsx              # Saved properties
    profile.tsx            # Client profile (dark mode toggle, language switch, all settings)
  (owner)/
    _layout.tsx            # Owner tab layout (Dashboard, Add, Properties, Profile)
    index.tsx              # Owner dashboard with notification bell badge
    add-property.tsx       # Multi-step add property form
    my-properties.tsx      # Owner's property list with edit/delete/toggle
    owner-profile.tsx      # Owner profile & settings
  (admin)/
    _layout.tsx            # Admin tab layout (Dashboard, Users, Properties, Settings)
    index.tsx              # Admin dashboard with quick actions
    users.tsx              # User management with KYC verify + notifications
    properties.tsx         # Property moderation (approve/reject/feature/delete)
    settings.tsx           # Admin settings

constants/
  colors.ts                # Theme colors
  locations.ts             # Bangladesh divisions/districts/upazilas data
  types.ts                 # TypeScript interfaces (User, Property, ChatMessage, AppNotification)

lib/
  app-context.tsx           # Global app state (Auth + Firestore listeners + notifications)
  firebase.ts               # Firebase initialization (Auth, Firestore, Storage)
  query-client.ts           # React Query setup
  theme-context.tsx         # Dark mode provider (AsyncStorage persisted)
  language-context.tsx      # Bengali/English i18n provider (AsyncStorage persisted)

components/
  ErrorBoundary.tsx         # Error boundary wrapper
  ErrorFallback.tsx         # Error fallback UI
  GoogleSignInButton.tsx    # Cross-platform Google Sign-In button
  KeyboardAwareScrollViewCompat.tsx  # Keyboard handling

server/
  index.ts                 # Express server (landing page + 24h cleanup scheduler)
  routes.ts                # API routes (includes cleanup-old-messages endpoint)
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
- Firebase Auth with email/password + Google Sign-In (web + native)
- Graceful fallback when Firestore permissions fail
- Firestore real-time property, chat & notification listings
- 4-level location selector (Division > District > Upazila)
- Property details with image gallery and contact options (Call, Message, WhatsApp)
- Save/favorite properties (Firestore subcollection)
- **Enhanced Chat System**: FB Messenger-style delete/edit messages, long-press action modal, "delete for me" / "delete for everyone", edit with label, delete all messages in thread
- **7-Day Auto-Delete**: Backend scheduler cleans up messages older than 7 days every 24 hours
- **In-App Notifications**: Real-time Firestore listener, notification types (message, new_property, kyc_approved, kyc_declined, system), bell badge with unread count
- **KYC Notifications**: Admin KYC approve/decline creates notifications for owners
- **New Property Notifications**: Adding a property notifies all clients
- **Dark Mode**: Theme toggle with AsyncStorage persistence, applied to profile screen
- **Language Toggle**: Bengali/English switch with translation system, applied to profile screen
- **Settings Screens**: Notification settings, privacy policy, help center (FAQ), terms & conditions, about app — all fully functional
- Edit profile screen (name, phone, whatsapp, gender, occupation, division, NID)
- Edit property screen (title, description, address, rent, deposit, area, bedrooms, bathrooms)
- Multi-step property add form for owners
- Owner dashboard with real stats (properties, views, messages, active count)
- Secret admin panel with user search, property delete, all settings functional
- No demo/sample data - fully production-ready with Firestore

### App Context Functions
- `login`, `register`, `logout`, `googleLogin`
- `updateUser(updates)` - Update user profile in Firestore
- `updateProperty(id, updates)` - Update property in Firestore
- `addProperty(data)` - Add new property + notify all clients
- `deleteProperty(id)` - Delete property from Firestore
- `togglePropertyAvailability(id)` - Toggle property active/paused
- `toggleSaveProperty(id)` - Save/unsave property
- `createChatThread(recipientId, name, propertyId, title)` - Create or find chat thread
- `sendMessage(chatId, text)` - Send message + create notification for receiver
- `getChatMessages(chatId)` - Get messages for a chat
- `deleteMessage(chatId, messageId, forEveryone)` - Delete message (for me or everyone)
- `editMessage(chatId, messageId, newText)` - Edit a sent message
- `deleteAllChatMessages(chatId)` - Delete all messages in a thread
- `notifications` - Real-time notification list
- `unreadNotificationCount` - Computed unread count
- `markNotificationRead(id)` - Mark single notification as read
- `markAllNotificationsRead()` - Mark all notifications as read
- `createNotification(userId, type, title, body, data?)` - Create a notification
- `getFilteredProperties()` - Get properties matching search filters
- `getOwnerProperties()` - Get current owner's properties
