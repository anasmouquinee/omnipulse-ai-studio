import React, { useState } from 'react';
import type { MediaAsset } from '../../types/content';
import { ISLAMIC_BACKGROUND_THEMES } from '../../data/islamicBackgrounds';
import type { IslamicBackgroundTheme } from '../../data/islamicBackgrounds';
import { Film, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MediaLibraryViewProps {
  mediaList?: MediaAsset[];
  onUseAsset: (asset: MediaAsset) => void;
  onNewGenerate?: () => void;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  onUseAsset
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'reciters' | 'places' | 'atmosphere'>('all');

  const filteredThemes = ISLAMIC_BACKGROUND_THEMES.filter(theme => {
    if (selectedCategory === 'reciters') return theme.category === 'reciter_portrait';
    if (selectedCategory === 'places') return theme.category === 'mosque' || theme.category === 'mecca';
    if (selectedCategory === 'atmosphere') return theme.category === 'desert' || theme.category === 'lantern' || theme.category === 'sunrise' || theme.category === 'minimal';
    return true;
  });

  const handleApplyThemeToStudio = (theme: IslamicBackgroundTheme) => {
    const dummyAsset: MediaAsset = {
      id: `theme-${theme.id}-${Date.now()}`,
      url: theme.imageUrl,
      type: 'image',
      aspectRatio: '9:16',
      createdAt: new Date()
    };
    onUseAsset(dummyAsset);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Hero Header Bar */}
      <div className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.45) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #10b981 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Film size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                Banque Vidéos & Décors HD (100% Sans Filigrane)
              </h2>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                <ShieldCheck size={13} />
                Libre de droits
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Clips et visuels haute définition sans aucun logo tiers, prêts pour l'incrustation automatique de vos signatures officielles <strong>@kae.islamic</strong> & <strong>@kaelar.islamic</strong>.
            </p>
          </div>
        </div>

        {/* Categories Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(3, 7, 18, 0.75)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'all', label: 'Tous les Médias' },
            { id: 'reciters', label: '🎙️ Récitateurs HD' },
            { id: 'places', label: '🕋 Lieux Saints & Mosquées' },
            { id: 'atmosphere', label: '🌌 Ciel Étoilé & Lanternes' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                background: selectedCategory === tab.id ? 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)' : 'transparent',
                color: selectedCategory === tab.id ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Clean Watermark-Free Visuals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredThemes.map(theme => (
          <div
            key={theme.id}
            className="glass-card"
            style={{
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.65)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              overflow: 'hidden'
            }}
          >
            {/* Visual Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '9/16',
              maxHeight: 360,
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#020617'
            }}>
              <img
                src={theme.imageUrl}
                alt={theme.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {/* Dark Vignette Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)'
              }} />

              {/* Watermark-Free Badge */}
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '0.25rem 0.55rem',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                <CheckCircle2 size={12} />
                <span>Sans Filigrane Tiers</span>
              </div>

              {/* Auto Watermark Preview at Bottom */}
              <div style={{
                position: 'absolute',
                bottom: 10,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.75)',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}>
                Signature : @kae.islamic • @kaelar.islamic
              </div>
            </div>

            {/* Title & Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                {theme.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Format 9:16 Vertical HD • Optimisé pour TikTok & Reels
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleApplyThemeToStudio(theme)}
                style={{
                  width: '100%',
                  marginTop: '0.25rem',
                  gap: '0.4rem',
                  background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)',
                  fontWeight: 700
                }}
              >
                <span>Utiliser dans le Studio</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
