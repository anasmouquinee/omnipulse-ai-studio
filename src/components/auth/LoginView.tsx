import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { KaabaIcon } from '../common/IslamicIcons';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('anasmouquine');
  const [password, setPassword] = useState('anaskaelar2004');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const result = AuthService.login(username, password);
      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(result.message);
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Andalusian Geometric Star Scrim */}
      <div className="islamic-geom-scrim" />

      {/* Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, var(--accent-emerald) 0%, transparent 70%)',
        opacity: 0.18,
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)',
        opacity: 0.16,
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* Main Glass Card */}
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(254, 240, 138, 0.25)'
      }}>
        {/* Top Bismillah Calligraphy */}
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-arabic)',
          fontSize: '1.25rem',
          color: '#fde68a',
          marginBottom: '1rem',
          letterSpacing: '0.05em'
        }}>
          ﷽
        </div>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.5) 0%, rgba(245, 158, 11, 0.3) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)'
          }}>
            <KaabaIcon size={34} color="#f59e0b" />
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'var(--grad-gold-foil)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 0.35rem 0',
            letterSpacing: '-0.02em'
          }}>
            Kaelar Islamic Studio
          </h1>

          <div style={{
            fontFamily: 'var(--font-arabic)',
            fontSize: '0.95rem',
            color: '#34d399',
            fontWeight: 700,
            marginBottom: '0.35rem'
          }}>
            استوديو الذكاء الاصطناعي الإسلامي
          </div>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            margin: 0
          }}>
            Espace Sécurisé d'Automatisation & Publication Islamique
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#fca5a5',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Username Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.45rem'
            }}>
              Identifiant / Utilisateur
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                display: 'flex',
                pointerEvents: 'none'
              }}>
                <User size={16} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  background: 'var(--bg-input)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--fg-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'var(--transition-fast)'
                }}
                placeholder="Votre nom d'utilisateur"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.45rem'
            }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                display: 'flex',
                pointerEvents: 'none'
              }}>
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.6rem 0.75rem 2.5rem',
                  background: 'var(--bg-input)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--fg-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'var(--transition-fast)'
                }}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              marginTop: '0.5rem',
              fontSize: '0.95rem',
              boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.45)'
            }}
          >
            {isLoading ? (
              <span>Authentification en cours...</span>
            ) : (
              <>
                <span>Accéder au Studio</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          color: 'var(--text-tertiary)',
          fontSize: '0.75rem'
        }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Chiffrement AES-256 • Distribution vérifiée @kae.islamic</span>
        </div>
      </div>
    </div>
  );
};
