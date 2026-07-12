import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import {
  FIRESTORE_COLLECTIONS,
} from '@eot/shared-types';

import {
  auth,
  firestore,
  googleProvider,
} from '../lib/firebase';

async function ensureCustomerProfile(user: User): Promise<void> {
  const customerRef = doc(
    firestore,
    FIRESTORE_COLLECTIONS.CUSTOMERS,
    user.uid,
  );

  const customerSnapshot = await getDoc(customerRef);

  if (!customerSnapshot.exists()) {
    await setDoc(customerRef, {
      id: user.uid,
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoUrl: user.photoURL ?? '',
      phoneNumber: user.phoneNumber ?? '',
      status: 'active',
      provider: 'google.com',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    return;
  }

  await setDoc(
    customerRef,
    {
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoUrl: user.photoURL ?? '',
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}

export async function signInCustomerWithGoogle(): Promise<User> {
  const result = await signInWithPopup(
    auth,
    googleProvider,
  );

  await ensureCustomerProfile(result.user);

  return result.user;
}

export async function signOutCustomer(): Promise<void> {
  await signOut(auth);
}

export function observeCustomerAuth(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}
