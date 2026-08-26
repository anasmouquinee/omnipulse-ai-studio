import React, { useState } from 'react';
import type { SocialAccount, SocialPlatform, SocialBridgeConfig, PublishLog } from '../../types/content';
import { StorageService } from '../../services/storageService';
import { SocialPublisher } from '../../services/socialPublisher';
import { Modal } from '../common/Modal';
import { 
  Share2, 
  RefreshCw, 
  ShieldCheck, 
  Webhook, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Send, 
  Settings2, 
  Activity,
  Zap,
  Globe
} from 'lucide-react';

interface AccountsViewProps {
  accounts: SocialAccount[];
  onAccountsUpdated: (accounts: SocialAccount[]) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

const PLATFORM_DETAILS: Record<SocialPlatform, { name: string; color: string; icon: string; desc: string }> = {
  tiktok: { name: 'TikTok', color: 'var(--color-tiktok)', icon: '🎵', desc: 'Publication automatique de vidéos verticales 9:16, scripts et sons tendance.' },
  instagram: { name: 'Instagram', color: 'var(--color-instagram)', icon: '📸', desc: 'Publication de posts dans le feed, carrousels, Reels et Stories.' },
  x: { name: 'X (Twitter)', color: 'var(--color-x)', icon: '🐦', desc: 'Publication directe de tweets et threads découpés automatiquement.' },
  linkedin: { name: 'LinkedIn', color: 'var(--color-linkedin)', icon: '💼', desc: 'Diffusion B2B, formats aérés et carrousels PDF.' },
  facebook: { name: 'Facebook', color: 'var(--color-facebook)', icon: '👥', desc: 'Pages professionnelles, groupes communautaires et liens.' },
};

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  onAccountsUpdated,
  onShowToast
}) => {
  const [bridgeConfig, setBridgeConfig] = useState<SocialBridgeConfig>(StorageService.getBridgeConfig());
  const [logs, setLogs] = useState<PublishLog[]>(StorageService.getPublishLogs());
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Edit Account Modal
  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [customUsername, setCustomUsername] = useState('');

  const handleSaveBridge = () => {
    StorageService.saveBridgeConfig(bridgeConfig);
    onShowToast('success', 'Passerelle Webhook Cloud enregistrée !');
  };

  const handleTestBridge = async () => {
    if (!bridgeConfig.universalWebhookUrl) {
      onShowToast('error', 'Veuillez saisir une URL de webhook pour lancer le test.');
      return;
    }

    setIsTestingWebhook(true);
    setTestResult(null);

    const res = await SocialPublisher.testWebhookPing(bridgeConfig.universalWebhookUrl, 'tiktok');
    setIsTestingWebhook(false);
    setTestResult(res);

    if (res.success) {
      onShowToast('success', 'Test du Webhook réussi !');
    } else {
      onShowToast('error', res.message);
    }
  };

  const handleOpenAccountEdit = (acc: SocialAccount) => {
    setEditingAccount(acc);
    setCustomWebhookUrl(acc.webhookUrl || '');
    setCustomUsername(acc.username || '');
  };

  const handleSaveAccountEdit = () => {
    if (!editingAccount) return;
    const updated = StorageService.updateAccountWebhook(
      editingAccount.id,
      customWebhookUrl,
      customUsername
    );
    onAccountsUpdated(updated);
    setEditingAccount(null);
    onShowToast('success', `Compte ${editingAccount.displayName} mis à jour !`);
  };

  const handleToggleConnection = async (acc: SocialAccount) => {
    const updated = StorageService.toggleAccountConnection(acc.id);
    onAccountsUpdated(updated);

    const isNowConnected = updated.find(a => a.id === acc.id)?.connected;
    if (isNowConnected) {
      onShowToast('success', `Compte ${acc.displayName} (${PLATFORM_DETAILS[acc.platform].name}) activé !`);
    } else {
      onShowToast('info', `Compte ${acc.displayName} désactivé.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Info */}
      <div className="glass-card" style={{
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
            background: 'var(--grad-dark-card)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            boxShadow: '0 0 15px var(--accent-primary-glow)'
          }}>
            <Share2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Passerelles Réseaux Sociaux & Cloud Webhooks</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Connectez vos 5 réseaux via Webhooks unifiés (Make, n8n, Zapier, Ayrshare) ou API directes
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={16} color="var(--accent-emerald)" />
          <span>Diffusion chiffrée SSL / HTTPS</span>
        </div>
      </div>

      {/* Option B: Unified Cloud Webhook Bridge Hub */}
      <div className="glass-card" style={{
        border: '1px solid var(--border-accent)',
        background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.06) 0%, rgba(18, 23, 34, 0.95) 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Zap size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Passerelle Cloud Unifiée (Option B — Gratuite)</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Envoyez automatiquement vos publications vers un scénario Make.com (1000 posts gratuits/mois), n8n ou Zapier
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a 
              href="https://www.make.com/en/register" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem', fontSize: '0.75rem' }}
            >
              <span>Créer un compte Make gratuit</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Webhook Input Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Webhook size={15} color="var(--accent-primary)" />
                URL du Webhook Cloud (Make.com / n8n / Zapier / Backend)
              </span>
            </label>
            <input
              type="url"
              className="form-input"
              value={bridgeConfig.universalWebhookUrl}
              onChange={(e) => setBridgeConfig({ ...bridgeConfig, universalWebhookUrl: e.target.value })}
              placeholder="https://hook.eu1.make.com/votre-cle-webhook-unique"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
            <button
              className="btn btn-secondary"
              onClick={handleTestBridge}
              disabled={isTestingWebhook || !bridgeConfig.universalWebhookUrl}
              style={{ flex: 1, gap: '0.4rem' }}
            >
              {isTestingWebhook ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Test en cours...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Tester le Webhook</span>
                </>
              )}
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSaveBridge}
              style={{ flex: 1 }}
            >
              Enregistrer
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-xs)',
            background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${testResult.success ? 'var(--accent-emerald)' : 'var(--color-tiktok)'}`,
            fontSize: '0.82rem',
            color: testResult.success ? 'var(--accent-emerald)' : 'var(--text-primary)'
          }}>
            {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} color="var(--color-tiktok)" />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Explanatory Payload Structure */}
        <div style={{
          background: 'var(--bg-input)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            📦 <strong>Payload envoyé en direct :</strong> <code>{`{ platform, text, hook, hashtags, media: { url, type } }`}</code>
          </div>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>100% Automatisé lors des publications</span>
        </div>
      </div>

      {/* Accounts Grid */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Vos 5 Canaux de Diffusion
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {accounts.map(acc => {
            const detail = PLATFORM_DETAILS[acc.platform];

            return (
              <div
                key={acc.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: `3px solid ${detail.color}`
                }}
              >
                {/* Account Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={acc.avatarUrl}
                      alt={acc.displayName}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {acc.displayName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {acc.username}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '1.2rem' }}>{detail.icon}</span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {detail.desc}
                </p>

                {/* Account Status / Webhook status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.75rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Webhook dédié : </span>
                    <span style={{ fontWeight: 600, color: acc.webhookUrl ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                      {acc.webhookUrl ? 'Configuré ✓' : 'Hérité du global'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div className={`status-dot ${acc.connected ? '' : 'simulated'}`} />
                    <span style={{ color: acc.connected ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {acc.connected ? 'Actif' : 'Désactivé'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenAccountEdit(acc)}
                    style={{ gap: '0.3rem' }}
                  >
                    <Settings2 size={14} />
                    <span>Configurer</span>
                  </button>

                  <button
                    className={`btn btn-sm ${acc.connected ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleToggleConnection(acc)}
                    style={{ flex: 1 }}
                  >
                    {acc.connected ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Publish Logs */}
      {logs.length > 0 && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Journal des Publications Récentes</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 240, overflowY: 'auto' }}>
            {logs.slice(0, 10).map(log => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {log.status === 'success' ? (
                    <CheckCircle2 size={15} color="var(--accent-emerald)" />
                  ) : (
                    <AlertCircle size={15} color="var(--color-tiktok)" />
                  )}
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{log.platform}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({log.responseMessage})</span>
                </div>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {editingAccount && (
        <Modal
          isOpen={true}
          onClose={() => setEditingAccount(null)}
          title={`Configuration du compte ${PLATFORM_DETAILS[editingAccount.platform].name}`}
          subtitle="Personnalisez le nom d'utilisateur et le webhook dédié si nécessaire"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditingAccount(null)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleSaveAccountEdit}>
                Enregistrer
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nom d'utilisateur / Handle</label>
              <input
                type="text"
                className="form-input"
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                placeholder="@moncompte"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Webhook Spécifique à {PLATFORM_DETAILS[editingAccount.platform].name} (Optionnel)
              </label>
              <input
                type="url"
                className="form-input"
                value={customWebhookUrl}
                onChange={(e) => setCustomWebhookUrl(e.target.value)}
                placeholder="Laisser vide pour utiliser le Webhook Cloud global..."
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
