export const FIRESTORE_COLLECTIONS = Object.freeze({
  CUSTOMERS: 'customers',
  STAFF_USERS: 'staffUsers',
  VENDORS: 'vendors',
  VENDOR_BRANCHES: 'vendorBranches',
  PRODUCTS: 'products',
  ADVERTISEMENTS: 'advertisements',

  AUTHORS: 'authors',
  PUBLISHERS: 'publishers',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'subcategories',

  BOOKS: 'books',
  SEASONS: 'seasons',
  EPISODES: 'episodes',
  CHAPTERS: 'chapters',
  CONTENT_BLOCKS: 'contentBlocks',

  CHARACTERS: 'characters',
  CHARACTER_APPEARANCES: 'characterAppearances',
  ASSETS: 'assets',
  CITATIONS: 'citations',
  REFERENCES: 'references',

  DATA_PACKS: 'dataPacks',
  PACK_VERSIONS: 'packVersions',

  ENTITLEMENTS: 'entitlements',
  DEVICE_BINDINGS: 'deviceBindings',

  READER_PROGRESS: 'readerProgress',
  BOOKMARKS: 'bookmarks',
  READER_NOTES: 'readerNotes',
  USER_PREFERENCES: 'userPreferences',

  TELEMETRY_EVENTS: 'telemetryEvents',
  WHATSAPP_LEADS: 'whatsappLeads',

  COMMERCE_ACCESS_HUBS: 'commerceAccessHubs',
  NEWS: 'news',
  APP_SETTINGS: 'appSettings'
} as const);

export type FirestoreCollectionName =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS];
