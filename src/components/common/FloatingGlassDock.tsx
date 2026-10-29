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

const NAV_ITEMS: { id: NavView; label: string; arabic: string; icon: React.ReactNode }[] = [
  { id: 'studio', label: 'Studio Reels', arabic: 'الاستوديو', icon: <Sparkles size={15} /> },
  { id: 'autopilot', label: 'Auto-Pilot 24h', arabic: 'نشر تلقائي', icon: <Compass size={15} /> },
  { id: 'library', label: 'Bibliothèque', arabic: 'المكتبة', icon: <BookOpen size={15} /> },
  { id: 'calendar', label: 'Calendrier', arabic: 'التقويم', icon: <Calendar size={15} /> },
  { id: 'campaigns', label: 'Campagnes', arabic: 'حملات', icon: <Zap size={15} /> },
  { id: 'media', label: 'Banque 4K', arabic: 'الوسائط', icon: <Film size={15} /> },
  { id: 'accounts', label: 'Réseaux', arabic: 'القنوات', icon: <Share2 size={15} /> },
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
            <span className="dock-brand-name">
              <span>Kaelar Islamic</span>
              <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>۞</span>
            </span>
            <span className="dock-brand-tag">استوديو الذكاء الاصطناعي</span>
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
                <span style={{
                  fontFamily: 'var(--font-arabic)',
                  fontSize: '0.72rem',
                  opacity: isActive ? 1 : 0.65,
                  marginLeft: 2,
                  color: isActive ? '#fde68a' : 'inherit'
                }}>
                  {item.arabic}
                </span>

                {item.id === 'autopilot' && (
                  <span className="pulse-dot" style={{ marginLeft: 3 }} />
                )}
                {item.id === 'calendar' && postsCount > 0 && (
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', marginLeft: 3 }}>
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

          {/* Channels Badge */}
          <div className="spec-pill" style={{ display: 'none' /* hidden on compact */ }}>
            <span className="pulse-dot" />
            <span style={{ color: '#34d399' }}>@kae.islamic</span>
          </div>

          {/* Settings Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenSettings}
            title="Paramètres & Clés API"
            style={{ padding: '0.45rem', borderRadius: '50%' }}
          >
            <Settings size={15} color="#f59e0b" />
          </button>

          {/* User Button */}
          <div className="btn-secondary btn-sm" style={{ padding: '0.35rem 0.8rem', gap: '0.45rem', display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#020705',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)'
            }}>
              <User size={13} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fde68a' }}>{user?.name || 'Anas'}</span>
            
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
