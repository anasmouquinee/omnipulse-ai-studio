import React, { useState } from 'react';
import type { MediaAsset } from '../../types/content';
import { Image as ImageIcon, Film, Plus, Sparkles } from 'lucide-react';

interface MediaLibraryViewProps {
  mediaList: MediaAsset[];
  onUseAsset: (asset: MediaAsset) => void;
  onNewGenerate: () => void;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  mediaList,
  onUseAsset,
  onNewGenerate
}) => {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');

  const filtered = mediaList.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Bar */}
      <div className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--grad-imagen)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px var(--accent-pink-glow)'
          }}>
            <ImageIcon size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Médiathèque IA (Imagen 3 & Vidéos)</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Stockage et réutilisation de vos créations graphiques et clips animés
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="tabs-container">
            <button
              className={`tab-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Tous ({mediaList.length})
            </button>
            <button
              className={`tab-btn ${filterType === 'image' ? 'active' : ''}`}
              onClick={() => setFilterType('image')}
            >
              <ImageIcon size={14} />
              Images
            </button>
            <button
              className={`tab-btn ${filterType === 'video' ? 'active' : ''}`}
              onClick={() => setFilterType('video')}
            >
              <Film size={14} />
              Vidéos
            </button>
          </div>

          <button className="btn btn-primary btn-sm" onClick={onNewGenerate}>
            <Plus size={15} />
            <span>Générer un Asset</span>
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {filtered.map(asset => (
          <div
            key={asset.id}
            className="glass-card"
            style={{
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              overflow: 'hidden'
            }}
          >
            {/* Visual Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: 220,
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#000'
            }}>
              {asset.type === 'video' ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <video
                    src={asset.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(6px)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.7rem',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Film size={12} color="var(--accent-amber)" />
                    <span>Vidéo {asset.durationSeconds}s</span>
                  </div>
                </div>
              ) : (
                <img
                  src={asset.url}
                  alt={asset.promptUsed || 'Asset'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* Ratio badge */}
              <span style={{
                position: 'absolute',
                bottom: '0.5rem',
                right: '0.5rem',
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-xs)'
              }}>
                {asset.aspectRatio}
              </span>
            </div>

            {/* Prompt Excerpt */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {asset.engine === 'imagen3' ? 'Google Imagen 3' : 'Moteur Vidéo IA'}
              </div>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginTop: '0.2rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {asset.promptUsed || 'Génération multimodale'}
              </p>
            </div>

            {/* Use Asset Button */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onUseAsset(asset)}
              style={{ width: '100%', gap: '0.4rem' }}
            >
              <Sparkles size={14} color="var(--accent-primary)" />
              <span>Créer un Post avec cet Asset</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
