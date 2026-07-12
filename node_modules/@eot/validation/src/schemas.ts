import { z } from 'zod';

export const PublicationStatusSchema = z.enum(['draft', 'in_review', 'published', 'archived']);

export const BaseEntitySchema = z.object({
  id: z.string().min(1),
  sortOrder: z.number(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  status: PublicationStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AuthorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Author name is required'),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const PublisherSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Publisher name is required'),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  copyrightNotice: z.string().optional(),
});

export const EducationalMetadataSchema = z.object({
  educationLevel: z.string().optional(),
  gradeOrForm: z.string().optional(),
  subject: z.string().optional(),
  syllabus: z.string().optional(),
  country: z.string().optional(),
  examinationBoard: z.string().optional(),
  module: z.string().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimatedStudyDuration: z.number().optional(),
  prerequisites: z.array(z.string()).optional(),
  assessmentType: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Category name is required'),
  educationalMetadata: EducationalMetadataSchema.optional(),
});

export const SubcategorySchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  name: z.string().min(1, 'Subcategory name is required'),
  educationalMetadata: EducationalMetadataSchema.optional(),
});

export const ContentBlockTypeSchema = z.enum([
  'paragraph',
  'heading',
  'subheading',
  'quote',
  'ordered-list',
  'unordered-list',
  'image',
  'callout',
  'table',
  'graph',
  'link',
  'citation',
  'reference',
  'character-card',
  'vendor-card',
  'product-card',
  'quiz',
]);

export const ContentBlockSchema = BaseEntitySchema.extend({
  type: ContentBlockTypeSchema,
  content: z.unknown(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const SectionSchema = BaseEntitySchema.extend({
  blocks: z.array(ContentBlockSchema),
});

export const ChapterSchema = BaseEntitySchema.extend({
  chapterNumber: z.number().int().nonnegative(),
  openingImageUrl: z.string().optional(),
  introduction: z.string().optional(),
  location: z.string().optional(),
  timelinePosition: z.string().optional(),
  emotionalTone: z.string().optional(),
  businessTheme: z.string().optional(),
  moralTheme: z.string().optional(),
  cliffhanger: z.string().optional(),
  chapterSummary: z.string().optional(),
  wordCount: z.number().optional(),
  estimatedReadingTime: z.number().optional(),
  editorialNotes: z.string().optional(),
  sections: z.array(SectionSchema).min(1, 'Chapter must have at least one section'),
});

export const EpisodeSchema = BaseEntitySchema.extend({
  episodeNumber: z.number().int().nonnegative(),
  synopsis: z.string().optional(),
  openingPreview: z.string().optional(),
  previousEpisodeRecap: z.string().optional(),
  cliffhanger: z.string().optional(),
  nextEpisodePreview: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative').optional(),
  freePreviewStatus: z.boolean().optional(),
  releaseDate: z.string().optional(), // Can add date validation if strictly needed
  chapters: z.array(ChapterSchema),
});

export const SeasonSchema = BaseEntitySchema.extend({
  seasonNumber: z.number().int().nonnegative(),
  description: z.string().optional(),
  coverAssetUrl: z.string().optional(),
  previousSeasonSummary: z.string().optional(),
  seasonIntroduction: z.string().optional(),
  seasonPreview: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative').optional(),
  releaseDate: z.string().optional(),
  episodes: z.array(EpisodeSchema),
});

export const BookSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Book title is required'),
  subtitle: z.string().optional(),
  slug: z.string().min(1),
  shortSynopsis: z.string().min(1, 'Short synopsis is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  authorId: z.string().min(1, 'Author is required'),
  coAuthorIds: z.array(z.string()).optional(),
  editor: z.string().optional(),
  illustrator: z.string().optional(),
  publisherId: z.string().min(1, 'Publisher is required'),
  fundingPartner: z.string().optional(),
  language: z.string().min(2),
  country: z.string().min(2),
  genre: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  ageRating: z.string().optional(),
  contentWarnings: z.array(z.string()).optional(),
  readingLevel: z.string().optional(),
  estimatedReadingTime: z.number().optional(),
  edition: z.string().optional(),
  publicationDate: z.string().optional(),
  copyrightStatement: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative').optional(),
  currency: z.string().optional(),
  freeOrPremium: z.enum(['free', 'premium']).optional(),
  bookStatus: PublicationStatusSchema,
  frontCoverAssetId: z.string().optional(),
  backCoverAssetId: z.string().optional(),
  episodeLabel: z.enum(['Episode', 'Series']).optional(),
  seasons: z.array(SeasonSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CharacterRelationshipSchema = z.object({
  targetCharacterId: z.string().min(1),
  type: z.enum(['family', 'business', 'friend', 'enemy', 'romantic', 'other']),
  description: z.string()
});

export const CharacterAppearanceSchema = z.object({
  bookId: z.string().optional(),
  seasonId: z.string().optional(),
  episodeId: z.string().optional(),
  chapterId: z.string().optional()
});

export const CharacterSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(1, 'Character name is required'),
  alternativeNames: z.array(z.string()).optional(),
  role: z.enum(['protagonist', 'antagonist', 'supporting', 'minor']),
  profileAssetId: z.string().optional(),
  fullBodyAssetId: z.string().optional(),
  age: z.number().nonnegative().optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  biography: z.string().optional(),
  personality: z.string().optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  relationships: z.array(CharacterRelationshipSchema).optional(),
  firstAppearance: CharacterAppearanceSchema.optional(),
  currentStatus: z.enum(['alive', 'deceased', 'unknown', 'archived']),
  characterArc: z.string().optional(),
  secrets: z.array(z.string()).optional(),
  knownLocations: z.array(z.string()).optional(),
  dialogueNotes: z.string().optional(),
  visualDescription: z.string().optional(),
  continuityNotes: z.string().optional(),
  associatedBooks: z.array(z.string()).optional(),
  associatedSeasons: z.array(z.string()).optional(),
  associatedEpisodes: z.array(z.string()).optional(),
  associatedChapters: z.array(z.string()).optional(),
  associatedAssets: z.array(z.string()).optional(),
  attributes: z.record(z.string(), z.string()).optional()
});

export const AssetSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Asset title is required'),
  originalFilename: z.string().min(1),
  fileType: z.string().min(1),
  mimeType: z.string().min(1),
  assetType: z.enum(['front-cover', 'back-cover', 'character-profile', 'character-full-body', 'scene-illustration', 'map', 'diagram', 'graph-image', 'table-image', 'vendor-logo', 'product-image', 'advertisement', 'audio', 'video', 'document', 'citation-source', 'reference-file']),
  width: z.number().optional(),
  height: z.number().optional(),
  fileSize: z.number().nonnegative(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  copyrightOwner: z.string().optional(),
  usageRights: z.string().optional(),
  source: z.string().optional(),
  uploadedAt: z.string().datetime(),
  associatedCharacters: z.array(z.string()).optional(),
  associatedBooks: z.array(z.string()).optional(),
  associatedChapters: z.array(z.string()).optional(),
  associatedVendors: z.array(z.string()).optional(),
  associatedProducts: z.array(z.string()).optional(),
  dataPackInclusionStatus: z.boolean(),
  processingStatus: z.enum(['pending', 'processing', 'completed', 'failed']),
  originalUrl: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  mobileWebpUrl: z.string().optional(),
  readerWebpUrl: z.string().optional(),
});

// Continuity Validations
export function validateCharacterContinuity(character: z.infer<typeof CharacterSchema>, allCharacters: z.infer<typeof CharacterSchema>[]) {
  const warnings: string[] = [];
  
  if (!character.profileAssetId) {
    warnings.push('Missing character image');
  }

  // Conflicting relationship definitions
  if (character.relationships) {
    character.relationships.forEach(rel => {
      const targetChar = allCharacters.find(c => c.id === rel.targetCharacterId);
      if (targetChar && targetChar.relationships) {
        const reverseRel = targetChar.relationships.find(r => r.targetCharacterId === character.id);
        if (reverseRel) {
          // If A says B is family, B should say A is family. If they differ significantly, flag it.
          if (rel.type === 'enemy' && reverseRel.type === 'friend') {
            warnings.push(`Conflicting relationship definitions between ${character.fullName} and ${targetChar.fullName}`);
          }
        }
      }
    });
  }

  // Inconsistent spelling detection - simple Levenshtein check placeholder or just checking exact conflicts
  allCharacters.forEach(otherChar => {
    if (otherChar.id !== character.id && otherChar.fullName.toLowerCase() === character.fullName.toLowerCase() && otherChar.fullName !== character.fullName) {
      warnings.push(`Inconsistent character spelling detected: ${character.fullName} vs ${otherChar.fullName}`);
    }
  });

  return warnings;
}
export const DataPackManifestSchema = z.object({
  packId: z.string().min(1),
  schemaVersion: z.string().min(1),
  packVersion: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  packType: z.enum(['book', 'season', 'episode', 'vendor']),
  bookId: z.string().optional(),
  seasonId: z.string().optional(),
  episodeId: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  language: z.string().min(2),
  country: z.string().min(2),
  category: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  minimumShellVersion: z.string().min(1),
  offlineAllowed: z.boolean(),
  contentHash: z.string().min(1),
  publishedAt: z.string().datetime(),
  assets: z.array(z.string()),
  entryPoint: z.string().min(1),
  licenseMode: z.enum(['free', 'purchased', 'subscription']),
});

// Custom validations function to check for duplicates
export function validateBookHierarchy(book: z.infer<typeof BookSchema>) {
  const issues: string[] = [];

  const seasonNumbers = new Set<number>();
  for (const season of book.seasons) {
    if (seasonNumbers.has(season.seasonNumber)) {
      issues.push(`Duplicate season number: ${season.seasonNumber}`);
    }
    seasonNumbers.add(season.seasonNumber);

    const episodeNumbers = new Set<number>();
    for (const episode of season.episodes) {
      if (episodeNumbers.has(episode.episodeNumber)) {
        issues.push(`Duplicate episode number: ${episode.episodeNumber} in season ${season.seasonNumber}`);
      }
      episodeNumbers.add(episode.episodeNumber);

      const chapterNumbers = new Set<number>();
      for (const chapter of episode.chapters) {
        if (chapterNumbers.has(chapter.chapterNumber)) {
          issues.push(`Duplicate chapter number: ${chapter.chapterNumber} in episode ${episode.episodeNumber}`);
        }
        chapterNumbers.add(chapter.chapterNumber);
      }
    }
  }

  return issues;
}
