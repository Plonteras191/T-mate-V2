# Product Requirements Document (PRD)
## Study Group Finder - TCC

---

### 1. Product Overview

**Product Name:** Study Group Finder  
**Platform:** Android (Mobile App)  
**Target Users:** Students of Tagoloan Community College (TCC)  
**Tech Stack:**
- Frontend: React Native (Expo) with TypeScript
- Backend: Supabase (PostgreSQL)
- Styling: StyleSheet (Core React Native)

**Purpose:**  
A mobile application that enables TCC students to create, discover, and join study groups with built-in chat functionality for collaborative learning.

---USE TSX NOT TS

---

### 2. Core Features

#### 2.1 User Authentication & Profile Management

**Sign Up**
- Users can register using any email address (no restriction to school email)
- Required fields: Full Name, Email, Password
- Password must meet basic security requirements (min 8 characters)
- Email verification required before account activation
- Verification email sent via Supabase Auth
- User must click verification link to activate account

**Login**
- Email and password authentication
- Session persistence (stay logged in)
- Cannot login until email is verified

**Password Reset**
- "Forgot Password" link on login screen
- User enters email address
- Password reset email sent via Supabase Auth
- User clicks link to create new password
- Redirect to login after successful reset

**Profile Management**
- View own profile
- Edit profile information (name, bio)
- Upload and change profile photo
- View other users' basic profiles (name, photo, bio)

**Logout**
- Secure logout with session termination

---

#### 2.2 Study Group Management

**Create Study Group**
- Group creator inputs:
  - Subject/Course name
  - Description
  - Meeting schedule (date/time)
  - Meeting location
  - Maximum member capacity (optional)
- Creator automatically becomes group admin

**Browse Study Groups**
- Display all available study groups
- Show group details: subject, description, schedule, location, member count, capacity
- Visual indicator for full groups

**Join Study Group**
- One-tap join functionality
- Cannot join if group is at maximum capacity
- Automatically gain access to group chat upon joining

**Leave Study Group**
- Members can leave any group they've joined
- Lose access to group chat upon leaving

**My Groups**
- View list of all groups user has joined
- Quick access to group chats

**Edit Study Group** (Admin Only)
- Group creator can edit group details
- Update subject, description, schedule, location, capacity

**Delete Study Group** (Admin Only)
- Group creator can permanently delete the group
- All members removed and chat history deleted

**Remove Members** (Admin Only)
- Group creator can remove specific members from the group

---

#### 2.3 Search & Discovery

**Search Functionality**
- Search study groups by subject/course name
- Real-time search results

**Filter Options**
- Filter by subject
- Filter by schedule/time
- Filter by availability (open/full)

---

#### 2.4 Built-in Chat System

**Group Chat**
- Real-time messaging within each study group
- Only group members can access the chat
- Send text messages with rich formatting
- Display sender's name and profile photo
- Timestamp for each message
- Chat history persists and loads on app open

**Rich Text Messaging**
- Emoji support (emoji picker)
- Text formatting options:
  - Bold
  - Italic
  - Strikethrough
- Link detection and clickable URLs
- Mention other users with @ symbol

**Image Sharing**
- Upload images from camera or gallery
- Image preview before sending
- Full-screen image viewer when tapped
- Multiple image support per message
- Image compression for optimal storage

**File Sharing**
- Upload study resources (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX)
- File size limit: 10MB per file
- Display file name, type, and size
- Download and view files in-app or external viewer
- File type icons for easy identification

**Chat Interface**
- Scrollable message list
- Text input field with formatting toolbar
- Send button
- Attachment button (image/file picker)
- Auto-scroll to latest message
- Load more messages on scroll up (pagination)

---

#### 2.5 Calendar Integration

**Group Schedule Display**
- Each study group displays meeting schedule
- View upcoming meetings in calendar format
- Calendar view shows all user's group meetings

**Add to Device Calendar**
- "Add to Calendar" button for each study group
- Export meeting details to device calendar (Google Calendar, iOS Calendar)
- Include: Title, Date/Time, Location, Description
- Set reminder notifications (handled by device calendar app)

**Calendar Screen**
- Monthly calendar view
- Highlight dates with scheduled group meetings
- Tap date to view all meetings for that day
- Quick navigation to group from calendar

---

#### 2.6 Additional Features

**Dashboard/Home Screen**
- Welcome message
- Quick access to "Browse Groups"
- Quick access to "My Groups"
- Display recent activity or featured groups
- Upcoming meetings widget

**Report System**
- Report inappropriate content or users
- Simple report form (reason selection + optional description)

**Status Indicators**
- Visual indicators for group capacity (open/full)
- Active member count display

---

### 3. Supabase PostgreSQL Schema

#### 3.1 Database Tables

**users**
- `id` (UUID, Primary Key, auto-generated)
- `email` (VARCHAR, Unique, Not Null)
- `full_name` (VARCHAR, Not Null)
- `bio` (TEXT, Nullable)
- `profile_photo_url` (TEXT, Nullable)
- `email_verified` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMP, Default: now())
- `updated_at` (TIMESTAMP, Default: now())

**study_groups**
- `id` (UUID, Primary Key, auto-generated)
- `creator_id` (UUID, Foreign Key → users.id, Not Null)
- `subject` (VARCHAR, Not Null)
- `description` (TEXT, Not Null)
- `meeting_schedule` (TIMESTAMP, Not Null)
- `meeting_location` (VARCHAR, Not Null)
- `max_capacity` (INTEGER, Nullable)
- `is_full` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMP, Default: now())
- `updated_at` (TIMESTAMP, Default: now())

**group_members**
- `id` (UUID, Primary Key, auto-generated)
- `group_id` (UUID, Foreign Key → study_groups.id, Not Null, On Delete: CASCADE)
- `user_id` (UUID, Foreign Key → users.id, Not Null, On Delete: CASCADE)
- `joined_at` (TIMESTAMP, Default: now())
- Unique constraint on (group_id, user_id)

**messages**
- `id` (UUID, Primary Key, auto-generated)
- `group_id` (UUID, Foreign Key → study_groups.id, Not Null, On Delete: CASCADE)
- `sender_id` (UUID, Foreign Key → users.id, Not Null, On Delete: CASCADE)
- `message_text` (TEXT, Nullable)
- `message_type` (VARCHAR, Default: 'text') -- text, image, file
- `formatting` (JSONB, Nullable) -- stores bold, italic, mentions, etc.
- `created_at` (TIMESTAMP, Default: now())

**message_attachments**
- `id` (UUID, Primary Key, auto-generated)
- `message_id` (UUID, Foreign Key → messages.id, Not Null, On Delete: CASCADE)
- `attachment_type` (VARCHAR, Not Null) -- image, pdf, doc, etc.
- `file_url` (TEXT, Not Null)
- `file_name` (VARCHAR, Not Null)
- `file_size` (INTEGER, Not Null) -- in bytes
- `thumbnail_url` (TEXT, Nullable) -- for images
- `created_at` (TIMESTAMP, Default: now())

**reports**
- `id` (UUID, Primary Key, auto-generated)
- `reporter_id` (UUID, Foreign Key → users.id, Not Null)
- `reported_user_id` (UUID, Foreign Key → users.id, Nullable)
- `reported_group_id` (UUID, Foreign Key → study_groups.id, Nullable)
- `reported_message_id` (UUID, Foreign Key → messages.id, Nullable)
- `reason` (VARCHAR, Not Null)
- `description` (TEXT, Nullable)
- `status` (VARCHAR, Default: 'pending') -- pending, reviewed, resolved
- `created_at` (TIMESTAMP, Default: now())

#### 3.2 Database Indexes

- Index on `users.email` for faster authentication queries
- Index on `study_groups.creator_id` for efficient group management
- Index on `study_groups.meeting_schedule` for calendar queries
- Index on `group_members.user_id` and `group_members.group_id` for membership lookups
- Index on `messages.group_id` and `messages.created_at` for chat history retrieval
- Index on `messages.message_type` for filtering media messages
- Index on `message_attachments.message_id` for attachment queries
- Index on `study_groups.subject` for search functionality

#### 3.3 Row Level Security (RLS) Policies

**users table:**
- Users can read all user profiles
- Users can only update their own profile
- Users can only delete their own account

**study_groups table:**
- All authenticated users can read study groups
- Only authenticated users can create study groups
- Only group creator can update/delete their groups

**group_members table:**
- Users can read memberships for groups they belong to
- Users can insert themselves into groups (join)
- Users can delete their own memberships (leave)
- Group creators can delete any membership (remove members)

**messages table:**
- Users can read messages only from groups they're members of
- Users can insert messages only into groups they're members of
- Users cannot update or delete messages

**message_attachments table:**
- Users can read attachments for messages in their groups
- Users can insert attachments for their own messages
- Users cannot update or delete attachments

**reports table:**
- Users can insert their own reports
- Only admins can read/update reports (future feature)

#### 3.4 Supabase Storage Buckets

**profile-photos**
- Store user profile images
- Public read access
- Authenticated write access (users can upload their own photos)
- File size limit: 5MB
- Allowed formats: JPG, PNG, WEBP

**chat-images**
- Store images shared in group chats
- Public read access (with group member verification)
- Authenticated write access
- File size limit: 10MB
- Allowed formats: JPG, PNG, WEBP, GIF
- Auto-generate thumbnails for preview

**chat-files**
- Store study resources and documents
- Public read access (with group member verification)
- Authenticated write access
- File size limit: 10MB per file
- Allowed formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT

---

### 4. User Flows

#### 4.1 Sign Up Flow
1. User opens app
2. Navigates to Sign Up screen
3. Enters full name, email, password
4. Submits form
5. Account created in Supabase Auth
6. Verification email sent automatically
7. User sees "Check your email" message
8. User clicks verification link in email
9. Email verified in Supabase
10. User can now login

#### 4.2 Password Reset Flow
1. User taps "Forgot Password" on login screen
2. Enters email address
3. Supabase sends password reset email
4. User clicks reset link in email
5. Redirected to "Create New Password" screen
6. User enters new password
7. Password updated in Supabase Auth
8. Redirected to login screen

#### 4.3 Create Study Group Flow
1. User navigates to "Create Group" screen
2. Fills in group details (subject, description, schedule, location, capacity)
3. Submits form
4. Record created in `study_groups` table
5. Creator automatically added to `group_members` table
6. Redirected to group chat screen

#### 4.4 Join Study Group Flow
1. User browses available groups
2. Selects a group to view details
3. Taps "Join Group" button
4. Record created in `group_members` table
5. User gains access to group chat
6. Group member count updated

#### 4.5 Send Text Message with Formatting Flow
1. User opens group chat
2. Types message in input field
3. Selects formatting options (bold, italic, emoji)
4. Taps send button
5. Message with formatting data inserted into `messages` table
6. Message appears in chat for all members

#### 4.6 Share Image in Chat Flow
1. User taps attachment button in chat
2. Selects "Image" option
3. Chooses image from gallery or takes new photo
4. Image preview shown
5. User adds optional caption
6. Taps send
7. Image uploaded to `chat-images` bucket
8. Message record created with image URL
9. Attachment record created in `message_attachments` table
10. Image displays in chat

#### 4.7 Share File in Chat Flow
1. User taps attachment button in chat
2. Selects "File" option
3. Opens file picker
4. Selects document (PDF, DOC, etc.)
5. File details shown (name, size)
6. User confirms upload
7. File uploaded to `chat-files` bucket
8. Message record created with file reference
9. Attachment record created in `message_attachments` table
10. File displays as downloadable attachment in chat

#### 4.8 Add Group Meeting to Calendar Flow
1. User views group details
2. Taps "Add to Calendar" button
3. App requests calendar permission (if not granted)
4. Meeting details exported to device calendar
5. User chooses calendar app (Google Calendar, etc.)
6. Event created with title, date, time, location, description
7. Confirmation message shown

---

### 5. Technical Specifications

#### 5.1 Frontend (React Native Expo with TypeScript)

**Key Libraries:**
- `expo` - Core framework
- `typescript` - Type safety
- `@supabase/supabase-js` - Supabase client
- `react-navigation` - Navigation (Stack, Bottom Tabs)
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`
- `expo-image-picker` - Profile photo and image upload
- `expo-document-picker` - File selection
- `expo-calendar` - Calendar integration
- `expo-file-system` - File handling
- `react-native-gifted-chat` (optional) - Chat UI components
- `react-native-markdown-display` - Rich text rendering
- `react-native-emoji-selector` - Emoji selector

**TypeScript Configuration:**
- Strict mode enabled
- Type definitions for all components, props, and state
- Interface definitions for API responses
- Type-safe navigation
- Supabase types generation

**Project Structure:**
```
src/
├── components/         # Reusable UI components
│   ├── common/        # Buttons, inputs, cards, etc.
│   ├── chat/          # Chat-related components
│   └── groups/        # Group-related components
├── screens/           # Screen components
│   ├── auth/          # Login, SignUp, PasswordReset
│   ├── groups/        # Browse, Create, Details, etc.
│   ├── chat/          # GroupChat
│   ├── calendar/      # CalendarView
│   └── profile/       # Profile, EditProfile
├── navigation/        # Navigation configuration
├── services/          # API and Supabase services
│   ├── auth.service.tsX
│   ├── groups.service.tsX
│   ├── chat.service.tsX
│   └── storage.service.tsX
├── types/             # TypeScript type definitions
│   ├── database.types.tsX
│   ├── navigation.types.tsX
│   └── models.tsX
├── theme/             # Design system
│   ├── colors.tsX
│   ├── typography.tsX
│   ├── spacing.tsX
│   └── styles.tsX
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── contexts/          # React contexts (Auth, etc.)
```

**Screen Structure:**
- Auth Stack: Login, SignUp, EmailVerificationNotice, PasswordReset
- Main Stack: 
  - Dashboard (Home)
  - BrowseGroups
  - MyGroups
  - CreateGroup
  - EditGroup
  - GroupDetails
  - GroupChat
  - CalendarView
  - Profile
  - EditProfile
  - UserProfile
  - ImageViewer
  - FileViewer

**Styling Approach:**
- Use `StyleSheet.create()` for all component styles
- Define reusable style constants in separate TypeScript files
- Create typed theme file with consistent design tokens
- Organize styles at component level or in dedicated style files
- Type-safe style objects

#### 5.2 Backend (Supabase)

**Authentication:**
- Email/Password authentication via Supabase Auth
- Email verification enabled in Supabase Auth settings
- Password reset via Supabase Auth magic link
- JWT token management
- Session handling with automatic refresh

**Database Operations:**
- Use Supabase client for all CRUD operations
- Leverage PostgreSQL functions for complex queries (e.g., search with filters)
- Batch queries for loading messages with attachments

**Storage:**
- Upload profile photos to `profile-photos` bucket
- Upload chat images to `chat-images` bucket
- Upload study files to `chat-files` bucket
- Generate public URLs for file access
- Implement file size validation before upload

**Email Configuration:**
- Configure SMTP settings in Supabase for email verification
- Customize email templates for verification and password reset
- Set redirect URLs for email links

**Type Generation:**
- Use Supabase CLI to generate TypeScript types from database schema
- Keep types in sync with database changes
- Import generated types throughout the application

---

### 6. TypeScript Type Definitions

#### 6.1 Database Types

**User Types (`types/models.ts`):**
```typescript
export interface User {
  id: string;
  email: string;
  full_name: string;
  bio: string | null;
  profile_photo_url: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  bio: string | null;
  profile_photo_url: string | null;
}
```

**Study Group Types:**
```typescript
export interface StudyGroup {
  id: string;
  creator_id: string;
  subject: string;
  description: string;
  meeting_schedule: string;
  meeting_location: string;
  max_capacity: number | null;
  is_full: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyGroupWithCreator extends StudyGroup {
  creator: UserProfile;
  member_count: number;
}

export interface CreateStudyGroupInput {
  subject: string;
  description: string;
  meeting_schedule: string;
  meeting_location: string;
  max_capacity?: number;
}

export interface UpdateStudyGroupInput {
  subject?: string;
  description?: string;
  meeting_schedule?: string;
  meeting_location?: string;
  max_capacity?: number;
}
```

**Message Types:**
```typescript
export type MessageType = 'text' | 'image' | 'file';

export interface MessageFormatting {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  mentions?: string[];
}

export interface Message {
  id: string;
  group_id: string;
  sender_id: string;
  message_text: string | null;
  message_type: MessageType;
  formatting: MessageFormatting | null;
  created_at: string;
}

export interface MessageWithSender extends Message {
  sender: UserProfile;
  attachments?: MessageAttachment[];
}

export interface SendMessageInput {
  group_id: string;
  message_text?: string;
  message_type?: MessageType;
  formatting?: MessageFormatting;
}
```

**Attachment Types:**
```typescript
export type AttachmentType = 'image' | 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'xls' | 'xlsx' | 'txt';

export interface MessageAttachment {
  id: string;
  message_id: string;
  attachment_type: AttachmentType;
  file_url: string;
  file_name: string;
  file_size: number;
  thumbnail_url: string | null;
  created_at: string;
}

export interface UploadAttachmentInput {
  file: File | Blob;
  attachment_type: AttachmentType;
  file_name: string;
}
```

**Group Member Types:**
```typescript
export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export interface GroupMemberWithUser extends GroupMember {
  user: UserProfile;
}
```

**Report Types:**
```typescript
export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  reported_group_id: string | null;
  reported_message_id: string | null;
  reason: string;
  description: string | null;
  status: ReportStatus;
  created_at: string;
}

export interface CreateReportInput {
  reported_user_id?: string;
  reported_group_id?: string;
  reported_message_id?: string;
  reason: string;
  description?: string;
}
```

#### 6.2 Navigation Types

**Navigation Types (`types/navigation.types.ts`):**
```typescript
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  EmailVerification: { email: string };
  PasswordReset: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Groups: NavigatorScreenParams<GroupsStackParamList>;
  Calendar: undefined;
  Profile: undefined;
};

export type GroupsStackParamList = {
  BrowseGroups: undefined;
  MyGroups: undefined;
  CreateGroup: undefined;
  EditGroup: { groupId: string };
  GroupDetails: { groupId: string };
  GroupChat: { groupId: string; groupName: string };
  ImageViewer: { imageUrl: string };
  FileViewer: { fileUrl: string; fileName: string };
  UserProfile: { userId: string };
};

export type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;
export type SignUpScreenProps = StackScreenProps<AuthStackParamList, 'SignUp'>;
export type GroupChatScreenProps = StackScreenProps<GroupsStackParamList, 'GroupChat'>;
// ... other screen props types
```

#### 6.3 Component Props Types

**Example Component Props:**
```typescript
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export interface GroupCardProps {
  group: StudyGroupWithCreator;
  onPress: () => void;
}

export interface MessageBubbleProps {
  message: MessageWithSender;
  isOwnMessage: boolean;
  onImagePress?: (imageUrl: string) => void;
  onFilePress?: (fileUrl: string, fileName: string) => void;
}
```

---

### 7. Design Guidelines (StyleSheet with TypeScript)

#### 7.1 Color Palette

**Theme Colors File (`theme/colors.ts`):**
```typescript
export const colors = {
  primary: '#3B82F6',      // Blue
  primaryDark: '#2563EB',  // Darker Blue
  primaryLight: '#60A5FA', // Lighter Blue
  
  secondary: '#6B7280',    // Gray
  secondaryLight: '#9CA3AF',
  
  success: '#10B981',      // Green
  danger: '#EF4444',       // Red
  warning: '#F59E0B',      // Orange
  
  background: '#FFFFFF',   // White
  backgroundGray: '#F3F4F6',
  
  text: '#1F2937',         // Dark Gray
  textLight: '#6B7280',
  textWhite: '#FFFFFF',
  
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  
  link: '#2563EB',
  
  chatBubbleSent: '#3B82F6',
  chatBubbleReceived: '#F3F4F6',
} as const;

export type ColorName = keyof typeof colors;
```





### 9. Success Metrics

- Number of registered users with verified emails
- Number of study groups created
- Average messages per group
- Number of files/images shared per group
- User retention rate (weekly active users)
- Average number of groups joined per user
- Calendar integration usage rate

---

### 10. Future Enhancements (Post v1.0)

- Push notifications for new messages
- In-app notification center
- Message reactions (emoji reactions)
- Message editing and deletion
- Voice messages
- Group avatars
- User ratings/reviews for groups
- Advanced search filters
- Group tags/categories
- Pinned messages
- Group announcements
- Read receipts
- Typing indicators

---

### 11. Development Timeline Estimate

**Phase 1: Setup & Authentication (Week 1-2)**
- Expo project setup with TypeScript
- TypeScript configuration and strict mode
- Supabase project configuration
- Database schema implementation
- Type generation from Supabase schema
- Theme constants (colors, typography, spacing) with types
- Sign Up/Login screens
- Email verification flow
- Password reset functionality

**Phase 2: Core Features (Week 3-4)**
- Profile management with photo upload
- Study group CRUD operations
- Browse and search functionality
- My Groups screen
- Reusable typed components
- Type-safe navigation setup

**Phase 3: Basic Chat System (Week 5)**
- Chat UI implementation
- Basic text messaging with types
- Message history loading
- Chat bubble styling
- Type-safe message handling

**Phase 4: Rich Chat Features (Week 6-7)**
- Rich text formatting (bold, italic, emoji)
- Image sharing and viewer
- File sharing and download
- Chat optimization and pagination
- Attachment styling
- Type-safe file handling

**Phase 5: Calendar Integration (Week 8)**
- Calendar view screen
- Export to device calendar
- Meeting schedule display
- Calendar component styling
- Type-safe calendar events

**Phase 6: Polish & Testing (Week 9-10)**
- UI/UX refinements
- Type checking and error handling
- Bug fixes
- Testing on multiple devices
- Report system implementation
- Performance optimization
- File upload/download testing
- Style consistency review
- TypeScript strict mode validation


SUPABASE SCHEMA
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_photo_url TEXT,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster queries
CREATE INDEX idx_users_email ON public.users(email);

-- Study Groups table
CREATE TABLE public.study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    meeting_schedule TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_location VARCHAR(255) NOT NULL,
    max_capacity INTEGER,
    is_full BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_study_groups_creator ON public.study_groups(creator_id);
CREATE INDEX idx_study_groups_schedule ON public.study_groups(meeting_schedule);
CREATE INDEX idx_study_groups_subject ON public.study_groups(subject);

-- Group Members table
CREATE TABLE public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Create indexes
CREATE INDEX idx_group_members_user ON public.group_members(user_id);
CREATE INDEX idx_group_members_group ON public.group_members(group_id);

-- Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message_text TEXT,
    message_type VARCHAR(20) DEFAULT 'text',
    formatting JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_messages_group ON public.messages(group_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);
CREATE INDEX idx_messages_type ON public.messages(message_type);

-- Message Attachments table
CREATE TABLE public.message_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    attachment_type VARCHAR(20) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_message_attachments_message ON public.message_attachments(message_id);

-- Reports table
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.users(id),
    reported_user_id UUID REFERENCES public.users(id),
    reported_group_id UUID REFERENCES public.study_groups(id),
    reported_message_id UUID REFERENCES public.messages(id),
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own account" ON public.users
    FOR DELETE USING (auth.uid() = id);

    -- Study Groups table policies
CREATE POLICY "Anyone can view study groups" ON public.study_groups
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create groups" ON public.study_groups
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their groups" ON public.study_groups
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their groups" ON public.study_groups
    FOR DELETE USING (auth.uid() = creator_id);

    -- Group Members table policies
CREATE POLICY "Anyone can view group members" ON public.group_members
    FOR SELECT USING (true);

CREATE POLICY "Users can join groups" ON public.group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave or creators can remove" ON public.group_members
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.study_groups sg 
            WHERE sg.id = group_id 
            AND sg.creator_id = auth.uid()
        )
    );


    -- Messages table policies
CREATE POLICY "Members can view group messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.group_members gm 
            WHERE gm.group_id = messages.group_id 
            AND gm.user_id = auth.uid()
        )
    );

CREATE POLICY "Members can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.group_members gm 
            WHERE gm.group_id = messages.group_id 
            AND gm.user_id = auth.uid()
        )
    );

    -- Message Attachments policies
CREATE POLICY "Members can view attachments" ON public.message_attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.group_members gm ON gm.group_id = m.group_id
            WHERE m.id = message_attachments.message_id
            AND gm.user_id = auth.uid()
        )
    );

CREATE POLICY "Senders can add attachments" ON public.message_attachments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.messages m
            WHERE m.id = message_id
            AND m.sender_id = auth.uid()
        )
    );

-- Reports policies
CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports" ON public.reports
    FOR SELECT USING (auth.uid() = reporter_id);

    -- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_groups_updated_at
    BEFORE UPDATE ON public.study_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    -- Function to handle new user creation (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- Function to update email_verified when confirmed
CREATE OR REPLACE FUNCTION public.handle_email_verified()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.users
        SET email_verified = true
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update email_verified
CREATE TRIGGER on_auth_user_email_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_email_verified();

    -- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('profile-photos', 'profile-photos', true),
    ('chat-images', 'chat-images', true),
    ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- Profile photos policies
CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload own profile photo"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own profile photo"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own profile photo"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-photos' AND auth.role() = 'authenticated');

-- Chat images policies
CREATE POLICY "Authenticated can view chat images"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can upload chat images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-images' AND auth.role() = 'authenticated');

-- Chat files policies
CREATE POLICY "Authenticated can view chat files"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-files' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can upload chat files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-files' AND auth.role() = 'authenticated');

