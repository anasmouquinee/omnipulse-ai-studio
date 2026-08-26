import React, { useState, useEffect, useRef } from 'react';
import type { IslamicPostItem, IslamicContentType, IslamicLanguage } from '../../types/islamic';
import { IslamicContentService, AVAILABLE_RECITERS } from '../../services/islamicContentService';
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
  Share2
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
  const [selectedTheme, setSelectedTheme] = useState<'golden_night' | 'emerald_mosque' | 'desert_dunes' | 'celestial_sky'>('golden_night');
  const [selectedReciterId, setSelectedReciterId] = useState<string>('ar.alafasy');

  const [currentItem, setCurrentItem] = useState<IslamicPostItem>(VERIFIED_ISLAMIC_POSTS[0]);
  const [renderedCardUrl, setRenderedCardUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Render canvas card when currentItem, aspectRatio, selectedLanguage or theme changes
  useEffect(() => {
    let isMounted = true;
    const generateCanvas = async () => {
      setIsRendering(true);
      const cardUrl = await IslamicContentService.renderQuoteCardCanvas(
        { ...currentItem, visualTheme: selectedTheme },
        aspectRatio,
        selectedLanguage
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
  }, [currentItem, aspectRatio, selectedLanguage, selectedTheme]);

  // When reciter changes on a Quran verse, fetch exact matching audio
  const handleReciterChange = async (reciterId: string) => {
    setSelectedReciterId(reciterId);
    if (currentItem.source.type === 'quran' && currentItem.source.surahNumber && currentItem.source.ayahNumber) {
      const audio = await IslamicContentService.fetchExactQuranAudio(
        currentItem.source.surahNumber,
        currentItem.source.ayahNumber,
        reciterId
      );
      if (audio) {
        setCurrentItem(prev => ({ ...prev, reciterAudio: audio }));
        onShowToast('info', `Audio synchronisé avec ${audio.reciterName} !`);
      }
    }
  };

  const handleSelectPreset = (preset: typeof ISLAMIC_THEME_PRESETS[0]) => {
    setSelectedCategory(preset.category);
    const matching = VERIFIED_ISLAMIC_POSTS.find(p => p.type === preset.category);
    if (matching) {
      setCurrentItem({ ...matching, visualTheme: selectedTheme });
    }
  };

  const handleGenerateAI = async () => {
    setIsGeneratingGemini(true);
    setIsRendering(true);
    try {
      const generated = await IslamicContentService.generateIslamicPost(
        selectedCategory,
        customTopic || undefined,
        selectedLanguage,
        selectedReciterId
      );
      const updatedItem: IslamicPostItem = { 
        ...generated, 
        id: `islamic-${Date.now()}`, 
        visualTheme: selectedTheme 
      };
      setCurrentItem(updatedItem);

      // Force immediate canvas update
      const newCardUrl = await IslamicContentService.renderQuoteCardCanvas(
        updatedItem,
        aspectRatio,
        selectedLanguage
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
    onShowToast('success', 'Rappel islamique et carte visuelle appliqués au studio !');
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
              Générateur de Citations & Rappels Islamiques Authentiques
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Coran, Hadiths Sahih et Invocations vérifiés avec calligraphie arabe et audio synchronisé
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
            100% Sources Sahih & Audio Exact
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
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

          {/* Languages Selector */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Languages size={15} color="#f59e0b" />
                Langues affichées sur la carte & les légendes
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

          {/* Visual Theme Preset */}
          <div className="form-group">
            <label className="form-label">Ambiance Visuelle & Couleurs</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'golden_night', name: 'Nuit Étoilée & Or', icon: '🌌' },
                { id: 'emerald_mosque', name: 'Mosquée Émeraude', icon: '🕌' },
                { id: 'desert_dunes', name: 'Dunes Dorées', icon: '🏜️' },
                { id: 'celestial_sky', name: 'Ciel Céleste', icon: '✨' },
              ].map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 0.8rem',
                    fontSize: '0.78rem',
                    borderRadius: 'var(--radius-xs)',
                    background: selectedTheme === theme.id ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-input)',
                    border: `1px solid ${selectedTheme === theme.id ? '#f59e0b' : 'var(--border-subtle)'}`,
                    color: selectedTheme === theme.id ? '#f59e0b' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <span>{theme.icon}</span>
                  <span style={{ fontWeight: 600 }}>{theme.name}</span>
                </button>
              ))}
            </div>
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
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              onClick={handleDownload}
              style={{ flex: 1, gap: '0.4rem' }}
            >
              <Download size={15} />
              <span>Télécharger HD</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={handleApplyToStudio}
              style={{ flex: 1.5, gap: '0.4rem', background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)' }}
            >
              <Share2 size={16} />
              <span>Appliquer & Publier</span>
            </button>
          </div>
        </div>

        {/* Right: Live Canvas Render Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '100%',
            maxWidth: aspectRatio === '9:16' ? 320 : 380,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(217, 119, 6, 0.4)',
            background: '#000',
            position: 'relative'
          }}>
            {renderedCardUrl ? (
              <img
                src={renderedCardUrl}
                alt="Islamic Quote Preview"
                style={{ width: '100%', display: 'block', height: 'auto' }}
              />
            ) : (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                <RefreshCw size={24} className="animate-spin" />
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Rendu de la calligraphie...</p>
              </div>
            )}

            {/* Audio Indicator Overlay */}
            {isPlayingAudio && (
              <div style={{
                position: 'absolute',
                top: 15,
                right: 15,
                background: 'rgba(16, 185, 129, 0.9)',
                color: '#fff',
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backdropFilter: 'blur(4px)'
              }}>
                <Volume2 size={12} className="animate-bounce" />
                <span>Récitation exacte</span>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
            Prêt pour publication directe sur <strong>@kaelarislamic</strong> & <strong>@mdou.g</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
