import React, { useState } from 'react';
import type { NavView } from './components/common/Sidebar';
import { FloatingGlassDock } from './components/common/FloatingGlassDock';
import { ToastNotification } from './components/common/ToastNotification';
import type { ToastMessage } from './components/common/ToastNotification';
import { SettingsModal } from './components/settings/SettingsModal';
import { LoginView } from './components/auth/LoginView';
import { ThreeVgpuScene, type ThreeSceneMode } from './components/common/ThreeVgpuScene';

import { StudioView } from './components/studio/StudioView';
import { AutoPilotDashboard } from './components/autopilot/AutoPilotDashboard';
import { IslamicLibraryView } from './components/library/IslamicLibraryView';
import { CalendarView } from './components/calendar/CalendarView';
import { CampaignGenerator } from './components/campaigns/CampaignGenerator';
import { AccountsView } from './components/accounts/AccountsView';
import { MediaLibraryView } from './components/media/MediaLibraryView';

import type { ScheduledPost, SocialAccount, MediaAsset } from './types/content';
import type { AISettings } from './types/ai';
import { StorageService } from './services/storageService';
import { SocialPublisher } from './services/socialPublisher';
import { AuthService } from './services/authService';
import { SunnahCalendarService } from './services/sunnahCalendarService';

import { Sparkles, Compass, BookOpen, Calendar, Zap, Share2, Film } from 'lucide-react';

import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/previews.css';

const VIEW_METAS: Record<NavView, { title: string; arabicTitle: string; subtitle: string; icon: React.ReactNode; badge: string }> = {
  studio: {
    title: 'Studio de Création & Reels Islamiques',
    arabicTitle: 'استوديو الرقائق والمقاطع القرآنية',
    subtitle: 'Récitations HD synchronisées, calligraphie ornée et export vidéo 9:16 pour Instagram & TikTok',
    icon: <Sparkles size={24} color="#f59e0b" />,
    badge: 'استوديو HD'
  },
  autopilot: {
    title: 'Centre de Contrôle Auto-Pilot 24h/24',
    arabicTitle: 'النشر السحابي التلقائي المستمر',
    subtitle: 'Planificateur Cloud autonome sur GitHub Actions — Rotation thématique et anti-répétition',
    icon: <Compass size={24} color="#10b981" />,
    badge: 'نشر تلقائي'
  },
  library: {
    title: 'Bibliothèque Sacrée & Registre Anti-Répétition',
    arabicTitle: 'المكتبة القرآنية والحديثية الموثقة',
    subtitle: 'Historique exhaustif des 130+ versets, hadiths et invocations vérifiées dans la tradition authentique',
    icon: <BookOpen size={24} color="#fbbf24" />,
    badge: 'مكتبة موثقة'
  },
  calendar: {
    title: 'Calendrier des Rappels Spirituels',
    arabicTitle: 'جدول المواعيد والمنشورات',
    subtitle: 'Vue d’ensemble des publications programmées et file d’attente sociale pour @kae.islamic',
    icon: <Calendar size={24} color="#34d399" />,
    badge: 'التقويم المبارك'
  },
  campaigns: {
    title: 'Programme Spirituel 7 Jours',
    arabicTitle: 'البرنامج الأسبوعي المبارك',
    subtitle: 'Génération automatisée d’une semaine complète de rappels, invocations du matin et Jumu’ah',
    icon: <Zap size={24} color="#f59e0b" />,
    badge: 'حملة أسبوعية'
  },
  accounts: {
    title: 'Canaux de Diffusion Connectés',
    arabicTitle: 'قنوات التواصل المربوطة',
    subtitle: 'Distribution directe vers @kae.islamic et @kaelar.islamic via Buffer API & Webhooks',
    icon: <Share2 size={24} color="#a855f7" />,
    badge: 'شبكات موثقة'
  },
  media: {
    title: 'Banque Vidéos 4K & Décors Sans Filigrane',
    arabicTitle: 'مكتبة المرئيات عالية الدقة',
    subtitle: 'Clips et visuels haute définition libres de droits pour vos rappels spirituels',
    icon: <Film size={24} color="#f59e0b" />,
    badge: 'وسائط 4K'
  }
};

export const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AuthService.isAuthenticated());

  // Global Application State
  const [currentView, setCurrentView] = useState<NavView>('studio');
  const [posts, setPosts] = useState<ScheduledPost[]>(() => StorageService.getPosts());
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => StorageService.getAccounts());
  const [mediaList, setMediaList] = useState<MediaAsset[]>(() => StorageService.getMediaLibrary());
  const [settings, setSettings] = useState<AISettings>(() => StorageService.getSettings());

  // Hijri Date
  const [hijriDate] = useState(() => SunnahCalendarService.getHijriDate());

  // Three.js 3D Scene & WebGPU State
  const [threeMode, setThreeMode] = useState<ThreeSceneMode>('sacred_crystal');
  const [threeWireframe, setThreeWireframe] = useState<boolean>(false);
  const [threeAutoRotate, setThreeAutoRotate] = useState<boolean>(true);
  const [threeFps, setThreeFps] = useState<number>(60);

  // Editing / Creation state
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, message };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Reload media assets when changed
  const refreshMedia = () => {
    setMediaList(StorageService.getMediaLibrary());
  };

  // Actions
  const handleNewPost = (initialDate?: Date) => {
    setEditingPost(null);
    setCurrentView('studio');
    if (initialDate) {
      showToast('info', `Création d'un post planifié pour le ${initialDate.toLocaleDateString('fr-FR')}`);
    }
  };

  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setCurrentView('studio');
    showToast('info', `Modification de "${post.title || post.originalIdea}"`);
  };

  const handlePostSaved = () => {
    const updatedPosts = StorageService.getPosts();
    setPosts(updatedPosts);
    refreshMedia();
  };

  const handlePublishNow = async (post: ScheduledPost) => {
    try {
      await SocialPublisher.publishNow(post);
      setPosts(StorageService.getPosts());
      showToast('success', `"${post.title || 'Publication'}" publiée en direct sur vos réseaux ! 🚀`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Erreur lors de la publication.');
    }
  };

  const handleDeletePost = (postId: string) => {
    const updated = StorageService.deletePost(postId);
    setPosts(updated);
    showToast('info', 'Publication supprimée.');
  };

  const handleCampaignCreated = () => {
    setPosts(StorageService.getPosts());
    refreshMedia();
  };

  const handleUseAssetInPost = (asset: MediaAsset) => {
    const newDraft: ScheduledPost = {
      id: `post-${Date.now()}`,
      title: asset.promptUsed ? `Post avec ${asset.promptUsed.slice(0, 30)}...` : 'Nouveau Post IA',
      originalIdea: asset.promptUsed || 'Contenu visuel généré par IA',
      platforms: ['tiktok', 'instagram', 'x', 'linkedin', 'facebook'],
      platformContent: {
        tiktok: { text: asset.promptUsed || '', hashtags: ['#fyp', '#ia'] },
        instagram: { text: asset.promptUsed || '', hashtags: ['#creativity', '#ai'] },
        x: { text: asset.promptUsed || '', hashtags: ['#IA'] },
        linkedin: { text: asset.promptUsed || '', hashtags: ['#Innovation'] },
        facebook: { text: asset.promptUsed || '', hashtags: ['#marketing'] }
      },
      media: asset,
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingPost(newDraft);
    setCurrentView('studio');
    showToast('success', 'Asset chargé dans le Studio IA !');
  };

  // If user is not authenticated, show protected Login View
  if (!isAuthenticated) {
    return (
      <>
        <LoginView
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            showToast('success', 'Bienvenue Anas ! Accès au Studio déverrouillé.');
          }}
        />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  const activeMeta = VIEW_METAS[currentView] || VIEW_METAS.studio;

  return (
    <div className="app-container">
      {/* 3D Three.js & VGPU WebGPU Canvas Scene */}
      <ThreeVgpuScene
        mode={threeMode}
        wireframe={threeWireframe}
        autoRotate={threeAutoRotate}
        onFpsUpdate={setThreeFps}
      />

      {/* Andalusian Sacred Geometric Star Pattern Scrim */}
      <div className="islamic-geom-scrim" />

      {/* Ambient Sacred Lantern Orbs */}
      <div className="ambient-container">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      {/* Top Bismillah Calligraphic Ribbon */}
      <div className="bismillah-ribbon">
        <div className="bismillah-text">
          <span style={{ fontSize: '1.4rem' }}>﷽</span>
          <span style={{ fontSize: '0.9rem', color: '#fde68a' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>
        <div className="hijri-date-pill">
          <span>🌙 {hijriDate.formattedStr}</span>
          <span style={{ color: '#f59e0b' }}>•</span>
          <span style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>{hijriDate.monthNameAr}</span>
        </div>
      </div>

      {/* Floating Gilded Islamic Dock Navigation */}
      <FloatingGlassDock
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={() => {
          setIsAuthenticated(false);
          showToast('info', 'Session fermée.');
        }}
        postsCount={posts.length}
        accounts={accounts}
        threeMode={threeMode}
        onSelectThreeMode={setThreeMode}
        wireframe={threeWireframe}
        onToggleWireframe={() => setThreeWireframe(prev => !prev)}
        autoRotate={threeAutoRotate}
        onToggleAutoRotate={() => setThreeAutoRotate(prev => !prev)}
        fps={threeFps}
      />

      {/* Main Viewport Content */}
      <div className="main-wrapper">
        <main className="app-content animate-fade-in">
          {/* Sacred Islamic Pavilion Cockpit Card */}
          <div className="hero-cockpit">
            <div className="hero-cockpit-left">
              <div className="hero-cockpit-icon">
                {activeMeta.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h1 className="hero-cockpit-title">
                    <span className="gradient-text">{activeMeta.title}</span>
                  </h1>
                  <span style={{
                    fontFamily: 'var(--font-arabic)',
                    fontSize: '1.15rem',
                    color: '#fde68a',
                    fontWeight: 700
                  }}>
                    {activeMeta.arabicTitle}
                  </span>
                  <span className="section-badge section-badge-emerald">
                    {activeMeta.badge}
                  </span>
                </div>
                <p className="hero-cockpit-desc">
                  {activeMeta.subtitle}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="spec-pill">
                <span className="pulse-dot-gold" />
                <span style={{ color: '#fde68a' }}>WebGPU 60 FPS</span>
              </div>
              <div className="spec-pill">
                <span style={{ color: '#34d399' }}>@kae.islamic & @kaelar.islamic</span>
              </div>
            </div>
          </div>

          {/* Active View Component */}
          {currentView === 'studio' && (
            <StudioView
              editingPost={editingPost}
              onPostSaved={handlePostSaved}
              onShowToast={showToast}
            />
          )}

          {currentView === 'autopilot' && (
            <AutoPilotDashboard
              onShowToast={showToast}
            />
          )}

          {currentView === 'library' && (
            <IslamicLibraryView
              onShowToast={showToast}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              posts={posts}
              onEditPost={handleEditPost}
              onPublishNow={handlePublishNow}
              onDeletePost={handleDeletePost}
              onNewPost={handleNewPost}
            />
          )}

          {currentView === 'campaigns' && (
            <CampaignGenerator
              onCampaignCreated={handleCampaignCreated}
              onShowToast={showToast}
              onNavigateToCalendar={() => setCurrentView('calendar')}
            />
          )}

          {currentView === 'accounts' && (
            <AccountsView
              accounts={accounts}
              onAccountsUpdated={setAccounts}
              onShowToast={showToast}
            />
          )}

          {currentView === 'media' && (
            <MediaLibraryView
              mediaList={mediaList}
              onUseAsset={handleUseAssetInPost}
              onNewGenerate={() => setCurrentView('studio')}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={setSettings}
        onShowToast={showToast}
      />

      {/* Floating Toast Notifications */}
      <ToastNotification
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
};

export default App;
