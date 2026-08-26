import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Zap, 
  Share2, 
  Image as ImageIcon, 
  Settings, 
  Cpu,
  Moon,
  ShieldCheck
} from 'lucide-react';
import type { AISettings } from '../../types/ai';

export type NavView = 'studio' | 'calendar' | 'campaigns' | 'accounts' | 'media';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onOpenSettings: () => void;
  postsCount: number;
  settings: AISettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenSettings,
  postsCount,
  settings
}) => {
  const hasLiveGemini = settings.geminiApiKey && settings.geminiApiKey.trim() !== '';

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="brand-icon-wrapper" style={{
            background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🕌</span>
          </div>
          <span className="brand-title">Kaelar Islamic</span>
          <span className="brand-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            AI Studio
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Contenu Islamique & IA</div>

        <button
          className={`nav-item ${currentView === 'studio' ? 'active' : ''}`}
          onClick={() => onNavigate('studio')}
        >
          <Sparkles size={18} color="#10b981" />
          <span>Studio de Rappels IA</span>
        </button>

        <button
          className={`nav-item ${currentView === 'campaigns' ? 'active' : ''}`}
          onClick={() => onNavigate('campaigns')}
        >
          <Zap size={18} color="#f59e0b" />
          <span>Programme 7 Jours</span>
        </button>

        <div className="nav-section-title">Diffusion & Planification</div>

        <button
          className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => onNavigate('calendar')}
        >
          <Calendar size={18} color="#06b6d4" />
          <span>Calendrier des Rappels</span>
          {postsCount > 0 && (
            <span className="nav-badge">{postsCount}</span>
          )}
        </button>

        <button
          className={`nav-item ${currentView === 'accounts' ? 'active' : ''}`}
          onClick={() => onNavigate('accounts')}
        >
          <Share2 size={18} color="#FE2C55" />
          <span>Canaux (@kaelar & @mdou)</span>
        </button>

        <button
          className={`nav-item ${currentView === 'media' ? 'active' : ''}`}
          onClick={() => onNavigate('media')}
        >
          <ImageIcon size={18} color="#ec4899" />
          <span>Médiathèque & Audios</span>
        </button>
      </nav>

      {/* Bottom Status Card */}
      <div className="sidebar-footer">
        <div className="ai-status-card" style={{
          background: 'rgba(6, 78, 59, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <div className="ai-status-header">
            <div className="ai-status-dot" style={{ background: '#10b981' }} />
            <span className="ai-status-title" style={{ color: '#10b981' }}>Sources Sahih Actives</span>
          </div>
          <p className="ai-status-text" style={{ fontSize: '0.72rem' }}>
            Coran, Bukhari & Muslim avec traduction FR / EN / AR
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenSettings}
          style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
        >
          <Settings size={14} />
          <span>Paramètres API</span>
        </button>
      </div>
    </aside>
  );
};
