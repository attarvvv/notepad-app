# 📝 Notepad Mobile App

A clean, warm-toned notepad mobile application built with **Expo SDK 54 / React Native**, **TypeScript**, and **Supabase** (Auth + Postgres Database with Row Level Security).

---

## 🎨 Theme & Styling
- **Palette**: Warm Cream & Tan
  - Background: `#FAF3E0` / `#FDF6E3`
  - Surface/Card: `#FFFDF7`
  - Primary Accent: `#D4A373`
  - Text Primary: `#3E2C1C`
  - Text Secondary: `#8B7355`
  - Border: `#E8DFC9`
- **Icons**: [lucide-react-native](https://lucide.dev)
- **Safe Area**: Handled via `react-native-safe-area-context`

---

## ⚡ Getting Started

### 1. Configure Supabase

1. Make sure your `notes` table is created in your [Supabase](https://supabase.com) dashboard with columns (`id`, `user_id`, `title`, `content`, `created_at`, `updated_at`) and Row Level Security (RLS) enabled.
2. Copy your **Project URL** and **Anon Key** from **Project Settings -> API**.
3. Open [`src/lib/supabase.ts`](./src/lib/supabase.ts) and update:
   ```ts
   export const SUPABASE_URL: string = 'https://your-project-id.supabase.co';
   export const SUPABASE_ANON_KEY: string = 'your-anon-public-key';
   ```

### 2. Start the Development Server

```bash
# Start Expo bundler
npm start

# Or run directly on Web
npm run web

# Or run on Android / iOS
npm run android
npm run ios
```

---

## 📂 Project Structure

```
notepad-new/
├── src/
│   ├── types/                   # TypeScript interfaces (Note, User, Navigation)
│   ├── theme/                   # Palette, typography, spacing, shadows
│   ├── lib/                     # Supabase client with AsyncStorage session
│   ├── contexts/                # AuthContext provider (user, session, signin, signup, signout)
│   ├── navigation/              # Root, Auth, and App Stack navigators
│   ├── components/              # NoteCard, SearchBar, CustomInput, CustomButton, EmptyState, LoadingSpinner
│   ├── screens/                 # LoginScreen, RegisterScreen, NotesListScreen, NoteEditorScreen
│   └── utils/                   # Date formatting utilities
├── App.tsx                      # App entry with SafeAreaProvider & NavigationContainer
└── package.json
```

---

## 🔒 Security & Row Level Security (RLS)
The database schema strictly isolates data per user using Postgres Row Level Security:
- `auth.uid() = user_id` ensures users can only read, create, edit, and delete their own notes.
