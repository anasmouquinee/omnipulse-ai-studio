import React, { useState } from 'react';
import type { ScheduledPost, SocialPlatform } from '../../types/content';
import type { IslamicPostItem } from '../../types/islamic';
import type { AITone, GeneratedSocialPack } from '../../types/ai';
import type { IslamicBackgroundTheme } from '../../data/islamicBackgrounds';
import { IslamicContentService } from '../../services/islamicContentService';
import { StorageService } from '../../services/storageService';
import { GeminiService } from '../../services/geminiService';
import { IslamicQuoteCardGenerator } from './IslamicQuoteCardGenerator';
import { ComfyAssetGenerator } from './ComfyAssetGenerator';
import { AITextGenerator } from './AITextGenerator';
import { Sparkles, Palette, PenTool, Copy, Check, Share2 } from 'lucide-react';
import { QalamPenIcon, FanousLanternIcon, RubElHizbIcon } from '../common/IslamicIcons';

interface StudioViewProps {
  editingPost: ScheduledPost | null;
  onPostSaved: (post: ScheduledPost) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

type StudioTab = 'quotes' | 'comfy' | 'copywriting';

export const StudioView: React.FC<StudioViewProps> = ({
  onPostSaved,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('quotes');

  // Copywriting state for Gemini
  const [promptText, setPromptText] = useState('Les mérites de la prière de nuit (Tahajjud) et comment la préserver avec constance');
  const [selectedTone, setSelectedTone] = useState<AITone>('inspiring');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['tiktok', 'instagram', 'youtube']);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [generatedPack, setGeneratedPack] = useState<GeneratedSocialPack | null>(null);

  const handleApplyIslamicPost = (item: IslamicPostItem, cardImageUrl: string) => {
    const post = IslamicContentService.convertToScheduledPost(item, cardImageUrl);
    StorageService.savePost(post);
    onPostSaved(post);
    onShowToast('success', 'Rappel enregistré dans votre bibliothèque ! 🕋');
  };

  const handleApplyComfyTheme = (theme: IslamicBackgroundTheme) => {
    // Add custom theme dynamically into IslamicContentService theme list if needed
    setActiveTab('quotes');
    onShowToast('success', `Thème visuel "${theme.name}" sélectionné !`);
  };

  const handleTogglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleGenerateCopywriting = async () => {
    if (!promptText.trim()) return;
    setIsGeneratingText(true);
    try {
      const pack = await GeminiService.generateSocialPack({
        prompt: promptText,
        tone: selectedTone,
        language: 'Français'
      });
      setGeneratedPack(pack);
      onShowToast('success', '✨ Pack de copywriting multi-plateformes généré avec succès !');
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Erreur lors de la génération avec Gemini.');
    } finally {
      setIsGeneratingText(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Studio Top Luxury Tab Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="studio-nav-tabs">
          <button
            type="button"
            className={`studio-tab-item ${activeTab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quotes')}
          >
            <QalamPenIcon size={16} color="#10b981" />
            <span>Studio Citations & Reels</span>
          </button>

          <button
            type="button"
            className={`studio-tab-item ${activeTab === 'comfy' ? 'active' : ''}`}
            onClick={() => setActiveTab('comfy')}
          >
            <FanousLanternIcon size={16} color="#38bdf8" />
            <span>ComfyUI Visual Studio</span>
            <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>NOUVEAU</span>
          </button>

          <button
            type="button"
            className={`studio-tab-item ${activeTab === 'copywriting' ? 'active' : ''}`}
            onClick={() => setActiveTab('copywriting')}
          >
            <RubElHizbIcon size={16} color="#f59e0b" />
            <span>Copywriting & Scripts Gemini</span>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="hud-chip">
          <span className="sidebar-status-dot-emerald" />
          <span>VGPU WebGL 60 FPS • Multi-Plateformes</span>
        </div>
      </div>

      {/* Viewport Render depending on active tab */}
      {activeTab === 'quotes' && (
        <IslamicQuoteCardGenerator
          onApplyPost={handleApplyIslamicPost}
          onShowToast={onShowToast}
        />
      )}

      {activeTab === 'comfy' && (
        <ComfyAssetGenerator
          onApplyAsBackgroundTheme={handleApplyComfyTheme}
          onShowToast={onShowToast}
        />
      )}

      {activeTab === 'copywriting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AITextGenerator
            prompt={promptText}
            onPromptChange={setPromptText}
            tone={selectedTone}
            onToneChange={setSelectedTone}
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
            isGenerating={isGeneratingText}
            onGenerate={handleGenerateCopywriting}
          />

          {/* Generated Result Display */}
          {generatedPack && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#f59e0b" />
                  <span>Résultats Multi-Réseaux Générés</span>
                </h3>
                <span className="badge badge-gold">GEMINI FLASH PRO</span>
              </div>

              {/* TikTok Tab Content */}
              {generatedPack.platforms.tiktok && (
                <div style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(5, 12, 28, 0.75)',
                  border: '1px solid rgba(254, 44, 85, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, color: '#fe2c55', fontSize: '0.85rem' }}>🎵 Script TikTok & Hook 3s :</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const t = generatedPack.platforms.tiktok;
                        navigator.clipboard.writeText(`${t?.hook}\n\n${t?.videoScript}\n\n${t?.caption}\n${t?.hashtags.join(' ')}`);
                        onShowToast('info', 'Script TikTok copié !');
                      }}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                    {generatedPack.platforms.tiktok.hook}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {generatedPack.platforms.tiktok.videoScript}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                    {generatedPack.platforms.tiktok.hashtags.join(' ')}
                  </div>
                </div>
              )}

              {/* Instagram Tab Content */}
              {generatedPack.platforms.instagram && (
                <div style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(5, 12, 28, 0.75)',
                  border: '1px solid rgba(225, 48, 108, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, color: '#e1306c', fontSize: '0.85rem' }}>📸 Légende Instagram & Carrousel :</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const ig = generatedPack.platforms.instagram;
                        navigator.clipboard.writeText(`${ig?.caption}\n\n${ig?.callToAction}\n${ig?.hashtags.join(' ')}`);
                        onShowToast('info', 'Légende Instagram copiée !');
                      }}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {generatedPack.platforms.instagram.caption}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>
                    👉 {generatedPack.platforms.instagram.callToAction}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {generatedPack.platforms.instagram.hashtags.join(' ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
