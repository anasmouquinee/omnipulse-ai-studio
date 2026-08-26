import React from 'react';
import { Image as ImageIcon, Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import type { ImageAspectRatio, ImageStylePreset } from '../../types/ai';
import type { MediaAsset } from '../../types/content';

interface AIImageGeneratorProps {
  imagePrompt: string;
  onImagePromptChange: (val: string) => void;
  aspectRatio: ImageAspectRatio;
  onAspectRatioChange: (ratio: ImageAspectRatio) => void;
  style: ImageStylePreset;
  onStyleChange: (style: ImageStylePreset) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  currentMedia?: MediaAsset;
  suggestedPrompt?: string;
  onApplySuggestedPrompt?: () => void;
}

const ASPECT_RATIOS: { key: ImageAspectRatio; label: string; desc: string }[] = [
  { key: '1:1', label: '1:1 Carré', desc: 'Instagram Feed, Facebook' },
  { key: '4:5', label: '4:5 Portrait', desc: 'Instagram Portrait optimisé' },
  { key: '9:16', label: '9:16 Vertical', desc: 'TikTok, Reels, Stories' },
  { key: '16:9', label: '16:9 Paysage', desc: 'X (Twitter), LinkedIn' },
];

const STYLES: { key: ImageStylePreset; label: string; emoji: string }[] = [
  { key: 'cinematic', label: 'Cinématique 8K', emoji: '🎬' },
  { key: 'hyperrealistic_photo', label: 'Photo Réaliste', emoji: '📷' },
  { key: 'minimalist_3d', label: '3D Minimaliste', emoji: '🧊' },
  { key: 'cyberpunk_neon', label: 'Cyberpunk & Néon', emoji: '⚡' },
  { key: 'editorial_luxury', label: 'Luxe & Éditorial', emoji: '✨' },
];

export const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({
  imagePrompt,
  onImagePromptChange,
  aspectRatio,
  onAspectRatioChange,
  style,
  onStyleChange,
  isGenerating,
  onGenerate,
  currentMedia,
  suggestedPrompt,
  onApplySuggestedPrompt
}) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header with Imagen 3 Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--grad-imagen)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 12px var(--accent-pink-glow)'
          }}>
            <ImageIcon size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Générateur Visuel Imagen 3</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Création d'images haute résolution calibrées au pixel près
            </p>
          </div>
        </div>

        {suggestedPrompt && onApplySuggestedPrompt && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onApplySuggestedPrompt}
            style={{ gap: '0.35rem' }}
          >
            <Sparkles size={14} color="var(--accent-pink)" />
            <span>Utiliser prompt IA suggéré</span>
          </button>
        )}
      </div>

      {/* Image Prompt Field */}
      <div className="form-group">
        <label className="form-label">
          <span>Prompt Visuel pour Imagen 3</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Description précise de la scène, de l'éclairage et des textures
          </span>
        </label>
        <textarea
          className="form-textarea"
          rows={2}
          value={imagePrompt}
          onChange={(e) => onImagePromptChange(e.target.value)}
          placeholder="Ex: Futuristic holographic neural network visualization in neon cyber-violet, obsidian background, 8k render..."
        />
      </div>

      {/* Aspect Ratio Selector */}
      <div className="form-group">
        <label className="form-label">Format & Ratio d'aspect</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
          {ASPECT_RATIOS.map(r => (
            <button
              key={r.key}
              type="button"
              className={`btn btn-sm ${aspectRatio === r.key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onAspectRatioChange(r.key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.5rem 0.75rem',
                gap: '0.1rem',
                border: aspectRatio === r.key ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{r.label}</span>
              <span style={{ fontSize: '0.68rem', color: aspectRatio === r.key ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                {r.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Style Preset Selector */}
      <div className="form-group">
        <label className="form-label">Style Visuel & Ambiance</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {STYLES.map(s => (
            <button
              key={s.key}
              type="button"
              className={`btn btn-sm ${style === s.key ? 'btn-imagen' : 'btn-secondary'}`}
              onClick={() => onStyleChange(s.key)}
              style={{ fontSize: '0.78rem' }}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Preview & Generate Button */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {currentMedia?.type === 'image' && (
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-sm)',
            border: '2px solid var(--accent-primary)',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
          }}>
            <img 
              src={currentMedia.url} 
              alt="Generated" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}

        <button
          className="btn btn-imagen btn-lg"
          onClick={onGenerate}
          disabled={isGenerating || imagePrompt.trim() === ''}
          style={{ flex: 1 }}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Génération Imagen 3 en cours...</span>
            </>
          ) : (
            <>
              <Wand2 size={18} />
              <span>Générer l'image avec Imagen 3</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
