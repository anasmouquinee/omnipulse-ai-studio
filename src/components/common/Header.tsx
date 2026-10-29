import React from 'react';
import type { NavView } from './Sidebar';
import { Sparkles, Compass, LogOut, User, BookOpen, Calendar, Zap, Share2, Film } from 'lucide-react';
import type { SocialAccount } from '../../types/content';
import { AuthService } from '../../services/authService';
import { ThreeSceneControls } from './ThreeSceneControls';
import type { ThreeSceneMode } from './ThreeVgpuScene';

interface HeaderProps {
  currentView: NavView;
  onNewPost: () => void;
  onNavigate: (view: NavView) => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
  accounts: SocialAccount[];
  threeMode: ThreeSceneMode;
  onSelectThreeMode: (mode: ThreeSceneMode) => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  fps: number;
}

const VIEW_TITLES: Record<NavView, { title: string; subtitle: string; icon: React.ReactNode }> = {
  studio: {
    title: 'Studio de Création & Reels Islamiques',
    subtitle: 'Récitations HD, calligraphie ornée et audio synchronisé pour Instagram & TikTok',
    icon: <Sparkles size={22} color="#10b981" />
  },
  autopilot: {
    title: 'Centre de Contrôle Auto-Pilot 24h/24',
    subtitle: 'Planificateur Cloud autonome — Publication toutes les 6 heures avec rotation thématique',
    icon: <Compass size={22} color="#34d399" />
  },
  library: {
    title: 'Bibliothèque Sacrée & Registre Anti-Répétition',
    subtitle: 'Historique exhaustif des versets et hadiths publiés pour garantir un contenu inédit',
    icon: <BookOpen size={22} color="#60a5fa" />
  },
  calendar: {
    title: 'Calendrier des Rappels Spirituels',
    subtitle: 'Vue d’ensemble des publications programmées pour TikTok et Instagram',
    icon: <Calendar size={22} color="#06b6d4" />
  },
  campaigns: {
    title: 'Programme Spirituel 7 Jours',
    subtitle: 'Génération automatisée d’une semaine de rappels, invocations et Jumu’ah',
    icon: <Zap size={22} color="#fbbf24" />
  },
  accounts: {
    title: 'Canaux Connectés',
    subtitle: 'Diffusion directe vers @kae.islamic et @kaelar.islamic via Buffer API',
    icon: <Share2 size={22} color="#a855f7" />
  },
  media: {
    title: 'Banque Vidéos 4K & Décors Sans Filigrane',
    subtitle: 'Clips et visuels haute définition libres de droits pour vos rappels spirituels',
    icon: <Film size={22} color="#f59e0b" />
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onLogout,
  threeMode,
  onSelectThreeMode,
  wireframe,
  onToggleWireframe,
  autoRotate,
  onToggleAutoRotate,
  fps
}) => {
  const current = VIEW_TITLES[currentView] || VIEW_TITLES.studio;
  const user = AuthService.getCurrentUser();

  return (
    <header className="app-header">
      {/* View Title */}
      <div className="header-left">
        <div className="header-icon-box">
          {current.icon}
        </div>
        <div className="header-title-group">
          <h1 className="header-page-title">
            <span className="header-title-gradient">
              {current.title}
            </span>
          </h1>
          <p className="header-subtitle">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="header-right">
        {/* Three.js 3D Controls Badge */}
        <ThreeSceneControls
          currentMode={threeMode}
          onSelectMode={onSelectThreeMode}
          wireframe={wireframe}
          onToggleWireframe={onToggleWireframe}
          autoRotate={autoRotate}
          onToggleAutoRotate={onToggleAutoRotate}
          fps={fps}
        />

        {/* Connected Channels Pill */}
        <div className="badge badge-emerald">
          <span className="sidebar-status-dot-emerald" />
          <span>@kae.islamic & @kaelar.islamic</span>
        </div>

        {/* User Pill */}
        <div className="header-user-btn">
          <div style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#030712'
          }}>
            <User size={13} />
          </div>
          <span>{user?.name || 'Anas'}</span>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Déconnexion"
              className="header-logout-btn"
              style={{ width: 22, height: 22, borderRadius: '50%', marginLeft: '0.25rem' }}
            >
              <LogOut size={12} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
