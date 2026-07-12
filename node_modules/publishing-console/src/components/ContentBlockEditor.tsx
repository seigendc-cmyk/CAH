import type { ContentBlock, ContentBlockType } from '@eot/shared-types';

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function ContentBlockEditor({ blocks, onChange }: ContentBlockEditorProps) {
  
  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `blk-${Date.now()}`,
      sortOrder: blocks.length,
      title: '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type,
      content: type === 'image' ? { url: '', caption: '' } : ''
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, newContent: unknown) => {
    onChange(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    
    // update sortOrder
    newBlocks.forEach((b, i) => b.sortOrder = i);
    onChange(newBlocks);
  };

  return (
    <div className="content-block-editor">
      <div className="block-toolbar">
        <button onClick={() => addBlock('paragraph')}>+ Paragraph</button>
        <button onClick={() => addBlock('heading')}>+ Heading</button>
        <button onClick={() => addBlock('quote')}>+ Quote</button>
        <button onClick={() => addBlock('image')}>+ Image</button>
        <button onClick={() => addBlock('unordered-list')}>+ List</button>
        <button onClick={() => addBlock('callout')}>+ Callout</button>
        {/* Placeholders for cards/quizzes */}
        <button onClick={() => addBlock('character-card')}>+ Character Card</button>
      </div>

      <div className="blocks-container">
        {blocks.map((block, index) => (
          <div key={block.id} className="block-item">
            <div className="block-controls">
              <span className="block-type">{block.type}</span>
              <button onClick={() => moveBlock(index, -1)}>↑</button>
              <button onClick={() => moveBlock(index, 1)}>↓</button>
              <button onClick={() => deleteBlock(block.id)} className="btn-danger-icon">x</button>
            </div>
            
            <div className="block-content-edit">
              {block.type === 'paragraph' && (
                <textarea 
                  value={block.content as string} 
                  onChange={e => updateBlock(block.id, e.target.value)} 
                  placeholder="Type paragraph text..."
                />
              )}
              {block.type === 'heading' && (
                <input 
                  type="text" 
                  value={block.content as string} 
                  onChange={e => updateBlock(block.id, e.target.value)} 
                  placeholder="Heading text..."
                />
              )}
              {block.type === 'image' && (
                <div className="image-edit">
                  <input 
                    type="text" 
                    value={(block.content as any).url || ''} 
                    onChange={e => updateBlock(block.id, { ...(block.content as any), url: e.target.value })} 
                    placeholder="Image URL"
                  />
                  <input 
                    type="text" 
                    value={(block.content as any).caption || ''} 
                    onChange={e => updateBlock(block.id, { ...(block.content as any), caption: e.target.value })} 
                    placeholder="Image Caption"
                  />
                </div>
              )}
              {/* Add other types as needed */}
              {['quote', 'callout'].includes(block.type) && (
                 <textarea 
                 value={block.content as string} 
                 onChange={e => updateBlock(block.id, e.target.value)} 
                 placeholder={`Type ${block.type} text...`}
               />
              )}
              {block.type === 'character-card' && (
                 <input 
                 type="text" 
                 value={block.content as string} 
                 onChange={e => updateBlock(block.id, e.target.value)} 
                 placeholder="Character ID"
               />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
