/**
 * Kaelar Islamic AI Studio - Aesthetic Curated Backgrounds & Visual Themes
 * High-definition cinematic backgrounds for viral Islamic TikTok & Instagram content.
 */

export interface IslamicBackgroundTheme {
  id: string;
  name: string;
  category: 'mosque' | 'desert' | 'mecca' | 'lantern' | 'sunrise' | 'minimal' | 'parchment';
  imageUrl: string;
  overlayOpacity: number; // 0.3 to 0.75
  accentColor: string;
  textColor: string;
  arabicColor: string;
}

export const ISLAMIC_BACKGROUND_THEMES: IslamicBackgroundTheme[] = [
  {
    id: 'night_mosque_arches',
    name: '🕌 Mosquée Illuminée de Nuit',
    category: 'mosque',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.58,
    accentColor: '#f59e0b',
    textColor: '#f8fafc',
    arabicColor: '#ffffff'
  },
  {
    id: 'desert_crescent_night',
    name: '🌙 Dunes & Ciel Étoilé',
    category: 'desert',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.55,
    accentColor: '#fbbf24',
    textColor: '#f1f5f9',
    arabicColor: '#ffffff'
  },
  {
    id: 'islamic_arch_lantern',
    name: '🏮 Lanterne & Arches d’Or',
    category: 'lantern',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.62,
    accentColor: '#f59e0b',
    textColor: '#f8fafc',
    arabicColor: '#fef08a'
  },
  {
    id: 'fajr_sunrise_rays',
    name: '🌄 Aube & Rayons Dorés (Fajr)',
    category: 'sunrise',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.65,
    accentColor: '#10b981',
    textColor: '#f8fafc',
    arabicColor: '#ffffff'
  },
  {
    id: 'sheikh_zayed_grand_mosque',
    name: '🏛️ Marbre Blanc & Reflets',
    category: 'mosque',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.60,
    accentColor: '#d97706',
    textColor: '#f8fafc',
    arabicColor: '#ffffff'
  },
  {
    id: 'royal_emerald_obsidian',
    name: '✨ Émeraude Royal & Arabesques',
    category: 'minimal',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.70,
    accentColor: '#10b981',
    textColor: '#f8fafc',
    arabicColor: '#fef08a'
  }
];
