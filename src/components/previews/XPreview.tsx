import React from 'react';
import { MessageSquare, Repeat2, Heart, BarChart2, Bookmark, Share } from 'lucide-react';
import type { PlatformContent, MediaAsset } from '../../types/content';

interface XPreviewProps {
  content?: PlatformContent;
  media?: MediaAsset;
}

export const XPreview: React.FC<XPreviewProps> = ({ content, media }) => {
  const tweetText = content?.text || 'Automatisez la création et la publication de vos contenus avec Gemini Flash et Imagen 3 ⚡ #IA #Productivity';
  const mediaUrl = media?.url;
  const isVideo = media?.type === 'video';

  return (
    <div className="x-post-card">
      <div className="x-header">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" 
          alt="Avatar" 
          className="x-avatar"
        />
        <div className="x-meta">
          <div className="x-user-row">
            <span className="x-name">OmniPulse Studio</span>
            <svg viewBox="0 0 24 24" className="x-badge-verified" fill="currentColor">
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6S8.65 2.475 8.01 3.738c-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5s.875 2.95 2.148 3.6c-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.15 1.262 2.52 2.138 4.1 2.138s2.95-.876 3.6-2.138c.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.05 4.542l-4.52-4.52 1.414-1.414 3.106 3.106 7.545-7.545 1.414 1.414-8.959 8.959z" />
            </svg>
            <span className="x-handle">@omnipulse_app</span>
            <span className="x-dot">·</span>
            <span className="x-time">1h</span>
          </div>

          {/* Tweet Content */}
          <div className="x-content-text">
            {tweetText}
          </div>

          {/* Media attachment */}
          {mediaUrl && (
            <div className="x-media-container">
              {isVideo ? (
                <video 
                  src={mediaUrl} 
                  style={{ width: '100%', maxHeight: '320px', objectFit: 'cover' }} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                />
              ) : (
                <img 
                  src={mediaUrl} 
                  alt="Post Attachment" 
                  className="x-media-img"
                />
              )}
            </div>
          )}

          {/* Metrics bar */}
          <div className="x-metrics-row">
            <div className="x-metric-item">
              <MessageSquare size={16} />
              <span>42</span>
            </div>
            <div className="x-metric-item">
              <Repeat2 size={16} />
              <span>128</span>
            </div>
            <div className="x-metric-item">
              <Heart size={16} />
              <span>854</span>
            </div>
            <div className="x-metric-item">
              <BarChart2 size={16} />
              <span>24.5k</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Bookmark size={16} />
              <Share size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
