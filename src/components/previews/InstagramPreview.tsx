import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import type { PlatformContent, MediaAsset } from '../../types/content';

interface InstagramPreviewProps {
  content?: PlatformContent;
  media?: MediaAsset;
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({ content, media }) => {
  const displayCaption = content?.text || 'Découvrez notre nouvelle approche pour automatiser vos réseaux sociaux avec Gemini Flash et Imagen 3 ✨';
  const hashtags = content?.hashtags?.join(' ') || '#socialmedia #automation #creativity #ia #gemini';
  const mediaUrl = media?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
  const isVideo = media?.type === 'video';

  return (
    <div className="instagram-post-card">
      {/* Header */}
      <div className="ig-header">
        <div className="ig-author">
          <div className="ig-avatar-ring">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" 
              alt="Avatar" 
              className="ig-avatar-img"
            />
          </div>
          <div>
            <div className="ig-username">pulse.creativestudio</div>
            <div style={{ fontSize: '0.7rem', color: '#A8A8A8' }}>Original Audio</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem', color: '#A8A8A8' }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Media Content */}
      <div className="ig-media-wrapper" style={{ aspectRatio: media?.aspectRatio === '4:5' ? '4/5' : '1/1' }}>
        {isVideo ? (
          <video 
            src={mediaUrl} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            autoPlay 
            loop 
            muted 
            playsInline
          />
        ) : (
          <img 
            src={mediaUrl} 
            alt="Instagram Post" 
            className="ig-media-img"
          />
        )}
      </div>

      {/* Actions */}
      <div className="ig-actions-bar">
        <div className="ig-actions-left">
          <Heart size={24} fill="#FE2C55" color="#FE2C55" style={{ cursor: 'pointer' }} />
          <MessageCircle size={24} color="#fff" style={{ cursor: 'pointer' }} />
          <Send size={24} color="#fff" style={{ cursor: 'pointer' }} />
        </div>
        <div>
          <Bookmark size={24} color="#fff" style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Likes */}
      <div className="ig-likes">
        1 428 J’aime
      </div>

      {/* Caption block */}
      <div className="ig-caption-block">
        <span className="ig-caption-author">pulse.creativestudio</span>
        <span style={{ whiteSpace: 'pre-line' }}>{displayCaption}</span>
        {hashtags && (
          <div style={{ color: '#0095F6', marginTop: '0.4rem', fontSize: '0.82rem' }}>
            {hashtags}
          </div>
        )}
      </div>

      {/* Timestamp */}
      <div className="ig-date-tag">
        Il y a 2 heures
      </div>
    </div>
  );
};
