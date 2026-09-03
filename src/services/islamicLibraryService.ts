/**
 * OmniPulse AI - Islamic Content Library & Anti-Duplication Registry
 * Preserves all published posts and guarantees zero repetitive publications.
 */

import type { IslamicLibraryItem, DeduplicationCheckResult } from '../types/library';
import type { IslamicQuoteItem } from '../types/islamic';

const LIBRARY_STORAGE_KEY = 'omnipulse_islamic_library';

// Default initial posts in history
const INITIAL_LIBRARY: IslamicLibraryItem[] = [
  {
    id: 'lib-init-1',
    type: 'quran',
    themeTitle: 'Rappel Quotidien — Sourate Al-Kahf',
    arabicText: 'مَن قَرَأَ سُورَةَ الْكَهْفِ فِي يَوْمِ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ',
    translationFr: '« Celui qui lit la Sourate Al-Kahf le jour du vendredi, une lumière l’éclairera pour lui l’intervalle entre les deux vendredis. »',
    translationEn: 'Whoever reads Surah Al-Kahf on the day of Jumuah, will have a light that will shine for him from one Friday to the next.',
    referenceText: 'Al-Mustadrak / Sahih Al-Jami’ — Hadith n° 6470',
    canonicalKey: 'hadith_kahf_jumuah_6470',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
    cardImageUrl: '',
    videoUrl: 'https://res.cloudinary.com/zmgzjmpl/video/upload/v1787785712/gaaveey0i94rpdpoo5xf.mp4',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    platforms: ['instagram', 'tiktok'],
    format: 'reel'
  }
];

export const IslamicLibraryService = {
  /**
   * Get all registered library items from local cache
   */
  getItems(): IslamicLibraryItem[] {
    try {
      const data = localStorage.getItem(LIBRARY_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_LIBRARY;
    } catch {
      return INITIAL_LIBRARY;
    }
  },

  /**
   * Fetch and synchronize library with cloud registry (GitHub Actions / Cloud Auto-Pilot)
   */
  async fetchSyncedItems(): Promise<IslamicLibraryItem[]> {
    const localItems = this.getItems();
    let remoteItems: IslamicLibraryItem[] = [];

    // 1. Try /api/library first
    try {
      const res = await fetch('/api/library');
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          remoteItems = data.items;
        }
      }
    } catch {
      // Ignore and try fallback
    }

    // 2. Direct GitHub Raw fallback if /api/library was not reachable (e.g. static dev)
    if (remoteItems.length === 0) {
      try {
        const ghRes = await fetch(
          'https://raw.githubusercontent.com/anasmouquinee/omnipulse-ai-studio/main/data/publishedRegistry.json'
        );
        if (ghRes.ok) {
          const raw = await ghRes.json();
          if (raw.publishedItems && Array.isArray(raw.publishedItems)) {
            remoteItems = raw.publishedItems.map((item: any, idx: number) => ({
              id: item.id || `gh-${idx}`,
              type: item.type || 'quran',
              themeTitle: item.theme || item.themeTitle || 'Rappel Islamique',
              arabicText: item.arabicText || '',
              translationFr: item.translationFr || '',
              translationEn: item.translationEn || '',
              referenceText: item.bookOrSurah 
                ? `${item.bookOrSurah}${item.numberOrAyah ? ' — ' + item.numberOrAyah : ''}` 
                : 'Rappel Islamique',
              canonicalKey: item.canonicalKey || item.contentHash || `key-${idx}`,
              reciterName: item.reciterName || 'Mishary Rashid Alafasy',
              audioUrl: item.audioUrl || '',
              cardImageUrl: item.cardImageUrl || '',
              videoUrl: item.videoUrl || '',
              publishedAt: item.timestamp || item.publishedAt || new Date().toISOString(),
              platforms: item.platforms || ['instagram', 'tiktok'],
              format: item.videoUrl ? 'reel' : 'photo'
            }));
          }
        }
      } catch (e) {
        console.warn('GitHub raw fallback fetch failed:', e);
      }
    }

    if (remoteItems.length === 0) {
      return localItems;
    }

    // 3. Merge without duplicates (favor remote if has videoUrl, or keep local)
    const existingVideoUrls = new Set(localItems.map(i => i.videoUrl).filter(Boolean));
    const existingKeys = new Set(localItems.map(i => i.canonicalKey).filter(Boolean));

    const newRemote = remoteItems.filter(r => {
      if (r.videoUrl && existingVideoUrls.has(r.videoUrl)) return false;
      if (r.canonicalKey && existingKeys.has(r.canonicalKey)) return false;
      return true;
    });

    const merged = [...newRemote, ...localItems];
    this.saveItems(merged);
    return merged;
  },

  /**
   * Save items to storage
   */
  saveItems(items: IslamicLibraryItem[]): void {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save Islamic library items:', e);
    }
  },

  /**
   * Generate canonical key from an Islamic quote
   */
  generateCanonicalKey(item: Partial<IslamicQuoteItem>): string {
    if (item.surahMetadata) {
      return `quran_${item.surahMetadata.surahNumber}_${item.surahMetadata.ayahNumber}`;
    }
    if (item.hadithMetadata) {
      const cleanBook = (item.hadithMetadata.book || 'hadith').toLowerCase().replace(/[^a-z0-9]/g, '');
      return `hadith_${cleanBook}_${item.hadithMetadata.hadithNumber || '0'}`;
    }
    // Fallback: clean normalized arabic text first 4 words
    const cleanAr = (item.arabicText || '')
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
      .replace(/[^ \u0600-\u06FF]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 5)
      .join('_');

    return `quote_${cleanAr || Date.now()}`;
  },

  /**
   * Register a newly published post into the library
   */
  recordPublication(
    item: IslamicQuoteItem,
    cardUrl: string,
    videoUrl?: string,
    format: 'reel' | 'photo' = 'reel',
    platforms: ('instagram' | 'tiktok')[] = ['instagram', 'tiktok']
  ): IslamicLibraryItem {
    const items = this.getItems();
    const canonicalKey = this.generateCanonicalKey(item);

    const newItem: IslamicLibraryItem = {
      id: `lib-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: item.type || 'quran',
      themeTitle: item.themeTitle || 'Rappel Islamique',
      arabicText: item.arabicText,
      translationFr: item.translationFr,
      translationEn: item.translationEn,
      referenceText: item.referenceText,
      canonicalKey,
      reciterName: item.reciterAudio?.reciterName,
      audioUrl: item.reciterAudio?.audioUrl,
      cardImageUrl: cardUrl,
      videoUrl: videoUrl,
      publishedAt: new Date().toISOString(),
      platforms,
      format,
      metadata: {
        surahNumber: item.surahMetadata?.surahNumber,
        ayahNumber: item.surahMetadata?.ayahNumber,
        hadithNumber: item.hadithMetadata?.hadithNumber
      }
    };

    const updated = [newItem, ...items];
    this.saveItems(updated);
    return newItem;
  },

  /**
   * Anti-Duplication Engine: checks if a quote was already published
   */
  checkDuplicate(quote: Partial<IslamicQuoteItem>): DeduplicationCheckResult {
    const items = this.getItems();
    const targetKey = this.generateCanonicalKey(quote);

    const exactMatch = items.find(i => i.canonicalKey === targetKey);
    if (exactMatch) {
      return { isDuplicate: true, existingItem: exactMatch, similarityScore: 1.0 };
    }

    // Secondary check on cleaned Arabic text
    if (quote.arabicText) {
      const cleanTarget = quote.arabicText.replace(/[\u064B-\u065F\u0670]/g, '').trim();
      for (const item of items) {
        const cleanExisting = item.arabicText.replace(/[\u064B-\u065F\u0670]/g, '').trim();
        if (cleanTarget === cleanExisting || (cleanTarget.length > 20 && cleanExisting.includes(cleanTarget.substring(0, 20)))) {
          return { isDuplicate: true, existingItem: item, similarityScore: 0.95 };
        }
      }
    }

    return { isDuplicate: false };
  },

  /**
   * Get list of all used canonical keys to feed prompt exclusions
   */
  getAllUsedKeys(): string[] {
    return this.getItems().map(i => i.canonicalKey);
  },

  /**
   * Delete an item from the library
   */
  deleteItem(id: string): void {
    const items = this.getItems().filter(i => i.id !== id);
    this.saveItems(items);
  }
};
