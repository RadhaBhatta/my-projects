import React from 'react';

export interface Garment {
  id: string;
  name: string;
  category: string;
  price: number;
  colorTheme: string; // Using raw CSS color hex strings instead of unstable web links
}

const LOCAL_CATALOG: Garment[] = [
  {
    id: 'dress-001',
    name: 'Elegant Emerald Evening Gown',
    category: 'Dress',
    price: 129.99,
    colorTheme: 'linear-gradient(135deg, #11998e, #38ef7d)' // Emerald green gradient
  },
  {
    id: 'dress-002',
    name: 'Summer Pastel Floral Mini',
    category: 'Dress',
    price: 79.50,
    colorTheme: 'linear-gradient(135deg, #ff007f, #ffaa00)' // Vibrant sunset orange/pink
  },
  {
    id: 'dress-003',
    name: 'Classic Crimson Cocktail Dress',
    category: 'Dress',
    price: 95.00,
    colorTheme: 'linear-gradient(135deg, #cb2d3e, #ef473a)' // Crimson red gradient
  }
];

interface DressGalleryProps {
  selectedDressId: string | null;
  onSelectDress: (dress: Garment) => void;
}

export const DressGallery: React.FC<DressGalleryProps> = ({ selectedDressId, onSelectDress }) => {
  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
        Select a Dress Catalog
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {LOCAL_CATALOG.map((dress) => {
          const isSelected = dress.id === selectedDressId;
          
          return (
            <div 
              key={dress.id}
              onClick={() => onSelectDress(dress)}
              style={{
                border: isSelected ? '3px solid #007bff' : '1px solid #ddd',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                backgroundColor: '#fff',
                boxShadow: isSelected ? '0 4px 14px rgba(0,123,255,0.25)' : '0 2px 5px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Pure CSS background graphic replacing the broken <img> tag */}
              <div style={{ 
                width: '100%', 
                height: '240px', 
                background: dress.colorTheme, 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
              }}>
                <span style={{ 
                  color: '#fff', 
                  fontWeight: 'bold', 
                  backgroundColor: 'rgba(0,0,0,0.3)', 
                  padding: '6px 12px', 
                  borderRadius: '20px',
                  fontSize: '0.85rem'
                }}>
                  👗 Dress Render
                </span>
              </div>

              <div style={{ marginTop: '12px' }}>
                <h3 style={{ fontSize: '1rem', margin: '4px 0', fontWeight: '600', color: '#222' }}>
                  {dress.name}
                </h3>
                <p style={{ color: '#28a745', fontWeight: 'bold', margin: '0' }}>
                  ${dress.price.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};