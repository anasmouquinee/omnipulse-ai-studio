/**
 * Kaelar Islamic AI Studio - Islamic Types & Verified Content Structure
 */

export type IslamicContentType = 
  | 'quran_verse' 
  | 'sahih_hadith' 
  | 'authentic_dua' 
  | 'islamic_reminder' 
  | 'jumua_special' 
  | 'tahajjud_motivation';

export type IslamicLanguage = 'fr' | 'en' | 'ar' | 'all';

export type AuthenticityGrade = 'Coran (Parole d’Allah)' | 'Sahih Bukhari' | 'Sahih Muslim' | 'Muttafaq Alayh (Bukhari & Muslim)' | 'Sahih Tirmidhi' | 'Sahih Abu Dawud' | 'Hisn al-Muslim (Authentique)';

export interface VerifiedSource {
  type: 'quran' | 'hadith' | 'dua';
  bookOrSurah: string;
  numberOrAyah: string;
  arabicReference: string;
  authenticityGrade: AuthenticityGrade;
  verifiedBy: string;
}

export interface ReciterAudio {
  reciterName: string;
  surahOrTitle: string;
  audioUrl: string;
  durationSeconds: number;
}

export interface IslamicPostItem {
  id: string;
  type: IslamicContentType;
  topic: string;
  arabicText: string;
  phonetic?: string;
  translationFr: string;
  translationEn: string;
  source: VerifiedSource;
  reciterAudio?: ReciterAudio;
  visualTheme: 'emerald_mosque' | 'golden_night' | 'desert_dunes' | 'celestial_sky' | 'minimal_marble';
  reflection: {
    fr: string;
    en: string;
    ar: string;
  };
  hashtags: {
    fr: string[];
    en: string[];
    ar: string[];
  };
}

export interface IslamicThemePreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: IslamicContentType;
  defaultTopic: string;
}
