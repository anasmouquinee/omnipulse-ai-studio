import React, { useState, useEffect, useRef } from 'react';
import type { IslamicPostItem, IslamicContentType, IslamicLanguage } from '../../types/islamic';
import { IslamicContentService, AVAILABLE_RECITERS, parseSurahNumber, parseAyahNumber } from '../../services/islamicContentService';
import { SocialPublisher } from '../../services/socialPublisher';
import { StorageService } from '../../services/storageService';
import { ISLAMIC_BACKGROUND_THEMES, type IslamicBackgroundTheme } from '../../data/islamicBackgrounds';
import { VERIFIED_ISLAMIC_POSTS, ISLAMIC_THEME_PRESETS, VERIFIED_RECITERS } from '../../data/verifiedIslamicData';
import { 
  Sparkles, 
  Volume2, 
  Play, 
  Pause, 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Languages,
  BookOpen,
  Mic,
  Share2,
  Send,
  Image as ImageIcon,
  Palette
} from 'lucide-react';

interface IslamicQuoteCardGeneratorProps {
  onApplyPost: (item: IslamicPostItem, generatedCardUrl: string, language: IslamicLanguage) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const IslamicQuoteCardGenerator: React.FC<IslamicQuoteCardGeneratorProps> = ({
  onApplyPost,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IslamicContentType>('quran_verse');
  const [customTopic, setCustomTopic] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<IslamicLanguage>('all');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1'>('9:16');
  const [selectedThemeId, setSelectedThemeId] = useState<string>(ISLAMIC_BACKGROUND_THEMES[0].id);
  const [selectedReciterId, setSelectedReciterId] = useState<string>('ar.alafasy');

  const [currentItem, setCurrentItem] = useState<IslamicPostItem>(VERIFIED_ISLAMIC_POSTS[0]);
  const [renderedCardUrl, setRenderedCardUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
  const [isPublishingDirectly, setIsPublishingDirectly] = useState(false);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Render canvas card when currentItem, aspectRatio, selectedLanguage or theme changes
  useEffect(() => {
    let isMounted = true;
    const generateCanvas = async () => {
      setIsRendering(true);
      const cardUrl = await IslamicContentService.renderQuoteCardCanvas(
        currentItem,
        aspectRatio,
        selectedLanguage,
        selectedThemeId
      );
      if (isMounted) {
        setRenderedCardUrl(cardUrl);
        setIsRendering(false);
      }
    };

    generateCanvas();
    return () => {
      isMounted = false;
    };
  }, [currentItem, aspectRatio, selectedLanguage, selectedThemeId]);

  // When reciter changes on a Quran verse, fetch exact matching audio
  const handleReciterChange = async (reciterId: string) => {
    setSelectedReciterId(reciterId);
    const surah = currentItem.source.surahNumber || 94;
    const ayah = currentItem.source.ayahNumber || 1;
    
    const audio = await IslamicContentService.fetchExactQuranAudio(
      surah,
      ayah,
      reciterId
    );
    if (audio) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }
      setCurrentItem(prev => ({ ...prev, reciterAudio: audio }));
      onShowToast('info', `Audio synchronisé avec ${audio.reciterName} !`);
    }
  };

  const handleSelectPreset = async (preset: typeof ISLAMIC_THEME_PRESETS[0]) => {
    setSelectedCategory(preset.category);
    setIsRendering(true);
    try {
      const matching = VERIFIED_ISLAMIC_POSTS.find(p => p.type === preset.category) || VERIFIED_ISLAMIC_POSTS[0];
      setCurrentItem(matching);
      const newCardUrl = await IslamicContentService.renderQuoteCardCanvas(
        matching,
        aspectRatio,
        selectedLanguage,
        selectedThemeId
      );
      setRenderedCardUrl(newCardUrl);
      onShowToast('info', `Catégorie sélectionnée : ${preset.name}`);
    } finally {
      setIsRendering(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGeneratingGemini(true);
    setIsRendering(true);
    try {
      const topicSuggestions: Record<IslamicContentType, string[]> = {
        quran_verse: [
          'La patience et la délivrance après l’épreuve',
          'L’apaisement du cœur par le rappel d’Allah (Dhikr)',
          'Le pardon infini et la miséricorde divine',
          'La confiance absolue en Allah (Tawakkul)',
          'La gratitude pour les bienfaits d’Allah'
        ],
        sahih_hadith: [
          'La valeur du bon comportement et de la bonté',
          'L’amour fraternel et l’entraide en Islam',
          'L’importance de la sincérité (Ikhlas)',
          'Les mérites de la prière à l’heure'
        ],
        authentic_dua: [
          'Invocation contre l’angoisse et les soucis',
          'Invocation du matin et de la protection divine',
          'Invocation pour demander la guidée et la piété',
          'Demande de pardon sincère (Sayyid al-Istighfar)'
        ],
        jumua_special: [
          'Les bénédictions du vendredi (Jumu’ah)',
          'Les mérites de la lecture de Sourate Al-Kahf',
          'Multiplier les prières sur le Prophète ﷺ le vendredi'
        ],
        tahajjud_motivation: [
          'L’intimité spirituelle du dernier tiers de la nuit',
          'La prière de nuit (Tahajjud) et l’invocation exaucée',
          'L’apaisement de l’âme avant l’aube (Fajr)'
        ],
        islamic_reminder: [
          'La vraie richesse de l’âme et le contentement',
          'La parole bienveillante comme aumône'
        ]
      };

      const suggestions = topicSuggestions[selectedCategory] || topicSuggestions.quran_verse;
      const randomSuggestedTopic = suggestions[Math.floor(Math.random() * suggestions.length)];
      const effectiveTopic = customTopic.trim() || randomSuggestedTopic;

      const generated = await IslamicContentService.generateIslamicPost(
        selectedCategory,
        effectiveTopic,
        selectedLanguage,
        selectedReciterId
      );
      const updatedItem: IslamicPostItem = { 
        ...generated, 
        id: `islamic-${Date.now()}`
      };
      setCurrentItem(updatedItem);

      // Force immediate canvas update
      const newCardUrl = await IslamicContentService.renderQuoteCardCanvas(
        updatedItem,
        aspectRatio,
        selectedLanguage,
        selectedThemeId
      );
      setRenderedCardUrl(newCardUrl);

      onShowToast('success', `✨ Généré par Gemini : ${updatedItem.topic} (${updatedItem.source.authenticityGrade})`);
    } catch (e: any) {
      console.warn('Generation error:', e);
      onShowToast('error', 'Erreur lors de la génération. Utilisation de la base vérifiée.');
    } finally {
      setIsGeneratingGemini(false);
      setIsRendering(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {
        onShowToast('info', 'Lecture audio démarrée');
      });
    }
  };

  const handleApplyToStudio = () => {
    onApplyPost(currentItem, renderedCardUrl, selectedLanguage);
    onShowToast('success', 'Rappel islamique chargé dans l’éditeur du studio !');
  };

  const handleDirectPublish = async () => {
    setIsPublishingDirectly(true);
    try {
      const scheduled = IslamicContentService.convertToScheduledPost(
        currentItem,
        selectedLanguage,
        renderedCardUrl
      );
      
      // Publish to Buffer for @kaelarislamic
      await SocialPublisher.publishNow(scheduled);

      const latestLogs = StorageService.getPublishLogs();
      const instaLog = latestLogs.find(l => l.platform === 'instagram' && l.postId === scheduled.id);
      if (instaLog && instaLog.status === 'success') {
        onShowToast('success', '✨ Affiche islamique publiée en direct sur Instagram (@kaelarislamic) !');
      } else if (instaLog && instaLog.status === 'failed') {
        onShowToast('error', instaLog.responseMessage || 'Erreur lors de la publication sur Buffer.');
      } else {
        onShowToast('success', '✨ Post transmis avec succès à Buffer (@kaelarislamic) !');
      }
    } catch (e: any) {
      console.warn('Publish error:', e);
      onShowToast('error', `Erreur de publication: ${e?.message || 'Vérifiez la connexion Buffer.'}`);
    } finally {
      setIsPublishingDirectly(false);
    }
  };

  const [isExportingVideo, setIsExportingVideo] = useState(false);

  const handleExportVideoReel = async () => {
    if (!renderedCardUrl || !currentItem.reciterAudio?.audioUrl) {
      onShowToast('info', 'Audio non disponible pour l’export vidéo');
      return;
    }

    setIsExportingVideo(true);
    onShowToast('info', '🎬 Téléchargement de l’audio et génération du Reel...');

    let animationFrameId: number | null = null;

    try {
      // 1. Fetch audio with proxy to bypass CORS
      const proxyAudioUrl = `/api/proxy-audio?url=${encodeURIComponent(currentItem.reciterAudio.audioUrl)}`;
      const audioRes = await fetch(proxyAudioUrl);
      if (!audioRes.ok) {
        throw new Error('Impossible de charger le fichier audio de récitation.');
      }
      const audioArrayBuffer = await audioRes.arrayBuffer();

      // 2. Load card image
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Erreur chargement image'));
        img.src = renderedCardUrl;
      });

      // 3. Setup AudioContext and decode audio
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer);
      const audioDuration = audioBuffer.duration;

      const dest = audioCtx.createMediaStreamDestination();
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(dest);
      source.connect(audioCtx.destination);

      // 4. Setup Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas non supporté');

      // Continuous animation loop for video frames
      let startTime = performance.now();
      const renderFrame = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        ctx.clearRect(0, 0, 1080, 1920);

        // Subtle dynamic zoom
        const scale = 1 + 0.02 * Math.sin((elapsed * Math.PI) / 8);
        const w = 1080 * scale;
        const h = 1920 * scale;
        const x = (1080 - w) / 2;
        const y = (1920 - h) / 2;
        ctx.drawImage(img, x, y, w, h);

        animationFrameId = requestAnimationFrame(renderFrame);
      };
      renderFrame();

      const canvasStream = canvas.captureStream(30);
      const combinedTracks = [
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ];
      const combinedStream = new MediaStream(combinedTracks);

      const mimeType = MediaRecorder.isTypeSupported('video/mp4') 
        ? 'video/mp4' 
        : (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm');

      const recorder = new MediaRecorder(combinedStream, { 
        mimeType,
        videoBitsPerSecond: 4500000 
      });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        audioCtx.close().catch(() => {});

        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        a.download = `reel-${(currentItem.source.bookOrSurah || 'quran').replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsExportingVideo(false);
        onShowToast('success', '✨ Vidéo Reel avec audio Coranique téléchargée pour TikTok et Instagram !');
      };

      recorder.start();
      source.start(0);

      // Stop after audio duration (+0.5s padding)
      const stopTimeout = setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, (audioDuration + 0.5) * 1000);

      source.onended = () => {
        clearTimeout(stopTimeout);
        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }, 500);
      };

    } catch (err: any) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      console.warn('Video export error:', err);
      setIsExportingVideo(false);
      onShowToast('error', `Erreur vidéo : ${err?.message || 'Impossible de créer la vidéo'}`);
    }
  };

  const handleDownload = () => {
    if (!renderedCardUrl) return;
    const link = document.createElement('a');
    link.download = `islamic-quote-${currentItem.type}-${Date.now()}.png`;
    link.href = renderedCardUrl;
    link.click();
    onShowToast('success', 'Carte de rappel téléchargée en haute définition !');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Audio Element */}
      {currentItem.reciterAudio && (
        <audio
          key={currentItem.reciterAudio.audioUrl}
          ref={audioRef}
          src={currentItem.reciterAudio.audioUrl}
          onEnded={() => setIsPlayingAudio(false)}
        />
      )}

      {/* Top Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.3) 0%, rgba(13, 21, 39, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
          }}>
            🕌
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Studio Visuel & Rappels Islamiques Cinématiques
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Fonds photographiques réels, calligraphie ornée et audio synchronisé pour TikTok & Reels
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#10b981'
          }}>
            <ShieldCheck size={14} />
            100% Sources Sahih & Rendu HD
          </span>
        </div>
      </div>

      {/* Preset Categories Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {ISLAMIC_THEME_PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: selectedCategory === preset.category 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%)' 
                : 'var(--bg-card)',
              border: `1px solid ${selectedCategory === preset.category ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
              color: selectedCategory === preset.category ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{preset.icon}</span>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: selectedCategory === preset.category ? '#f59e0b' : 'inherit' }}>
                {preset.name}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Grid: Controls Left + Canvas Preview Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left: Customization Controls */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Custom Topic Input */}
          <div className="form-group">
            <label className="form-label">
              <span>Sujet spécifique ou mot-clé (Ex: Kaffarah, Sabr, Tawakkul, Tahajjud...)</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Ex: Kaffarah, l’apaisement du cœur, le repentir..."
              />
              <button
                className="btn btn-primary"
                onClick={handleGenerateAI}
                disabled={isGeneratingGemini}
                style={{ gap: '0.4rem', whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)' }}
              >
                {isGeneratingGemini ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
                <span>Générer IA</span>
              </button>
            </div>
          </div>

          {/* Photographic Background Themes Selector */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Palette size={15} color="#f59e0b" />
                Arrière-plan Photographique & Ambiance
              </span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.6rem' }}>
              {ISLAMIC_BACKGROUND_THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedThemeId(theme.id)}
                  style={{
                    position: 'relative',
                    height: 64,
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden',
                    border: `2px solid ${selectedThemeId === theme.id ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                    cursor: 'pointer',
                    padding: 0,
                    boxShadow: selectedThemeId === theme.id ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={theme.imageUrl}
                    alt={theme.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#fff',
                    textAlign: 'left'
                  }}>
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Languages Selector */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Languages size={15} color="#f59e0b" />
                Langues affichées sur la carte
              </span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
              {[
                { id: 'all', label: 'Trilingue (AR+FR+EN)' },
                { id: 'fr', label: 'Français 🇫🇷' },
                { id: 'en', label: 'English 🇬🇧' },
                { id: 'ar', label: 'العربية 🇸🇦' },
              ].map(lang => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.id as IslamicLanguage)}
                  style={{
                    padding: '0.5rem 0.3rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-xs)',
                    background: selectedLanguage === lang.id ? 'var(--grad-primary)' : 'var(--bg-input)',
                    color: selectedLanguage === lang.id ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reciter Selector for Quran Audio */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mic size={15} color="#10b981" />
                Récitateur Coranique (Audio Exact du Verset)
              </span>
            </label>
            <select
              className="form-select"
              value={selectedReciterId}
              onChange={(e) => handleReciterChange(e.target.value)}
            >
              {AVAILABLE_RECITERS.map(rec => (
                <option key={rec.id} value={rec.id}>{rec.name}</option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="form-group">
            <label className="form-label">Format de la carte</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-xs)',
                  background: aspectRatio === '9:16' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-input)',
                  border: `1px solid ${aspectRatio === '9:16' ? '#10b981' : 'var(--border-subtle)'}`,
                  color: aspectRatio === '9:16' ? '#10b981' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                📱 9:16 (TikTok & Reels)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-xs)',
                  background: aspectRatio === '1:1' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-input)',
                  border: `1px solid ${aspectRatio === '1:1' ? '#10b981' : 'var(--border-subtle)'}`,
                  color: aspectRatio === '1:1' ? '#10b981' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                🖼️ 1:1 (Post Instagram)
              </button>
            </div>
          </div>

          {/* Audio Reciter Player */}
          {currentItem.reciterAudio && (
            <div style={{
              background: 'rgba(6, 78, 59, 0.25)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={toggleAudio}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    border: 'none',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isPlayingAudio ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
                </button>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                    🎙️ {currentItem.reciterAudio.reciterName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                    {currentItem.reciterAudio.surahOrTitle}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.75rem' }}>
                <Volume2 size={16} />
                <span>Audio Exact Récité</span>
              </div>
            </div>
          )}

          {/* Source Info Card */}
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Référence certifiée :</span>
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{currentItem.source.authenticityGrade}</span>
            </div>
            <div style={{ fontWeight: 600, color: '#f8fafc' }}>
              📚 {currentItem.source.bookOrSurah} — {currentItem.source.numberOrAyah}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* 1. Main Direct 1-Click Visual Quote Card Publishing to Instagram */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDirectPublish}
              disabled={isPublishingDirectly}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                gap: '0.55rem',
                background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.45)',
                border: '1px solid rgba(16, 185, 129, 0.5)'
              }}
            >
              {isPublishingDirectly ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Publication de la carte sur @kaelarislamic...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>🚀 Publier la Carte Visuelle sur @kaelarislamic (Instagram)</span>
                </>
              )}
            </button>

            {/* 2. Download Actions: Video Reel with Audio & HD Image */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleExportVideoReel}
                disabled={isExportingVideo}
                style={{ 
                  gap: '0.4rem', 
                  fontSize: '0.82rem',
                  background: 'rgba(245, 158, 11, 0.12)',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24'
                }}
              >
                {isExportingVideo ? <RefreshCw size={14} className="animate-spin" /> : <Mic size={14} />}
                <span>{isExportingVideo ? 'Enregistrement...' : '🎬 Vidéo Reel + Audio (TikTok)'}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDownload}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Télécharger Image HD</span>
              </button>
            </div>

            {/* 3. Text edit */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleApplyToStudio}
              style={{ width: '100%', gap: '0.4rem', fontSize: '0.82rem' }}
            >
              <Share2 size={14} />
              <span>Éditer le texte dans le Studio</span>
            </button>
          </div>
        </div>

        {/* Right: Live Canvas Render Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '100%',
            maxWidth: aspectRatio === '9:16' ? 330 : 380,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(245, 158, 11, 0.2)',
            border: '2px solid rgba(245, 158, 11, 0.45)',
            background: '#000',
            position: 'relative'
          }}>
            {renderedCardUrl ? (
              <img
                src={renderedCardUrl}
                alt="Islamic Quote Preview"
                style={{ 
                  width: '100%', 
                  display: 'block', 
                  height: 'auto',
                  opacity: isRendering ? 0.6 : 1,
                  transition: 'opacity 0.2s ease'
                }}
              />
            ) : (
              <div style={{ padding: '5rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                <RefreshCw size={28} className="animate-spin" color="#f59e0b" />
                <p style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>Rendu cinématique en cours...</p>
              </div>
            )}

            {/* Audio Indicator Overlay */}
            {isPlayingAudio && (
              <div style={{
                position: 'absolute',
                top: 15,
                right: 15,
                background: 'rgba(16, 185, 129, 0.95)',
                color: '#fff',
                padding: '0.3rem 0.7rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)'
              }}>
                <Volume2 size={13} className="animate-bounce" />
                <span>Récitation en cours</span>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
            Prêt pour publication directe sur <strong>@kaelarislamic</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
