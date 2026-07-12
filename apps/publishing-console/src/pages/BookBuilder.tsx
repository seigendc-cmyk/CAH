import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookRepository } from '../lib/repositories';
import { BookSchema, validateBookHierarchy } from '@eot/validation';
import type { Book, Season, Episode, Chapter, Section, ContentBlock } from '@eot/shared-types';
import { ContentBlockEditor } from '../components/ContentBlockEditor';

export function BookBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>('');
  
  // Navigation state
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      bookRepository.getById(id).then(b => setBook(b || null));
    }
  }, [id]);

  const handleSave = async () => {
    if (!book) return;
    
    // Validate
    const schemaResult = BookSchema.safeParse(book);
    const hierarchyIssues = validateBookHierarchy(book);
    
    const allIssues = [...hierarchyIssues];
    if (!schemaResult.success) {
      allIssues.push(...schemaResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`));
    }
    
    setValidationIssues(allIssues);

    if (allIssues.length > 0) {
      setSaveStatus('Failed to save - Check validation');
      return;
    }

    setSaveStatus('Saving...');
    await bookRepository.save(book);
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  if (!book) return <div>Loading...</div>;

  const updateBookField = (field: keyof Book, value: any) => {
    setBook({ ...book, [field]: value });
  };

  const addSeason = () => {
    const newSeason: Season = {
      id: `s-${Date.now()}`,
      title: 'New Season',
      sortOrder: book.seasons.length,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seasonNumber: book.seasons.length + 1,
      episodes: []
    };
    setBook({ ...book, seasons: [...book.seasons, newSeason] });
  };

  const addEpisode = (seasonId: string) => {
    setBook({
      ...book,
      seasons: book.seasons.map(s => {
        if (s.id !== seasonId) return s;
        const newEp: Episode = {
          id: `e-${Date.now()}`,
          title: 'New Episode',
          sortOrder: s.episodes.length,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          episodeNumber: s.episodes.length + 1,
          chapters: []
        };
        return { ...s, episodes: [...s.episodes, newEp] };
      })
    });
  };

  const addChapter = (seasonId: string, episodeId: string) => {
    setBook({
      ...book,
      seasons: book.seasons.map(s => {
        if (s.id !== seasonId) return s;
        return {
          ...s,
          episodes: s.episodes.map(e => {
            if (e.id !== episodeId) return e;
            const newChap: Chapter = {
              id: `ch-${Date.now()}`,
              title: 'New Chapter',
              sortOrder: e.chapters.length,
              status: 'draft',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              chapterNumber: e.chapters.length + 1,
              sections: []
            };
            return { ...e, chapters: [...e.chapters, newChap] };
          })
        };
      })
    });
  };

  const addSection = (seasonId: string, episodeId: string, chapterId: string) => {
    setBook({
      ...book,
      seasons: book.seasons.map(s => {
        if (s.id !== seasonId) return s;
        return {
          ...s,
          episodes: s.episodes.map(e => {
            if (e.id !== episodeId) return e;
            return {
              ...e,
              chapters: e.chapters.map(c => {
                if (c.id !== chapterId) return c;
                const newSec: Section = {
                  id: `sec-${Date.now()}`,
                  title: 'New Section',
                  sortOrder: c.sections.length,
                  status: 'draft',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  blocks: []
                };
                return { ...c, sections: [...c.sections, newSec] };
              })
            }
          })
        };
      })
    });
  };

  const updateSectionBlocks = (seasonId: string, episodeId: string, chapterId: string, sectionId: string, newBlocks: ContentBlock[]) => {
    setBook({
      ...book,
      seasons: book.seasons.map(s => {
        if (s.id !== seasonId) return s;
        return {
          ...s,
          episodes: s.episodes.map(e => {
            if (e.id !== episodeId) return e;
            return {
              ...e,
              chapters: e.chapters.map(c => {
                if (c.id !== chapterId) return c;
                return {
                  ...c,
                  sections: c.sections.map(sec => {
                    if (sec.id !== sectionId) return sec;
                    return { ...sec, blocks: newBlocks };
                  })
                }
              })
            }
          })
        };
      })
    });
  }

  // Derived state for active items
  const activeSeason = book.seasons.find(s => s.id === activeSeasonId);
  const activeEpisode = activeSeason?.episodes.find(e => e.id === activeEpisodeId);
  const activeChapter = activeEpisode?.chapters.find(c => c.id === activeChapterId);
  const activeSection = activeChapter?.sections.find(sec => sec.id === activeSectionId);

  return (
    <div className="builder-container">
      <div className="builder-header">
        <button onClick={() => navigate('/books')}>&larr; Back</button>
        <h2>Editing: {book.title}</h2>
        <div className="header-actions">
          <span className="save-status">{saveStatus}</span>
          <button onClick={handleSave} className="btn-primary">Save Book</button>
        </div>
      </div>

      <div className="builder-layout">
        <div className="structure-navigator">
          <h3>Structure</h3>
          <button onClick={addSeason} className="btn-small">+ Add Season</button>
          <ul className="tree">
            {book.seasons.map(season => (
              <li key={season.id}>
                <div 
                  className={`tree-node ${activeSeasonId === season.id ? 'active' : ''}`}
                  onClick={() => { setActiveSeasonId(season.id); setActiveEpisodeId(null); setActiveChapterId(null); setActiveSectionId(null); }}
                >
                  Season {season.seasonNumber}: {season.title}
                </div>
                {activeSeasonId === season.id && (
                  <ul>
                    <button onClick={() => addEpisode(season.id)} className="btn-small">+ Add Episode</button>
                    {season.episodes.map(episode => (
                      <li key={episode.id}>
                        <div 
                          className={`tree-node ${activeEpisodeId === episode.id ? 'active' : ''}`}
                          onClick={() => { setActiveEpisodeId(episode.id); setActiveChapterId(null); setActiveSectionId(null); }}
                        >
                          Episode {episode.episodeNumber}: {episode.title}
                        </div>
                        {activeEpisodeId === episode.id && (
                          <ul>
                            <button onClick={() => addChapter(season.id, episode.id)} className="btn-small">+ Add Chapter</button>
                            {episode.chapters.map(chapter => (
                              <li key={chapter.id}>
                                <div 
                                  className={`tree-node ${activeChapterId === chapter.id ? 'active' : ''}`}
                                  onClick={() => { setActiveChapterId(chapter.id); setActiveSectionId(null); }}
                                >
                                  Chapter {chapter.chapterNumber}: {chapter.title}
                                </div>
                                {activeChapterId === chapter.id && (
                                  <ul>
                                    <button onClick={() => addSection(season.id, episode.id, chapter.id)} className="btn-small">+ Add Section</button>
                                    {chapter.sections.map(section => (
                                      <li key={section.id}>
                                        <div 
                                          className={`tree-node ${activeSectionId === section.id ? 'active' : ''}`}
                                          onClick={() => setActiveSectionId(section.id)}
                                        >
                                          {section.title || `Section`}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="editing-workspace">
          {validationIssues.length > 0 && (
            <div className="validation-panel">
              <h4>Validation Issues</h4>
              <ul>
                {validationIssues.map((issue, idx) => <li key={idx}>{issue}</li>)}
              </ul>
            </div>
          )}

          {!activeSeasonId && (
            <div className="book-details-form">
              <h3>Book Metadata</h3>
              <label>Title <input value={book.title} onChange={e => updateBookField('title', e.target.value)} /></label>
              <label>Short Synopsis <textarea value={book.shortSynopsis} onChange={e => updateBookField('shortSynopsis', e.target.value)} /></label>
              <label>Author ID <input value={book.authorId} onChange={e => updateBookField('authorId', e.target.value)} /></label>
              <label>Category ID <input value={book.categoryId} onChange={e => updateBookField('categoryId', e.target.value)} /></label>
              <label>Price <input type="number" value={book.price || ''} onChange={e => updateBookField('price', parseFloat(e.target.value))} /></label>
              <label>Front Cover Asset ID <input value={book.frontCoverAssetId || ''} onChange={e => updateBookField('frontCoverAssetId', e.target.value)} placeholder="ast-123" /></label>
              <label>Back Cover Asset ID <input value={book.backCoverAssetId || ''} onChange={e => updateBookField('backCoverAssetId', e.target.value)} placeholder="ast-456" /></label>
            </div>
          )}

          {activeSectionId && activeSeasonId && activeEpisodeId && activeChapterId && activeSection && (
            <div className="section-editor">
              <h3>Editing {activeSection.title || 'Section'}</h3>
              <ContentBlockEditor 
                blocks={activeSection.blocks} 
                onChange={(newBlocks) => updateSectionBlocks(activeSeasonId, activeEpisodeId, activeChapterId, activeSectionId, newBlocks)} 
              />
            </div>
          )}
        </div>
        
        <div className="mobile-preview-panel">
          <h3>Preview</h3>
          <div className="preview-device">
            {activeSection ? (
               activeSection.blocks.map(b => (
                 <div key={b.id} className={`preview-block preview-${b.type}`}>
                   {b.type === 'paragraph' && <p>{b.content as string}</p>}
                   {b.type === 'heading' && <h2>{b.content as string}</h2>}
                   {b.type === 'image' && <div className="preview-image-placeholder">Image</div>}
                 </div>
               ))
            ) : (
              <p className="preview-placeholder">Select a section to preview.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
