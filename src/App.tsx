import React, { useState } from 'react';
import { Sidebar } from './components/common/Sidebar';
import type { NavView } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastNotification } from './components/common/ToastNotification';
import type { ToastMessage } from './components/common/ToastNotification';
import { SettingsModal } from './components/settings/SettingsModal';
import { LoginView } from './components/auth/LoginView';

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

import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/previews.css';

export const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AuthService.isAuthenticated());

  // Global Application State
  const [currentView, setCurrentView] = useState<NavView>('studio');
  const [posts, setPosts] = useState<ScheduledPost[]>(() => StorageService.getPosts());
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => StorageService.getAccounts());
  const [mediaList, setMediaList] = useState<MediaAsset[]>(() => StorageService.getMediaLibrary());
  const [settings, setSettings] = useState<AISettings>(() => StorageService.getSettings());

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

  return (
    <div className="app-container">
      {/* Background Ambients */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        postsCount={posts.length}
        settings={settings}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header
          currentView={currentView}
          onNewPost={() => handleNewPost()}
          onNavigate={setCurrentView}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={() => {
            setIsAuthenticated(false);
            showToast('info', 'Session sécurisée fermée.');
          }}
          accounts={accounts}
        />

        {/* Content Viewport */}
        <main className="app-content animate-fade-in">
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
