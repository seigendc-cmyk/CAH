import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import {
  FIRESTORE_COLLECTIONS,
} from '@eot/shared-types';

import {
  firestore,
  storage,
} from '../lib/firebase';

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export interface PassportPhotoUploadResult {
  downloadUrl: string;
  storagePath: string;
}

export function validatePassportPhoto(file: File): void {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    throw new Error(
      'Select a JPG, PNG or WebP image.',
    );
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new Error(
      'The image must not exceed 5 MB.',
    );
  }
}

export async function uploadCustomerPassportPhoto(
  uid: string,
  file: File,
): Promise<PassportPhotoUploadResult> {
  validatePassportPhoto(file);

  const storagePath =
    `customers/${uid}/passport-photo/current`;

  const photoReference = ref(
    storage,
    storagePath,
  );

  await uploadBytes(
    photoReference,
    file,
    {
      contentType: file.type,
      customMetadata: {
        customerUid: uid,
        photoPurpose: 'passport-profile',
      },
    },
  );

  const downloadUrl =
    await getDownloadURL(photoReference);

  const customerReference = doc(
    firestore,
    FIRESTORE_COLLECTIONS.CUSTOMERS,
    uid,
  );

  await setDoc(
    customerReference,
    {
      passportPhotoUrl: downloadUrl,
      passportPhotoPath: storagePath,
      passportPhotoUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );

  return {
    downloadUrl,
    storagePath,
  };
}
