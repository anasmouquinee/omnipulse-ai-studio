import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Lightbulb } from 'lucide-react';
import type { AITone } from '../../types/ai';
import type { SocialPlatform } from '../../types/content';
import { PROMPT_INSPIRATIONS } from '../../data/mockData';

interface AITextGeneratorProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  tone: AITone;
  onToneChange: (tone: AITone) => void;
  selectedPlatforms: SocialPlatform[];
  onTogglePlatform: (platform: SocialPlatform) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const TONES: { key: AITone; label: string; emoji: string }[] = [
  { key: 'viral', label: 'Viral & Accrocheur', emoji: '🔥' },
  { key: 'professional', label: 'B2B & Professionnel', emoji: '💼' },
  { key: 'educational', label: 'Éducatif & Valeur', emoji: '💡' },
  { key: 'storytelling', label: 'Storytelling & Émotion', emoji: '📖' },
  { key: 'humorous', label: 'Humoristique & Décalé', emoji: '😄' },
  { key: 'direct_sales', label: 'Vente & Conversion', emoji: '🎯' },
  { key: 'inspiring', label: 'Inspirant & Motivation', emoji: '✨' },
];

const PLATFORMS: { key: SocialPlatform; label: string; icon: string }[] = [
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'instagram', label: 'Instagram', icon: '📸' },
  { key: 'x', label: 'X (Twitter)', icon: '🐦' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'facebook', label: 'Facebook', icon: '👥' },
];

export const AITextGenerator: React.FC<AITextGeneratorProps> = ({
  prompt,
  onPromptChange,
  tone,
  onToneChange,
  selectedPlatforms,
  onTogglePlatform,
  isGenerating,
  onGenerate
}) => {
  const [showInspirations, setShowInspirations] = useState(false);

  const applyInspiration = (insp: { prompt: string; tone: string }) => {
    onPromptChange(insp.prompt);
    onToneChange(insp.tone as AITone);
    setShowInspirations(false);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header with Gemini Flash Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--grad-gemini)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 12px var(--accent-primary-glow)'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Moteur Texte Gemini Flash</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Génération d’accroches virales, légendes et scripts multi-plateformes
            </p>
          </div>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setShowInspirations(!showInspirations)}
          style={{ gap: '0.35rem' }}
        >
          <Lightbulb size={14} color="var(--accent-amber)" />
          <span>{showInspirations ? 'Masquer idées' : 'Idées de contenu'}</span>
        </button>
      </div>

      {/* Inspirations Drawer */}
      {showInspirations && (
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}>
          {PROMPT_INSPIRATIONS.map((insp, i) => (
            <div
              key={i}
              onClick={() => applyInspiration(insp)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.75rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              className="glass-card"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {insp.category}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                {insp.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                {insp.prompt.slice(0, 75)}...
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Idea Input */}
      <div className="form-group">
        <label className="form-label">
          <span>Sujet, Idée principale ou Angle éditorial</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Ex: "Conseils pour doubler son engagement", "Sortie produit v2"
          </span>
        </label>
        <textarea
          className="form-textarea"
          rows={3}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Décrivez votre idée de contenu, l'angle, ou le message clé à faire passer..."
        />
      </div>

      {/* Tone of Voice Selector */}
      <div className="form-group">
        <label className="form-label">Tonalité & Style d’expression</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {TONES.map(t => (
            <button
              key={t.key}
              type="button"
              className={`btn btn-sm ${tone === t.key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onToneChange(t.key)}
              style={{ fontSize: '0.78rem' }}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Networks Selectors */}
      <div className="form-group">
        <label className="form-label">Réseaux cibles pour la déclinaison</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PLATFORMS.map(p => {
            const isSelected = selectedPlatforms.includes(p.key);
            return (
              <button
                key={p.key}
                type="button"
                className={`platform-pill ${isSelected ? `active ${p.key}` : ''}`}
                onClick={() => onTogglePlatform(p.key)}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Action Button */}
      <button
        className="btn btn-gemini btn-lg"
        onClick={onGenerate}
        disabled={isGenerating || prompt.trim() === ''}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {isGenerating ? (
          <>
            <RefreshCw size={18} className="animate-spin" />
            <span>Génération Gemini Flash en cours...</span>
          </>
        ) : (
          <>
            <Wand2 size={18} />
            <span>Générer le Pack Multi-Réseaux avec Gemini</span>
          </>
        )}
      </button>
    </div>
  );
};
