import React, { useState, useEffect } from 'react';
import { AutoPilotService, AUTOPILOT_THEMES } from '../../services/autoPilotService';
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

  // Live countdown timer
  useEffect(() => {
    const updateCountdown = () => {
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
              Génère et publie automatiquement des Reels vidéo inédits sur <strong>Instagram (`@kaelarislamic`)</strong> et <strong>TikTok (`@mdou.g`)</strong> à intervalles réguliers en alternant harmonieusement entre le Coran, les Hadiths Sahih, les Invocations, Tahajjud et la Sagesse.
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

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Card 1: Countdown */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              <Clock size={15} color="#f59e0b" />
              <span>PROCHAINE PUBLICATION AUTOMATIQUE</span>
            </div>
            <div style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: config.isEnabled ? '#fef08a' : 'var(--text-tertiary)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              margin: '0.2rem 0'
            }}>
              {timeRemainingStr}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '0.75rem' }}>
            {config.lastRunAt ? `Dernière exécution : ${new Date(config.lastRunAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 'Aucune publication automatique récente'}
          </div>
        </div>

        {/* Card 2: Frequency Selector */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
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
                    padding: '0.45rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: config.intervalHours === opt.hours ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    background: config.intervalHours === opt.hours ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: config.intervalHours === opt.hours ? '#34d399' : 'var(--text-secondary)',
                    fontWeight: config.intervalHours === opt.hours ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.75rem' }}>
            ✓ {config.intervalHours} Heures = {Math.round(24 / config.intervalHours)} publication{Math.round(24 / config.intervalHours) > 1 ? 's' : ''} diversifiée{Math.round(24 / config.intervalHours) > 1 ? 's' : ''} par 24h
          </div>
        </div>

        {/* Card 3: Next Topic in Rotation */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              <Compass size={15} color="#60a5fa" />
              <span>PROCHAIN THÈME AU PROGRAMME</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{currentTheme.icon}</span>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#93c5fd' }}>
                  {currentTheme.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
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
            color: 'var(--text-tertiary)', 
            marginTop: '0.75rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <span>Suivant après : <strong>{upcomingTheme.icon} {upcomingTheme.badge}</strong></span>
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
      <div style={{
        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(217, 119, 6, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem', color: '#fef08a', fontWeight: 700 }}>
            Déclencher un Cycle Immédiat sur "{currentTheme.title}"
          </h4>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Génère instantanément un Reel inédit sur le thème actuel et le publie sur Instagram et TikTok sans attendre le prochain créneau de 6h.
          </p>
        </div>

        <button
          onClick={handleTriggerNow}
          disabled={isRunningManual}
          style={{
            padding: '0.8rem 1.5rem',
            background: isRunningManual ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#020617',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: isRunningManual ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 20px -5px rgba(245, 158, 11, 0.4)'
          }}
        >
          {isRunningManual ? (
            <>
              <RotateCw size={16} className="spin" />
              <span>{currentStep || 'Exécution du cycle...'}</span>
            </>
          ) : (
            <>
              <Zap size={16} />
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
