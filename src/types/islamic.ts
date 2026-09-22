/**
 * Kaelar Islamic AI Studio - Islamic Types & Verified Content Structure
 */

export type IslamicContentType = 
  | 'quran_verse' 
  | 'sahih_hadith' 
  | 'authentic_dua' 
  | 'islamic_reminder' 
  | 'jumua_special' 
  | 'tahajjud_motivation'
  | 'adhkar_routine';

export type IslamicLanguage = 'fr' | 'en' | 'ar' | 'all';

export type AuthenticityGrade = 
  | 'Coran (Parole d’Allah)' 
  | 'Sahih Bukhari' 
  | 'Sahih Muslim' 
  | 'Muttafaq Alayh (Bukhari & Muslim)' 
  | 'Sahih Tirmidhi' 
  | 'Sahih Abu Dawud' 
  | 'Hisn al-Muslim (Authentique)'
  | 'Adhkar Sahih (Sunnah Authentique)';

export interface VerifiedSource {
  type: 'quran' | 'hadith' | 'dua' | 'adhkar';
  bookOrSurah: string;
  numberOrAyah: string;
  surahNumber?: number;
  ayahNumber?: number;
  arabicReference: string;
  authenticityGrade: AuthenticityGrade;
  verifiedBy: string;
}

export interface ReciterAudio {
  reciterId?: string;
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
  visualTheme: 'emerald_mosque' | 'golden_night' | 'desert_dunes' | 'celestial_sky' | 'minimal_marble' | 'minimal_cream';
  checklistItems?: string[];
  closingAyah?: string;
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
