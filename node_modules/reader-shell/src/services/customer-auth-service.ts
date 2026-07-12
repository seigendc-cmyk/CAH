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

export interface CustomerProfile {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  passportPhotoUrl?: string;
  passportPhotoPath?: string;

  phoneNumber?: string;
  dateOfBirth?: string;

  addressLine1?: string;
  suburb?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;

  status: 'active' | 'suspended' | 'deleted';
  provider: 'google.com';
  profileCompleted: boolean;

  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
}

export interface CustomerProfileInput {
  phoneNumber: string;
  dateOfBirth: string;
  addressLine1: string;
  suburb: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
}

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

      phoneNumber: '',
      dateOfBirth: '',

      addressLine1: '',
      suburb: '',
      city: '',
      province: '',
      country: 'Zimbabwe',
      postalCode: '',

      status: 'active',
      provider: 'google.com',
      profileCompleted: false,

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

export async function getCustomerProfile(
  uid: string,
): Promise<CustomerProfile | null> {
  const customerRef = doc(
    firestore,
    FIRESTORE_COLLECTIONS.CUSTOMERS,
    uid,
  );

  const snapshot = await getDoc(customerRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as CustomerProfile;
}

export async function updateCustomerProfile(
  uid: string,
  profile: CustomerProfileInput,
): Promise<void> {
  const customerRef = doc(
    firestore,
    FIRESTORE_COLLECTIONS.CUSTOMERS,
    uid,
  );

  await setDoc(
    customerRef,
    {
      phoneNumber: profile.phoneNumber.trim(),
      dateOfBirth: profile.dateOfBirth,

      addressLine1: profile.addressLine1.trim(),
      suburb: profile.suburb.trim(),
      city: profile.city.trim(),
      province: profile.province.trim(),
      country: profile.country.trim(),
      postalCode: profile.postalCode?.trim() ?? '',

      profileCompleted: true,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}

export async function signOutCustomer(): Promise<void> {
  await signOut(auth);
}

export function observeCustomerAuth(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}

