export type IslamicContentType = 'quran' | 'hadith' | 'dua' | 'wisdom';

export interface IslamicLibraryItem {
  id: string;
  type: IslamicContentType;
  themeTitle: string;
  arabicText: string;
  translationFr: string;
  translationEn: string;
  referenceText: string;
  canonicalKey: string; // Used for anti-duplication (e.g. 'quran_18_10' or hash of text)
  reciterName?: string;
  audioUrl?: string;
  cardImageUrl?: string;
  videoUrl?: string;
  publishedAt: string;
  platforms: ('instagram' | 'tiktok')[];
  format: 'reel' | 'photo';
  metadata?: {
    surahNumber?: number;
    ayahNumber?: number;
    hadithNumber?: number;
  };
}

export interface DeduplicationCheckResult {
  isDuplicate: boolean;
  existingItem?: IslamicLibraryItem;
  similarityScore?: number;
}
