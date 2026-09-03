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
  Layers,
  Key
} from 'lucide-react';

interface AccountsViewProps {
  accounts: SocialAccount[];
  onAccountsUpdated: (accounts: SocialAccount[]) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

const PLATFORM_DETAILS: Record<SocialPlatform, { name: string; color: string; icon: string; desc: string }> = {
  tiktok: { name: 'TikTok', color: 'var(--color-tiktok)', icon: '🎵', desc: 'Publication automatique de vidéos verticales 9:16, scripts et sons tendance.' },
  instagram: { name: 'Instagram', color: 'var(--color-instagram)', icon: '📸', desc: 'Publication de posts dans le feed, carrousels, Reels et Stories.' },
  youtube: { name: 'YouTube Shorts', color: '#ef4444', icon: '🔴', desc: 'Diffusion de vidéos courtes 9:16 #Shorts avec titres et tags viraux.' },
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
  const [activeTab, setActiveTab] = useState<'buffer' | 'make'>('buffer');
  const [logs, setLogs] = useState<PublishLog[]>(StorageService.getPublishLogs());
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Edit Account Modal
  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [customUsername, setCustomUsername] = useState('');

  const handleSaveBridge = () => {
    StorageService.saveBridgeConfig(bridgeConfig);
    onShowToast('success', 'Configuration de diffusion enregistrée avec succès !');
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Passerelles de Publication Réelle</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Publiez directement sur TikTok, Instagram, X, LinkedIn et Facebook via Buffer ou Make.com
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={16} color="var(--accent-emerald)" />
          <span>Connexions sécurisées SSL / HTTPS</span>
        </div>
      </div>

      {/* Bridge Selector Tabs */}
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Méthode de Diffusion Automatique</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Choisissez comment OmniPulse envoie vos vidéos et posts vers vos réseaux
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'buffer' ? 'active' : ''}`}
              onClick={() => setActiveTab('buffer')}
            >
              <Layers size={14} />
              <span>1. Buffer API (Recommandé TikTok/Insta)</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'make' ? 'active' : ''}`}
              onClick={() => setActiveTab('make')}
            >
              <Webhook size={14} />
              <span>2. Make.com Webhook</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Buffer Direct Integration */}
        {activeTab === 'buffer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'var(--bg-input)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                🚀 <strong>Buffer est le partenaire certifié officiel</strong> pour publier automatiquement sur <strong>TikTok</strong> et <strong>Instagram Reels</strong> en direct !
              </div>
              <a
                href="https://buffer.com/manage/channels"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem', fontSize: '0.75rem' }}
              >
                <span>Gérer mes canaux sur Buffer</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Key size={15} color="var(--accent-primary)" />
                    Jeton d'accès Buffer (Buffer Access Token)
                  </span>
                  <a
                    href="https://buffer.com/developers/api"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}
                  >
                    Obtenir mon token Buffer ↗
                  </a>
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={bridgeConfig.bufferAccessToken || ''}
                  onChange={(e) => setBridgeConfig({ ...bridgeConfig, bufferAccessToken: e.target.value })}
                  placeholder="1/abcdef123456789..."
                />
              </div>

              <div className="form-group" style={{ flex: 1.5 }}>
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    ID Canal YouTube Shorts (Optionnel)
                  </span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={bridgeConfig.bufferYoutubeChannelId || ''}
                  onChange={(e) => setBridgeConfig({ ...bridgeConfig, bufferYoutubeChannelId: e.target.value })}
                  placeholder="Ex: 6a8f4c..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveBridge}
                  style={{ flex: 1 }}
                >
                  Enregistrer Configuration Buffer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Make.com Webhook Integration */}
        {activeTab === 'make' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Webhook size={15} color="var(--accent-primary)" />
                    URL du Webhook Make.com
                  </span>
                </label>
                <input
                  type="url"
                  className="form-input"
                  value={bridgeConfig.universalWebhookUrl}
                  onChange={(e) => setBridgeConfig({ ...bridgeConfig, universalWebhookUrl: e.target.value })}
                  placeholder="https://hook.eu1.make.com/5ftvjpexv24p5bwyvu9fifjhokrn7exs"
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
                      <span>Test...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Tester Webhook</span>
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
          </div>
        )}
      </div>

      {/* Accounts Grid */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Vos Canaux Connectés
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

                {/* Account Status */}
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
                    <span style={{ color: 'var(--text-muted)' }}>Passerelle : </span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                      Buffer / Webhook Cloud
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div className={`status-dot ${acc.connected ? '' : 'simulated'}`} />
                    <span style={{ color: acc.connected ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {acc.connected ? 'Connecté (Buffer)' : 'En attente'}
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
                    <span>Modifier</span>
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
          subtitle="Personnalisez le nom d'utilisateur et l'identifiant de canal"
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
