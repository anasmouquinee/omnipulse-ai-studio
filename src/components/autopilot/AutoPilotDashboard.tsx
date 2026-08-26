import React, { useState, useEffect } from 'react';
import { AutoPilotService } from '../../services/autoPilotService';
import type { AutoPilotConfig, AutoPilotLog } from '../../services/autoPilotService';
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
  Compass
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

  const nextTheme = AutoPilotService.getNextRecommendedTheme();

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
                fontWeight: 700,
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                background: config.isEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: config.isEnabled ? '#34d399' : '#f87171',
                border: `1px solid ${config.isEnabled ? '#10b981' : '#ef4444'}`
              }}>
                {config.isEnabled ? '● ACTIF (En ligne)' : '○ EN PAUSE'}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, maxWidth: '650px' }}>
              Génère et publie automatiquement des Reels vidéo inédits sur <strong>Instagram (`@kaelarislamic`)</strong> et <strong>TikTok (`@mdou.g`)</strong> à intervalles réguliers en alternant harmonieusement entre le Coran, les Hadiths Sahih, les Invocations et Tahajjud.
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggleAutoPilot}
            style={{
              padding: '0.85rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${config.isEnabled ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
              background: config.isEnabled ? 'rgba(239, 68, 68, 0.15)' : 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: config.isEnabled ? 'none' : '0 10px 20px -5px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.15s'
            }}
          >
            <Power size={18} />
            <span>{config.isEnabled ? 'Mettre en pause' : 'Activer l’Auto-Pilot'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Countdown, Interval, Next Theme */}
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
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: config.intervalHours === opt.hours ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                    background: config.intervalHours === opt.hours ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.2)',
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
            ✓ 6 Heures = 4 publications diversifiées par 24h
          </div>
        </div>

        {/* Card 3: Next Topic in Rotation */}
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
              <Compass size={15} color="#60a5fa" />
              <span>PROCHAIN THÈME AU PROGRAMME</span>
            </div>

            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#60a5fa', margin: '0.2rem 0' }}>
              {nextTheme.title}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '0.75rem' }}>
            Rotation thématique continue et dédupliquée
          </div>
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
            Déclencher un Cycle Immédiat
          </h4>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Génère instantanément un Reel inédit sur le thème actuel et le publie sur Instagram et TikTok sans attendre le prochain créneau.
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
              <span>Lancer Auto-Pilot Maintenant</span>
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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
          📋 Historique des Exécutions Auto-Pilot
        </h3>

        {config.logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>
            Aucun cycle exécuté pour le moment. Cliquez sur « Lancer Auto-Pilot Maintenant » pour tester le premier cycle !
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {config.logs.map(log => (
              <div
                key={log.id}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {log.status === 'success' ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : log.status === 'running' ? (
                    <RotateCw size={18} color="#f59e0b" className="spin" />
                  ) : (
                    <AlertCircle size={18} color="#ef4444" />
                  )}

                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fef08a' }}>
                      {log.themeTitle}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
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
                        fontSize: '0.75rem',
                        color: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        textDecoration: 'none'
                      }}
                    >
                      <Film size={13} />
                      <span>Voir la Vidéo</span>
                    </a>
                  )}

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
