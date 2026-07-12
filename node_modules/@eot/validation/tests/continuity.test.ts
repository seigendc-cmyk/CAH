import { describe, it, expect } from 'vitest';
import { CharacterSchema, validateCharacterContinuity } from '../src/schemas';
import type { Character } from '@eot/shared-types';

const baseChar: Character = {
  id: 'c-1',
  fullName: 'Jon Snow',
  role: 'protagonist',
  currentStatus: 'alive',
};

describe('Character Continuity Validation', () => {
  it('should flag missing profile image', () => {
    const char = { ...baseChar };
    const warnings = validateCharacterContinuity(char, [char]);
    expect(warnings).toContain('Missing character image');
  });

  it('should flag conflicting relationship definitions', () => {
    const char1: Character = {
      ...baseChar,
      id: 'c-1',
      fullName: 'Alice',
      profileAssetId: 'asset-1',
      relationships: [{ targetCharacterId: 'c-2', type: 'enemy', description: '' }]
    };
    
    const char2: Character = {
      ...baseChar,
      id: 'c-2',
      fullName: 'Bob',
      profileAssetId: 'asset-2',
      relationships: [{ targetCharacterId: 'c-1', type: 'friend', description: '' }]
    };

    const warnings = validateCharacterContinuity(char1, [char1, char2]);
    expect(warnings.some(w => w.includes('Conflicting relationship'))).toBe(true);
  });

  it('should flag inconsistent spelling based on case', () => {
    const char1: Character = { ...baseChar, fullName: 'Jon Snow', profileAssetId: 'a1' };
    const char2: Character = { ...baseChar, id: 'c-2', fullName: 'jon snow', profileAssetId: 'a2' };
    
    const warnings = validateCharacterContinuity(char1, [char1, char2]);
    expect(warnings.some(w => w.includes('Inconsistent character spelling'))).toBe(true);
  });
});
