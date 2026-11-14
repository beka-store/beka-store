import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { AuthContext, type AuthContextValue } from '@/context/authContext';
import { getFirebase, isFirebaseConfigured } from '@/lib/firebase';
import { ensureProfile, subscribeToProfile } from '@/lib/profiles';
import type { UserProfile } from '@/types';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const { auth } = getFirebase();
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeProfile?.();
      unsubscribeProfile = null;
      setFirebaseUser(user);
      setProfile(null);
      setLoadError(null);

      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const onFailure = () => {
        setLoadError('تعذر تحميل بيانات الحساب، تأكد من الاتصال وحاول مرة أخرى.');
        setIsLoading(false);
      };
      ensureProfile(user)
        .then(() => {
          unsubscribeProfile = subscribeToProfile(
            user.uid,
            (data) => {
              setProfile(data);
              setIsLoading(false);
            },
            onFailure
          );
        })
        .catch(onFailure);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile?.();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithRedirect(getFirebase().auth, new GoogleAuthProvider());
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(getFirebase().auth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ firebaseUser, profile, isLoading, loadError, signInWithGoogle, signOut }),
    [firebaseUser, profile, isLoading, loadError, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
