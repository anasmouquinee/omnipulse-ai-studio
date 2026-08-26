import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      zIndex: 200,
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="animate-fade-in"
          style={{
            pointerEvents: 'auto',
            minWidth: '300px',
            maxWidth: '420px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-lg)',
            borderLeft: `4px solid ${
              toast.type === 'success' 
                ? 'var(--accent-emerald)' 
                : toast.type === 'error' 
                  ? 'var(--accent-rose)' 
                  : 'var(--accent-cyan)'
            }`
          }}
        >
          {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', shrink: 0 }} />}
          {toast.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--accent-rose)', shrink: 0 }} />}
          {toast.type === 'info' && <Info size={18} style={{ color: 'var(--accent-cyan)', shrink: 0 }} />}
          
          <div style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {toast.message}
          </div>

          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => onDismiss(toast.id)}
            style={{ padding: '0.2rem', color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
