import {
  collection,
  query,
  where,
  getDocs,
  documentId,
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, type Entitlement, type Book } from '@eot/shared-types';
import { firestore } from '../lib/firebase';

export type CustomerLibraryResult = {
  books: Book[];
  entitlementCount: number;
};

export async function getCustomerLibrary(
  customerId: string
): Promise<CustomerLibraryResult> {
  if (!customerId) {
    throw new Error('Customer ID is required to fetch library');
  }

  const entitlementsRef = collection(
    firestore,
    FIRESTORE_COLLECTIONS.ENTITLEMENTS
  );

  // We require a composite index on (customerId ASC, status ASC)
  const entitlementsQuery = query(
    entitlementsRef,
    where('customerId', '==', customerId),
    where('status', '==', 'active')
  );

  const entitlementsSnapshot = await getDocs(entitlementsQuery);
  const now = new Date();

  const activeBookIds = new Set<string>();

  entitlementsSnapshot.forEach((docSnap) => {
    const data = docSnap.data() as Entitlement;

    // Client-side filtering for expiresAt
    let isExpired = false;
    if (data.expiresAt) {
      // Handle Firebase Timestamp or string/date
      const expiresAtDate =
        typeof data.expiresAt.toDate === 'function'
          ? data.expiresAt.toDate()
          : new Date(data.expiresAt);

      if (expiresAtDate < now) {
        isExpired = true;
      }
    }

    if (!isExpired && data.bookId) {
      activeBookIds.add(data.bookId);
    }
  });

  const uniqueBookIds = Array.from(activeBookIds);

  if (uniqueBookIds.length === 0) {
    return {
      books: [],
      entitlementCount: 0,
    };
  }

  // Fetch books in chunks of 30 due to Firestore 'in' query limits
  const CHUNK_SIZE = 30;
  const bookChunks: string[][] = [];

  for (let i = 0; i < uniqueBookIds.length; i += CHUNK_SIZE) {
    bookChunks.push(uniqueBookIds.slice(i, i + CHUNK_SIZE));
  }

  const booksRef = collection(firestore, FIRESTORE_COLLECTIONS.BOOKS);
  const booksPromises = bookChunks.map((chunk) => {
    const q = query(booksRef, where(documentId(), 'in', chunk));
    return getDocs(q);
  });

  const booksSnapshots = await Promise.all(booksPromises);
  const books: Book[] = [];

  booksSnapshots.forEach((snap) => {
    snap.forEach((docSnap) => {
      const bookData = { id: docSnap.id, ...docSnap.data() } as Book;
      
      // Only return published books
      if (bookData.bookStatus === 'published') {
        books.push(bookData);
      }
    });
  });

  return {
    books,
    entitlementCount: books.length,
  };
}
