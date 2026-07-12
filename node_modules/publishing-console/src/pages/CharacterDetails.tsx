import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { characterRepository } from '../lib/repositories';
import { validateCharacterContinuity } from '@eot/validation';
import type { Character } from '@eot/shared-types';

export function CharacterDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      characterRepository.getById(id).then(c => setCharacter(c || null));
      characterRepository.getAll().then(setAllCharacters);
    }
  }, [id]);

  useEffect(() => {
    if (character) {
      setWarnings(validateCharacterContinuity(character, allCharacters));
    }
  }, [character, allCharacters]);

  const handleSave = async () => {
    if (character) {
      await characterRepository.save(character);
      navigate('/characters');
    }
  };

  if (!character) return <div>Loading...</div>;

  return (
    <div className="builder-container">
      <div className="builder-header">
        <button onClick={() => navigate('/characters')}>&larr; Back</button>
        <h2>Editing: {character.fullName}</h2>
        <button onClick={handleSave} className="btn-primary">Save Character</button>
      </div>

      <div className="editing-workspace">
        {warnings.length > 0 && (
          <div className="validation-panel">
            <h4>Continuity Warnings</h4>
            <ul>
              {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
            </ul>
          </div>
        )}

        <div className="book-details-form">
          <label>Full Name <input value={character.fullName} onChange={e => setCharacter({...character, fullName: e.target.value})} /></label>
          <label>Role 
            <select value={character.role} onChange={e => setCharacter({...character, role: e.target.value as any})}>
              <option value="protagonist">Protagonist</option>
              <option value="antagonist">Antagonist</option>
              <option value="supporting">Supporting</option>
              <option value="minor">Minor</option>
            </select>
          </label>
          <label>Status
            <select value={character.currentStatus} onChange={e => setCharacter({...character, currentStatus: e.target.value as any})}>
              <option value="alive">Alive</option>
              <option value="deceased">Deceased</option>
              <option value="unknown">Unknown</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>Biography <textarea value={character.biography || ''} onChange={e => setCharacter({...character, biography: e.target.value})} /></label>
          {/* Note: the rest of the rich fields (strengths, relationships) would normally have complex inputs here, simplified for foundation */}
        </div>
      </div>
    </div>
  );
}
