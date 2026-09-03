import React, { useState } from 'react';
import type { ScheduledPost, SocialPlatform, PostStatus } from '../../types/content';
import { PostCard } from './PostCard';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, List, Grid } from 'lucide-react';

interface CalendarViewProps {
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onPublishNow: (post: ScheduledPost) => void;
  onDeletePost: (postId: string) => void;
  onNewPost: (initialDate?: Date) => void;
}

type CalendarMode = 'month' | 'timeline';

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onEditPost,
  onPublishNow,
  onDeletePost,
  onNewPost
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarMode>('month');
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesPlatform = platformFilter === 'all' || post.platforms.includes(platformFilter);
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesPlatform && matchesStatus;
  });

  // Generate Month Days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPrefixes = Array.from({ length: firstDayIndex }, (_, i) => i);

  const getPostsForDay = (day: number) => {
    return filteredPosts.filter(p => {
      const pDate = new Date(p.scheduledTime);
      return pDate.getFullYear() === year && pDate.getMonth() === month && pDate.getDate() === day;
    });
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Controls Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        background: 'var(--bg-surface)',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={prevMonth}>
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={nextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'capitalize' }}>
            {monthName}
          </h2>
        </div>

        {/* View Mode & Filter Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mode Switcher */}
          <div className="tabs-container">
            <button
              className={`tab-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              <Grid size={15} />
              <span>Grille Mois</span>
            </button>
            <button
              className={`tab-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <List size={15} />
              <span>Timeline ({filteredPosts.length})</span>
            </button>
          </div>

          {/* Platform Filters */}
          <select
            className="form-select"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
          >
            <option value="all">Tous les Réseaux</option>
            <option value="tiktok">TikTok 🎵</option>
            <option value="instagram">Instagram 📸</option>
            <option value="youtube">YouTube Shorts 🔴</option>
            <option value="x">X (Twitter) 🐦</option>
            <option value="linkedin">LinkedIn 💼</option>
            <option value="facebook">Facebook 👥</option>
          </select>

          {/* Status Filters */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
          >
            <option value="all">Tous les Statuts</option>
            <option value="scheduled">Planifiés</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>

          <button className="btn btn-primary btn-sm" onClick={() => onNewPost()}>
            <Plus size={15} />
            <span>Nouveau Post</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Body */}
      {viewMode === 'month' ? (
        <div className="glass-card" style={{ padding: '1rem' }}>
          {/* Weekday Labels Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            {weekDays.map(d => (
              <div key={d} style={{ padding: '0.5rem 0' }}>{d}</div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem'
          }}>
            {/* Empty slots before month start */}
            {emptyPrefixes.map(i => (
              <div
                key={`empty-${i}`}
                style={{
                  minHeight: '110px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed rgba(255, 255, 255, 0.03)'
                }}
              />
            ))}

            {/* Actual Days */}
            {daysArray.map(day => {
              const dayPosts = getPostsForDay(day);
              const isToday = 
                new Date().getFullYear() === year && 
                new Date().getMonth() === month && 
                new Date().getDate() === day;

              return (
                <div
                  key={day}
                  style={{
                    minHeight: '120px',
                    background: isToday ? 'rgba(139, 92, 246, 0.06)' : 'var(--bg-surface)',
                    border: isToday ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    transition: 'border-color var(--transition-fast)'
                  }}
                  className="glass-card"
                >
                  {/* Day Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: isToday ? 800 : 600,
                      color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)',
                      background: isToday ? 'var(--accent-primary-subtle)' : 'transparent',
                      padding: '0.1rem 0.35rem',
                      borderRadius: 'var(--radius-xs)'
                    }}>
                      {day}
                    </span>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onNewPost(new Date(year, month, day, 18, 0))}
                      title="Ajouter un post ce jour"
                      style={{ padding: '0.1rem', color: 'var(--text-muted)' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Day Posts List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto', maxHeight: '140px' }}>
                    {dayPosts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => onEditPost(p)}
                        style={{
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-xs)',
                          padding: '0.35rem 0.45rem',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          borderLeft: `2px solid ${p.status === 'published' ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}`
                        }}
                      >
                        <span>{p.platforms[0] === 'tiktok' ? '🎵' : p.platforms[0] === 'instagram' ? '📸' : '💼'}</span>
                        <span style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 600,
                          flex: 1
                        }}>
                          {p.title || p.originalIdea}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Timeline / List Mode */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredPosts.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)'
            }}>
              <CalendarIcon size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3>Aucune publication trouvée</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Créez un nouveau post ou ajustez vos filtres de recherche.
              </p>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={() => onNewPost()} 
                style={{ marginTop: '1rem' }}
              >
                Créer une publication
              </button>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={onEditPost}
                onPublishNow={onPublishNow}
                onDelete={onDeletePost}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
