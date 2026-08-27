import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#030712',
          color: '#f8fafc',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: 480,
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '1rem',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#f43f5e'
            }}>
              <ShieldAlert size={28} />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Récupération du Studio
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Une ancienne version ou un fichier en cache a causé une interruption. Cliquez sur le bouton ci-dessous pour rafraîchir et charger la dernière version propre.
            </p>

            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <RefreshCw size={16} />
              <span>Vider le Cache et Relancer</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
