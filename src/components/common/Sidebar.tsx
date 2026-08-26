import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Zap, 
  Share2, 
  Image as ImageIcon, 
  Settings, 
  Cpu
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
          <div className="brand-icon-wrapper">
            <Sparkles size={20} />
          </div>
          <span className="brand-title">OmniPulse</span>
          <span className="brand-badge">AI 2026</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Studio & Création</div>

        <button
          className={`nav-item ${currentView === 'studio' ? 'active' : ''}`}
          onClick={() => onNavigate('studio')}
        >
          <Sparkles size={18} color="var(--accent-primary)" />
          <span>Studio IA Multimodal</span>
        </button>

        <button
          className={`nav-item ${currentView === 'campaigns' ? 'active' : ''}`}
          onClick={() => onNavigate('campaigns')}
        >
          <Zap size={18} color="var(--accent-amber)" />
          <span>Campagnes 7 Jours</span>
          <span className="nav-item-badge" style={{ color: 'var(--accent-amber)' }}>Auto</span>
        </button>

        <button
          className={`nav-item ${currentView === 'media' ? 'active' : ''}`}
          onClick={() => onNavigate('media')}
        >
          <ImageIcon size={18} color="var(--accent-pink)" />
          <span>Médiathèque IA</span>
        </button>

        <div className="nav-section-title" style={{ marginTop: '0.75rem' }}>Distribution</div>

        <button
          className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => onNavigate('calendar')}
        >
          <Calendar size={18} color="var(--accent-cyan)" />
          <span>Calendrier & Posts</span>
          {postsCount > 0 && <span className="nav-item-badge">{postsCount}</span>}
        </button>

        <button
          className={`nav-item ${currentView === 'accounts' ? 'active' : ''}`}
          onClick={() => onNavigate('accounts')}
        >
          <Share2 size={18} color="#FE2C55" />
          <span>Comptes Réseaux</span>
        </button>
      </nav>

      {/* Footer / AI Status Widget & Settings */}
      <div className="sidebar-footer">
        {/* AI Status Card */}
        <div className="ai-status-card">
          <div className="ai-status-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={14} color="var(--accent-primary)" />
              <span>Moteurs IA</span>
            </div>
            <div className="status-dot" style={{ background: hasLiveGemini ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
          </div>

          <div className="ai-models-list">
            <span className="ai-model-tag" style={{ color: '#C4B5FD' }}>Gemini Flash</span>
            <span className="ai-model-tag" style={{ color: '#F472B6' }}>Imagen 3</span>
            <span className="ai-model-tag" style={{ color: '#FCD34D' }}>Vidéo AI</span>
          </div>
        </div>

        {/* Settings button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenSettings}
          style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Settings size={15} />
          <span>Paramètres API</span>
        </button>
      </div>
    </aside>
  );
};
