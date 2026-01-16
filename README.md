# T-mate 📚

<p align="center">
  <a href="https://expo.dev/accounts/johnplonteras/projects/T-mate/builds/339afba6-9c0c-4616-91f8-664d4bccd2b8">
    <img src="https://img.shields.io/badge/📱_Download_APK-Click_Here-00D084?style=for-the-badge&logo=android" alt="Download APK"/>
  </a>
</p>

> A Study Group Finder mobile application for Tagoloan Community College (TCC) students

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat&logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0.31-000020?style=flat&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase)

---

## 📖 Overview

**T-mate** is a mobile application that enables students to create, discover, and join study groups with built-in real-time chat functionality for collaborative learning. The app provides a seamless experience for organizing study sessions, sharing resources, and connecting with fellow students.

---

## ✨ Features

### 🔐 Authentication
- **Email & Password Sign Up** - Register with full name, email, and password
- **Email Verification** - Secure account activation via email
- **Login** - Session persistence (stay logged in)
- **Password Reset** - Forgot password functionality via email link
- **Secure Logout** - Complete session termination

### 👤 Profile Management
- View and edit personal profile (name, bio)
- Upload and change profile photo
- View other users' profiles

### 📚 Study Group Management
- **Create Groups** - Set subject, description, schedule, location, and capacity
- **Browse Groups** - Discover all available study groups
- **Join/Leave Groups** - One-tap functionality
- **Edit Groups** - Group admins can modify group details
- **Delete Groups** - Remove groups (admin only)
- **Member Management** - Admins can remove members

### 🔍 Search & Discovery
- Search groups by subject/course name
- Filter by schedule/time
- Filter by availability (open/full)

### 💬 Real-time Chat System
- **Group Messaging** - Real-time chat within each study group
- **Rich Text Formatting** - Bold, italic, strikethrough support
- **Emoji Support** - Built-in emoji picker
- **Image Sharing** - Upload from camera or gallery with preview
- **File Sharing** - Share study resources (PDF, DOC, PPT, XLS, etc.)
- **Media Viewer** - Full-screen image viewer
- **Link Detection** - Clickable URLs
- **User Mentions** - Tag other users with @

### 📅 Calendar Integration
- View upcoming meetings in calendar format
- Monthly calendar view with meeting highlights
- Add meetings to device calendar (Google Calendar, iOS Calendar)
- Quick navigation to groups from calendar

### 🏠 Dashboard
- Welcome message
- Quick access to Browse/My Groups
- Upcoming meetings widget
- Featured groups section

### 🚨 Report System
- Report inappropriate content or users
- Simple report form with reason selection

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native (Expo) |
| **Language** | TypeScript |
| **Navigation** | React Navigation (Stack + Bottom Tabs) |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Icons** | Lucide React Native, Expo Vector Icons |
| **Styling** | React Native StyleSheet |

---

## 📁 Project Structure

```
T-mate/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Buttons, inputs, cards, etc.
│   │   ├── chat/           # Chat-related components
│   │   ├── calendar/       # Calendar components
│   │   ├── groups/         # Group-related components
│   │   └── profile/        # Profile components
│   │
│   ├── screens/            # Screen components
│   │   ├── auth/           # Login, SignUp, PasswordReset
│   │   ├── groups/         # Browse, Create, Details, etc.
│   │   ├── chat/           # GroupChat, ImageViewer
│   │   ├── calendar/       # CalendarView
│   │   ├── main/           # Home screen
│   │   └── profile/        # Profile, EditProfile
│   │
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API and Supabase services
│   ├── types/              # TypeScript type definitions
│   ├── theme/              # Design system (colors, typography)
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts (Auth, etc.)
│   └── utils/              # Utility functions
│
├── lib/                    # Supabase client configuration
├── assets/                 # Images, icons, fonts
├── app.config.js           # Expo configuration
├── eas.json                # EAS Build configuration
└── package.json            # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** - `npm install -g expo-cli`
- **EAS CLI** (for builds) - `npm install -g eas-cli`
- **Android Studio** (for Android emulator) - [Download](https://developer.android.com/studio)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/T-mate.git
   cd T-mate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the database schema from `Study_Group_Finder_PRD_Android.md` (Section: SUPABASE SCHEMA)
   - Create storage buckets: `profile-photos`, `chat-images`, `chat-files`
   - Configure authentication settings (enable email provider)

### Running the App

**Development Mode (Expo Go)**
```bash
npm start
```
Then scan the QR code with the Expo Go app on your device.

**Android Emulator**
```bash
npm run android
```

**iOS Simulator** (macOS only)
```bash
npm run ios
```

---

## 📦 Building for Production

### Android APK (Preview)
```bash
npm run build:android
# or
eas build -p android --profile preview
```

### Android Production Build
```bash
npm run build:android:prod
# or
eas build -p android --profile production
```

> **Note:** You need to be logged into EAS CLI (`eas login`) and have a project configured.

---

## ⚙️ Configuration

### Expo Configuration (`app.config.js`)

| Property | Description |
|----------|-------------|
| `name` | App display name: "T-mate" |
| `slug` | URL-friendly identifier |
| `version` | Current app version |
| `icon` | App icon path |
| `splash` | Splash screen configuration |
| `extra.supabaseUrl` | Supabase project URL |
| `extra.supabasePublishableKey` | Supabase anon/public key |

### EAS Build Profiles (`eas.json`)

| Profile | Description |
|---------|-------------|
| `development` | Development client with debugging |
| `preview` | APK for internal testing |
| `production` | Production-ready AAB for Play Store |

---

## 🗄️ Database Schema

The app uses the following Supabase tables:

| Table | Description |
|-------|-------------|
| `users` | User profiles and authentication |
| `study_groups` | Study group details |
| `group_members` | Group membership records |
| `messages` | Chat messages |
| `message_attachments` | File/image attachments |
| `reports` | User/content reports |

For the complete schema with RLS policies, see `Study_Group_Finder_PRD_Android.md`.

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Start web version |
| `npm run build:android` | Build Android APK (preview) |
| `npm run build:android:prod` | Build Android AAB (production) |

---

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | ✅ |

> ⚠️ **Important:** Never commit your `.env` file to version control!

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**John Plonteras**

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - Development framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

---

