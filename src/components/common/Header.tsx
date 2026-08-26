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
    title: 'Studio de Création IA',
    subtitle: 'Génération de posts, hooks, visuels Imagen 3 et vidéos pour 5 réseaux',
    icon: <Sparkles size={20} color="var(--accent-primary)" />
  },
  calendar: {
    title: 'Calendrier & Planification',
    subtitle: 'Vue d’ensemble des publications programmées et automatisation multi-canaux',
    icon: <Calendar size={20} color="var(--accent-cyan)" />
  },
  campaigns: {
    title: 'Générateur de Campagnes 7 Jours',
    subtitle: 'Planification stratégique automatisée pour dominer votre niche en 1 clic',
    icon: <Zap size={20} color="var(--accent-amber)" />
  },
  accounts: {
    title: 'Comptes Réseaux Sociaux',
    subtitle: 'Passerelles de publication TikTok, Instagram, X, LinkedIn et Facebook',
    icon: <Share2 size={20} color="#FE2C55" />
  },
  media: {
    title: 'Médiathèque Multimodale',
    subtitle: 'Visuels générés par Imagen 3 et clips animés prêts à être réutilisés',
    icon: <Layers size={20} color="var(--accent-pink)" />
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
        {/* Connected Accounts Indicator */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigate('accounts')}
          title="Gérer les comptes reliés"
          style={{ gap: '0.4rem' }}
        >
          <div className="status-dot" style={{ background: connectedCount > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }} />
          <span>{connectedCount}/5 Réseaux</span>
        </button>

        {/* Settings button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenSettings}
          title="Réglages et Clés API"
        >
          <Settings size={15} />
        </button>

        {/* Quick New Post Action */}
        {currentView !== 'studio' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={onNewPost}
            style={{ gap: '0.4rem' }}
          >
            <Plus size={15} />
            <span>Nouveau Post IA</span>
          </button>
        )}
      </div>
    </header>
  );
};
