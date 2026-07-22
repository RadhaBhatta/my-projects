import React, { useState, type ChangeEvent } from 'react';
import { supabase } from '../supabaseClient';

interface ImageUploaderProps {
  onUploadSuccess: (publicUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setUploading(true);

      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;

      // 1. Upload to Supabase Storage Bucket
      const { error: uploadError } = await supabase.storage
        .from('tryon-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get the public web URL
      const { data } = supabase.storage
        .from('tryon-media')
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error('Could not retrieve public URL.');
      }

      onUploadSuccess(data.publicUrl);

    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ 
      margin: '20px 0', 
      padding: '16px', 
      border: '2px dashed #ccc', 
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>
        Step 2: Upload Your Photo
      </label>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={uploading} 
        style={{ width: '100%' }}
      />

      {uploading && <p style={{ color: '#007bff', margin: '8px 0 0 0', fontSize: '0.9rem' }}>Uploading your photo...</p>}
      {error && <p style={{ color: '#dc3545', margin: '8px 0 0 0', fontSize: '0.9rem' }}>{error}</p>}
    </div>
  );
};