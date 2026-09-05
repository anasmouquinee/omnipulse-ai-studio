import React, { useState, useEffect } from 'react';
import { AutoPilotService, AUTOPILOT_THEMES } from '../../services/autoPilotService';
import { getBufferRateLimitStatus } from '../../services/socialPublisher';
import type { AutoPilotConfig, AutoPilotLog, AutoPilotTheme } from '../../services/autoPilotService';
import { 
  Sparkles, 
  Play, 
  Power, 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Film, 
  ExternalLink,
  Zap,
  Calendar,
  Compass,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface AutoPilotDashboardProps {
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const AutoPilotDashboard: React.FC<AutoPilotDashboardProps> = ({ onShowToast }) => {
  const [config, setConfig] = useState<AutoPilotConfig>(() => AutoPilotService.getConfig());
  const [isRunningManual, setIsRunningManual] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [timeRemainingStr, setTimeRemainingStr] = useState('');

  // Subscribe to config changes
  useEffect(() => {
    const unsub = AutoPilotService.subscribe((updated) => setConfig(updated));
    return unsub;
  }, []);

  const [bufferRateLimit, setBufferRateLimit] = useState(() => getBufferRateLimitStatus());

  // Live countdown timer & Buffer rate-limit monitor
  useEffect(() => {
    const updateCountdown = () => {
      setBufferRateLimit(getBufferRateLimitStatus());

      if (!config.isEnabled || !config.nextRunAt) {
        setTimeRemainingStr('En pause');
        return;
      }

      const diff = new Date(config.nextRunAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeRemainingStr('Imminent (Cycle en cours)');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemainingStr(
        `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.nextRunAt, config.isEnabled]);

  const handleToggleAutoPilot = () => {
    const nextState = !config.isEnabled;
    const updated: AutoPilotConfig = {
      ...config,
      isEnabled: nextState,
      nextRunAt: nextState ? new Date(Date.now() + config.intervalHours * 3600 * 1000).toISOString() : null
    };
    AutoPilotService.saveConfig(updated);
    setConfig(updated);
    onShowToast(nextState ? 'success' : 'info', nextState ? '🤖 Auto-Pilot 6h activé !' : '⏸️ Auto-Pilot mis en pause.');
  };

  const handleIntervalChange = (hours: number) => {
    const updated: AutoPilotConfig = {
      ...config,
      intervalHours: hours,
      nextRunAt: config.isEnabled ? new Date(Date.now() + hours * 3600 * 1000).toISOString() : null
    };
    AutoPilotService.saveConfig(updated);
    setConfig(updated);
    onShowToast('info', `Fréquence mise à jour : 1 publication toutes les ${hours} heures.`);
  };

  const handleSelectTheme = (index: number) => {
    AutoPilotService.setThemeIndex(index);
    setConfig(AutoPilotService.getConfig());
    const theme = AUTOPILOT_THEMES[index];
    onShowToast('success', `🎯 Prochain thème sélectionné : ${theme.title}`);
  };

  const handleTriggerNow = async () => {
    setIsRunningManual(true);
    setCurrentStep('Démarrage du cycle...');
    onShowToast('info', '🚀 Lancement du cycle de publication automatique...');

    try {
      const res = await AutoPilotService.executeCycle((step) => setCurrentStep(step));
      if (res.success) {
        onShowToast('success', '✨ Publication Auto-Pilot terminée avec succès sur Instagram & TikTok !');
      } else {
        onShowToast('error', res.message);
      }
    } catch (err: any) {
      onShowToast('error', `Échec: ${err.message}`);
    } finally {
      setIsRunningManual(false);
      setCurrentStep('');
      setConfig(AutoPilotService.getConfig());
    }
  };

  const currentTheme = AutoPilotService.getNextRecommendedTheme();
  const currentIdx = (config.currentThemeIndex || 0) % AUTOPILOT_THEMES.length;
  const nextIdx = (currentIdx + 1) % AUTOPILOT_THEMES.length;
  const upcomingTheme = AUTOPILOT_THEMES[nextIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: config.isEnabled ? 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🤖</span>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #a7f3d0 0%, #10b981 50%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Auto-Pilot Studio Islamique (6 Heures)
              </h1>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                background: config.isEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: config.isEnabled ? '#34d399' : '#f87171',
                border: `1px solid ${config.isEnabled ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
              }}>
                {config.isEnabled ? '● ACTIF (En ligne)' : '○ EN PAUSE'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '700px', margin: 0, lineHeight: 1.5 }}>
              Génère et publie automatiquement des Reels vidéo inédits sur <strong>Instagram (`@kae.islamic`)</strong>, <strong>TikTok (`@kaelar.islamic`)</strong> et <strong>YouTube Shorts</strong> à intervalles réguliers en alternant harmonieusement entre le Coran, les Hadiths Sahih, les Invocations, Tahajjud et la Sagesse.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={handleToggleAutoPilot}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.3rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: config.isEnabled ? 'rgba(239, 68, 68, 0.15)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: config.isEnabled ? '#fca5a5' : '#ffffff',
                border: config.isEnabled ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                boxShadow: config.isEnabled ? 'none' : '0 10px 20px -5px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Power size={16} />
              <span>{config.isEnabled ? 'Mettre en pause' : 'Activer l’Auto-Pilot'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Buffer Rate Limit Guard Banner */}
      {bufferRateLimit.isLimited && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(180, 83, 9, 0.1) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 25px -5px rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '1.85rem' }}>⏳</span>
            <div>
              <div style={{ fontWeight: 800, color: '#fef08a', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                Quota Quotidien Buffer API en Pause de Sécurité (250 req/jour)
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.45, maxWidth: '680px' }}>
                La limite quotidienne de l'API Buffer est atteinte. L'Auto-Pilot a activé la pause de sécurité pour protéger vos comptes Instagram et TikTok contre tout blocage. La publication reprendra automatiquement dès réinitialisation.
              </div>
            </div>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '10px',
            padding: '0.6rem 1.2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#fcd34d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Réinitialisation dans</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              ~{Math.ceil(bufferRateLimit.remainingMs / (1000 * 60 * 60))} heures
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Card 1: Countdown */}
        <div className="glass-card" style={{
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, rgba(17, 28, 54, 0.8) 0%, rgba(9, 16, 32, 0.9) 100%)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45), 0 0 25px rgba(245, 158, 11, 0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
              <Clock size={15} color="#f59e0b" />
              <span>PROCHAINE PUBLICATION AUTOMATIQUE</span>
            </div>
            <div style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              background: config.isEnabled ? 'linear-gradient(135deg, #ffffff 0%, #fef08a 50%, #f59e0b 100%)' : 'none',
              WebkitBackgroundClip: config.isEnabled ? 'text' : 'unset',
              WebkitTextFillColor: config.isEnabled ? 'transparent' : '#64748b',
              color: config.isEnabled ? '#fef08a' : '#64748b',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              margin: '0.2rem 0'
            }}>
              {timeRemainingStr}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.75rem' }}>
            {config.lastRunAt ? `Dernière exécution : ${new Date(config.lastRunAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 'Aucune publication automatique récente'}
          </div>
        </div>

        {/* Card 2: Frequency Selector */}
        <div className="glass-card" style={{
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, rgba(6, 78, 59, 0.25) 0%, rgba(9, 16, 32, 0.9) 100%)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45), 0 0 25px rgba(16, 185, 129, 0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              <RotateCw size={15} color="#10b981" />
              <span>FRÉQUENCE DE PUBLICATION</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { hours: 3, label: '3 Heures' },
                { hours: 6, label: '6 Heures ⭐' },
                { hours: 12, label: '12 Heures' },
                { hours: 24, label: '24 Heures' }
              ].map(opt => (
                <button
                  key={opt.hours}
                  onClick={() => handleIntervalChange(opt.hours)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    border: config.intervalHours === opt.hours ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    background: config.intervalHours === opt.hours ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.2) 100%)' : 'rgba(255,255,255,0.03)',
                    color: config.intervalHours === opt.hours ? '#34d399' : '#94a3b8',
                    fontWeight: config.intervalHours === opt.hours ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: config.intervalHours === opt.hours ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600, marginTop: '0.75rem' }}>
            ✓ {config.intervalHours} Heures = {Math.round(24 / config.intervalHours)} publication{Math.round(24 / config.intervalHours) > 1 ? 's' : ''} diversifiée{Math.round(24 / config.intervalHours) > 1 ? 's' : ''} par 24h
          </div>
        </div>

        {/* Card 3: Next Topic in Rotation */}
        <div className="glass-card" style={{
          border: '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.15) 0%, rgba(9, 16, 32, 0.9) 100%)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45), 0 0 25px rgba(6, 182, 212, 0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
              <Compass size={15} color="#22d3ee" />
              <span>PROCHAIN THÈME AU PROGRAMME</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.3rem' }}>
              <span style={{ fontSize: '1.75rem', filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))' }}>{currentTheme.icon}</span>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#67e8f9' }}>
                  {currentTheme.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                  {currentTheme.subtitle}
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontSize: '0.75rem', 
            color: '#94a3b8', 
            marginTop: '0.75rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span>Suivant après : <strong style={{ color: '#f8fafc' }}>{upcomingTheme.icon} {upcomingTheme.badge}</strong></span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>Rotation continue 🔁</span>
          </div>
        </div>
      </div>

      {/* Interactive Theme Rotation Grid */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔁 Rotation Séquentielle des Thèmes (6 Piliers Islamiques)</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              L’Auto-Pilot enchaîne automatiquement ces thématiques une par une pour garantir une variété totale sur vos comptes. Vous pouvez aussi cliquer sur un thème pour le choisir directement comme prochain post.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '0.85rem'
        }}>
          {AUTOPILOT_THEMES.map((theme, idx) => {
            const isCurrent = idx === currentIdx;
            return (
              <div
                key={theme.id}
                onClick={() => handleSelectTheme(idx)}
                style={{
                  padding: '1rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: isCurrent ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                  background: isCurrent ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  boxShadow: isCurrent ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{theme.icon}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: isCurrent ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.06)',
                      color: isCurrent ? '#34d399' : 'var(--text-tertiary)',
                      border: isCurrent ? '1px solid rgba(16, 185, 129, 0.5)' : 'none'
                    }}>
                      Étape {idx + 1}/6 : {theme.badge}
                    </span>
                  </div>

                  {isCurrent && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px',
                      background: '#10b981',
                      color: '#020617'
                    }}>
                      🎯 ACTIF (PROCHAIN)
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isCurrent ? '#fef08a' : '#e2e8f0', marginBottom: '0.25rem' }}>
                  {theme.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                  {theme.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Immediate Trigger Action */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.45)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 30px rgba(245, 158, 11, 0.15)'
      }}>
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#fef08a', fontWeight: 800, letterSpacing: '-0.01em' }}>
            ⚡ Déclencher un Cycle Immédiat sur "{currentTheme.title}"
          </h4>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>
            Génère instantanément un Reel inédit sur le thème actuel et le publie sur Instagram et TikTok sans attendre le prochain créneau de 6h.
          </p>
        </div>

        <button
          className="btn btn-gold"
          onClick={handleTriggerNow}
          disabled={isRunningManual}
          style={{
            padding: '0.85rem 1.75rem',
            fontSize: '0.95rem',
            fontWeight: 800
          }}
        >
          {isRunningManual ? (
            <>
              <RotateCw size={18} className="animate-spin" />
              <span>{currentStep || 'Exécution du cycle...'}</span>
            </>
          ) : (
            <>
              <Zap size={18} />
              <span>Lancer Auto-Pilot Maintenant ({currentTheme.badge})</span>
            </>
          )}
        </button>
      </div>

      {/* Execution Logs Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📜</span>
            <span>Historique des Exécutions Auto-Pilot</span>
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            {config.logs?.length || 0} exécutions enregistrées
          </span>
        </div>

        {(!config.logs || config.logs.length === 0) ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--text-tertiary)',
            fontSize: '0.85rem'
          }}>
            Aucune exécution enregistrée pour le moment. Le prochain cycle débutera automatiquement dans le temps imparti.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {config.logs.map((log) => {
              const isSuccess = log.status === 'success';
              const isFailed = log.status === 'failed';

              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
                    {isFailed && <AlertCircle size={18} color="#ef4444" />}
                    {!isSuccess && !isFailed && <RotateCw size={18} color="#f59e0b" className="spin" />}

                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>
                        {log.themeTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: isSuccess ? 'var(--text-secondary)' : isFailed ? '#f87171' : '#f59e0b' }}>
                        {log.message}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {log.videoUrl && (
                      <a
                        href={log.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          color: '#f59e0b',
                          textDecoration: 'none',
                          fontWeight: 600
                        }}
                      >
                        <Film size={13} />
                        <span>Voir la Vidéo</span>
                      </a>
                    )}

                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      {new Date(log.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
