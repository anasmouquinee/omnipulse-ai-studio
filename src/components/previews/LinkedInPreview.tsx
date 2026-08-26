import React from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Globe } from 'lucide-react';
import type { PlatformContent, MediaAsset } from '../../types/content';

interface LinkedInPreviewProps {
  content?: PlatformContent;
  media?: MediaAsset;
}

export const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({ content, media }) => {
  const headline = content?.hook || 'L’automatisation des réseaux sociaux en 2026';
  const bodyText = content?.text || 'Dans un monde où la rapidité d’exécution fait la différence, les créateurs et entreprises adoptent des workflows multimodaux.';
  const hashtags = content?.hashtags?.join(' ') || '#IA #MarketingStrategy #Productivite';
  const mediaUrl = media?.url;
  const isVideo = media?.type === 'video';

  return (
    <div className="linkedin-post-card">
      {/* Header */}
      <div className="linkedin-header">
        <img 
          src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80" 
          alt="Avatar" 
          className="linkedin-avatar"
        />
        <div className="linkedin-info">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="linkedin-name">OmniPulse Technologies</span>
            <button className="btn btn-ghost btn-sm" style={{ color: '#70B5F9', fontWeight: 700, fontSize: '0.82rem' }}>
              + Suivre
            </button>
          </div>
          <div className="linkedin-headline">Plateforme d’Automatisation IA & Création Multimodale</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
            <span className="linkedin-timestamp">3 h • Modifié • </span>
            <Globe size={12} color="#6E7378" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="linkedin-text">
        {headline && <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>{headline}</div>}
        <div style={{ whiteSpace: 'pre-line' }}>{bodyText}</div>
        {hashtags && <div style={{ color: '#70B5F9', marginTop: '0.5rem' }}>{hashtags}</div>}
      </div>

      {/* Media */}
      {mediaUrl && (
        <div className="linkedin-media">
          {isVideo ? (
            <video 
              src={mediaUrl} 
              style={{ width: '100%', maxHeight: '340px', objectFit: 'cover' }} 
              autoPlay 
              loop 
              muted 
              playsInline
            />
          ) : (
            <img 
              src={mediaUrl} 
              alt="LinkedIn Post" 
              className="linkedin-media-img"
            />
          )}
        </div>
      )}

      {/* Footer Reactions */}
      <div className="linkedin-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <ThumbsUp size={16} />
          <span>J’aime</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <MessageSquare size={16} />
          <span>Commenter</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <Repeat2 size={16} />
          <span>Republier</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <Send size={16} />
          <span>Envoyer</span>
        </div>
      </div>
    </div>
  );
};
