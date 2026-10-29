import React, { useState, useEffect } from 'react';
import { 
  KaabaIcon, 
  MosqueDomeIcon, 
  RubElHizbIcon, 
  SunnahPalmIcon 
} from './IslamicIcons';
import { Palette, Check, ChevronDown } from 'lucide-react';

export type IslamicThemeId = 'kiswah' | 'rawdah' | 'andalusia' | 'desert_fajr';

export interface IslamicThemeOption {
  id: IslamicThemeId;
  name: string;
  arabicName: string;
  tagline: string;
  icon: React.ReactNode;
  primaryColor: string;
  secondaryColor: string;
  bgPreview: string;
}

export const ISLAMIC_THEMES: IslamicThemeOption[] = [
  {
    id: 'kiswah',
    name: 'Kiswah Al-Kaaba',
    arabicName: 'الكسوة المشرفة',
    tagline: 'Obsidienne profonde, Or pur 24K & filigrane sacré',
    icon: <KaabaIcon size={18} color="#f59e0b" />,
    primaryColor: '#f59e0b',
    secondaryColor: '#10b981',
    bgPreview: '#020705'
  },
  {
    id: 'rawdah',
    name: 'Rawdah Al-Sharifah',
    arabicName: 'الروضة النبوية',
    tagline: 'Émeraude prophétique, marbre blanc & cuivre noble',
    icon: <MosqueDomeIcon size={18} color="#34d399" />,
    primaryColor: '#10b981',
    secondaryColor: '#fef08a',
    bgPreview: '#01140e'
  },
  {
    id: 'andalusia',
    name: 'Andalusia Zellige',
    arabicName: 'الأندلس والزليج',
    tagline: 'Lapis lazuli mauresque, zellige cyan & or d’Alhambra',
    icon: <RubElHizbIcon size={18} color="#38bdf8" />,
    primaryColor: '#0284c7',
    secondaryColor: '#f59e0b',
    bgPreview: '#020b18'
  },
  {
    id: 'desert_fajr',
    name: 'Fajr Desert Dawn',
    arabicName: 'فجر الصحراء',
    tagline: 'Crépuscule doré, terre d’Orient & ambre chaleureux',
    icon: <SunnahPalmIcon size={18} color="#fb923c" />,
    primaryColor: '#f97316',
    secondaryColor: '#fbbf24',
    bgPreview: '#110806'
  }
];

const STORAGE_KEY = 'kaelar_islamic_theme';

export const IslamicThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<IslamicThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'kiswah' || saved === 'rawdah' || saved === 'andalusia' || saved === 'desert_fajr')) {
        return saved as IslamicThemeId;
      }
    } catch {
      // LocalStorage unavailable fallback
    }
    return 'kiswah';
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    try {
      localStorage.setItem(STORAGE_KEY, currentTheme);
    } catch {
      // Ignore
    }
  }, [currentTheme]);

  const activeOption = ISLAMIC_THEMES.find(t => t.id === currentTheme) || ISLAMIC_THEMES[0];

  return (
    <div style={{ position: 'relative' }}>
      {/* Theme Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-full)',
          padding: '0.35rem 0.75rem',
          color: 'var(--fg-primary)',
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'var(--transition-smooth)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
        }}
        title="Changer le Thème Islamique Sacré"
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {activeOption.icon}
        </span>
        <span style={{
          fontFamily: 'var(--font-arabic)',
          fontSize: '0.82rem',
          color: activeOption.primaryColor
        }}>
          {activeOption.arabicName}
        </span>
        <ChevronDown 
          size={13} 
          style={{ 
            color: 'var(--fg-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease'
          }} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 998
            }}
          />
          <div 
            className="animate-fade-in"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 310,
              background: 'var(--surface-glass)',
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(254, 240, 138, 0.25)',
              padding: '0.85rem',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Palette size={14} color="#f59e0b" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
                  Thème Spirituel Kaelar
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: '0.85rem',
                color: '#fef08a'
              }}>
                الألوان والروحانية
              </span>
            </div>

            {/* List of Themes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {ISLAMIC_THEMES.map((theme) => {
                const isActive = theme.id === currentTheme;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(16, 185, 129, 0.08) 100%)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isActive ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.06)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition-fast)',
                      position: 'relative'
                    }}
                  >
                    {/* Swatch & Icon */}
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-xs)',
                      background: theme.bgPreview,
                      border: `1.5px solid ${theme.primaryColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 12px ${theme.primaryColor}33`,
                      flexShrink: 0
                    }}>
                      {theme.icon}
                    </div>

                    {/* Metadata */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                          {theme.name}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-arabic)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: theme.primaryColor
                        }}>
                          {theme.arabicName}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--fg-secondary)',
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {theme.tagline}
                      </div>
                    </div>

                    {/* Active Checkmark */}
                    {isActive && (
                      <Check size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
