import React, { useState } from 'react';
import type { CampaignTemplate, ScheduledPost } from '../../types/content';
import { CAMPAIGN_TEMPLATES } from '../../data/mockData';
import { GeminiService } from '../../services/geminiService';
import { ImagenService } from '../../services/imagenService';
import { StorageService } from '../../services/storageService';
import { Zap, Sparkles, RefreshCw, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampaignGeneratorProps {
  onCampaignCreated: (posts: ScheduledPost[]) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
  onNavigateToCalendar: () => void;
}

export const CampaignGenerator: React.FC<CampaignGeneratorProps> = ({
  onCampaignCreated,
  onShowToast,
  onNavigateToCalendar
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate>(CAMPAIGN_TEMPLATES[0]);
  const [campaignTopic, setCampaignTopic] = useState('Automatisation et productivité avec l’intelligence artificielle en 2026');
  const [targetAudience, setTargetAudience] = useState('Créateurs de contenu, agences, indépendants');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<ScheduledPost[]>([]);

  const handleGenerateCampaign = async () => {
    if (!campaignTopic.trim()) return;
    setIsGenerating(true);
    setGeneratedPosts([]);

    try {
      const daysCount = selectedTemplate.days;
      const newPosts: ScheduledPost[] = [];
      const now = new Date();

      // Strategic day-by-day angles
      const angles = [
        { dayOffset: 1, angle: 'Hook & Prise de conscience du problème', promptSuffix: 'Mettre en lumière le problème majeur et pourquoi les anciennes méthodes échouent.' },
        { dayOffset: 2, angle: 'Valeur éducative & Blueprint concret', promptSuffix: 'Donner 3 étapes précises et actionnables pour résoudre le problème.' },
        { dayOffset: 3, angle: 'Storytelling & Étude de cas inspirante', promptSuffix: 'Raconter une transformation ou un cas client réel avec des métriques chiffrées.' },
        { dayOffset: 4, angle: 'Contre-intuitif & Débat sectoriel', promptSuffix: 'Défendre une opinion tranchée qui va à contre-courant des idées reçues.' },
        { dayOffset: 5, angle: 'Tutoriel rapide / Démo en coulisses', promptSuffix: 'Montrer les coulisses ou un tutoriel court pas à pas.' },
        { dayOffset: 6, angle: 'FAQ & Réponses aux objections', promptSuffix: 'Répondre aux 3 freins les plus fréquents de l’audience.' },
        { dayOffset: 7, angle: 'Récapitulatif & Appel à l’action fort', promptSuffix: 'Synthèse de la semaine avec invitation claire à passer à l’action.' }
      ];

      for (let i = 0; i < Math.min(daysCount, angles.length); i++) {
        const item = angles[i];
        const scheduledDate = new Date(now.getTime() + item.dayOffset * 24 * 60 * 60 * 1000);
        scheduledDate.setHours(18, 30, 0, 0);

        const subPrompt = `${campaignTopic} - Angle du jour : ${item.angle}. ${item.promptSuffix} Cible : ${targetAudience}`;

        const socialPack = await GeminiService.generateSocialPack({
          prompt: subPrompt,
          tone: selectedTemplate.tone as any,
          targetPlatforms: ['tiktok', 'instagram', 'x', 'linkedin', 'facebook']
        });

        // Generate matching visual
        const media = await ImagenService.generateImage({
          prompt: socialPack.suggestedImagePrompt,
          aspectRatio: '1:1',
          style: 'cinematic'
        });

        const post: ScheduledPost = {
          id: `camp-post-${Date.now()}-${i}`,
          title: `Jour ${item.dayOffset} : ${item.angle}`,
          originalIdea: subPrompt,
          platforms: ['tiktok', 'instagram', 'x', 'linkedin', 'facebook'],
          platformContent: {
            tiktok: {
              text: socialPack.platforms.tiktok.caption,
              hook: socialPack.platforms.tiktok.hook,
              videoScript: socialPack.platforms.tiktok.videoScript,
              hashtags: socialPack.platforms.tiktok.hashtags,
              audioTrackSuggestion: socialPack.platforms.tiktok.audioTrackSuggestion
            },
            instagram: {
              text: socialPack.platforms.instagram.caption,
              hook: socialPack.platforms.instagram.hook,
              callToAction: socialPack.platforms.instagram.callToAction,
              hashtags: socialPack.platforms.instagram.hashtags
            },
            facebook: {
              text: socialPack.platforms.facebook.text,
              hook: socialPack.platforms.facebook.hook,
              callToAction: socialPack.platforms.facebook.callToAction,
              hashtags: socialPack.platforms.facebook.hashtags
            },
            linkedin: {
              text: socialPack.platforms.linkedin.text,
              hook: socialPack.platforms.linkedin.headline,
              callToAction: socialPack.platforms.linkedin.callToAction,
              hashtags: socialPack.platforms.linkedin.hashtags
            },
            x: {
              text: socialPack.platforms.x.tweet,
              hook: socialPack.platforms.x.threadParts?.[0],
              hashtags: socialPack.platforms.x.hashtags
            }
          },
          media,
          scheduledTime: scheduledDate.toISOString(),
          status: 'scheduled',
          campaignTag: selectedTemplate.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        StorageService.savePost(post);
        newPosts.push(post);
      }

      setGeneratedPosts(newPosts);
      onCampaignCreated(newPosts);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      onShowToast('success', `Campagne de ${newPosts.length} jours créée et programmée dans le calendrier !`);
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Erreur lors de la génération de la campagne.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="glass-card glass-card-glow" style={{
        background: 'var(--grad-glow-banner)',
        border: '1px solid var(--border-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--grad-gemini)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px var(--accent-primary-glow)'
          }}>
            <Zap size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Générateur de Campagne IA Automatisée</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Planifiez une semaine complète de contenu stratégique sur 5 réseaux en un seul clic
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Setup Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        {/* Templates Selection */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={16} color="var(--accent-primary)" />
            1. Choisissez un Modèle Stratégique
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CAMPAIGN_TEMPLATES.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                style={{
                  background: selectedTemplate.id === template.id ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  border: selectedTemplate.id === template.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                className="glass-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {template.name}
                  </span>
                  <span className="badge badge-scheduled">{template.days} Jours</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Parameters */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="var(--accent-cyan)" />
            2. Thématique & Cible
          </h3>

          <div className="form-group">
            <label className="form-label">Sujet central de la campagne</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={campaignTopic}
              onChange={(e) => setCampaignTopic(e.target.value)}
              placeholder="Ex: Lancement de notre nouveau service, Astuces de croissance TikTok, Promotion Black Friday..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Audience cible & Personas</label>
            <input
              type="text"
              className="form-input"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ex: Freelances, Créateurs vidéo, Décideurs B2B..."
            />
          </div>

          <button
            className="btn btn-gemini btn-lg"
            onClick={handleGenerateCampaign}
            disabled={isGenerating || !campaignTopic.trim()}
            style={{ marginTop: 'auto' }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Génération des 7 publications IA en cours...</span>
              </>
            ) : (
              <>
                <Zap size={18} />
                <span>Générer et Programmer la Campagne (7 Jours)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Campaign Results Summary */}
      {generatedPosts.length > 0 && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {generatedPosts.length} Publications Planifiées dans votre Calendrier
              </h3>
            </div>

            <button 
              className="btn btn-primary btn-sm"
              onClick={onNavigateToCalendar}
              style={{ gap: '0.4rem' }}
            >
              <span>Voir dans le Calendrier</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {generatedPosts.map(p => (
              <div
                key={p.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {p.title}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(p.scheduledTime).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                  </span>
                </div>

                {p.media?.url && (
                  <img 
                    src={p.media.url} 
                    alt="Preview" 
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} 
                  />
                )}

                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.platformContent.tiktok.hook || p.platformContent.instagram.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
