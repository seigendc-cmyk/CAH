export const DEFAULT_PUBLISHER = {
  name: 'JE Trust',
};

export type PublicationStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface BaseEntity {
  id: string;
  sortOrder: number;
  title: string;
  subtitle?: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Publisher {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  address?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  copyrightNotice?: string;
}

export interface EducationalMetadata {
  educationLevel?: string;
  gradeOrForm?: string;
  subject?: string;
  syllabus?: string;
  country?: string;
  examinationBoard?: string;
  module?: string;
  learningOutcomes?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyDuration?: number; // in minutes
  prerequisites?: string[];
  assessmentType?: string;
}

export interface Category {
  id: string;
  name: string;
  educationalMetadata?: EducationalMetadata;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  educationalMetadata?: EducationalMetadata;
}

export type ContentBlockType =
  | 'header'
  | 'title'
  | 'paragraph'
  | 'heading'
  | 'subheading'
  | 'quote'
  | 'ordered-list'
  | 'unordered-list'
  | 'image'
  | 'divider'
  | 'callout'
  | 'table'
  | 'graph'
  | 'link'
  | 'citation'
  | 'reference'
  | 'character-card'
  | 'vendor-card'
  | 'product-card'
  | 'quiz';

export interface ContentBlock extends BaseEntity {
  type: ContentBlockType;
  content: unknown; // Type-specific payload
  metadata?: Record<string, unknown>;
}

export interface Section extends BaseEntity {
  blocks: ContentBlock[];
}

export interface Chapter extends BaseEntity {
  chapterNumber: number;
  openingImageUrl?: string;
  introduction?: string;
  // mainContent is functionally represented by sections/blocks
  location?: string;
  timelinePosition?: string;
  emotionalTone?: string;
  businessTheme?: string;
  moralTheme?: string;
  cliffhanger?: string;
  chapterSummary?: string;
  wordCount?: number;
  estimatedReadingTime?: number;
  editorialNotes?: string;
  blocks: ContentBlock[];
}

export interface Episode extends BaseEntity {
  episodeNumber: number;
  synopsis?: string;
  openingPreview?: string;
  previousEpisodeRecap?: string;
  cliffhanger?: string;
  nextEpisodePreview?: string;
  price?: number;
  freePreviewStatus?: boolean;
  releaseDate?: string;
  chapters: Chapter[];
}

export interface Season extends BaseEntity {
  seasonNumber: number;
  description?: string;
  coverAssetUrl?: string;
  previousSeasonSummary?: string;
  seasonIntroduction?: string;
  seasonPreview?: string;
  price?: number;
  releaseDate?: string;
  episodes: Episode[];
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  shortSynopsis: string;
  fullDescription: string;
  authorId: string;
  coAuthorIds?: string[];
  editor?: string;
  illustrator?: string;
  publisherId: string;
  fundingPartner?: string;
  language: string;
  country: string;
  genre?: string;
  categoryId: string;
  subcategoryId?: string;
  keywords?: string[];
  targetAudience?: string;
  ageRating?: string;
  contentWarnings?: string[];
  readingLevel?: string;
  estimatedReadingTime?: number;
  edition?: string;
  publicationDate?: string;
  copyrightStatement?: string;
  price?: number;
  currency?: string;
  freeOrPremium?: 'free' | 'premium';
  bookStatus: PublicationStatus;
  frontCoverAssetId?: string;
  backCoverAssetId?: string;
  
  // Customization
  episodeLabel?: 'Episode' | 'Series';
  
  seasons: Season[];
  
  createdAt: string;
  updatedAt: string;
}

export interface CharacterRelationship {
  targetCharacterId: string;
  type: 'family' | 'business' | 'friend' | 'enemy' | 'romantic' | 'other';
  description: string;
}

export interface CharacterAppearance {
  bookId?: string;
  seasonId?: string;
  episodeId?: string;
  chapterId?: string;
}

export interface Character {
  id: string;
  fullName: string;
  alternativeNames?: string[];
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  profileAssetId?: string;
  fullBodyAssetId?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  biography?: string;
  personality?: string;
  strengths?: string[];
  weaknesses?: string[];
  relationships?: CharacterRelationship[];
  firstAppearance?: CharacterAppearance;
  currentStatus: 'alive' | 'deceased' | 'unknown' | 'archived';
  characterArc?: string;
  secrets?: string[];
  knownLocations?: string[];
  dialogueNotes?: string;
  visualDescription?: string;
  continuityNotes?: string;
  associatedBooks?: string[];
  associatedSeasons?: string[];
  associatedEpisodes?: string[];
  associatedChapters?: string[];
  associatedAssets?: string[];
  attributes?: Record<string, string>;
}

export interface Asset {
  id: string;
  title: string;
  originalFilename: string;
  fileType: string;
  mimeType: string;
  assetType: 'front-cover' | 'back-cover' | 'character-profile' | 'character-full-body' | 'scene-illustration' | 'map' | 'diagram' | 'graph-image' | 'table-image' | 'vendor-logo' | 'product-image' | 'advertisement' | 'audio' | 'video' | 'document' | 'citation-source' | 'reference-file';
  width?: number;
  height?: number;
  fileSize: number;
  altText?: string;
  caption?: string;
  description?: string;
  copyrightOwner?: string;
  usageRights?: string;
  source?: string;
  uploadedAt: string;
  associatedCharacters?: string[];
  associatedBooks?: string[];
  associatedChapters?: string[];
  associatedVendors?: string[];
  associatedProducts?: string[];
  dataPackInclusionStatus: boolean;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Storage URLs
  originalUrl: string;
  thumbnailUrl?: string;
  mobileWebpUrl?: string;
  readerWebpUrl?: string;
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  url?: string;
}

export interface Reference {
  id: string;
  title: string;
  link: string;
}

export interface DataPackManifest {
  packId: string;
  schemaVersion: string;
  packVersion: string;
  title: string;
  description: string;
  packType: 'book' | 'season' | 'episode' | 'vendor';
  bookId?: string;
  seasonId?: string;
  episodeId?: string;
  author?: string;
  publisher?: string;
  language: string;
  country: string;
  category?: string;
  price?: number;
  currency?: string;
  minimumShellVersion: string;
  offlineAllowed: boolean;
  contentHash: string;
  publishedAt: string;
  assets: string[];
  entryPoint: string;
  licenseMode: 'free' | 'purchased' | 'subscription';
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  contactEmail?: string;
  contactWhatsApp?: string;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
}

export interface Advertisement {
  id: string;
  vendorId: string;
  productId?: string;
  imageUrl: string;
  targetUrl: string;
}

export interface ReaderProgress {
  userId: string;
  bookId: string;
  currentSeasonId?: string;
  currentEpisodeId?: string;
  currentChapterId?: string;
  scrollPosition: number;
  updatedAt: string;
}

export type CustomerStatus =
  | 'active'
  | 'suspended'
  | 'deleted';

export interface Customer {
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

  status: CustomerStatus;
  provider: 'google.com';
  profileCompleted: boolean;

  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export type StaffRole =
  | 'administrator'
  | 'publisher'
  | 'editor'
  | 'support'
  | 'analyst';

export interface StaffUser {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  passportPhotoUrl?: string;
  passportPhotoPath?: string;
  roles: StaffRole[];
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export interface Entitlement {
  id?: string;
  customerId: string;
  bookId: string;
  accessType: 'free' | 'purchase' | 'subscription' | 'promotion';
  status: 'active' | 'revoked' | 'expired';
  grantedAt: any;
  expiresAt: any | null;
}
