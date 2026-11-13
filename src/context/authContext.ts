import { createContext } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/types';

export interface AuthContextValue {
  firebaseUser: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  loadError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
