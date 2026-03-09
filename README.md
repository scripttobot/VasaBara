# BashVara (বাসভাড়া)

A mobile application for Bangladesh's rental property market built with React Native and Expo. BashVara connects tenants (ভাড়াটিয়া) with property owners (বাড়িওয়ালা) through a modern, feature-rich platform.

## Features

- **Role-based Access**: Separate interfaces for tenants and property owners
- **Property Listings**: Browse, search, and filter rental properties across Bangladesh
- **Real-time Chat**: FB Messenger-style messaging with edit/delete support
- **In-App Notifications**: Real-time notifications for messages, new properties, and KYC updates
- **KYC Verification**: Owner identity verification system
- **Advanced Search**: Filter by location (Division > District > Upazila), rent range, bedrooms, and more
- **Save Properties**: Bookmark favorite listings for later
- **Dark Mode**: Toggle between light and dark themes
- **Bilingual Support**: Bengali and English language toggle
- **Google Sign-In**: Cross-platform Google authentication
- **Admin Panel**: Hidden admin interface for platform management

## Tech Stack

- **Frontend**: React Native with Expo SDK 54
- **Routing**: Expo Router (file-based routing)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context + Firebase real-time listeners
- **UI**: Custom components with Inter font family
- **Icons**: @expo/vector-icons (Ionicons)

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your device (for testing)
- Firebase project with Firestore, Authentication, and Storage enabled

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bashvara.git
   cd bashvara
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**

   Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
   ```

4. **Set up Firebase**
   - Enable Email/Password and Google Sign-In in Firebase Authentication
   - Create a Firestore database with the following collections: `users`, `properties`, `chats`, `notifications`
   - Set Firestore security rules as needed
   - Enable Firebase Storage for property images

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `w` to open in web browser

## Project Structure

```
app/                    # Expo Router screens
├── (auth)/             # Authentication screens (login, register)
├── (client)/           # Tenant tab screens (home, chat, saved, profile)
├── (owner)/            # Owner tab screens (dashboard, add property, properties, profile)
├── (admin)/            # Admin panel screens
├── chat/[id].tsx       # Chat conversation screen
├── property/[id].tsx   # Property detail screen
├── notifications.tsx   # Notifications list
└── ...                 # Settings screens (privacy, terms, help, about)

components/             # Reusable UI components
constants/              # Colors, types, location data
lib/                    # Firebase config, app context, theme, i18n
assets/                 # Images, icons, fonts
```

## Firebase Collections

| Collection | Description |
|------------|-------------|
| `users` | User profiles (name, email, role, KYC status) |
| `properties` | Property listings (title, rent, location, images) |
| `chats` | Chat threads between users |
| `chats/{id}/messages` | Messages within a chat thread |
| `notifications` | In-app notifications |
| `users/{id}/savedProperties` | User's saved/bookmarked properties |

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android (APK)
eas build --platform android --profile preview

# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#0A8F7F` | Main brand color (teal) |
| Secondary | `#F26B3A` | Accent color (coral) |
| Accent | `#FFB800` | Highlights (yellow) |
| Background | `#F7F8FA` | Screen backgrounds |

## License

This project is proprietary. All rights reserved.
