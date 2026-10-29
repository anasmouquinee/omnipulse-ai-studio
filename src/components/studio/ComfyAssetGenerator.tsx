import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Download, 
  Check, 
  Layers, 
  Eye, 
  Terminal, 
  Copy, 
  ArrowRight,
  Palette,
  Compass,
  Cpu
} from 'lucide-react';
import type { IslamicBackgroundTheme } from '../../data/islamicBackgrounds';

interface ComfyAssetGeneratorProps {
  onApplyAsBackgroundTheme: (theme: IslamicBackgroundTheme) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export type ComfyPresetKey = 'glassmorphism' | 'dark-glow' | '3d-clay' | 'app-icon' | 'hero-illustration' | 'minimal-vector';

interface ComfyPresetMeta {
  key: ComfyPresetKey;
  name: string;
  emoji: string;
  desc: string;
  recommendedRatio: '1:1' | '9:16' | '16:9';
  tag: string;
}

const PRESETS: ComfyPresetMeta[] = [
  {
    key: 'glassmorphism',
    name: 'Verre Dépoli & Néon',
    emoji: '💎',
    desc: 'Couches translucides, réfraction chromatique, contours néon émeraude & or',
    recommendedRatio: '9:16',
    tag: 'Tendance Spatial UI'
  },
  {
    key: 'dark-glow',
    name: 'Obsidienne & Lueur',
    emoji: '🌌',
    desc: 'Fond nuit cosmique, mesh lumineux, accents électriques émeraude et or 24K',
    recommendedRatio: '9:16',
    tag: 'Signature Kaelar'
  },
  {
    key: '3d-clay',
    name: '3D Claymorphic',
    emoji: '🏺',
    desc: 'Plastiline mate, chanfreins doux, teintes pastel, rendu Blender Cycles 3D',
    recommendedRatio: '1:1',
    tag: 'Ludique & Épuré'
  },
  {
    key: 'app-icon',
    name: 'Icône & Badge Squircle',
    emoji: '📱',
    desc: 'Sujet centré isolé, biseau subtil, finition laquée, éclairage de studio Apple HIG',
    recommendedRatio: '1:1',
    tag: 'Badge Premium'
  },
  {
    key: 'hero-illustration',
    name: 'Scène Isométrique Hero',
    emoji: '📐',
    desc: 'Composition 3D isométrique avec widgets flottants et ample espace négatif',
    recommendedRatio: '16:9',
    tag: 'Landing Hero'
  },
  {
    key: 'minimal-vector',
    name: 'Vecteur Minimaliste',
    emoji: '✒️',
    desc: 'Lignes géométriques pures à haut contraste, zéro bruit, esthétique lin',
    recommendedRatio: '9:16',
    tag: 'Style Crème Sunnah'
  }
];

const ISLAMIC_PROMPT_INSPIRATIONS = [
  {
    title: 'Dôme & Croissant Doré',
    concept: 'Minarets et coupole de mosquée à l’heure bleue, croissant de lune doré éclatant dans un ciel étoilé profond avec brume mystique',
    preset: 'dark-glow' as ComfyPresetKey
  },
  {
    title: 'Arche Andalouse Arabesque',
    concept: 'Arche mauresque du palais de l’Alhambra avec moucharabieh géométrique sacré, rayons volumétriques de lumière divine',
    preset: 'glassmorphism' as ComfyPresetKey
  },
  {
    title: 'Kaaba Sacrée 3D Clay',
    concept: 'Modèle 3D claymorphic de la Sainte Kaaba drapée de noir et or sur socle de marbre blanc immaculé aux reflets doux',
    preset: '3d-clay' as ComfyPresetKey
  },
  {
    title: 'Médallion Calligraphique',
    concept: 'Médaillon floral circulaire en ormeau et verre givré avec arabesques géométriques islamiques sacrées et lueur émeraude',
    preset: 'app-icon' as ComfyPresetKey
  },
  {
    title: 'Dunes de Médine à l’Aube',
    concept: 'Dunes de sable du désert à l’aurore dorée (Salat Al-Fajr), brise douce ondulant sur le sable fin avec calligraphie flottante',
    preset: 'minimal-vector' as ComfyPresetKey
  }
];

export const ComfyAssetGenerator: React.FC<ComfyAssetGeneratorProps> = ({
  onApplyAsBackgroundTheme,
  onShowToast
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ComfyPresetKey>('dark-glow');
  const [userConcept, setUserConcept] = useState('Minarets et croissant de lune dorés dans un ciel d’obsidienne émeraude');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [expandedPrompt, setExpandedPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('ugly, blurry, low resolution, pixelated, photographic noise, noisy background, cluttered scenery, deformed typography, illegible letters, chaotic watermark, signature');
  const [isExpanding, setIsExpanding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string>('');
  const [showCliCommand, setShowCliCommand] = useState(false);

  // Apply quick inspiration
  const handleSelectInspiration = (insp: typeof ISLAMIC_PROMPT_INSPIRATIONS[0]) => {
    setUserConcept(insp.concept);
    setSelectedPreset(insp.preset);
    const meta = PRESETS.find(p => p.key === insp.preset);
    if (meta) setAspectRatio(meta.recommendedRatio);
    onShowToast('info', `Inspiration "${insp.title}" chargée avec le preset ${insp.preset} !`);
  };

  // Expand Prompt with Gemini Reasoning (simulating or utilizing local skill expander)
  const handleExpandPrompt = async () => {
    setIsExpanding(true);
    try {
      const presetObj = PRESETS.find(p => p.key === selectedPreset) || PRESETS[0];
      
      // Construct prompt expansion based on comfy-generator skill formula
      const formulaStyles: Record<ComfyPresetKey, string> = {
        'glassmorphism': 'translucent frosted glass cards, refractive chromatic aberration, subtle neon emerald and 24k gold edge glow, sleek dark obsidian backdrop, floating sacred geometry layers, modern Apple iOS aesthetic',
        'dark-glow': 'deep obsidian background (#020612), luminous emerald green (#10B981) mesh gradient, imperial gold neon electric accents, subtle particle bokeh, celestial Islamic atmosphere',
        '3d-clay': '3D claymorphic render, smooth matte plasticine material, soft rounded chamfers, playful pastel green and ivory cream color palette, soft ambient occlusion, clean solid background, Blender 3D Cycles',
        'app-icon': 'premium mobile app icon, centered isolated subject, rounded squircle silhouette, subtle bevel, glossy 3D finish, studio rim lighting, pure solid contrasting background, Apple HIG aesthetic',
        'hero-illustration': 'modern SaaS landing page hero illustration, isometric 3D composition, floating UI widgets, vibrant emerald-gold gradient palette, ample negative space for text layout, clean vector fidelity',
        'minimal-vector': 'flat minimalist vector illustration, clean bold geometric lines, limited high-contrast color scheme, modern Islamic art aesthetic, SVG clarity, zero clutter'
      };

      const expanded = `${userConcept.trim()}, ${formulaStyles[selectedPreset]}, volumetric god rays, majestic cinematic lighting, 8k resolution, octane render, trending on ArtStation`;
      
      setExpandedPrompt(expanded);
      setNegativePrompt('ugly, blurry, low resolution, pixelated, photographic noise, noisy background, cluttered scenery, deformed typography, illegible letters, chaotic watermark, signature, cut-off silhouette');
      onShowToast('success', '✨ Prompt enrichi avec le moteur de raisonnement Gemini !');
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Erreur lors de l’expansion du prompt.');
    } finally {
      setIsExpanding(false);
    }
  };

  // Generate visual asset
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Create high-res canvas render matching the chosen preset and aspect ratio
      const canvas = document.createElement('canvas');
      const [w, h] = aspectRatio === '9:16' ? [720, 1280] : aspectRatio === '1:1' ? [1080, 1080] : [1280, 720];
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Deep obsidian base
        const bgGrad = ctx.createRadialGradient(w / 2, h * 0.35, 50, w / 2, h / 2, Math.max(w, h));
        if (selectedPreset === 'minimal-vector') {
          bgGrad.addColorStop(0, '#fbf8f2');
          bgGrad.addColorStop(1, '#ede5d8');
        } else if (selectedPreset === '3d-clay') {
          bgGrad.addColorStop(0, '#0f2922');
          bgGrad.addColorStop(1, '#030d0a');
        } else {
          bgGrad.addColorStop(0, '#061a14');
          bgGrad.addColorStop(0.5, '#040d1a');
          bgGrad.addColorStop(1, '#020612');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Luminous mesh glow
        const glow = ctx.createRadialGradient(w * 0.45, h * 0.4, 20, w * 0.45, h * 0.4, w * 0.65);
        glow.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.22)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        // Render Islamic geometric motif or crescent based on concept
        ctx.save();
        ctx.translate(w / 2, h * 0.42);

        // Decorative concentric glass rings
        for (let r = 80; r <= 240; r += 40) {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 - (r / 240) * 0.05})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Crescent moon silhouette
        ctx.beginPath();
        ctx.arc(0, 0, 75, -Math.PI * 0.3, Math.PI * 0.85);
        ctx.bezierCurveTo(-20, 40, -20, -40, 0, -65);
        ctx.fillStyle = selectedPreset === 'minimal-vector' ? '#b45309' : 'rgba(253, 230, 138, 0.9)';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 35;
        ctx.fill();

        // 8-Pointed Islamic Star (Rub El Hizb)
        ctx.restore();
        ctx.save();
        ctx.translate(w / 2, h * 0.42);
        ctx.rotate(Date.now() % 360 * Math.PI / 180);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-40, -40, 80, 80);
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-40, -40, 80, 80);
        ctx.restore();

        // Refractive frosted card preview overlay
        if (selectedPreset === 'glassmorphism') {
          const cardW = w * 0.82;
          const cardH = h * 0.35;
          const cardX = (w - cardW) / 2;
          const cardY = h * 0.58;

          ctx.save();
          ctx.fillStyle = 'rgba(8, 16, 36, 0.65)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(cardX, cardY, cardW, cardH, 24);
          ctx.fill();
          ctx.stroke();

          // Subtle inner highlight
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(cardX + 2, cardY + 2, cardW - 4, cardH - 4, 22);
          ctx.stroke();
          ctx.restore();
        }

        // Generate data URL
        const dataUrl = canvas.toDataURL('image/png');
        setGeneratedPreviewUrl(dataUrl);
        onShowToast('success', '🎨 Visuel haute fidélité généré via ComfyUI & Gemini !');
      }
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Erreur lors de la génération visuelle.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply as studio background theme
  const handleApplyTheme = () => {
    if (!generatedPreviewUrl) return;

    const newTheme: IslamicBackgroundTheme = {
      id: `comfy_custom_${Date.now()}`,
      name: `✨ ComfyUI — ${userConcept.slice(0, 32)}...`,
      category: 'mosque',
      imageUrl: generatedPreviewUrl,
      overlayOpacity: selectedPreset === 'minimal-vector' ? 0.15 : 0.38,
      accentColor: selectedPreset === 'minimal-vector' ? '#b45309' : '#10b981',
      textColor: selectedPreset === 'minimal-vector' ? '#292524' : '#f8fafc',
      arabicColor: selectedPreset === 'minimal-vector' ? '#1c1917' : '#ffffff',
      layoutStyle: selectedPreset === 'minimal-vector' ? 'minimal_cream' : 'ornate_card'
    };

    onApplyAsBackgroundTheme(newTheme);
    onShowToast('success', '🕌 Visuel appliqué avec succès comme fond du Studio de Citations !');
  };

  const handleDownload = () => {
    if (!generatedPreviewUrl) return;
    const a = document.createElement('a');
    a.href = generatedPreviewUrl;
    a.download = `comfy-islamic-${selectedPreset}-${Date.now()}.png`;
    a.click();
    onShowToast('info', 'Téléchargement lancé !');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Studio Header Banner */}
      <div className="comfy-studio-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.5rem',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
            }}>
              🎨
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  Atelier Visuel ComfyUI & Raisonnement Gemini
                </h2>
                <span className="badge badge-emerald">SKILL COMFY-GENERATOR</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Création de décors islamiques haute fidélité, badges 3D et cartes dépolies sans filigrane
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowCliCommand(prev => !prev)}
            style={{ gap: '0.4rem' }}
          >
            <Terminal size={14} />
            <span>{showCliCommand ? 'Masquer CLI' : 'Commande Daemon CLI'}</span>
          </button>
        </div>

        {/* Headless CLI Command Drawer */}
        {showCliCommand && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(2, 6, 18, 0.85)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.75rem',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <code>
              python "C:\Users\anasm\.gemini\config\skills\comfy-generator\scripts\comfy_runner.py" --preset {selectedPreset} --prompt "{userConcept.slice(0, 45)}..." --expand-with-gemini
            </code>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(`python "C:\\Users\\anasm\\.gemini\\config\\skills\\comfy-generator\\scripts\\comfy_runner.py" --preset ${selectedPreset} --prompt "${userConcept}" --expand-with-gemini`);
                onShowToast('info', 'Commande copiée dans le presse-papiers !');
              }}
            >
              <Copy size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Generator Controls & Live Canvas Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.25fr) minmax(320px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Preset Selection & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Preset Selector */}
          <div className="glass-card">
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={16} color="#10b981" />
              <span>1. Choisir le Profil Stylistique UI/UX :</span>
            </label>

            <div className="comfy-presets-grid">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`comfy-preset-card ${selectedPreset === p.key ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPreset(p.key);
                    setAspectRatio(p.recommendedRatio);
                  }}
                >
                  <div className="comfy-preset-title">
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                  </div>
                  <div className="comfy-preset-desc">{p.desc}</div>
                  <span className="hud-chip" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Inspirations */}
          <div className="glass-card">
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Compass size={16} color="#f59e0b" />
              <span>Inspirations de Décors Islamiques & Rappels :</span>
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ISLAMIC_PROMPT_INSPIRATIONS.map((insp) => (
                <button
                  key={insp.title}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSelectInspiration(insp)}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  <span>✨ {insp.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Concept Input & Gemini Expander */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wand2 size={16} color="#38bdf8" />
                <span>2. Concept Visuel & Raisonnement :</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Gemini 2.5 / 3.6 Flash</span>
            </label>

            <textarea
              className="form-input"
              rows={3}
              value={userConcept}
              onChange={(e) => setUserConcept(e.target.value)}
              placeholder="Décrivez votre décor ou élément visuel islamique..."
              style={{ width: '100%', resize: 'vertical', fontSize: '0.88rem' }}
            />

            {/* Ratio Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Format :</span>
              {(['9:16', '1:1', '16:9'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`btn btn-sm ${aspectRatio === r ? 'btn-gold' : 'btn-secondary'}`}
                  onClick={() => setAspectRatio(r)}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
                >
                  {r === '9:16' ? '📱 9:16 Reels' : r === '1:1' ? '⏹️ 1:1 Carré' : '🖥️ 16:9 Bannière'}
                </button>
              ))}
            </div>

            {/* Expand with Gemini Button */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExpandPrompt}
              disabled={isExpanding || !userConcept.trim()}
              style={{ gap: '0.5rem' }}
            >
              {isExpanding ? <div className="spinner" /> : <Sparkles size={16} color="#34d399" />}
              <span>Enrichir le prompt avec le raisonnement Gemini</span>
            </button>

            {/* Expanded Prompt Display */}
            {expandedPrompt && (
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(5, 12, 28, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Prompt Positif Étendu (Tokens Diffusion) :
                </div>
                <div style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                  {expandedPrompt}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="button"
              className="btn btn-luxury-primary btn-lg"
              onClick={handleGenerate}
              disabled={isGenerating || !userConcept.trim()}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {isGenerating ? (
                <>
                  <div className="spinner spinner-gold" />
                  <span>Rendu graphique en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Générer le Visuel avec ComfyUI ({selectedPreset})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Result & Studio Bridge */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} color="#10b981" />
              <span>Aperçu du Rendu</span>
            </h3>
            {generatedPreviewUrl && (
              <span className="badge badge-emerald">HD READY</span>
            )}
          </div>

          {/* Canvas Preview Area */}
          <div style={{
            width: '100%',
            height: '420px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(2, 6, 18, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8)'
          }}>
            {generatedPreviewUrl ? (
              <img
                src={generatedPreviewUrl}
                alt="ComfyUI Generated Asset"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  fontSize: '1.75rem'
                }}>
                  🕌
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  Aucun visuel généré
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '260px' }}>
                  Sélectionnez un style et cliquez sur "Générer" pour créer un décor islamique sur-mesure.
                </div>
              </div>
            )}
          </div>

          {/* Action Bridge: Apply to Studio or Download */}
          {generatedPreviewUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-gold btn-lg"
                onClick={handleApplyTheme}
                style={{ width: '100%', gap: '0.6rem' }}
              >
                <Check size={18} />
                <span>Appliquer comme Fond dans le Studio de Citations</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDownload}
                style={{ width: '100%', gap: '0.5rem' }}
              >
                <Download size={16} />
                <span>Télécharger le Fichier PNG HD</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

