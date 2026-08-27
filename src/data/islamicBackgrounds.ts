/**
 * Kaelar Islamic AI Studio - Aesthetic Curated Backgrounds & Visual Themes
 * High-definition cinematic backgrounds for viral Islamic TikTok & Instagram content.
 */

export interface IslamicBackgroundTheme {
  id: string;
  name: string;
  category: 'mosque' | 'desert' | 'mecca' | 'lantern' | 'sunrise' | 'minimal' | 'parchment' | 'reciter_portrait';
  imageUrl: string;
  overlayOpacity: number; // 0.3 to 0.75
  accentColor: string;
  textColor: string;
  arabicColor: string;
  layoutStyle?: 'ornate_card' | 'reciter_minimal';
}

export const ISLAMIC_BACKGROUND_THEMES: IslamicBackgroundTheme[] = [
  // 1. Viral TikTok Reciter Portrait Styles (Inspiration @c7l.11)
  {
    id: 'reciter_luhaidan',
    name: '🎙️ Sheikh Muhammad Al-Luhaidan (Style TikTok Viral)',
    category: 'reciter_portrait',
    imageUrl: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.42,
    accentColor: '#38bdf8',
    textColor: '#f8fafc',
    arabicColor: '#ffffff',
    layoutStyle: 'reciter_minimal'
  },
  {
    id: 'reciter_alafasy',
    name: '🎙️ Sheikh Mishary Rashid Alafasy (Émotion & Sérénité)',
    category: 'reciter_portrait',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.45,
    accentColor: '#10b981',
    textColor: '#f8fafc',
    arabicColor: '#ffffff',
    layoutStyle: 'reciter_minimal'
  },
  {
    id: 'reciter_islamsobhi',
    name: '🎙️ Sheikh Islam Sobhi (Ténèbres & Lumière)',
    category: 'reciter_portrait',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.48,
    accentColor: '#fbbf24',
    textColor: '#f8fafc',
    arabicColor: '#ffffff',
    layoutStyle: 'reciter_minimal'
  },
  {
    id: 'reciter_dossari',
    name: '🎙️ Sheikh Yasser Al-Dossari (Grandeur de la Kaaba)',
    category: 'reciter_portrait',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.45,
    accentColor: '#f59e0b',
    textColor: '#f8fafc',
    arabicColor: '#ffffff',
    layoutStyle: 'reciter_minimal'
  },
  {
    id: 'reciter_abdulbasit',
    name: '🎙️ Sheikh Abdul Basit (Voix d’Or Intemporelle)',
    category: 'reciter_portrait',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.46,
    accentColor: '#d97706',
    textColor: '#f8fafc',
    arabicColor: '#ffffff',
    layoutStyle: 'reciter_minimal'
  },

  // 2. Ornate Card Styles
  {
    id: 'night_mosque_arches',
    name: '🕌 Mosquée Illuminée de Nuit',
    category: 'mosque',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.58,
    accentColor: '#f59e0b',
    textColor: '#f8fafc',
    arabicColor: '#ffffff',
    layoutStyle: 'ornate_card'
  },
  {
    id: 'desert_crescent_night',
    name: '🌙 Dunes & Ciel Étoilé',
    category: 'desert',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.55,
    accentColor: '#fbbf24',
    textColor: '#f1f5f9',
    arabicColor: '#ffffff',
    layoutStyle: 'ornate_card'
  },
  {
    id: 'islamic_arch_lantern',
    name: '🏮 Lanterne & Arches d’Or',
    category: 'lantern',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.62,
    accentColor: '#f59e0b',
    textColor: '#f8fafc',
    arabicColor: '#fef08a',
    layoutStyle: 'ornate_card'
  },
  {
    id: 'fajr_sunrise_rays',
    name: '🌄 Aube & Rayons Dorés (Fajr)',
    category: 'sunrise',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.65,
    accentColor: '#10b981',
    textColor: '#f8fafc',
    arabicColor: '#ffffff',
    layoutStyle: 'ornate_card'
  },
  {
    id: 'sheikh_zayed_grand_mosque',
    name: '🏛️ Marbre Blanc & Reflets',
    category: 'mosque',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.60,
    accentColor: '#d97706',
    textColor: '#f8fafc',
    arabicColor: '#ffffff',
    layoutStyle: 'ornate_card'
  },
  {
    id: 'royal_emerald_obsidian',
    name: '✨ Émeraude Royal & Arabesques',
    category: 'minimal',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85',
    overlayOpacity: 0.70,
    accentColor: '#10b981',
    textColor: '#f8fafc',
    arabicColor: '#fef08a',
    layoutStyle: 'ornate_card'
  }
];
