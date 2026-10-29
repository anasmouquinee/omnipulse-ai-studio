import React from 'react';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Calendar, 
  Zap, 
  Film, 
  Share2, 
  Settings, 
  LogOut, 
  User 
} from 'lucide-react';
import type { NavView } from './Sidebar';
import type { SocialAccount } from '../../types/content';
import { AuthService } from '../../services/authService';
import { ThreeSceneControls } from './ThreeSceneControls';
import type { ThreeSceneMode } from './ThreeVgpuScene';

interface FloatingGlassDockProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
  postsCount: number;
  accounts: SocialAccount[];
  threeMode: ThreeSceneMode;
  onSelectThreeMode: (mode: ThreeSceneMode) => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  fps: number;
}

const NAV_ITEMS: { id: NavView; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'studio', label: 'Studio Reels', icon: <Sparkles size={15} /> },
  { id: 'autopilot', label: 'Auto-Pilot 24h', icon: <Compass size={15} />, badge: 'LIVE' },
  { id: 'library', label: 'Bibliothèque', icon: <BookOpen size={15} /> },
  { id: 'calendar', label: 'Calendrier', icon: <Calendar size={15} /> },
  { id: 'campaigns', label: 'Campagnes', icon: <Zap size={15} /> },
  { id: 'media', label: 'Banque 4K', icon: <Film size={15} /> },
  { id: 'accounts', label: 'Réseaux', icon: <Share2 size={15} /> },
];

export const FloatingGlassDock: React.FC<FloatingGlassDockProps> = ({
  currentView,
  onNavigate,
  onOpenSettings,
  onLogout,
  postsCount,
  threeMode,
  onSelectThreeMode,
  wireframe,
  onToggleWireframe,
  autoRotate,
  onToggleAutoRotate,
  fps
}) => {
  const user = AuthService.getCurrentUser();

  return (
    <header className="dock-wrapper">
      <nav className="dock">
        {/* Brand Group */}
        <div className="dock-brand" onClick={() => onNavigate('studio')}>
          <div className="dock-avatar">
            <span>🕌</span>
          </div>
          <div className="dock-brand-meta">
            <span className="dock-brand-name">Kaelar Islamic</span>
            <span className="dock-brand-tag">OMNIPULSE STUDIO</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="dock-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`dock-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'autopilot' && (
                  <span className="pulse-dot" style={{ marginLeft: 2 }} />
                )}
                {item.id === 'calendar' && postsCount > 0 && (
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', marginLeft: 2 }}>
                    {postsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dock Actions */}
        <div className="dock-actions">
          {/* 3D Scene Controls Pill */}
          <ThreeSceneControls
            currentMode={threeMode}
            onSelectMode={onSelectThreeMode}
            wireframe={wireframe}
            onToggleWireframe={onToggleWireframe}
            autoRotate={autoRotate}
            onToggleAutoRotate={onToggleAutoRotate}
            fps={fps}
          />

          {/* Social Status Pill */}
          <div className="spec-pill" style={{ display: 'none' /* hidden on compact */ }}>
            <span className="pulse-dot" />
            <span>@kae.islamic</span>
          </div>

          {/* Settings Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenSettings}
            title="Paramètres & Clés API"
            style={{ padding: '0.45rem', borderRadius: '50%' }}
          >
            <Settings size={15} />
          </button>

          {/* User Button */}
          <div className="btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem', gap: '0.45rem', display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#07090e'
            }}>
              <User size={12} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{user?.name || 'Anas'}</span>
            
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Déconnexion"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--fg-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 4
                }}
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default FloatingGlassDock;
