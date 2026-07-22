import { useState } from 'react';
import { DressGallery, type Garment } from './components/DressGallery';
import { ImageUploader } from './components/ImageUploader';

export default function App() {
  const [selectedDress, setSelectedDress] = useState<Garment | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [finalAiResult, setFinalAiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateTryOn = async () => {
    if (!selectedDress || !userPhotoUrl) return;
    
    try {
      setLoading(true);
      setFinalAiResult(null);

      // Hit your local backend proxy server route
      const response = await fetch('http://localhost:5000/api/tryon/generate-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userImageUrl: userPhotoUrl,
          dressName: selectedDress.name
        })
      });

      const data = await response.json();
      
      if (response.ok && data.resultUrl) {
        setFinalAiResult(data.resultUrl);
      } else {
        alert(`Error from AI Engine: ${data.error || 'Failed to load fitting'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Could not establish connection to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#111' }}>
          ✨ AI Virtual Studio Fitting Room
        </h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        <div>
          <DressGallery 
            selectedDressId={selectedDress?.id || null} 
            onSelectDress={(dress) => setSelectedDress(dress)} 
          />
        </div>

        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '12px', 
          padding: '24px', 
          backgroundColor: '#fafafa',
          alignSelf: 'start'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
            Virtual Dressing Mirror
          </h2>
          
          {selectedDress ? (
            <div>
              <div style={{ marginBottom: '12px', padding: '10px', backgroundColor: '#e9f5ff', borderRadius: '6px', color: '#0056b3', fontWeight: '600' }}>
                Step 1 Selected: {selectedDress.name}
              </div>

              <ImageUploader onUploadSuccess={(url) => setUserPhotoUrl(url)} />

              {userPhotoUrl && (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#28a745', fontWeight: '600' }}>
                    ✓ Photo Linked Successfully!
                  </p>
                  <img 
                    src={userPhotoUrl} 
                    alt="User portrait preview" 
                    style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                </div>
              )}

              <button 
                disabled={!userPhotoUrl || loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: userPhotoUrl && !loading ? '#28a745' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: userPhotoUrl && !loading ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s',
                  marginBottom: '20px'
                }}
                onClick={handleGenerateTryOn}
              >
                {loading ? '⚡ Processing AI Virtual Try-On...' : 'Generate AI Virtual Try-On'}
              </button>

              {/* Dynamic Mirror Preview Box */}
              <div style={{ 
  width: '100%', 
  minHeight: '350px', // Forces the container to reserve physical vertical room
  background: finalAiResult ? '#ffffff' : selectedDress.colorTheme, 
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  border: finalAiResult ? '3px solid #28a745' : '1px solid #ddd',
  marginTop: '20px'
}}>
  {finalAiResult ? (
  <img 
    src={finalAiResult} // MUST point directly to your state string hook
    alt="AI Try-on Output Look" 
    style={{ 
      width: '100%', 
      height: '100%', 
      display: 'block', 
      objectFit: 'contain'
    }} 
  />
  ) : (
    <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>
      <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '6px' }}>
        {loading ? '⚡' : '👗'}
      </span>
      <span style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem' }}>
        {loading ? 'AI Model is Working...' : 'Studio Mirror Workspace'}
      </span>
    </div>
  )}
</div>
            </div>
          ) : (
            <p style={{ color: '#888', fontStyle: 'italic', margin: '0', textAlign: 'center', padding: '40px 0' }}>
              Choose a garment dress catalog on the left to begin the fitting preview session.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}