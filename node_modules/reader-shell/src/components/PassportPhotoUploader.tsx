import {
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';

import {
  uploadCustomerPassportPhoto,
  validatePassportPhoto,
} from '../services/passport-photo-service';

interface PassportPhotoUploaderProps {
  uid: string;
  currentPhotoUrl?: string;
  required?: boolean;
  onUploaded?: (downloadUrl: string) => void;
}

function PassportPhotoUploader({
  uid,
  currentPhotoUrl,
  required = false,
  onUploaded,
}: PassportPhotoUploaderProps) {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState(currentPhotoUrl ?? '');

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    setPreviewUrl(currentPhotoUrl ?? '');
  }, [currentPhotoUrl]);

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setError('');

    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    try {
      validatePassportPhoto(file);

      if (
        previewUrl &&
        previewUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (uploadError) {
      event.target.value = '';
      setSelectedFile(null);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Invalid image.',
      );
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Select a photograph first.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result =
        await uploadCustomerPassportPhoto(
          uid,
          selectedFile,
        );

      setSelectedFile(null);
      setPreviewUrl(result.downloadUrl);
      onUploaded?.(result.downloadUrl);
    } catch (uploadError) {
      console.error(
        'Passport photo upload failed:',
        uploadError,
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Photo upload failed.',
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="passport-photo-section">
      <h2>Passport-size photograph</h2>

      <p className="passport-photo-help">
        Select a clear front-facing photograph from
        your device. JPG, PNG and WebP files up to
        5 MB are accepted.
      </p>

      <div className="passport-photo-layout">
        <div className="passport-photo-preview">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Customer passport profile"
            />
          ) : (
            <span>No photograph selected</span>
          )}
        </div>

        <div className="passport-photo-controls">
          <label className="passport-photo-picker">
            Choose photograph
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="user"
              required={required && !currentPhotoUrl}
              onChange={handleFileChange}
            />
          </label>

          <button
            type="button"
            className="passport-photo-upload-button"
            disabled={!selectedFile || uploading}
            onClick={handleUpload}
          >
            {uploading
              ? 'Uploading photograph...'
              : 'Upload photograph'}
          </button>
        </div>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}
    </section>
  );
}

export default PassportPhotoUploader;
