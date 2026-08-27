import React from 'react';
import type { NavView } from './Sidebar';
import { Sparkles, Plus, Compass, LogOut, User, ShieldCheck } from 'lucide-react';
import type { SocialAccount } from '../../types/content';
import { AuthService } from '../../services/authService';

interface HeaderProps {
  currentView: NavView;
  onNewPost: () => void;
  onNavigate: (view: NavView) => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
  accounts: SocialAccount[];
}

const VIEW_TITLES: Record<NavView, { title: string; subtitle: string; icon: React.ReactNode }> = {
  studio: {
    title: 'Studio de Création & Reels Islamiques',
    subtitle: 'Récitations HD, calligraphie ornée et audio synchronisé pour TikTok (@mdou.g) & Instagram (@kaelarislamic)',
    icon: <Sparkles size={22} color="#10b981" />
  },
  autopilot: {
    title: 'Centre de Contrôle Auto-Pilot 24h/24',
    subtitle: 'Planificateur Cloud autonome — Publication toutes les 6 heures avec rotation thématique et protection anti-doublon',
    icon: <Compass size={22} color="#34d399" />
  },
  library: {
    title: 'Bibliothèque Sacrée & Registre Anti-Répétition',
    subtitle: 'Historique exhaustif des versets et hadiths publiés pour garantir un contenu 100% inédit et authentique',
    icon: <span style={{ fontSize: '1.3rem' }}>📚</span>
  },
  calendar: {
    title: 'Calendrier des Rappels Spirituels',
    subtitle: 'Vue d’ensemble des publications programmées pour TikTok et Instagram',
    icon: <span style={{ fontSize: '1.3rem' }}>📅</span>
  },
  campaigns: {
    title: 'Programme Spirituel 7 Jours',
    subtitle: 'Génération automatisée d’une semaine de rappels, invocations du matin et Jumu’ah',
    icon: <span style={{ fontSize: '1.3rem' }}>⚡</span>
  },
  accounts: {
    title: 'Canaux Connectés',
    subtitle: 'Diffusion directe vers @kaelarislamic et @mdou.g via Buffer API',
    icon: <span style={{ fontSize: '1.3rem' }}>📡</span>
  },
  media: {
    title: 'Banque Vidéos HD & Décors (Sans Filigrane)',
    subtitle: 'Clips et visuels 4K/HD libres de droits pour l’incrustation de vos rappels et signatures officielles',
    icon: <span style={{ fontSize: '1.3rem' }}>🎥</span>
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNewPost,
  onNavigate,
  onOpenSettings,
  onLogout
}) => {
  const current = VIEW_TITLES[currentView] || VIEW_TITLES.studio;
  const user = AuthService.getCurrentUser();

  return (
    <header className="app-header">
      {/* View Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
        }}>
          {current.icon}
        </div>
        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, #fde68a 60%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            {current.title}
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.15rem 0 0 0' }}>
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Header Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Connected Channels Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(6, 78, 59, 0.35)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>
            @kaelarislamic & @mdou.g (Actifs)
          </span>
        </div>

        {/* User Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.35rem 0.75rem',
          borderRadius: '999px'
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#030712'
          }}>
            <User size={14} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
            {user?.name || 'Anas'}
          </span>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Déconnexion"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
                marginLeft: '0.2rem'
              }}
            >
              <LogOut size={14} />
            </button>
          )}
        </div>

        {/* New Reel Button */}
        <button
          className="btn btn-gold btn-sm"
          onClick={onNewPost}
          style={{ gap: '0.4rem', fontWeight: 800 }}
        >
          <Plus size={16} />
          <span>Nouveau Reel</span>
        </button>
      </div>
    </header>
  );
};
