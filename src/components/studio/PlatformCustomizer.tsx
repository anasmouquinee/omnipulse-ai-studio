import React, { useState } from 'react';
import type { SocialPlatform, PlatformContent } from '../../types/content';
import { Sliders, Hash, Video, MessageSquare, AlertCircle } from 'lucide-react';

interface PlatformCustomizerProps {
  platformContent: Record<SocialPlatform, PlatformContent>;
  onUpdateContent: (platform: SocialPlatform, updated: Partial<PlatformContent>) => void;
  activePlatform: SocialPlatform;
  onSelectPlatform: (platform: SocialPlatform) => void;
}

const CHAR_LIMITS: Record<SocialPlatform, number> = {
  tiktok: 2200,
  instagram: 2200,
  youtube: 5000,
  x: 280,
  linkedin: 3000,
  facebook: 63206,
};

const PLATFORMS: { key: SocialPlatform; label: string; icon: string }[] = [
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'instagram', label: 'Instagram', icon: '📸' },
  { key: 'youtube', label: 'YouTube Shorts', icon: '🔴' },
  { key: 'x', label: 'X (Twitter)', icon: '🐦' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'facebook', label: 'Facebook', icon: '👥' },
];

export const PlatformCustomizer: React.FC<PlatformCustomizerProps> = ({
  platformContent,
  onUpdateContent,
  activePlatform,
  onSelectPlatform
}) => {
  const current = platformContent[activePlatform] || { text: '', hashtags: [] };
  const charLimit = CHAR_LIMITS[activePlatform];
  const currentLength = (current.text || '').length;
  const isOverLimit = currentLength > charLimit;

  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newTag.trim()) return;
    const cleanTag = newTag.startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
    if (!current.hashtags?.includes(cleanTag)) {
      onUpdateContent(activePlatform, {
        hashtags: [...(current.hashtags || []), cleanTag]
      });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateContent(activePlatform, {
      hashtags: (current.hashtags || []).filter(t => t !== tagToRemove)
    });
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Ajustement sur mesure par Réseau</h3>
        </div>

        {/* Character count pill */}
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: isOverLimit ? 'var(--accent-rose)' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          {isOverLimit && <AlertCircle size={14} />}
          <span>{currentLength} / {charLimit} car.</span>
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="tabs-container">
        {PLATFORMS.map(p => (
          <button
            key={p.key}
            type="button"
            className={`tab-btn ${activePlatform === p.key ? 'active' : ''}`}
            onClick={() => onSelectPlatform(p.key)}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Hook Field if applicable */}
      {(activePlatform === 'tiktok' || activePlatform === 'instagram' || activePlatform === 'linkedin') && (
        <div className="form-group">
          <label className="form-label">
            <span>Accroche visuelle / Titre (Hook)</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Captive dans les 3 premières secondes</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={current.hook || ''}
            onChange={(e) => onUpdateContent(activePlatform, { hook: e.target.value })}
            placeholder="Ex: Arrête de faire cette erreur en 2026..."
          />
        </div>
      )}

      {/* Video Script if TikTok */}
      {activePlatform === 'tiktok' && (
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Video size={14} color="var(--color-tiktok)" />
              Script de tournage vidéo TikTok (Scène par scène)
            </span>
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            value={current.videoScript || ''}
            onChange={(e) => onUpdateContent(activePlatform, { videoScript: e.target.value })}
            placeholder="[Scène 1] Montre le problème&#10;[Scène 2] Explique la solution&#10;[Scène 3] CTA..."
          />
        </div>
      )}

      {/* Main Post Text / Caption */}
      <div className="form-group">
        <label className="form-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MessageSquare size={14} />
            Texte / Légende de la publication
          </span>
        </label>
        <textarea
          className="form-textarea"
          rows={5}
          value={current.text || ''}
          onChange={(e) => onUpdateContent(activePlatform, { text: e.target.value })}
          placeholder="Rédigez ou personnalisez le texte de votre publication..."
          style={{ borderColor: isOverLimit ? 'var(--accent-rose)' : undefined }}
        />
      </div>

      {/* Hashtags Tags Editor */}
      <div className="form-group">
        <label className="form-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Hash size={14} color="var(--accent-primary)" />
            Hashtags ciblés
          </span>
        </label>

        {/* Existing Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
          {(current.hashtags || []).map((tag, idx) => (
            <span
              key={idx}
              className="badge"
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
              onClick={() => handleRemoveTag(tag)}
              title="Cliquer pour supprimer"
            >
              {tag} <span style={{ marginLeft: '0.3rem', color: 'var(--accent-rose)' }}>×</span>
            </span>
          ))}
        </div>

        {/* Add Tag Input */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-input"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Ajouter un hashtag (ex: #ia) et appuyer sur Entrée..."
            style={{ fontSize: '0.85rem' }}
          />
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleAddTag}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};
