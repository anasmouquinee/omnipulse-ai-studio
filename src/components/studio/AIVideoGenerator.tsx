import React, { useState } from 'react';
import { Film, Sparkles, RefreshCw, Wand2, Play, Image as ImageIcon, Video } from 'lucide-react';
import type { VideoMotionPreset } from '../../types/ai';
import type { MediaAsset } from '../../types/content';

interface AIVideoGeneratorProps {
  videoPrompt: string;
  onVideoPromptChange: (val: string) => void;
  duration: 5 | 10 | 15;
  onDurationChange: (duration: 5 | 10 | 15) => void;
  motion: VideoMotionPreset;
  onMotionChange: (motion: VideoMotionPreset) => void;
  aspectRatio: '9:16' | '16:9' | '1:1';
  onAspectRatioChange: (ratio: '9:16' | '16:9' | '1:1') => void;
  isGenerating: boolean;
  onGenerate: () => void;
  currentMedia?: MediaAsset;
  suggestedPrompt?: string;
  onApplySuggestedPrompt?: () => void;
}

const MOTIONS: { key: VideoMotionPreset; label: string; emoji: string }[] = [
  { key: 'dynamic_pan', label: 'Panoramique Dynamique', emoji: '🎥' },
  { key: 'subtle_zoom', label: 'Zoom Avant Fluide', emoji: '🔍' },
  { key: 'fpv_drone', label: 'Vol FPV Drone', emoji: '🛸' },
  { key: 'orbit_360', label: 'Orbite Circulaire 360°', emoji: '🔄' },
  { key: 'timelapse', label: 'Timelapse Électrique', emoji: '⚡' },
];

export const AIVideoGenerator: React.FC<AIVideoGeneratorProps> = ({
  videoPrompt,
  onVideoPromptChange,
  duration,
  onDurationChange,
  motion,
  onMotionChange,
  aspectRatio,
  onAspectRatioChange,
  isGenerating,
  onGenerate,
  currentMedia,
  suggestedPrompt,
  onApplySuggestedPrompt
}) => {
  const [generationMode, setGenerationMode] = useState<'text_to_video' | 'image_to_video'>(
    currentMedia?.type === 'image' ? 'image_to_video' : 'text_to_video'
  );

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header with Video Engine Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--grad-video)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
          }}>
            <Film size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Moteur Vidéo IA (Text & Image-to-Video)</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Création de vidéos dynamiques pour TikTok, Reels, Shorts et X
            </p>
          </div>
        </div>

        {suggestedPrompt && onApplySuggestedPrompt && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onApplySuggestedPrompt}
            style={{ gap: '0.35rem' }}
          >
            <Sparkles size={14} color="var(--accent-amber)" />
            <span>Prompt IA suggéré</span>
          </button>
        )}
      </div>

      {/* Mode Switcher: Text-to-Video vs Image-to-Video */}
      <div className="tabs-container">
        <button
          type="button"
          className={`tab-btn ${generationMode === 'text_to_video' ? 'active' : ''}`}
          onClick={() => setGenerationMode('text_to_video')}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Video size={14} />
          <span>Text-to-Video (Depuis Prompt)</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${generationMode === 'image_to_video' ? 'active' : ''}`}
          onClick={() => setGenerationMode('image_to_video')}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <ImageIcon size={14} />
          <span>Image-to-Video (Animer Visuel Imagen 3)</span>
        </button>
      </div>

      {/* Image-to-Video Source Banner */}
      {generationMode === 'image_to_video' && (
        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {currentMedia?.type === 'image' ? (
            <>
              <img 
                src={currentMedia.url} 
                alt="Source Image" 
                style={{ width: 52, height: 52, borderRadius: 'var(--radius-xs)', objectFit: 'cover' }} 
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  Image source détectée (Imagen 3)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  L'IA va donner vie et animer cette image avec les mouvements de caméra sélectionnés.
                </div>
              </div>
            </>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              💡 Générez d'abord une image dans l'onglet <strong>2. Image Imagen 3</strong> pour l'animer ici !
            </div>
          )}
        </div>
      )}

      {/* Video Prompt */}
      <div className="form-group">
        <label className="form-label">
          <span>Prompt Vidéo & Mouvement d'animation</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Description de l'action, de l'animation et du rythme
          </span>
        </label>
        <textarea
          className="form-textarea"
          rows={2}
          value={videoPrompt}
          onChange={(e) => onVideoPromptChange(e.target.value)}
          placeholder="Ex: Cinematic dynamic camera zoom into glowing neural interface, volumetric lights, 60fps fluid loop..."
        />
      </div>

      {/* Settings Grid: Duration, Ratio */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Duration */}
        <div className="form-group">
          <label className="form-label">Durée du clip</label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {([5, 10, 15] as const).map(d => (
              <button
                key={d}
                type="button"
                className={`btn btn-sm ${duration === d ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onDurationChange(d)}
                style={{ flex: 1 }}
              >
                {d} secondes
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="form-group">
          <label className="form-label">Format Vidéo</label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['9:16', '16:9', '1:1'] as const).map(r => (
              <button
                key={r}
                type="button"
                className={`btn btn-sm ${aspectRatio === r ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onAspectRatioChange(r)}
                style={{ flex: 1 }}
              >
                {r === '9:16' ? '9:16 TikTok' : r === '16:9' ? '16:9 Paysage' : '1:1 Carré'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Motion Selector */}
      <div className="form-group">
        <label className="form-label">Mouvement de caméra IA</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {MOTIONS.map(m => (
            <button
              key={m.key}
              type="button"
              className={`btn btn-sm ${motion === m.key ? 'btn-video' : 'btn-secondary'}`}
              onClick={() => onMotionChange(m.key)}
              style={{ fontSize: '0.78rem' }}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button & Video Preview */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {currentMedia?.type === 'video' && (
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-sm)',
            border: '2px solid var(--accent-amber)',
            overflow: 'hidden',
            flexShrink: 0,
            background: '#000',
            position: 'relative'
          }}>
            <video 
              src={currentMedia.url} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              autoPlay 
              loop 
              muted 
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)'
            }}>
              <Play size={16} color="#fff" />
            </div>
          </div>
        )}

        <button
          className="btn btn-video btn-lg"
          onClick={onGenerate}
          disabled={isGenerating || videoPrompt.trim() === ''}
          style={{ flex: 1 }}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Génération Vidéo IA en cours...</span>
            </>
          ) : (
            <>
              <Wand2 size={18} />
              <span>
                {generationMode === 'image_to_video' ? 'Animer l’Image en Vidéo IA' : 'Générer le Clip Vidéo IA'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
