import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Music, Disc } from 'lucide-react';
import type { PlatformContent, MediaAsset } from '../../types/content';

interface TikTokPreviewProps {
  content?: PlatformContent;
  media?: MediaAsset;
}

export const TikTokPreview: React.FC<TikTokPreviewProps> = ({ content, media }) => {
  const displayHook = content?.hook || 'Accroche virale en 3 secondes 🚀';
  const displayCaption = content?.text || 'Découvrez comment automatiser votre création de contenu avec OmniPulse AI. #fyp #viral #tech #creator';
  const displayAudio = content?.audioTrackSuggestion || 'Son original - OmniPulse Studio (Tendance)';
  const mediaUrl = media?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
  const isVideo = media?.type === 'video';

  return (
    <div className="tiktok-phone-frame">
      {/* Background Media (Video or Image) */}
      {isVideo ? (
        <video 
          src={mediaUrl} 
          className="tiktok-video-bg" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
      ) : (
        <img 
          src={mediaUrl} 
          alt="TikTok Media" 
          className="tiktok-video-bg"
        />
      )}

      {/* Dark overlay for contrast */}
      <div className="tiktok-video-overlay" />

      {/* Top Header */}
      <div className="tiktok-top-bar">
        <span>Abonnements</span>
        <span className="active">Pour toi</span>
      </div>

      {/* On-screen Visual Hook Banner */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '1rem',
        right: '1rem',
        zIndex: 4,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(254, 44, 85, 0.4)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem 1rem',
        textAlign: 'center',
        boxShadow: '0 0 20px rgba(0,0,0,0.8)'
      }}>
        <p style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {displayHook}
        </p>
      </div>

      {/* Sidebar Action Buttons */}
      <div className="tiktok-sidebar-actions">
        {/* Creator Avatar */}
        <div className="tiktok-avatar-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
            alt="Creator" 
            className="tiktok-avatar-img"
          />
          <div className="tiktok-avatar-plus">+</div>
        </div>

        {/* Like */}
        <div className="tiktok-action-btn">
          <div className="tiktok-action-icon-circle">
            <Heart size={22} fill="#FE2C55" color="#FE2C55" />
          </div>
          <span>24.8k</span>
        </div>

        {/* Comment */}
        <div className="tiktok-action-btn">
          <div className="tiktok-action-icon-circle">
            <MessageCircle size={22} fill="#fff" color="#fff" />
          </div>
          <span>482</span>
        </div>

        {/* Bookmark */}
        <div className="tiktok-action-btn">
          <div className="tiktok-action-icon-circle">
            <Bookmark size={22} fill="#F59E0B" color="#F59E0B" />
          </div>
          <span>1.2k</span>
        </div>

        {/* Share */}
        <div className="tiktok-action-btn">
          <div className="tiktok-action-icon-circle">
            <Share2 size={22} color="#fff" />
          </div>
          <span>350</span>
        </div>

        {/* Rotating Music Disc */}
        <div className="animate-spin" style={{ animationDuration: '4s' }}>
          <div className="tiktok-action-icon-circle" style={{ background: '#111', border: '2px solid #333' }}>
            <Disc size={20} color="#FE2C55" />
          </div>
        </div>
      </div>

      {/* Bottom Info & Captions */}
      <div className="tiktok-bottom-info">
        <div className="tiktok-username">@pulsecreator_ai</div>
        <div className="tiktok-caption">
          {displayCaption}
        </div>
        <div className="tiktok-audio-track">
          <Music size={13} />
          <span style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayAudio}
          </span>
        </div>
      </div>
    </div>
  );
};
