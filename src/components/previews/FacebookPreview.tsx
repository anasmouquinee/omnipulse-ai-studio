import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal } from 'lucide-react';
import type { PlatformContent, MediaAsset } from '../../types/content';

interface FacebookPreviewProps {
  content?: PlatformContent;
  media?: MediaAsset;
}

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({ content, media }) => {
  const postText = content?.text || 'Découvrez comment automatiser votre calendrier éditorial sur tous vos réseaux avec OmniPulse Studio.';
  const hashtags = content?.hashtags?.join(' ') || '#marketing #entrepreneuriat #ia';
  const mediaUrl = media?.url;
  const isVideo = media?.type === 'video';

  return (
    <div className="facebook-post-card">
      {/* Header */}
      <div className="facebook-header">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
          alt="Avatar" 
          className="facebook-avatar"
        />
        <div style={{ flex: 1 }}>
          <div className="facebook-name">OmniPulse Community</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
            <span className="facebook-time">Hier à 14:30 · </span>
            <Globe size={12} color="#B0B3B8" />
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem', color: '#B0B3B8' }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post Text */}
      <div className="facebook-text">
        <div style={{ whiteSpace: 'pre-line' }}>{postText}</div>
        {hashtags && <div style={{ color: '#4599FF', marginTop: '0.4rem' }}>{hashtags}</div>}
      </div>

      {/* Media Attachment */}
      {mediaUrl && (
        <div>
          {isVideo ? (
            <video 
              src={mediaUrl} 
              style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} 
              autoPlay 
              loop 
              muted 
              playsInline
            />
          ) : (
            <img 
              src={mediaUrl} 
              alt="Facebook Post" 
              className="facebook-media-img"
            />
          )}
        </div>
      )}

      {/* Stats preview */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        fontSize: '0.78rem',
        color: '#B0B3B8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ background: '#1877F2', borderRadius: '50%', padding: '2px', display: 'flex' }}>
            <ThumbsUp size={10} color="#fff" />
          </span>
          <span>384</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span>48 commentaires</span>
          <span>19 partages</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="facebook-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <ThumbsUp size={18} />
          <span>J’aime</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <MessageCircle size={18} />
          <span>Commenter</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <Share2 size={18} />
          <span>Partager</span>
        </div>
      </div>
    </div>
  );
};
