import React, { useState } from 'react';
import type { 
  ScheduledPost, 
  SocialPlatform, 
  PlatformContent, 
  MediaAsset 
} from '../../types/content';
import type { 
  AITone, 
  ImageAspectRatio, 
  ImageStylePreset, 
  VideoMotionPreset, 
  GeneratedSocialPack 
} from '../../types/ai';
import type { IslamicPostItem, IslamicLanguage } from '../../types/islamic';
import { GeminiService } from '../../services/geminiService';
import { ImagenService } from '../../services/imagenService';
import { VideoService } from '../../services/videoService';
import { SocialPublisher } from '../../services/socialPublisher';
import { StorageService } from '../../services/storageService';
import { IslamicContentService } from '../../services/islamicContentService';

import { IslamicQuoteCardGenerator } from './IslamicQuoteCardGenerator';
import { AITextGenerator } from './AITextGenerator';
import { AIImageGenerator } from './AIImageGenerator';
import { AIVideoGenerator } from './AIVideoGenerator';
import { PlatformCustomizer } from './PlatformCustomizer';
import { MultiPlatformPreview } from '../previews/MultiPlatformPreview';
import { ScheduleModal } from '../calendar/ScheduleModal';

import { 
  Calendar, 
  Send, 
  Save, 
  Layers, 
  Sparkles, 
  Image as ImageIcon, 
  Film,
  Compass,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudioViewProps {
  editingPost: ScheduledPost | null;
  onPostSaved: (post: ScheduledPost) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

type StudioTab = 'islamic' | 'text' | 'image' | 'video' | 'customize';

export const StudioView: React.FC<StudioViewProps> = ({
  editingPost,
  onPostSaved,
  onShowToast
}) => {
  // Main Studio State
  const [activeTab, setActiveTab] = useState<StudioTab>('islamic');
  const [prompt, setPrompt] = useState(editingPost?.originalIdea || 'La patience (Sabr) et la délivrance selon le Coran et la Sunnah');
  const [tone, setTone] = useState<AITone>('educational');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(
    editingPost?.platforms || ['tiktok', 'instagram', 'x', 'linkedin', 'facebook']
  );
  
  // Platform-specific content
  const [platformContent, setPlatformContent] = useState<Record<SocialPlatform, PlatformContent>>(
    editingPost?.platformContent || {
      tiktok: { text: '', hashtags: ['#IslamRappels', '#Coran', '#Sabr', '#MuslimTikTok', '#Dua'] },
      instagram: { text: '', hashtags: ['#IslamFrance', '#HadithSahih', '#Tawakkul', '#KaelarIslamic'] },
      x: { text: '', hashtags: ['#Islam', '#Rappels', '#Coran'] },
      linkedin: { text: '', hashtags: ['#Wisdom', '#Spiritualite', '#Ethique'] },
      facebook: { text: '', hashtags: ['#IslamRappel', '#CoranFrançais', '#Priere'] },
    }
  );

  // Active Preview & Media
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<SocialPlatform>('tiktok');
  const [currentMedia, setCurrentMedia] = useState<MediaAsset | undefined>(editingPost?.media);

  // Suggested Prompts from Gemini
  const [suggestedImagePrompt, setSuggestedImagePrompt] = useState<string>('');
  const [suggestedVideoPrompt, setSuggestedVideoPrompt] = useState<string>('');

  // Generation Loading States
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Image generation parameters
  const [imagePrompt, setImagePrompt] = useState('Majestic golden crescent moon over minimalist mosque architecture at night, celestial starry sky, warm golden atmospheric lighting, 8k render');
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>('9:16');
  const [imageStyle, setImageStyle] = useState<ImageStylePreset>('cinematic');

  // Video generation parameters
  const [videoPrompt, setVideoPrompt] = useState('Slow cinematic golden dust particles floating in peaceful night mosque arches, atmospheric spiritual ambience 4k');
  const [videoDuration, setVideoDuration] = useState<5 | 10 | 15>(10);
  const [videoMotion, setVideoMotion] = useState<VideoMotionPreset>('slow_zoom');
  const [videoRatio, setVideoRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');

  // Schedule Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Platform Toggle Helper
  const handleTogglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // 1. Apply Islamic Quote Card to Studio
  const handleApplyIslamicPost = (item: IslamicPostItem, cardUrl: string, language: IslamicLanguage) => {
    const scheduled = IslamicContentService.convertToScheduledPost(item, language, cardUrl);
    setPlatformContent(scheduled.platformContent);
    setPrompt(item.topic);
    setCurrentMedia(scheduled.media);
    setActivePreviewPlatform('tiktok');
    setActiveTab('text');
  };

  // 2. Generate Copywriting via Gemini
  const handleGenerateText = async () => {
    if (!prompt.trim()) {
      onShowToast('error', 'Veuillez saisir un sujet ou thème islamique.');
      return;
    }

    setIsGeneratingText(true);
    try {
      const pack: GeneratedSocialPack = await GeminiService.generateMultiPlatformPack(
        prompt,
        tone,
        selectedPlatforms
      );

      setPlatformContent(prev => ({
        ...prev,
        ...pack.platforms
      }));

      if (pack.suggestedVisualPrompt) {
        setSuggestedImagePrompt(pack.suggestedVisualPrompt);
        setImagePrompt(pack.suggestedVisualPrompt);
      }
      if (pack.suggestedVideoPrompt) {
        setSuggestedVideoPrompt(pack.suggestedVideoPrompt);
        setVideoPrompt(pack.suggestedVideoPrompt);
      }

      onShowToast('success', 'Pack de rappels islamiques généré par Gemini !');
    } catch (error: any) {
      onShowToast('error', error?.message || 'Échec de génération du texte.');
    } finally {
      setIsGeneratingText(false);
    }
  };

  // 3. Generate Visual Image with Imagen 3
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      onShowToast('error', 'Veuillez décrire le visuel souhaité.');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const asset = await ImagenService.generateImage({
        prompt: imagePrompt,
        aspectRatio: imageRatio,
        style: imageStyle
      });

      setCurrentMedia(asset);
      StorageService.saveMediaAsset(asset);
      onShowToast('success', 'Visuel islamique 8K généré avec succès !');
    } catch (error: any) {
      onShowToast('error', error?.message || 'Erreur de génération d’image.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 4. Generate AI Video Clip
  const handleGenerateVideo = async (mode: 'text_to_video' | 'image_to_video' = 'text_to_video') => {
    setIsGeneratingVideo(true);
    try {
      const asset = await VideoService.generateVideo({
        prompt: videoPrompt,
        mode,
        sourceImageUrl: mode === 'image_to_video' ? currentMedia?.url : undefined,
        durationSeconds: videoDuration,
        aspectRatio: videoRatio,
        motionPreset: videoMotion
      });

      setCurrentMedia(asset);
      StorageService.saveMediaAsset(asset);
      onShowToast('success', 'Clip vidéo IA généré et prêt pour TikTok / Reels !');
    } catch (error: any) {
      onShowToast('error', error?.message || 'Erreur de génération vidéo.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // 5. Construct Post Object
  const getPostObject = (): ScheduledPost => {
    return {
      id: editingPost?.id || `post-${Date.now()}`,
      title: prompt.slice(0, 50) || 'Rappel Islamique Authentique',
      originalIdea: prompt,
      platforms: selectedPlatforms,
      platformContent: platformContent,
      media: currentMedia,
      scheduledTime: editingPost?.scheduledTime || new Date(Date.now() + 3600000).toISOString(),
      status: editingPost?.status || 'draft',
      createdAt: editingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Save Draft
  const handleSaveDraft = () => {
    const post = getPostObject();
    post.status = 'draft';
    StorageService.savePost(post);
    onPostSaved(post);
    onShowToast('success', 'Brouillon enregistré avec succès !');
  };

  // Direct Publish (Buffer TikTok & Instagram + Webhook)
  const handlePublishNow = async () => {
    const post = getPostObject();
    try {
      const published = await SocialPublisher.publishNow(post);
      onPostSaved(published);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#059669', '#d97706']
      });
      onShowToast('success', 'Publié en direct sur @kaelarislamic & @mdou.g !');
    } catch (error: any) {
      onShowToast('error', 'Erreur lors de la publication directe.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Studio Header Bar */}
      <div className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.5rem',
        border: '1px solid var(--border-accent)',
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.15) 0%, rgba(13, 21, 39, 0.9) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.3rem'
          }}>
            🕌
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Kaelar Islamic AI Studio</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Diffusion automatique pour <strong>@kaelarislamic</strong> & <strong>@mdou.g</strong>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleSaveDraft}
            style={{ gap: '0.4rem' }}
          >
            <Save size={15} />
            <span>Enregistrer</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsScheduleModalOpen(true)}
            style={{ gap: '0.4rem' }}
          >
            <Calendar size={15} color="var(--accent-primary)" />
            <span>Programmer</span>
          </button>

          <button 
            className="btn btn-primary btn-sm"
            onClick={handlePublishNow}
            style={{ gap: '0.4rem', background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)' }}
          >
            <Send size={15} />
            <span>Publier Maintenant</span>
          </button>
        </div>
      </div>

      {/* Main Studio Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'islamic' ? 'active' : ''}`}
          onClick={() => setActiveTab('islamic')}
          style={{ gap: '0.4rem', fontWeight: 700 }}
        >
          <span>🕌</span>
          <span>1. Rappels & Citations Vérifiés</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
          style={{ gap: '0.4rem' }}
        >
          <Sparkles size={15} />
          <span>2. Textes & Scripts Gemini</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
          style={{ gap: '0.4rem' }}
        >
          <ImageIcon size={15} />
          <span>3. Visuels Imagen 3</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
          style={{ gap: '0.4rem' }}
        >
          <Film size={15} />
          <span>4. Vidéo IA & Audio</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'customize' ? 'active' : ''}`}
          onClick={() => setActiveTab('customize')}
          style={{ gap: '0.4rem' }}
        >
          <Layers size={15} />
          <span>5. Personnalisation Réseaux</span>
        </button>
      </div>

      {/* Tab 1: Dedicated Islamic Quote Card Generator */}
      {activeTab === 'islamic' && (
        <IslamicQuoteCardGenerator
          onApplyPost={handleApplyIslamicPost}
          onShowToast={onShowToast}
        />
      )}

      {/* Layout for Tabs 2, 3, 4, 5: Generator Left + Live Mockup Right */}
      {activeTab !== 'islamic' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          
          {/* Left Panel: Active Generator */}
          <div>
            {activeTab === 'text' && (
              <AITextGenerator
                prompt={prompt}
                setPrompt={setPrompt}
                tone={tone}
                setTone={setTone}
                selectedPlatforms={selectedPlatforms}
                onTogglePlatform={handleTogglePlatform}
                onGenerate={handleGenerateText}
                isGenerating={isGeneratingText}
                onShowToast={onShowToast}
              />
            )}

            {activeTab === 'image' && (
              <AIImageGenerator
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
                imageRatio={imageRatio}
                setImageRatio={setImageRatio}
                imageStyle={imageStyle}
                setImageStyle={setImageStyle}
                suggestedPrompt={suggestedImagePrompt}
                onGenerate={handleGenerateImage}
                isGenerating={isGeneratingImage}
                generatedImage={currentMedia}
              />
            )}

            {activeTab === 'video' && (
              <AIVideoGenerator
                videoPrompt={videoPrompt}
                setVideoPrompt={setVideoPrompt}
                videoDuration={videoDuration}
                setVideoDuration={setVideoDuration}
                videoMotion={videoMotion}
                setVideoMotion={setVideoMotion}
                videoRatio={videoRatio}
                setVideoRatio={setVideoRatio}
                suggestedPrompt={suggestedVideoPrompt}
                onGenerate={handleGenerateVideo}
                isGenerating={isGeneratingVideo}
                generatedVideo={currentMedia}
                currentImage={currentMedia}
              />
            )}

            {activeTab === 'customize' && (
              <PlatformCustomizer
                selectedPlatforms={selectedPlatforms}
                platformContent={platformContent}
                setPlatformContent={setPlatformContent}
                activePreviewPlatform={activePreviewPlatform}
                setActivePreviewPlatform={setActivePreviewPlatform}
              />
            )}
          </div>

          {/* Right Panel: Interactive Social Mockups (TikTok / Instagram) */}
          <div style={{ position: 'sticky', top: '1.5rem' }}>
            <MultiPlatformPreview
              activePlatform={activePreviewPlatform}
              onSelectPlatform={setActivePreviewPlatform}
              platformContent={platformContent[activePreviewPlatform]}
              media={currentMedia}
              selectedPlatforms={selectedPlatforms}
            />
          </div>

        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <ScheduleModal
          isOpen={true}
          onClose={() => setIsScheduleModalOpen(false)}
          targetPlatform={activePreviewPlatform}
          onScheduleConfirm={(scheduledDate) => {
            const post = getPostObject();
            SocialPublisher.schedulePost(post, scheduledDate);
            onPostSaved(post);
            setIsScheduleModalOpen(false);
            onShowToast('success', `Rappel programmé avec succès pour le ${scheduledDate.toLocaleDateString('fr-FR')} !`);
          }}
        />
      )}

    </div>
  );
};
