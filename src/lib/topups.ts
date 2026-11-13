import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import type { TopUpMethodId, TopUpRequest, UserProfile } from '@/types';

export interface NewTopUp {
  user: Pick<UserProfile, 'uid' | 'name' | 'phone' | 'email'>;
  amount: number;
  method: TopUpMethodId;
  transactionNumber: string;
  screenshot: string;
}

function toTopUp(snap: QueryDocumentSnapshot<DocumentData>): TopUpRequest {
  const data = snap.data();
  return {
    id: snap.id,
    uid: data.uid,
    name: data.name,
    phone: data.phone,
    email: data.email ?? null,
    amount: data.amount,
    method: data.method,
    transactionNumber: data.transactionNumber,
    screenshot: data.screenshot,
    status: data.status,
    createdAt: data.createdAt?.toDate?.() ?? null,
  };
}

function sortNewestFirst(items: TopUpRequest[]): TopUpRequest[] {
  return [...items].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

export async function createTopUp(input: NewTopUp): Promise<void> {
  const { db } = getFirebase();
  await addDoc(collection(db, 'topups'), {
    uid: input.user.uid,
    name: input.user.name,
    phone: input.user.phone,
    email: input.user.email,
    amount: input.amount,
    method: input.method,
    transactionNumber: input.transactionNumber,
    screenshot: input.screenshot,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export function subscribeToMyTopUps(
  uid: string,
  onData: (items: TopUpRequest[]) => void,
  onError: () => void
) {
  const { db } = getFirebase();
  const q = query(collection(db, 'topups'), where('uid', '==', uid));
  return onSnapshot(
    q,
    (snap) => onData(sortNewestFirst(snap.docs.map(toTopUp))),
    onError
  );
}

export function subscribeToAllTopUps(onData: (items: TopUpRequest[]) => void, onError: () => void) {
  const { db } = getFirebase();
  return onSnapshot(
    collection(db, 'topups'),
    (snap) => onData(sortNewestFirst(snap.docs.map(toTopUp))),
    onError
  );
}

export async function approveTopUp(item: Pick<TopUpRequest, 'id' | 'uid' | 'amount'>): Promise<void> {
  const { db } = getFirebase();
  const topUpRef = doc(db, 'topups', item.id);
  const userRef = doc(db, 'users', item.uid);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(topUpRef);
    if (!snap.exists() || snap.data().status !== 'pending') {
      throw new Error('ALREADY_REVIEWED');
    }
    tx.update(topUpRef, { status: 'approved', reviewedAt: serverTimestamp() });
    tx.update(userRef, { balance: increment(item.amount) });
  });
}

export async function rejectTopUp(id: string): Promise<void> {
  const { db } = getFirebase();
  const topUpRef = doc(db, 'topups', id);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(topUpRef);
    if (!snap.exists() || snap.data().status !== 'pending') {
      throw new Error('ALREADY_REVIEWED');
    }
    tx.update(topUpRef, { status: 'rejected', reviewedAt: serverTimestamp() });
  });
}
