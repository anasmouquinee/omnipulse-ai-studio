import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Zap, 
  Share2, 
  Film,
  Settings, 
  Cpu,
  ShieldCheck,
  Compass,
  BookOpen
} from 'lucide-react';
import type { AISettings } from '../../types/ai';

export type NavView = 'studio' | 'autopilot' | 'library' | 'calendar' | 'campaigns' | 'accounts' | 'media';

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
  postsCount
}) => {
  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="brand-icon-wrapper">
            <span style={{ fontSize: '1.25rem' }}>🕌</span>
          </div>
          <div>
            <div className="brand-title">Kaelar Islamic</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              OmniPulse Studio
            </div>
          </div>
          <span className="brand-badge">
            VGPU AI
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Studio & Automatisation</div>

        <button
          type="button"
          className={`nav-item ${currentView === 'studio' ? 'active' : ''}`}
          onClick={() => onNavigate('studio')}
        >
          <Sparkles size={18} color="#10b981" />
          <span>Studio Reels & TikTok</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'autopilot' ? 'active' : ''}`}
          onClick={() => onNavigate('autopilot')}
        >
          <Compass size={18} color="#34d399" />
          <span>Auto-Pilot 24h/24</span>
          <span className="badge badge-emerald" style={{ marginLeft: 'auto', fontSize: '0.62rem' }}>
            ACTIF
          </span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'library' ? 'active' : ''}`}
          onClick={() => onNavigate('library')}
        >
          <BookOpen size={18} color="#60a5fa" />
          <span>Bibliothèque Sacrée</span>
        </button>

        <div className="nav-section-title" style={{ marginTop: '0.5rem' }}>Planning & Canaux</div>

        <button
          type="button"
          className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => onNavigate('calendar')}
        >
          <Calendar size={18} color="#06b6d4" />
          <span>Calendrier</span>
          {postsCount > 0 && (
            <span className="badge badge-gold" style={{ marginLeft: 'auto', fontSize: '0.62rem' }}>
              {postsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'campaigns' ? 'active' : ''}`}
          onClick={() => onNavigate('campaigns')}
        >
          <Zap size={18} color="#fbbf24" />
          <span>Campagnes 7 Jours</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'media' ? 'active' : ''}`}
          onClick={() => onNavigate('media')}
        >
          <Film size={18} color="#f59e0b" />
          <span>Banque Vidéos 4K</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'accounts' ? 'active' : ''}`}
          onClick={() => onNavigate('accounts')}
        >
          <Share2 size={18} color="#a855f7" />
          <span>Réseaux Connectés</span>
        </button>
      </nav>

      {/* Bottom Status Card */}
      <div className="sidebar-footer">
        <div className="ai-status-card">
          <div className="ai-status-header">
            <div className="ai-status-dot" />
            <span className="ai-status-title">VGPU Engine & Sahih AI</span>
          </div>
          <p className="ai-status-text">
            WebGPU hardware pipeline actif avec vérification authentifiée des versets et hadiths.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenSettings}
          style={{ width: '100%', justifyContent: 'center', gap: '0.45rem' }}
        >
          <Settings size={14} />
          <span>Paramètres & Modèles</span>
        </button>
      </div>
    </aside>
  );
};
