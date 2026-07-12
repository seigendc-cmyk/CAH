import { describe, it, expect } from 'vitest';
import { DataPackManifestSchema } from '../src/schemas';
import type { DataPackManifest } from '@eot/shared-types';

describe('DataPackManifest Validation', () => {
  it('should accept a valid manifest', () => {
    const validManifest: DataPackManifest = {
      packId: 'pack-123',
      schemaVersion: '1.0.0',
      packVersion: '1.0.0',
      title: 'The Empire of Trust',
      description: 'A great book',
      packType: 'book',
      bookId: 'book-1',
      author: 'Author Name',
      language: 'en',
      country: 'US',
      minimumShellVersion: '1.0.0',
      offlineAllowed: true,
      contentHash: 'hash123',
      publishedAt: new Date().toISOString(),
      assets: ['asset1.png'],
      entryPoint: 'index.json',
      licenseMode: 'free',
    };

    const result = DataPackManifestSchema.safeParse(validManifest);
    expect(result.success).toBe(true);
  });

  it('should reject an invalid manifest missing required fields', () => {
    const invalidManifest = {
      packId: 'pack-123',
      // Missing title, schemaVersion, etc.
    };

    const result = DataPackManifestSchema.safeParse(invalidManifest);
    expect(result.success).toBe(false);
  });

  it('should reject an invalid license mode', () => {
    const invalidManifest = {
      packId: 'pack-123',
      schemaVersion: '1.0.0',
      packVersion: '1.0.0',
      title: 'The Empire of Trust',
      description: 'A great book',
      packType: 'book',
      language: 'en',
      country: 'US',
      minimumShellVersion: '1.0.0',
      offlineAllowed: true,
      contentHash: 'hash123',
      publishedAt: new Date().toISOString(),
      assets: ['asset1.png'],
      entryPoint: 'index.json',
      licenseMode: 'unknown_mode', // Invalid
    };

    const result = DataPackManifestSchema.safeParse(invalidManifest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('licenseMode');
    }
  });
});
