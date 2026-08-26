import React from 'react';
import type { ScheduledPost, SocialPlatform } from '../../types/content';
import { Clock, Send, Trash2, Edit3 } from 'lucide-react';

interface PostCardProps {
  post: ScheduledPost;
  onEdit: (post: ScheduledPost) => void;
  onPublishNow: (post: ScheduledPost) => void;
  onDelete: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onPublishNow,
  onDelete
}) => {
  const dateObj = new Date(post.scheduledTime);
  const formattedDate = dateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'tiktok': return '🎵';
      case 'instagram': return '📸';
      case 'x': return '🐦';
      case 'linkedin': return '💼';
      case 'facebook': return '👥';
      default: return '🌐';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="badge badge-published">Publié</span>;
      case 'scheduled':
        return <span className="badge badge-scheduled">Planifié</span>;
      case 'publishing':
        return <span className="badge badge-gemini">En cours...</span>;
      case 'failed':
        return <span className="badge badge-failed">Échoué</span>;
      default:
        return <span className="badge badge-draft">Brouillon</span>;
    }
  };

  return (
    <div 
      className="glass-card" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        padding: '1.1rem',
        borderLeft: `3px solid ${
          post.status === 'published' 
            ? 'var(--accent-emerald)' 
            : post.status === 'scheduled' 
              ? 'var(--accent-cyan)' 
              : 'var(--accent-primary)'
        }`
      }}
    >
      {/* Top Meta Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {post.platforms.map(p => (
            <span key={p} title={p} style={{ fontSize: '0.85rem' }}>
              {getPlatformIcon(p)}
            </span>
          ))}
        </div>
        {getStatusBadge(post.status)}
      </div>

      {/* Media Thumbnail & Title */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {post.media?.url && (
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-xs)',
            overflow: 'hidden',
            flexShrink: 0,
            background: '#000'
          }}>
            <img 
              src={post.media.url} 
              alt="Media" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.title || post.originalIdea}
          </h4>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginTop: '0.2rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {post.platformContent[post.platforms[0]]?.text || post.originalIdea}
          </p>
        </div>
      </div>

      {/* Date & Action Buttons Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.6rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={13} color="var(--accent-cyan)" />
          <span>{formattedDate}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {post.status !== 'published' && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onPublishNow(post)}
              title="Publier immédiatement"
              style={{ color: 'var(--accent-emerald)', padding: '0.3rem' }}
            >
              <Send size={14} />
            </button>
          )}

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onEdit(post)}
            title="Modifier dans le Studio"
            style={{ padding: '0.3rem' }}
          >
            <Edit3 size={14} />
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onDelete(post.id)}
            title="Supprimer la publication"
            style={{ color: 'var(--accent-rose)', padding: '0.3rem' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
