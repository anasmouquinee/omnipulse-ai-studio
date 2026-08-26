import React, { useState } from 'react';
import type { ScheduledPost } from '../../types/content';
import { IslamicContentService } from '../../services/islamicContentService';
import { VERIFIED_ISLAMIC_POSTS } from '../../data/verifiedIslamicData';
import { StorageService } from '../../services/storageService';
import { Zap, Sparkles, RefreshCw, Layers, CheckCircle2, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampaignGeneratorProps {
  onCampaignCreated: (posts: ScheduledPost[]) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
  onNavigateToCalendar: () => void;
}

const ISLAMIC_7DAY_THEMES = [
  { day: 1, name: 'Lundi : Verset du Coran sur la Délivrance (Al-Yusr)', category: 'quran_verse' as const, topic: 'La promesse du soulagement après l’épreuve' },
  { day: 2, name: 'Mardi : Hadith Sahih sur la Patience (Sabr)', category: 'sahih_hadith' as const, topic: 'L’émerveillement face au croyant et le bienfait de la patience' },
  { day: 3, name: 'Mercredi : Invocation contre l’angoisse (Hisn al-Muslim)', category: 'authentic_dua' as const, topic: 'Invocation pour apaiser le cœur et dissiper les soucis' },
  { day: 4, name: 'Jeudi : Motivation pour la Prière de Nuit (Tahajjud)', category: 'tahajjud_motivation' as const, topic: 'Le secret des prières exaucées au dernier tiers de la nuit' },
  { day: 5, name: 'Vendredi : Spécial Jumu’ah & Sourate Al-Kahf', category: 'jumua_special' as const, topic: 'La lumière entre les deux vendredis et les prières sur le Prophète ﷺ' },
  { day: 6, name: 'Samedi : Rappel sur la Confiance en Allah (Tawakkul)', category: 'islamic_reminder' as const, topic: 'Placer sa confiance totale en Allah et lâcher prise' },
  { day: 7, name: 'Dimanche : Le Pouvoir du Repentir & Istighfar', category: 'authentic_dua' as const, topic: 'Les bienfaits de la demande de pardon quotidienne' },
];

export const CampaignGenerator: React.FC<CampaignGeneratorProps> = ({
  onCampaignCreated,
  onShowToast,
  onNavigateToCalendar
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'fr' | 'en' | 'ar'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<ScheduledPost[]>([]);

  const handleGenerateCampaign = async () => {
    setIsGenerating(true);
    setGeneratedPosts([]);

    try {
      const newPosts: ScheduledPost[] = [];
      const now = new Date();

      for (let i = 0; i < ISLAMIC_7DAY_THEMES.length; i++) {
        const theme = ISLAMIC_7DAY_THEMES[i];
        const scheduledDate = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
        // Set posting hour at 18:45 (ideal peak time)
        scheduledDate.setHours(18, 45, 0, 0);

        // Fetch or generate authentic verified post item
        const islamicItem = await IslamicContentService.generateIslamicPost(
          theme.category,
          theme.topic,
          selectedLanguage
        );

        // Render aesthetic quote card for this day
        const cardUrl = await IslamicContentService.renderQuoteCardCanvas(
          islamicItem,
          '9:16',
          selectedLanguage
        );

        const scheduledPost = IslamicContentService.convertToScheduledPost(
          islamicItem,
          selectedLanguage,
          cardUrl
        );

        scheduledPost.scheduledTime = scheduledDate.toISOString();
        scheduledPost.status = 'scheduled';

        StorageService.savePost(scheduledPost);
        newPosts.push(scheduledPost);
      }

      setGeneratedPosts(newPosts);
      onCampaignCreated(newPosts);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#059669', '#d97706']
      });

      onShowToast('success', 'Programme islamique de 7 jours généré et planifié avec succès !');
    } catch (e: any) {
      onShowToast('error', 'Erreur lors de la génération du programme.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.25) 0%, rgba(13, 21, 39, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            🕌
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Programme de Rappels Spirituels 7 Jours
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Générez 7 jours complets de versets, hadiths Sahih et invocations avec cartes HD et audio
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#10b981' }}>
          <ShieldCheck size={18} />
          <span>100% Vérifié & Sourcé (Bukhari / Muslim)</span>
        </div>
      </div>

      {/* Campaign Controls */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Language Selection */}
        <div className="form-group">
          <label className="form-label">Langue de la routine 7 jours</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
            {[
              { id: 'all', label: 'Trilingue (AR + FR + EN) 🌍' },
              { id: 'fr', label: 'Français 🇫🇷' },
              { id: 'en', label: 'English 🇬🇧' },
              { id: 'ar', label: 'العربية 🇸🇦' },
            ].map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelectedLanguage(l.id as any)}
                style={{
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-xs)',
                  background: selectedLanguage === l.id ? 'var(--grad-primary)' : 'var(--bg-input)',
                  border: `1px solid ${selectedLanguage === l.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  color: selectedLanguage === l.id ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Day-by-Day Schedule Preview */}
        <div>
          <label className="form-label" style={{ marginBottom: '0.75rem' }}>
            Programme Prévu pour les 7 Prochains Jours
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ISLAMIC_7DAY_THEMES.map((theme, idx) => (
              <div
                key={theme.day}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{theme.name}</span>
                </div>

                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                  18:45 (Pic TikTok/Insta)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="btn btn-primary"
          onClick={handleGenerateCampaign}
          disabled={isGenerating}
          style={{
            padding: '0.9rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)',
            gap: '0.5rem',
            justifyContent: 'center'
          }}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Génération des 7 cartes de rappel & planification en cours...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Générer & Planifier la Semaine (7 Posts) en 1 Clic</span>
            </>
          )}
        </button>

      </div>

      {/* Generated Posts Result */}
      {generatedPosts.length > 0 && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                7 Rappels Islamiques Prêts & Programmés
              </h3>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onNavigateToCalendar}
              style={{ gap: '0.4rem', color: '#10b981' }}
            >
              <span>Voir dans le Calendrier</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {generatedPosts.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              >
                {p.media?.url && (
                  <img
                    src={p.media.url}
                    alt="Quote Card"
                    style={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: 2 }}>
                    📅 {new Date(p.scheduledTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })} à 18:45
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Cibles : TikTok (@mdou.g) & Instagram (@kaelarislamic)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
