import React, { useState } from 'react';
import { Sparkles, ChevronDown, Check, Terminal, Eye, RotateCw } from 'lucide-react';
import type { ThreeSceneMode } from './ThreeVgpuScene';

interface ThreeSceneControlsProps {
  currentMode: ThreeSceneMode;
  onSelectMode: (mode: ThreeSceneMode) => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  fps: number;
}

const MODES: { id: ThreeSceneMode; name: string; desc: string; color: string }[] = [
  {
    id: 'sacred_crystal',
    name: 'Sacred Emerald Crystal',
    desc: 'Cristal 3D facetté, cage d’or et anneaux gyroscopiques',
    color: '#10B981'
  },
  {
    id: 'celestial_gyroscope',
    name: 'Celestial Gyroscope',
    desc: 'Astrolabe 3D tri-axial en rotation orbitale',
    color: '#F59E0B'
  },
  {
    id: 'quantum_nebula',
    name: 'Quantum Particle Nebula',
    desc: 'Champ stellaire immersif de 1 200 particules 3D réactives',
    color: '#06B6D4'
  }
];

export const ThreeSceneControls: React.FC<ThreeSceneControlsProps> = ({
  currentMode,
  onSelectMode,
  wireframe,
  onToggleWireframe,
  autoRotate,
  onToggleAutoRotate,
  fps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMcpModal, setShowMcpModal] = useState(false);

  const activeModeObj = MODES.find(m => m.id === currentMode) || MODES[0];

  return (
    <div className="three-controls-wrapper">
      <button
        type="button"
        className="vgpu-status-badge"
        onClick={() => setIsOpen(!isOpen)}
        title="Contrôles 3D Three.js & VGPU"
      >
        <span className="vgpu-status-dot" style={{ backgroundColor: activeModeObj.color }} />
        <span className="vgpu-badge-label">3D Scene</span>
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
                <span>Moteur 3D Three.js & VGPU</span>
              </div>
              <span className="vgpu-tech-tag webgpu">Interactive 3D</span>
            </div>

            <div className="vgpu-preset-list">
              <div className="vgpu-section-label">Modes 3D Interactifs :</div>
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`vgpu-preset-item ${currentMode === m.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectMode(m.id);
                    setIsOpen(false);
                  }}
                >
                  <div
                    className="vgpu-preset-dot"
                    style={{ backgroundColor: m.color }}
                  />
                  <div className="vgpu-preset-info">
                    <div className="vgpu-preset-name">{m.name}</div>
                    <div className="vgpu-preset-desc">{m.desc}</div>
                  </div>
                  {currentMode === m.id && (
                    <Check size={16} className="vgpu-preset-check" color="#10B981" />
                  )}
                </button>
              ))}
            </div>

            {/* Quick 3D Toggles */}
            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                className={`btn btn-sm ${wireframe ? 'btn-gold' : 'btn-secondary'}`}
                onClick={onToggleWireframe}
                style={{ flex: 1, fontSize: '0.72rem', gap: '0.35rem' }}
              >
                <Eye size={12} />
                <span>Wireframe {wireframe ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${autoRotate ? 'btn-primary' : 'btn-secondary'}`}
                onClick={onToggleAutoRotate}
                style={{ flex: 1, fontSize: '0.72rem', gap: '0.35rem' }}
              >
                <RotateCw size={12} />
                <span>Rotation {autoRotate ? 'ON' : 'OFF'}</span>
              </button>
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
                Le serveur MCP VGPU développé par Vercel permet aux outils IA (Claude, Cursor, Codex) de requêter
                la documentation WebGPU et Three.js TSL nativement.
              </p>

              <div className="vgpu-code-block">
                <div className="vgpu-code-label">Lancer le serveur MCP en local :</div>
                <code>npx -y vgpu mcp</code>
              </div>

              <div className="vgpu-code-block">
                <div className="vgpu-code-label">Serveur hébergé Streamable HTTP :</div>
                <code>https://vgpu.sh/api/mcp</code>
              </div>

              <div className="vgpu-code-block">
                <div className="vgpu-code-label">Fichier de configuration dans votre repo :</div>
                <code>.agents/mcp_config.json</code>
              </div>
            </div>

            <div className="vgpu-modal-actions">
              <button
                type="button"
                className="btn-luxury-primary"
                onClick={() => setShowMcpModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
