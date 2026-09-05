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
    '#trending',
    '#islamicreminder',
    '#kaelar_islamic',
    '#kaelarislamic'
  ],

  instagram_boosters: [
    '#islamicreels',
    '#reelsinstagram',
    '#reelsviral',
    '#explorepage',
    '#instaislam',
    '#reels',
    '#explore',
    '#viralreels',
    '#quranrecitation',
    '#dailyreminder',
    '#kaeislamic',
    '#kaelarislamic'
  ],

  youtube_boosters: [
    '#Shorts',
    '#YouTubeShorts',
    '#IslamicShorts',
    '#ViralShorts',
    '#Trending',
    '#ShortsFeed',
    '#HolyQuran',
    '#HadithOfTheDay',
    '#IslamicStatus',
    '#DailyReminder',
    '#kaelarislamic'
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
    '#kaeislamic',
    '#kaelar_islamic',
    '#kaelarislamic'
  ]
};

export const IslamicViralTagsService = {
  /**
   * Generates a curated, algorithmically optimal list of viral Islamic hashtags
   * strictly customized for each platform's discovery feed (TikTok FYP, Instagram Explore, YouTube Shorts).
   */
  getViralTags(
    category: IslamicContentType = 'quran_verse',
    platform: SocialPlatform | 'all' = 'all',
    language: IslamicLanguage = 'all',
    customTopic?: string,
    limit: number = 14
  ): string[] {
    const selectedTags = new Set<string>();

    if (platform === 'youtube') {
      // YouTube Shorts SEO Formula: #Shorts first, followed by high-intent shorts tags & category
      selectedTags.add('#Shorts');
      ISLAMIC_VIRAL_TAG_TAXONOMY.youtube_boosters.slice(1, 6).forEach(t => selectedTags.add(t));
      
      const categoryTags = ISLAMIC_VIRAL_TAG_TAXONOMY[category] || ISLAMIC_VIRAL_TAG_TAXONOMY.quran_verse;
      categoryTags.slice(0, 4).forEach(t => selectedTags.add(t));
      
      selectedTags.add('#Islam');
      selectedTags.add('#Quran');
      selectedTags.add('#kaelarislamic');
      return Array.from(selectedTags).slice(0, limit);
    }

    if (platform === 'tiktok') {
      // TikTok FYP Formula: High-velocity viral hooks, short keywords, community tags
      ISLAMIC_VIRAL_TAG_TAXONOMY.tiktok_boosters.slice(0, 7).forEach(t => selectedTags.add(t));
      
      const categoryTags = ISLAMIC_VIRAL_TAG_TAXONOMY[category] || ISLAMIC_VIRAL_TAG_TAXONOMY.quran_verse;
      categoryTags.slice(0, 4).forEach(t => selectedTags.add(t));
      
      selectedTags.add('#islam');
      selectedTags.add('#allah');
      if (language === 'fr' || language === 'all') {
        selectedTags.add('#rappelislam');
      }
      selectedTags.add('#kaelar_islamic');
      selectedTags.add('#kaelarislamic');
      return Array.from(selectedTags).slice(0, limit);
    }

    if (platform === 'instagram') {
      // Instagram Explore Formula: Explore tags, Reels virality, aesthetic community tags
      ISLAMIC_VIRAL_TAG_TAXONOMY.instagram_boosters.slice(0, 6).forEach(t => selectedTags.add(t));
      
      const categoryTags = ISLAMIC_VIRAL_TAG_TAXONOMY[category] || ISLAMIC_VIRAL_TAG_TAXONOMY.quran_verse;
      categoryTags.slice(0, 4).forEach(t => selectedTags.add(t));
      
      selectedTags.add('#islam');
      selectedTags.add('#muslim');
      if (language === 'fr' || language === 'all') {
        selectedTags.add('#rappelsislamiques');
        selectedTags.add('#coran');
      }
      selectedTags.add('#kaeislamic');
      selectedTags.add('#kaelarislamic');
      return Array.from(selectedTags).slice(0, limit);
    }

    // Default / All Platforms
    const coreList = ISLAMIC_VIRAL_TAG_TAXONOMY.core_global;
    coreList.slice(0, 3).forEach(t => selectedTags.add(t));

    const categoryTags = ISLAMIC_VIRAL_TAG_TAXONOMY[category] || ISLAMIC_VIRAL_TAG_TAXONOMY.quran_verse;
    categoryTags.slice(0, 4).forEach(t => selectedTags.add(t));

    selectedTags.add('#muslimtiktok');
    selectedTags.add('#fyp');
    selectedTags.add('#islamicreels');
    selectedTags.add('#Shorts');
    selectedTags.add('#kaelarislamic');

    if (customTopic && customTopic.trim()) {
      const cleanTopic = customTopic.trim().replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '');
      if (cleanTopic.length > 2) {
        selectedTags.add(`#${cleanTopic.toLowerCase()}`);
      }
    }

    return Array.from(selectedTags).slice(0, limit);
  },

  /**
   * Formats a complete, platform-native viral caption with verified reference and algorithmic tag layout.
   */
  formatViralCaption(
    item: IslamicPostItem,
    language: IslamicLanguage = 'all',
    platform: SocialPlatform | 'all' = 'all'
  ): string {
    const tags = this.getViralTags(item.type, platform, language, item.topic);
    const tagString = tags.join(' ');

    const cleanFr = (item.translationFr || '').replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();
    const cleanEn = (item.translationEn || '').replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();
    const ref = `${item.source.bookOrSurah} — ${item.source.numberOrAyah}`;
    const reciter = item.reciterAudio?.reciterName ? `🎙️ Récitation : ${item.reciterAudio.reciterName}` : '';

    // 1. TikTok Dedicated Caption (Punchy, fast-reading, immediate hook before "more")
    if (platform === 'tiktok') {
      return `${item.arabicText}\n\n« ${cleanFr} »\n\n📍 ${ref}${reciter ? '\n' + reciter : ''}\n\n${tagString}`;
    }

    // 2. YouTube Shorts Dedicated Caption (SEO title, full text, description tags)
    if (platform === 'youtube') {
      const titleLine = `${item.source.bookOrSurah} — ${item.source.numberOrAyah} 🕋 #Shorts`;
      return `${titleLine}\n\n${item.arabicText}\n\n« ${cleanFr} »\n\n"${cleanEn}"\n\n${reciter ? reciter + '\n' : ''}✨ Source certifiée : ${ref}\n\n${tagString}`;
    }

    // 3. Instagram Reels Dedicated Caption (Aesthetic spacing, reflection note, explore hashtags block)
    if (platform === 'instagram') {
      const reflection = item.reflection?.fr ? `✨ Réflexion : ${item.reflection.fr}\n\n` : '';
      return `${item.arabicText}\n\n« ${cleanFr} »\n\n“ ${cleanEn} ”\n\n📍 ${ref}${reciter ? '\n' + reciter : ''}\n\n${reflection}.\n.\n${tagString}`;
    }

    // 4. Default Trilingual
    if (language === 'fr') {
      return `${item.arabicText}\n\n« ${cleanFr} »\n\n📌 ${ref}${reciter ? '\n' + reciter : ''}\n\n${tagString}`;
    }

    if (language === 'en') {
      return `${item.arabicText}\n\n“${cleanEn}”\n\n📌 ${ref}${reciter ? '\n' + reciter : ''}\n\n${tagString}`;
    }

    return `${item.arabicText}\n\n🇫🇷 « ${cleanFr} »\n\n🇬🇧 “${cleanEn}”\n\n📌 ${ref}${reciter ? '\n' + reciter : ''}\n\n${tagString}`;
  }
};
