import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { ScheduledPost } from '../../types/content';
import { Calendar, Clock, Zap } from 'lucide-react';
import { BEST_POSTING_TIMES } from '../../services/socialPublisher';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ScheduledPost | null;
  onSchedule: (post: ScheduledPost, targetTime: Date) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  post,
  onSchedule
}) => {
  // Default to tomorrow at 18:30
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const defaultTimeStr = '18:30';

  const [date, setDate] = useState(defaultDateStr);
  const [time, setTime] = useState(defaultTimeStr);

  if (!post) return null;

  const handleApplyBestTime = (timeString: string) => {
    setTime(timeString);
  };

  const handleConfirm = () => {
    const combined = new Date(`${date}T${time}:00`);
    onSchedule(post, combined);
    onClose();
  };

  // Get primary platform for best time advice
  const primaryPlatform = post.platforms[0] || 'tiktok';
  const bestSlots = BEST_POSTING_TIMES[primaryPlatform] || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Programmer la Publication"
      subtitle={`Publication automatique sur ${post.platforms.join(', ').toUpperCase()}`}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} style={{ gap: '0.4rem' }}>
            <Calendar size={16} />
            <span>Valider la Programmation</span>
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Post Summary Card */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {post.media?.url && (
            <img 
              src={post.media.url} 
              alt="Thumbnail" 
              style={{ width: 48, height: 48, borderRadius: 'var(--radius-xs)', objectFit: 'cover' }} 
            />
          )}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {post.title || post.originalIdea || 'Publication sans titre'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {post.platforms.length} réseaux connectés
            </div>
          </div>
        </div>

        {/* Date & Time Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} />
                Date de publication
              </span>
            </label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                Heure exacte
              </span>
            </label>
            <input
              type="time"
              className="form-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {/* AI Best Time Slot Suggestions */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={14} color="var(--accent-amber)" />
              Heures Recommandées par l'IA ({primaryPlatform.toUpperCase()})
            </span>
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {bestSlots.map((slot, idx) => (
              <div
                key={idx}
                onClick={() => handleApplyBestTime(slot.timeString)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                className="glass-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {slot.timeString}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {slot.dayOfWeek}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {slot.reason}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-emerald)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {slot.expectedEngagementBoost}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
