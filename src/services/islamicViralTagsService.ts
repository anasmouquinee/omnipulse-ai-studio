/**
 * Kaelar Islamic AI Studio - Viral Tag & Algorithmic Discovery Engine
 * Generates high-converting, category-aware viral Islamic hashtags
 * optimized specifically for TikTok FYP and Instagram Reels Explore feeds.
 */

import type { IslamicContentType, IslamicPostItem, IslamicLanguage } from '../types/islamic';
import type { SocialPlatform } from '../types/content';

export const ISLAMIC_VIRAL_TAG_TAXONOMY: Record<string, string[]> = {
  // Global High-Volume Core Anchors (10M+ to 100M+ views)
  core_global: [
    '#islam',
    '#quran',
    '#hadith',
    '#allah',
    '#muslim',
    '#islamicreminder',
    '#islamicquotes',
    '#sunnah',
    '#deen',
    '#prophetmuhammad'
  ],

  // Platform Algorithmic FYP Boosters
  tiktok_boosters: [
    '#muslimtiktok',
    '#islamictiktok',
    '#islamicvideo',
    '#fyp',
    '#foryou',
    '#foryoupage',
    '#viralvideo',
    '#trending'
  ],

  instagram_boosters: [
    '#islamicreels',
    '#reelsinstagram',
    '#reelsviral',
    '#explorepage',
    '#instaislam',
    '#reels'
  ],

  // Category Specific Niche Rankers
  quran_verse: [
    '#quranrecitation',
    '#quranverses',
    '#surah',
    '#ayah',
    '#tilawat',
    '#holyquran',
    '#beautifultilawat',
    '#quranquote',
    '#قرآن',
    '#تلاوة'
  ],

  sahih_hadith: [
    '#hadith',
    '#hadithoftheday',
    '#sahihbukhari',
    '#sahihmuslim',
    '#propheticwisdom',
    '#sunnahrasul',
    '#hadithquotes',
    '#حديث',
    '#سنة'
  ],

  authentic_dua: [
    '#dua',
    '#dhikr',
    '#adhkar',
    '#hisnulmuslim',
    '#supplication',
    '#istighfar',
    '#subhanallah',
    '#alhamdulillah',
    '#allahuakbar',
    '#دعاء',
    '#أذكار'
  ],

  tahajjud_motivation: [
    '#tahajjud',
    '#nightprayer',
    '#qiyamullail',
    '#fajr',
    '#peaceofmind',
    '#duainthelastthird',
    '#spiritualgrowth',
    '#islamicpeace',
    '#قيام_الليل',
    '#تهجد'
  ],

  islamic_reminder: [
    '#tawakkul',
    '#sabr',
    '#patience',
    '#islamicmotivation',
    '#trustallah',
    '#islamicwisdom',
    '#hopeinallah',
    '#heartpeace',
    '#innerpeace',
    '#توكل_على_الله',
    '#صبر'
  ],

  jumua_special: [
    '#jummahmubarak',
    '#jumuah',
    '#fridayprayer',
    '#suratalkahf',
    '#salawat',
    '#duajummah',
    '#blessedfriday',
    '#alkahf',
    '#جمعة_مباركة',
    '#سورة_الكهف'
  ],

  // French Regional Viral Boosters (France, Belgium, Maghreb, Canada)
  french_boosters: [
    '#islamfrance',
    '#coran',
    '#rappelislam',
    '#rappelsislamiques',
    '#musulman',
    '#hadithdujour',
    '#prière',
    '#invocation'
  ],

  // Arabic Regional Viral Boosters
  arabic_boosters: [
    '#إسلام',
    '#قرآن_كريم',
    '#تلاوات_خاشعة',
    '#أدعية',
    '#اكسبلور_فولو'
  ],

  // Account Signature Brand
  branding: [
    '#kaelarislamic',
    '#mdou'
  ]
};

export const IslamicViralTagsService = {
  /**
   * Generates a curated, algorithmically optimal list of viral Islamic hashtags.
   * Balances high-traffic anchors, category keywords, platform FYP hooks and niche tags.
   */
  getViralTags(
    category: IslamicContentType = 'quran_verse',
    platform: SocialPlatform | 'all' = 'all',
    language: IslamicLanguage = 'all',
    customTopic?: string,
    limit: number = 14
  ): string[] {
    const selectedTags = new Set<string>();

    // 1. Add 3 Global Core Anchors
    const coreList = ISLAMIC_VIRAL_TAG_TAXONOMY.core_global;
    coreList.slice(0, 3).forEach(t => selectedTags.add(t));

    // 2. Add 4 Category-Specific High Impact Tags
    const categoryTags = ISLAMIC_VIRAL_TAG_TAXONOMY[category] || ISLAMIC_VIRAL_TAG_TAXONOMY.quran_verse;
    categoryTags.slice(0, 4).forEach(t => selectedTags.add(t));

    // 3. Add Platform Specific FYP Hooks
    if (platform === 'tiktok' || platform === 'all') {
      selectedTags.add('#muslimtiktok');
      selectedTags.add('#fyp');
      selectedTags.add('#foryou');
    }
    if (platform === 'instagram' || platform === 'all') {
      selectedTags.add('#islamicreels');
      selectedTags.add('#explorepage');
    }

    // 4. Add Language-Specific Regional Boosters
    if (language === 'fr' || language === 'all') {
      ISLAMIC_VIRAL_TAG_TAXONOMY.french_boosters.slice(0, 2).forEach(t => selectedTags.add(t));
    }
    if (language === 'ar' || language === 'all') {
      ISLAMIC_VIRAL_TAG_TAXONOMY.arabic_boosters.slice(0, 2).forEach(t => selectedTags.add(t));
    }

    // 5. Add Custom Topic Tag if provided (e.g. #sabr, #kaffarah, #tawakkul)
    if (customTopic && customTopic.trim()) {
      const cleanTopic = customTopic.trim().replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '');
      if (cleanTopic.length > 2) {
        selectedTags.add(`#${cleanTopic.toLowerCase()}`);
      }
    }

    // 6. Signature Brand Tag
    selectedTags.add('#kaelarislamic');

    // Convert Set to Array and enforce limit
    return Array.from(selectedTags).slice(0, limit);
  },

  /**
   * Formats a complete, high-engagement viral caption with verified reference and clean tag layout.
   */
  formatViralCaption(
    item: IslamicPostItem,
    language: IslamicLanguage = 'all',
    platform: SocialPlatform | 'all' = 'all'
  ): string {
    const tags = this.getViralTags(item.type, platform, language, item.topic);
    const tagString = tags.join(' ');

    const ref = `${item.source.bookOrSurah} — ${item.source.numberOrAyah} [${item.source.authenticityGrade}]`;
    const reciter = item.reciterAudio?.reciterName ? `🎙️ Récitation : ${item.reciterAudio.reciterName}` : '';

    if (language === 'fr') {
      return `${item.arabicText}\n\n« ${item.translationFr} »\n\n📌 ${ref}${reciter ? '\n' + reciter : ''}\n\n✨ Réflexion : ${item.reflection.fr}\n\n${tagString}`;
    }

    if (language === 'en') {
      return `${item.arabicText}\n\n“${item.translationEn}”\n\n📌 ${ref}${reciter ? '\n' + reciter : ''}\n\n✨ Reflection: ${item.reflection.en}\n\n${tagString}`;
    }

    if (language === 'ar') {
      return `${item.arabicText}\n\n📌 المرجع: ${item.source.arabicReference} [${item.source.authenticityGrade}]${reciter ? '\n' + reciter : ''}\n\n✨ تأمل: ${item.reflection.ar}\n\n${tagString}`;
    }

    // Trilingual Default
    return `${item.arabicText}\n\n🇫🇷 « ${item.translationFr} »\n\n🇬🇧 “${item.translationEn}”\n\n📌 ${ref}${reciter ? '\n' + reciter : ''}\n\n${tagString}`;
  }
};
