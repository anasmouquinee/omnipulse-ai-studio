import React, { useState } from 'react';
import { VgpuService, SHADER_PRESETS, type ShaderPresetId } from '../../services/vgpuService';
import { Cpu, Sparkles, ChevronDown, Check, Terminal, ExternalLink } from 'lucide-react';

interface VgpuStatusBadgeProps {
  currentPreset: ShaderPresetId;
  onSelectPreset: (preset: ShaderPresetId) => void;
  fps: number;
}

export const VgpuStatusBadge: React.FC<VgpuStatusBadgeProps> = ({
  currentPreset,
  onSelectPreset,
  fps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMcpModal, setShowMcpModal] = useState(false);
  const isWebGpu = VgpuService.getInstance().isSupported();

  const activePresetObj = SHADER_PRESETS.find(p => p.id === currentPreset) || SHADER_PRESETS[0];

  return (
    <div className="vgpu-badge-wrapper">
      <button
        type="button"
        className="vgpu-status-badge"
        onClick={() => setIsOpen(!isOpen)}
        title="Contrôles GPU & Shaders VGPU Vercel"
      >
        <span className="vgpu-status-dot" style={{ backgroundColor: activePresetObj.accentColor }} />
        <span className="vgpu-badge-label">
          {isWebGpu ? 'VGPU WebGPU' : 'Canvas2D'}
        </span>
        <span className="vgpu-badge-fps">{fps > 0 ? `${fps} FPS` : '60 FPS'}</span>
        <ChevronDown size={14} className={`vgpu-badge-arrow ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="vgpu-dropdown-backdrop" onClick={() => setIsOpen(false)} />
          <div className="vgpu-dropdown-menu animate-fade-in">
            <div className="vgpu-dropdown-header">
              <div className="vgpu-dropdown-title">
                <Sparkles size={14} color="#10B981" />
                <span>Moteur Graphique VGPU (Vercel)</span>
              </div>
              <span className={`vgpu-tech-tag ${isWebGpu ? 'webgpu' : 'fallback'}`}>
                {isWebGpu ? 'Hardware Accelerated' : 'Software Fallback'}
              </span>
            </div>

            <div className="vgpu-preset-list">
              <div className="vgpu-section-label">Sélectionnez le Shader Actif :</div>
              {SHADER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`vgpu-preset-item ${currentPreset === preset.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectPreset(preset.id);
                    setIsOpen(false);
                  }}
                >
                  <div
                    className="vgpu-preset-dot"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                  <div className="vgpu-preset-info">
                    <div className="vgpu-preset-name">{preset.name}</div>
                    <div className="vgpu-preset-desc">{preset.description}</div>
                  </div>
                  {currentPreset === preset.id && (
                    <Check size={16} className="vgpu-preset-check" color="#10B981" />
                  )}
                </button>
              ))}
            </div>

            <div className="vgpu-dropdown-footer">
              <button
                type="button"
                className="vgpu-mcp-btn"
                onClick={() => {
                  setIsOpen(false);
                  setShowMcpModal(true);
                }}
              >
                <Terminal size={14} />
                <span>VGPU MCP Server Config</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* MCP Quick Guide Modal */}
      {showMcpModal && (
        <div className="vgpu-modal-overlay animate-fade-in" onClick={() => setShowMcpModal(false)}>
          <div className="vgpu-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="vgpu-modal-header">
              <div className="vgpu-modal-title">
                <Terminal size={20} color="#10B981" />
                <h3>VGPU Model Context Protocol (MCP)</h3>
              </div>
              <button
                type="button"
                className="vgpu-modal-close"
                onClick={() => setShowMcpModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="vgpu-modal-body">
              <p className="vgpu-modal-intro">
                Vercel a intégré un serveur MCP complet dans la bibliothèque <strong>vgpu</strong>.
                Il permet aux agents IA (Claude Code, Cursor, Codex, Antigravity) de rechercher la documentation,
                valider le code WGSL et extraire des exemples graphiques.
              </p>

              <div className="vgpu-code-block">
                <div className="vgpu-code-label">Lancer le serveur MCP local en stdio :</div>
                <code>npx -y vgpu mcp</code>
              </div>

              <div className="vgpu-code-block">
                <div className="vgpu-code-label">Ou configurer l'URL distante Streamable HTTP :</div>
                <code>https://vgpu.sh/api/mcp</code>
              </div>

              <div className="vgpu-code-block">
                <div className="vgpu-code-label">Configuration générée dans votre workspace :</div>
                <code>.agents/mcp_config.json</code>
              </div>

              <div className="vgpu-mcp-features">
                <div className="vgpu-feature-item">
                  <strong>📚 docs (search / read)</strong> : Navigation sémantique dans l'API WebGPU.
                </div>
                <div className="vgpu-feature-item">
                  <strong>🎨 examples (search / read)</strong> : Bibliothèque de shaders et scènes 3D certifiées.
                </div>
                <div className="vgpu-feature-item">
                  <strong>⚡ WebGPU Runtime</strong> : Intégré nativement dans ce projet OmniPulse Studio.
                </div>
              </div>
            </div>

            <div className="vgpu-modal-actions">
              <button
                type="button"
                className="btn-luxury-primary"
                onClick={() => setShowMcpModal(false)}
              >
                Compris & Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
