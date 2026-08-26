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
import { GeminiService } from '../../services/geminiService';
import { ImagenService } from '../../services/imagenService';
import { VideoService } from '../../services/videoService';
import { SocialPublisher } from '../../services/socialPublisher';
import { StorageService } from '../../services/storageService';

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
  Film
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudioViewProps {
  editingPost: ScheduledPost | null;
  onPostSaved: (post: ScheduledPost) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

type StudioTab = 'text' | 'image' | 'video' | 'customize';

export const StudioView: React.FC<StudioViewProps> = ({
  editingPost,
  onPostSaved,
  onShowToast
}) => {
  // Main Studio State
  const [activeTab, setActiveTab] = useState<StudioTab>('text');
  const [prompt, setPrompt] = useState(editingPost?.originalIdea || 'Lancement de notre nouveau studio IA tout-en-un pour réseaux sociaux');
  const [tone, setTone] = useState<AITone>('viral');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(
    editingPost?.platforms || ['tiktok', 'instagram', 'x', 'linkedin', 'facebook']
  );
  
  // Platform-specific content
  const [platformContent, setPlatformContent] = useState<Record<SocialPlatform, PlatformContent>>(
    editingPost?.platformContent || {
      tiktok: { text: '', hashtags: ['#fyp', '#tech', '#viral'] },
      instagram: { text: '', hashtags: ['#automation', '#contentcreator', '#ia'] },
      x: { text: '', hashtags: ['#IA', '#Productivity'] },
      linkedin: { text: '', hashtags: ['#MarketingStrategy', '#Innovation'] },
      facebook: { text: '', hashtags: ['#entrepreneuriat', '#marketing'] },
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
  const [imagePrompt, setImagePrompt] = useState('Futuristic glowing neural network visualization in cyber-violet and cyan, 8k render');
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>('1:1');
  const [imageStyle, setImageStyle] = useState<ImageStylePreset>('cinematic');

  // Video generation parameters
  const [videoPrompt, setVideoPrompt] = useState('Dynamic camera zoom into futuristic holographic interface, smooth 60fps cinematic motion');
  const [videoDuration, setVideoDuration] = useState<5 | 10 | 15>(10);
  const [videoMotion, setVideoMotion] = useState<VideoMotionPreset>('dynamic_pan');
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

  // Update specific platform content
  const handleUpdateContent = (platform: SocialPlatform, updated: Partial<PlatformContent>) => {
    setPlatformContent(prev => ({
      ...prev,
      [platform]: { ...prev[platform], ...updated }
    }));
  };

  // 1. Generate Multi-Network Text with Gemini Flash
  const handleGenerateText = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingText(true);

    try {
      const result: GeneratedSocialPack = await GeminiService.generateSocialPack({
        prompt,
        tone,
        targetPlatforms: selectedPlatforms
      });

      // Update platform content
      setPlatformContent({
        tiktok: {
          text: result.platforms.tiktok.caption,
          hook: result.platforms.tiktok.hook,
          videoScript: result.platforms.tiktok.videoScript,
          hashtags: result.platforms.tiktok.hashtags,
          audioTrackSuggestion: result.platforms.tiktok.audioTrackSuggestion
        },
        instagram: {
          text: result.platforms.instagram.caption,
          hook: result.platforms.instagram.hook,
          callToAction: result.platforms.instagram.callToAction,
          hashtags: result.platforms.instagram.hashtags
        },
        facebook: {
          text: result.platforms.facebook.text,
          hook: result.platforms.facebook.hook,
          callToAction: result.platforms.facebook.callToAction,
          hashtags: result.platforms.facebook.hashtags
        },
        linkedin: {
          text: result.platforms.linkedin.text,
          hook: result.platforms.linkedin.headline,
          callToAction: result.platforms.linkedin.callToAction,
          hashtags: result.platforms.linkedin.hashtags
        },
        x: {
          text: result.platforms.x.tweet,
          hook: result.platforms.x.threadParts?.[0],
          hashtags: result.platforms.x.hashtags
        }
      });

      setSuggestedImagePrompt(result.suggestedImagePrompt);
      setSuggestedVideoPrompt(result.suggestedVideoPrompt);
      setImagePrompt(result.suggestedImagePrompt);
      setVideoPrompt(result.suggestedVideoPrompt);

      onShowToast('success', 'Pack social généré avec succès par Gemini Flash !');
      setActiveTab('customize');
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Erreur lors de la génération Gemini Flash.');
    } finally {
      setIsGeneratingText(false);
    }
  };

  // 2. Generate Image with Imagen 3
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);

    try {
      const asset = await ImagenService.generateImage({
        prompt: imagePrompt,
        aspectRatio: imageRatio,
        style: imageStyle
      });
      setCurrentMedia(asset);
      onShowToast('success', 'Visuel Imagen 3 généré et ajouté au post !');
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Erreur lors de la génération Imagen 3.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 3. Generate Video
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setIsGeneratingVideo(true);

    try {
      const asset = await VideoService.generateVideo({
        prompt: videoPrompt,
        durationSeconds: videoDuration,
        motion: videoMotion,
        aspectRatio: videoRatio,
        sourceImageUrl: currentMedia?.type === 'image' ? currentMedia.url : undefined
      });
      setCurrentMedia(asset);
      onShowToast('success', 'Clip vidéo IA généré avec succès !');
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Erreur lors de la génération vidéo.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Build the Post Object
  const buildCurrentPost = (status: ScheduledPost['status'] = 'draft'): ScheduledPost => {
    return {
      id: editingPost?.id || `post-${Date.now()}`,
      title: prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt,
      originalIdea: prompt,
      platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['tiktok', 'instagram', 'x'],
      platformContent,
      media: currentMedia,
      scheduledTime: editingPost?.scheduledTime || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      status,
      createdAt: editingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  // 4. Save as Draft
  const handleSaveDraft = () => {
    const post = buildCurrentPost('draft');
    StorageService.savePost(post);
    onPostSaved(post);
    onShowToast('info', 'Brouillon sauvegardé avec succès.');
  };

  // 5. Direct Publish Now
  const handlePublishNow = async () => {
    const post = buildCurrentPost('publishing');
    try {
      await SocialPublisher.publishNow(post);
      onPostSaved(post);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onShowToast('success', 'Publication diffusée sur tous vos réseaux ! 🚀');
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Erreur lors de la publication directe.');
    }
  };

  // 6. Schedule Confirmation
  const handleConfirmSchedule = (post: ScheduledPost, targetTime: Date) => {
    const scheduled = SocialPublisher.schedulePost(post, targetTime);
    onPostSaved(scheduled);
    onShowToast('success', `Publication programmée pour le ${targetTime.toLocaleDateString('fr-FR')} à ${targetTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} !`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', gap: '1.75rem', alignItems: 'start' }}>
      {/* Left Column: AI Creation Studio & Tools */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Navigation Tabs between Text, Image, Video, Customizer */}
        <div className="tabs-container" style={{ padding: '0.4rem' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveTab('text')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Sparkles size={15} color="var(--accent-primary)" />
            <span>1. Texte Gemini</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <ImageIcon size={15} color="var(--accent-pink)" />
            <span>2. Image Imagen 3</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Film size={15} color="var(--accent-amber)" />
            <span>3. Vidéo IA</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'customize' ? 'active' : ''}`}
            onClick={() => setActiveTab('customize')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Layers size={15} color="var(--accent-cyan)" />
            <span>4. Ajustement</span>
          </button>
        </div>

        {/* Tab Content 1: Gemini Flash Text */}
        {activeTab === 'text' && (
          <AITextGenerator
            prompt={prompt}
            onPromptChange={setPrompt}
            tone={tone}
            onToneChange={setTone}
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
            isGenerating={isGeneratingText}
            onGenerate={handleGenerateText}
          />
        )}

        {/* Tab Content 2: Imagen 3 Image */}
        {activeTab === 'image' && (
          <AIImageGenerator
            imagePrompt={imagePrompt}
            onImagePromptChange={setImagePrompt}
            aspectRatio={imageRatio}
            onAspectRatioChange={setImageRatio}
            style={imageStyle}
            onStyleChange={setImageStyle}
            isGenerating={isGeneratingImage}
            onGenerate={handleGenerateImage}
            currentMedia={currentMedia}
            suggestedPrompt={suggestedImagePrompt}
            onApplySuggestedPrompt={() => setImagePrompt(suggestedImagePrompt)}
          />
        )}

        {/* Tab Content 3: Video AI */}
        {activeTab === 'video' && (
          <AIVideoGenerator
            videoPrompt={videoPrompt}
            onVideoPromptChange={setVideoPrompt}
            duration={videoDuration}
            onDurationChange={setVideoDuration}
            motion={videoMotion}
            onMotionChange={setVideoMotion}
            aspectRatio={videoRatio}
            onAspectRatioChange={setVideoRatio}
            isGenerating={isGeneratingVideo}
            onGenerate={handleGenerateVideo}
            currentMedia={currentMedia}
            suggestedPrompt={suggestedVideoPrompt}
            onApplySuggestedPrompt={() => setVideoPrompt(suggestedVideoPrompt)}
          />
        )}

        {/* Tab Content 4: Platform-Specific Customizer */}
        {activeTab === 'customize' && (
          <PlatformCustomizer
            platformContent={platformContent}
            onUpdateContent={handleUpdateContent}
            activePlatform={activePreviewPlatform}
            onSelectPlatform={setActivePreviewPlatform}
          />
        )}

        {/* Action Controls Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          background: 'var(--bg-surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            className="btn btn-secondary"
            onClick={handleSaveDraft}
          >
            <Save size={16} />
            <span>Sauvegarder Brouillon</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setIsScheduleModalOpen(true)}
              style={{ gap: '0.4rem', border: '1px solid var(--accent-cyan)' }}
            >
              <Calendar size={16} color="var(--accent-cyan)" />
              <span>Programmer...</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={handlePublishNow}
              style={{ gap: '0.4rem' }}
            >
              <Send size={16} />
              <span>Publier Maintenant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Real-time Multi-Platform Preview */}
      <div style={{ position: 'sticky', top: '90px' }}>
        <MultiPlatformPreview
          platformContent={platformContent}
          media={currentMedia}
          activePlatform={activePreviewPlatform}
          onSelectPlatform={setActivePreviewPlatform}
        />
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        post={buildCurrentPost('scheduled')}
        onSchedule={handleConfirmSchedule}
      />
    </div>
  );
};
