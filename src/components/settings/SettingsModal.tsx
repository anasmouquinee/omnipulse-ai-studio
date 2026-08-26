import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { AISettings, VideoProviderType } from '../../types/ai';
import { StorageService } from '../../services/storageService';
import { Sparkles, Image as ImageIcon, Film, ShieldAlert, Check, Cloud } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: (settings: AISettings) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

const VIDEO_PROVIDERS: { id: VideoProviderType; name: string; defaultEndpoint: string }[] = [
  { id: 'runway', name: 'Runway ML (Gen-3 Alpha)', defaultEndpoint: 'https://api.runwayml.com/v1/generate' },
  { id: 'luma', name: 'Luma Dream Machine', defaultEndpoint: 'https://api.lumalabs.ai/dream-machine/v1/generations' },
  { id: 'google_veo', name: 'Google Veo (Vertex AI)', defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate:predict' },
  { id: 'kling', name: 'Kling AI Video', defaultEndpoint: 'https://api.klingai.com/v1/videos/text2video' },
  { id: 'fal_ai', name: 'Fal.ai (Minimax / LTX-Video / CogVideoX)', defaultEndpoint: 'https://fal.run/fal-ai/minimax-video' },
  { id: 'simulator', name: 'Simulateur Vidéo Intégré (Sans Clé requise)', defaultEndpoint: '' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
  onShowToast
}) => {
  const currentSettings = StorageService.getSettings();
  const currentBridge = StorageService.getBridgeConfig();
  const [settings, setSettings] = useState<AISettings>(currentSettings);
  const [bridgeConfig, setBridgeConfig] = useState(currentBridge);

  const handleProviderChange = (provider: VideoProviderType) => {
    const selected = VIDEO_PROVIDERS.find(p => p.id === provider);
    setSettings({
      ...settings,
      videoProvider: provider,
      videoApiEndpoint: selected?.defaultEndpoint || settings.videoApiEndpoint
    });
  };

  const handleSave = () => {
    StorageService.saveSettings(settings);
    StorageService.saveBridgeConfig(bridgeConfig);
    onSettingsSaved(settings);
    onShowToast('success', 'Paramètres, clés API et stockage vidéo enregistrés !');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Paramètres & Clés API d'Intelligence Artificielle"
      subtitle="Configurez vos accès directs à Gemini Flash / Pro, Imagen 3 et aux générateurs vidéo"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSave} style={{ gap: '0.4rem' }}>
            <Check size={16} />
            <span>Enregistrer les Clés</span>
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Notice Card */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          display: 'flex',
          gap: '0.75rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}>
          <ShieldAlert size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            Vos clés API sont stockées de façon sécurisée localement dans votre navigateur (`localStorage`) et ne transitent par aucun serveur tiers.
          </div>
        </div>

        {/* 1. Gemini API Key */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={15} color="var(--accent-primary)" />
              Clé API Google Gemini (Gemini Flash & Pro)
            </span>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer" 
              style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}
            >
              Google AI Studio ↗
            </a>
          </label>
          <input
            type="password"
            className="form-input"
            value={settings.geminiApiKey}
            onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
            placeholder="AIzaSy... ou AQ.Ab8..."
          />
        </div>

        {/* Gemini Model */}
        <div className="form-group">
          <label className="form-label">Modèle de Rédaction & Stratégie</label>
          <select
            className="form-select"
            value={settings.geminiModel || 'gemini-3.6-flash'}
            onChange={(e) => setSettings({ ...settings, geminiModel: e.target.value })}
          >
            <option value="gemini-3.6-flash">Gemini 3.6 Flash (Dernière génération & Recommandé)</option>
            <option value="gemini-flash-latest">Gemini Flash Latest</option>
            <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
            <option value="gemini-2.5-pro">Gemini Pro (Raisonnement approfondi)</option>
          </select>
        </div>

        {/* 2. Imagen 3 API Key */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ImageIcon size={15} color="var(--accent-pink)" />
              Clé API Google Imagen 3
            </span>
          </label>
          <input
            type="password"
            className="form-input"
            value={settings.imagenApiKey}
            onChange={(e) => setSettings({ ...settings, imagenApiKey: e.target.value })}
            placeholder="Utilise la même clé Gemini par défaut..."
          />
        </div>

        {/* 3. Video API Connector */}
        <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Film size={15} color="var(--accent-amber)" />
                Fournisseur / Moteur Vidéo IA
              </span>
            </label>
            <select
              className="form-select"
              value={settings.videoProvider || 'runway'}
              onChange={(e) => handleProviderChange(e.target.value as VideoProviderType)}
            >
              {VIDEO_PROVIDERS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Endpoint API Vidéo</label>
            <input
              type="text"
              className="form-input"
              value={settings.videoApiEndpoint}
              onChange={(e) => setSettings({ ...settings, videoApiEndpoint: e.target.value })}
              placeholder="https://api.runwayml.com/v1/generate"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clé API Vidéo (Optionnel si Simulateur)</label>
            <input
              type="password"
              className="form-input"
              value={settings.videoApiKey}
              onChange={(e) => setSettings({ ...settings, videoApiKey: e.target.value })}
              placeholder="rw_... ou key_..."
            />
          </div>
        </div>

        {/* 4. Cloud Storage for Reels & Videos */}
        <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Cloud size={15} color="#06b6d4" />
                Hébergement Cloud des Vidéos Reels (Requis pour Buffer)
              </span>
            </label>
            <select
              className="form-select"
              value={bridgeConfig.cloudStorage?.provider || 'cloudinary'}
              onChange={(e) => setBridgeConfig({
                ...bridgeConfig,
                cloudStorage: { ...(bridgeConfig.cloudStorage || { provider: 'cloudinary' }), provider: e.target.value as any }
              })}
            >
              <option value="cloudinary">Cloudinary (Gratuit & Rapide — Recommandé)</option>
              <option value="supabase">Supabase Storage (Gratuit / S3)</option>
            </select>
          </div>

          {(bridgeConfig.cloudStorage?.provider || 'cloudinary') === 'cloudinary' ? (
            <>
              <div className="form-group">
                <label className="form-label">
                  <span>Cloudinary Cloud Name</span>
                  <a href="https://cloudinary.com/users/register_free" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                    Créer un compte gratuit Cloudinary ↗
                  </a>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={bridgeConfig.cloudStorage?.cloudinaryCloudName || ''}
                  onChange={(e) => setBridgeConfig({
                    ...bridgeConfig,
                    cloudStorage: { ...(bridgeConfig.cloudStorage || { provider: 'cloudinary' }), provider: 'cloudinary', cloudinaryCloudName: e.target.value }
                  })}
                  placeholder="Ex: dqmfgj6e9 ou votre Cloud Name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Upload Preset (Non signé)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Créé dans Settings &gt; Upload sur Cloudinary</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={bridgeConfig.cloudStorage?.cloudinaryUploadPreset || ''}
                  onChange={(e) => setBridgeConfig({
                    ...bridgeConfig,
                    cloudStorage: { ...(bridgeConfig.cloudStorage || { provider: 'cloudinary' }), provider: 'cloudinary', cloudinaryUploadPreset: e.target.value }
                  })}
                  placeholder="ml_default ou votre preset unsigned"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Supabase Project URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={bridgeConfig.cloudStorage?.supabaseUrl || ''}
                  onChange={(e) => setBridgeConfig({
                    ...bridgeConfig,
                    cloudStorage: { ...(bridgeConfig.cloudStorage || { provider: 'supabase' }), provider: 'supabase', supabaseUrl: e.target.value }
                  })}
                  placeholder="https://xyzcompany.supabase.co"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Supabase Anon Key</label>
                <input
                  type="password"
                  className="form-input"
                  value={bridgeConfig.cloudStorage?.supabaseAnonKey || ''}
                  onChange={(e) => setBridgeConfig({
                    ...bridgeConfig,
                    cloudStorage: { ...(bridgeConfig.cloudStorage || { provider: 'supabase' }), provider: 'supabase', supabaseAnonKey: e.target.value }
                  })}
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bucket Public Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={bridgeConfig.cloudStorage?.supabaseBucket || 'reels'}
                  onChange={(e) => setBridgeConfig({
                    ...bridgeConfig,
                    cloudStorage: { ...(bridgeConfig.cloudStorage || { provider: 'supabase' }), provider: 'supabase', supabaseBucket: e.target.value }
                  })}
                  placeholder="reels"
                />
              </div>
            </>
          )}
        </div>

        {/* Language Selection */}
        <div className="form-group" style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '1rem' }}>
          <label className="form-label">Langue par défaut des publications</label>
          <select
            className="form-select"
            value={settings.defaultLanguage}
            onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value as any })}
          >
            <option value="fr">Français (France / International)</option>
            <option value="en">English (US / UK)</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};
