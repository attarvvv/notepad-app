import { Session, User } from '@supabase/supabase-js';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  NotesList: undefined;
  NoteEditor: {
    note?: Note;
  } | undefined;
};

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; data?: { user: User | null; session: Session | null } }>;
  signOut: () => Promise<{ error: Error | null }>;
}
