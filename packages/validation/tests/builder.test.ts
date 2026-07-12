import { describe, it, expect } from 'vitest';
import { BookSchema, validateBookHierarchy } from '../src/schemas';
import type { Book } from '@eot/shared-types';

const validBook: Book = {
  id: 'b-1',
  title: 'Test Book',
  slug: 'test-book',
  shortSynopsis: 'Short',
  fullDescription: 'Full',
  authorId: 'a-1',
  publisherId: 'p-1',
  language: 'en',
  country: 'US',
  categoryId: 'c-1',
  bookStatus: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  seasons: [
    {
      id: 's-1',
      title: 'Season 1',
      sortOrder: 1,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seasonNumber: 1,
      episodes: [
        {
          id: 'e-1',
          title: 'Episode 1',
          sortOrder: 1,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          episodeNumber: 1,
          chapters: [
            {
              id: 'ch-1',
              title: 'Chapter 1',
              sortOrder: 1,
              status: 'draft',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              chapterNumber: 1,
              sections: [
                {
                  id: 'sec-1',
                  title: 'Section 1',
                  sortOrder: 1,
                  status: 'draft',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  blocks: [
                    {
                      id: 'blk-1',
                      title: 'Block 1',
                      sortOrder: 1,
                      status: 'draft',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      type: 'paragraph',
                      content: 'Hello world',
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

describe('Builder Validation', () => {
  it('should accept a valid book hierarchy', () => {
    const result = BookSchema.safeParse(validBook);
    expect(result.success).toBe(true);
    const hierarchyIssues = validateBookHierarchy(validBook);
    expect(hierarchyIssues.length).toBe(0);
  });

  it('should reject a book missing required fields', () => {
    const invalidBook = { ...validBook, title: '' };
    const result = BookSchema.safeParse(invalidBook);
    expect(result.success).toBe(false);
  });

  it('should reject a book with negative price', () => {
    const invalidBook = { ...validBook, price: -10 };
    const result = BookSchema.safeParse(invalidBook);
    expect(result.success).toBe(false);
  });

  it('should reject an empty chapter (no sections)', () => {
    const invalidBook = JSON.parse(JSON.stringify(validBook));
    invalidBook.seasons[0].episodes[0].chapters[0].sections = [];
    const result = BookSchema.safeParse(invalidBook);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Chapter must have at least one section');
    }
  });

  it('should detect duplicate hierarchy numbers', () => {
    const invalidBook = JSON.parse(JSON.stringify(validBook));
    // Add another season with the same seasonNumber
    invalidBook.seasons.push({ ...invalidBook.seasons[0], id: 's-2' });
    const hierarchyIssues = validateBookHierarchy(invalidBook);
    expect(hierarchyIssues.length).toBeGreaterThan(0);
    expect(hierarchyIssues[0]).toContain('Duplicate season number: 1');
  });
});
