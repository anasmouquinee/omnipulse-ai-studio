import React from 'react';
import type { NavView } from './Sidebar';
import { Sparkles, Plus, Calendar, Zap, Settings, Share2, Layers } from 'lucide-react';
import type { SocialAccount } from '../../types/content';

interface HeaderProps {
  currentView: NavView;
  onNewPost: () => void;
  onNavigate: (view: NavView) => void;
  onOpenSettings: () => void;
  accounts: SocialAccount[];
}

const VIEW_TITLES: Record<NavView, { title: string; subtitle: string; icon: React.ReactNode }> = {
  studio: {
    title: 'Studio de Création Islamique',
    subtitle: 'Génération de citations, versets, hadiths authentiques, visuels et vidéos multilingues',
    icon: <Sparkles size={20} color="#10b981" />
  },
  calendar: {
    title: 'Calendrier des Rappels Spirituels',
    subtitle: 'Vue d’ensemble des publications programmées pour TikTok et Instagram',
    icon: <Calendar size={20} color="#06b6d4" />
  },
  campaigns: {
    title: 'Routines Spirituelles 7 Jours',
    subtitle: 'Génération automatisée d’une semaine de rappels, invocations du matin et Jumu’ah',
    icon: <Zap size={20} color="#f59e0b" />
  },
  accounts: {
    title: 'Comptes TikTok & Instagram',
    subtitle: 'Diffusion directe vers @kaelarislamic et @mdou.g via Buffer API',
    icon: <Share2 size={20} color="#FE2C55" />
  },
  media: {
    title: 'Médiathèque Coran & Visuels',
    subtitle: 'Cartes de citations, récitateurs célèbres et clips vidéo prêts à diffuser',
    icon: <Layers size={20} color="#ec4899" />
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNewPost,
  onNavigate,
  onOpenSettings,
  accounts
}) => {
  const current = VIEW_TITLES[currentView];
  const connectedCount = accounts.filter(a => a.connected).length;

  return (
    <header className="app-header">
      {/* View Title */}
      <div className="header-left">
        <div className="header-title-wrapper">
          <h1>
            {current.icon}
            <span>{current.title}</span>
          </h1>
          <p>{current.subtitle}</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Connected Channels Pill */}
        <button
          className="header-pill-btn"
          onClick={() => onNavigate('accounts')}
          title="Gérer les canaux connectés"
          style={{ background: 'rgba(6, 78, 59, 0.25)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
        >
          <div className="status-dot online" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>
            {connectedCount > 0 ? `${connectedCount} Réseaux Connectés (@kaelar & @mdou)` : 'Passerelle Buffer'}
          </span>
        </button>

        {/* New Post Button */}
        <button
          className="btn btn-primary"
          onClick={onNewPost}
          style={{ gap: '0.4rem', background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)' }}
        >
          <Plus size={16} />
          <span>Nouveau Rappel</span>
        </button>
      </div>
    </header>
  );
};
