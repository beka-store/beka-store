import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebase } from '@/lib/firebase';
import { fromE164 } from '@/lib/phone';
import type { UserProfile } from '@/types';

function toProfile(id: string, data: DocumentData): UserProfile {
  return {
    uid: id,
    name: data.name ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    photoURL: data.photoURL ?? null,
    balance: typeof data.balance === 'number' ? data.balance : 0,
  };
}

export async function ensureProfile(user: User): Promise<void> {
  const { db } = getFirebase();
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName ?? null,
      email: user.email ?? null,
      phone: user.phoneNumber ? fromE164(user.phoneNumber) : null,
      photoURL: user.photoURL ?? null,
      balance: 0,
      createdAt: serverTimestamp(),
    });
    return;
  }

  const data = snap.data();
  const updates: Record<string, string> = {};
  if (user.email && user.email !== data.email) updates.email = user.email;
  if (user.photoURL && user.photoURL !== data.photoURL) updates.photoURL = user.photoURL;
  if (Object.keys(updates).length > 0) await updateDoc(ref, updates);
}

export async function updateProfileDetails(uid: string, details: { name: string; phone: string }): Promise<void> {
  const { db } = getFirebase();
  await updateDoc(doc(db, 'users', uid), { name: details.name, phone: details.phone });
}

export function subscribeToProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError: () => void
) {
  const { db } = getFirebase();
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => onData(snap.exists() ? toProfile(snap.id, snap.data()) : null),
    onError
  );
}

export function subscribeToAllUsers(onData: (users: UserProfile[]) => void, onError: () => void) {
  const { db } = getFirebase();
  return onSnapshot(
    collection(db, 'users'),
    (snap) => onData(snap.docs.map((item) => toProfile(item.id, item.data()))),
    onError
  );
}
