import React, { useState } from 'react';
import type { SocialPlatform, PlatformContent, MediaAsset } from '../../types/content';
import { TikTokPreview } from './TikTokPreview';
import { InstagramPreview } from './InstagramPreview';
import { XPreview } from './XPreview';
import { LinkedInPreview } from './LinkedInPreview';
import { FacebookPreview } from './FacebookPreview';
import { Copy, Check, Eye } from 'lucide-react';

interface MultiPlatformPreviewProps {
  platformContent: Record<SocialPlatform, PlatformContent>;
  media?: MediaAsset;
  activePlatform?: SocialPlatform;
  onSelectPlatform?: (platform: SocialPlatform) => void;
}

export const MultiPlatformPreview: React.FC<MultiPlatformPreviewProps> = ({
  platformContent,
  media,
  activePlatform = 'tiktok',
  onSelectPlatform
}) => {
  const [selectedTab, setSelectedTab] = useState<SocialPlatform>(activePlatform);
  const [copied, setCopied] = useState(false);

  const currentPlatform = onSelectPlatform ? activePlatform : selectedTab;
  const setPlatform = onSelectPlatform || setSelectedTab;

  const handleCopyText = () => {
    const textToCopy = platformContent[currentPlatform]?.text || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms: { key: SocialPlatform; label: string; iconLabel: string }[] = [
    { key: 'tiktok', label: 'TikTok', iconLabel: '🎵' },
    { key: 'instagram', label: 'Instagram', iconLabel: '📸' },
    { key: 'youtube', label: 'YouTube Shorts', iconLabel: '🔴' },
    { key: 'x', label: 'X (Twitter)', iconLabel: '🐦' },
    { key: 'linkedin', label: 'LinkedIn', iconLabel: '💼' },
    { key: 'facebook', label: 'Facebook', iconLabel: '👥' },
  ];

  return (
    <div className="preview-showcase">
      {/* Platform Switcher & Actions Bar */}
      <div className="preview-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={18} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '0.92rem', letterSpacing: '0.02em' }}>
            Aperçu Rendu Réel
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleCopyText}
            title="Copier le texte du post actuel"
          >
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
      </div>

      {/* Platform Selector Buttons */}
      <div className="preview-platform-selector">
        {platforms.map(p => (
          <button
            key={p.key}
            className={`platform-pill ${currentPlatform === p.key ? `active ${p.key}` : ''}`}
            onClick={() => setPlatform(p.key)}
          >
            <span>{p.iconLabel}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Render selected platform mockup */}
      <div style={{
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 0',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-subtle)'
      }}>
        {currentPlatform === 'tiktok' && (
          <TikTokPreview content={platformContent.tiktok} media={media} />
        )}
        {currentPlatform === 'instagram' && (
          <InstagramPreview content={platformContent.instagram} media={media} />
        )}
        {currentPlatform === 'x' && (
          <XPreview content={platformContent.x} media={media} />
        )}
        {currentPlatform === 'linkedin' && (
          <LinkedInPreview content={platformContent.linkedin} media={media} />
        )}
        {currentPlatform === 'facebook' && (
          <FacebookPreview content={platformContent.facebook} media={media} />
        )}
      </div>
    </div>
  );
};
