import { useEffect, useState, useRef } from 'react';
import { assetRepository } from '../lib/repositories';
import type { Asset } from '@eot/shared-types';

export function AssetLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setAssets(await assetRepository.getAll());
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();

      const newAsset: Asset = {
        id: `ast-${Date.now()}`,
        title: file.name,
        originalFilename: file.name,
        fileType: file.type.split('/')[1],
        mimeType: file.type,
        assetType: 'scene-illustration', // Default
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        dataPackInclusionStatus: false,
        processingStatus: 'completed',
        originalUrl: data.originalUrl,
        thumbnailUrl: data.thumbnailUrl,
        mobileWebpUrl: data.mobileWebpUrl,
        readerWebpUrl: data.readerWebpUrl,
      };

      await assetRepository.save(newAsset);
      await loadAssets();
    } catch (err) {
      console.error(err);
      alert('Upload failed or unsupported format');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="asset-library">
      <div className="header">
        <h2>Asset Library</h2>
        <input 
          type="file" 
          ref={fileInputRef}
          style={{ display: 'none' }} 
          accept="image/jpeg, image/png, image/webp, image/gif" 
          onChange={handleUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="btn-primary"
          disabled={isUploading}
        >
          {isUploading ? 'Processing...' : 'Upload Asset'}
        </button>
      </div>

      <div className="asset-grid">
        {assets.map(asset => (
          <div key={asset.id} className="asset-card">
            <img src={asset.thumbnailUrl || asset.originalUrl} alt={asset.title} />
            <div className="asset-info">
              <h4>{asset.title}</h4>
              <p>{asset.assetType}</p>
              <p>{(asset.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ))}
        {assets.length === 0 && <p>No assets uploaded yet.</p>}
      </div>
    </div>
  );
}
