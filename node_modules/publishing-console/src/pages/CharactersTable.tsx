import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { characterRepository } from '../lib/repositories';
import type { Character } from '@eot/shared-types';

export function CharactersTable() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => setCharacters(await characterRepository.getAll());

  const handleCreate = async () => {
    const newChar: Character = {
      id: `char-${Date.now()}`,
      fullName: 'New Character',
      role: 'supporting',
      currentStatus: 'alive',
    };
    await characterRepository.save(newChar);
    navigate(`/characters/${newChar.id}`);
  };

  return (
    <div className="books-table-container">
      <div className="books-header">
        <h2>Character Library</h2>
        <button onClick={handleCreate} className="btn-primary">Create Character</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map(char => (
            <tr key={char.id}>
              <td>{char.fullName}</td>
              <td>{char.role}</td>
              <td>{char.currentStatus}</td>
              <td>
                <button onClick={() => navigate(`/characters/${char.id}`)} className="btn-secondary">Edit</button>
              </td>
            </tr>
          ))}
          {characters.length === 0 && <tr><td colSpan={4}>No characters found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
