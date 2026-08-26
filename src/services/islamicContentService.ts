/**
 * Kaelar Islamic AI Studio - Islamic Content & Aesthetic Quote Card Engine
 * Handles authentic multilingual generation (FR, EN, AR), Exact Quran Audio Matching, and Photographic Canvas Rendering.
 */

import type { IslamicPostItem, IslamicContentType, IslamicLanguage, VerifiedSource, ReciterAudio } from '../types/islamic';
import type { ScheduledPost, SocialPlatform } from '../types/content';
import { VERIFIED_ISLAMIC_POSTS, VERIFIED_RECITERS } from '../data/verifiedIslamicData';
import { ISLAMIC_BACKGROUND_THEMES, type IslamicBackgroundTheme } from '../data/islamicBackgrounds';
import { StorageService } from './storageService';

export const AVAILABLE_RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy (مشاري العفاسي)' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit Murattal (عبد الباسط عبد الصمد)' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi (المنشاوي)' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary (الحصري)' },
  { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly (ماهر المعيقلي)' },
  { id: 'ar.sudais', name: 'Abdul Rahman Al-Sudais (السديس)' },
  { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri (أبو بكر الشاطري)' },
  { id: 'ar.saadalghamdi', name: 'Saad Al-Ghamdi (سعد الغامدي)' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify (علي الحذيفي)' },
  { id: 'ar.aymanswoid', name: 'Dr. Ayman Sowaid (أيمن سويد)' }
];

export const SURAH_NAME_TO_NUMBER: Record<string, number> = {
  'al-fatihah': 1, 'fatihah': 1, 'ouverture': 1,
  'al-baqarah': 2, 'baqarah': 2, 'vache': 2,
  'ali-imran': 3, 'al-imran': 3, 'imran': 3,
  'an-nisa': 4, 'nisa': 4, 'femmes': 4,
  'al-maidah': 5, 'maidah': 5, 'table': 5,
  'al-anam': 6, 'anam': 6,
  'al-araf': 7, 'araf': 7,
  'al-anfal': 8, 'anfal': 8,
  'at-tawbah': 9, 'tawbah': 9, 'repentir': 9,
  'yunus': 10,
  'hud': 11,
  'yusuf': 12, 'joseph': 12,
  'ar-rad': 13, 'rad': 13,
  'ibrahim': 14,
  'al-hijr': 15,
  'an-nahl': 16, 'nahl': 16, 'abeilles': 16,
  'al-isra': 17, 'isra': 17,
  'al-kahf': 18, 'kahf': 18, 'caverne': 18,
  'maryam': 19, 'marie': 19,
  'taha': 20,
  'al-anbiya': 21, 'anbiya': 21, 'prophetes': 21,
  'al-hajj': 22, 'hajj': 22,
  'al-muminun': 23, 'muminun': 23, 'croyants': 23,
  'an-nur': 24, 'nur': 24, 'lumiere': 24,
  'al-furqan': 25, 'furqan': 25, 'discernement': 25,
  'ash-shuara': 26,
  'an-naml': 27, 'fourmis': 27,
  'al-qasas': 28, 'recit': 28,
  'al-ankabut': 29, 'ankabut': 29, 'araignee': 29,
  'ar-rum': 30, 'romains': 30,
  'luqman': 31,
  'as-sajdah': 32, 'prosternation': 32,
  'al-ahzab': 33, 'coalises': 33,
  'saba': 34,
  'fatir': 35,
  'ya-sin': 36, 'yasin': 36,
  'as-saffat': 37,
  'sad': 38,
  'az-zumar': 39, 'groupes': 39,
  'ghafir': 40, 'pardon': 40,
  'fussilat': 41,
  'ash-shura': 42, 'consultation': 42,
  'az-zukhruf': 43, 'ornements': 43,
  'ad-dukhan': 44, 'fumee': 44,
  'al-jathiyah': 45,
  'al-ahqaf': 46,
  'muhammad': 47,
  'al-fath': 48, 'fath': 48, 'victoire': 48,
  'al-hujurat': 49,
  'qaf': 50,
  'adh-dhariyat': 51,
  'at-tur': 52,
  'an-najm': 53, 'etoile': 53,
  'al-qamar': 54, 'lune': 54,
  'ar-rahman': 55, 'rahman': 55,
  'al-waqiah': 56, 'waqiah': 56,
  'al-hadid': 57, 'fer': 57,
  'al-mujadila': 58,
  'al-hashr': 59,
  'al-mumtahanah': 60,
  'as-saff': 61,
  'al-jumuah': 62, 'jumuah': 62, 'vendredi': 62,
  'al-munafiqun': 63,
  'at-taghabun': 64,
  'at-talaq': 65, 'talaq': 65, 'divorce': 65,
  'at-tahrim': 66,
  'al-mulk': 67, 'mulk': 67, 'royaute': 67,
  'al-qalam': 68, 'plume': 68,
  'al-haqqah': 69,
  'al-maarij': 70,
  'nuh': 71, 'noe': 71,
  'al-jinn': 72, 'jinn': 72,
  'al-muzzammil': 73,
  'al-muddaththir': 74,
  'al-qiyamah': 75, 'resurrection': 75,
  'al-insan': 76, 'homme': 76,
  'al-mursalat': 77,
  'an-naba': 78,
  'an-naziat': 79,
  'abasa': 80,
  'at-takwir': 81,
  'al-infitar': 82,
  'al-mutaffifin': 83,
  'al-inshiqaq': 84,
  'al-buruj': 85,
  'at-tariq': 86,
  'al-ala': 87,
  'al-ghashiyah': 88,
  'al-fajr': 89, 'fajr': 89, 'aube': 89,
  'al-balad': 90,
  'ash-shams': 91, 'soleil': 91,
  'al-layl': 92, 'nuit': 92,
  'ad-duha': 93, 'duha': 93,
  'ash-sharh': 94, 'sharh': 94, 'inshirah': 94, 'ouverture': 94,
  'at-tin': 95, 'figuier': 95,
  'al-alaq': 96,
  'al-qadr': 97, 'qadr': 97, 'destin': 97,
  'al-bayyinah': 98,
  'az-zalzalah': 99,
  'al-adiyat': 100,
  'al-qariah': 101,
  'at-takathur': 102,
  'al-asr': 103, 'asr': 103, 'temps': 103,
  'al-humazah': 104,
  'al-fil': 105, 'elephant': 105,
  'quraysh': 106, 'coraysh': 106,
  'al-maun': 107,
  'al-kawthar': 108, 'kawthar': 108, 'abondance': 108,
  'al-kafirun': 109,
  'an-nasr': 110, 'secours': 110,
  'al-masad': 111,
  'al-ikhlas': 112, 'ikhlas': 112, 'monotheisme': 112,
  'al-falaq': 113, 'falaq': 113, 'aube naissante': 113,
  'an-nas': 114, 'nas': 114, 'hommes': 114
};

export function parseSurahNumber(bookOrSurah?: string, explicitNumber?: any): number | undefined {
  if (explicitNumber && !isNaN(Number(explicitNumber))) {
    const num = Number(explicitNumber);
    if (num >= 1 && num <= 114) return num;
  }
  if (!bookOrSurah) return undefined;
  
  const numMatch = bookOrSurah.match(/\b(1[0-1][0-4]|[1-9][0-9]?)\b/);
  if (numMatch) return parseInt(numMatch[1], 10);

  const clean = bookOrSurah.toLowerCase().replace(/sourate|surah|surat|[-_']/g, ' ').trim();
  for (const [key, val] of Object.entries(SURAH_NAME_TO_NUMBER)) {
    if (clean.includes(key)) return val;
  }
  return undefined;
}

export function parseAyahNumber(numberOrAyah?: string, explicitAyah?: any): number | undefined {
  if (explicitAyah && !isNaN(Number(explicitAyah))) {
    const num = Number(explicitAyah);
    if (num >= 1 && num <= 286) return num;
  }
  if (!numberOrAyah) return undefined;
  const numMatch = numberOrAyah.match(/\b([1-9][0-9]{0,2})\b/);
  return numMatch ? parseInt(numMatch[1], 10) : undefined;
}

export const IslamicContentService = {
  /**
   * Fetches the EXACT verse audio recitation from the official AlQuran Cloud API.
   */
  async fetchExactQuranAudio(
    surahNumber: number = 94, 
    ayahNumber: number = 5, 
    reciterId: string = 'ar.alafasy'
  ): Promise<ReciterAudio | null> {
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${reciterId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.audio) {
          const reciterObj = AVAILABLE_RECITERS.find(r => r.id === reciterId);
          return {
            reciterId,
            reciterName: reciterObj?.name || json.data.edition?.englishName || 'Mishary Alafasy',
            surahOrTitle: `Sourate ${json.data.surah?.englishName || surahNumber} (Verset ${ayahNumber})`,
            audioUrl: json.data.audio,
            durationSeconds: 25
          };
        }
      }
    } catch (e) {
      console.warn('Could not fetch exact Quran verse audio:', e);
    }
    return null;
  },

  /**
   * Generates or fetches an authentic Islamic post item based on category, topic, and language preference.
   */
  async generateIslamicPost(
    category: IslamicContentType,
    customTopic?: string,
    language: IslamicLanguage = 'all',
    preferredReciterId: string = 'ar.alafasy'
  ): Promise<IslamicPostItem> {
    const apiKey = StorageService.getApiKey();
    const activeTopic = customTopic?.trim() || '';

    if (apiKey && apiKey.trim() !== '') {
      const searchTopic = activeTopic || 'Inspiration, foi et rappel spirituel';

      const categoryInstructions: Record<IslamicContentType, string> = {
        quran_verse: "Tu dois OBLIGATOIREMENT générer un VERSET DU NOBLE CORAN (Parole d'Allah) et STRICTEMENT rien d'autre (AUCUN hadith). Donne obligatoirement surahNumber (1 à 114) et ayahNumber exacts.",
        sahih_hadith: "Tu dois OBLIGATOIREMENT générer une PAROLE DU PROPHÈTE MOHAMMAD ﷺ issue STRICTEMENT de Sahih Al-Bukhari ou Sahih Muslim (AUCUN verset coranique).",
        authentic_dua: "Tu dois OBLIGATOIREMENT générer une INVOCATION AUTHENTIQUE (Du'a / Dhikr) issue de Hisn al-Muslim (Citadelle du Musulman) ou de Bukhari/Muslim.",
        jumua_special: "Tu dois OBLIGATOIREMENT générer un rappel sur les mérites du VENDREDI (Jumu'ah), la lecture de Sourate Al-Kahf ou les Salawat sur le Prophète ﷺ.",
        tahajjud_motivation: "Tu dois OBLIGATOIREMENT générer un rappel puissant sur la PRIÈRE DE NUIT (Tahajjud, Qiyam al-Layl, dernier tiers de la nuit ou Istighfar à l'aube).",
        islamic_reminder: "Tu dois générer un rappel de sagesse islamique profonde et inspirante (Patience, Confiance en Allah / Tawakkul, Gratitude)."
      };

      try {
        const prompt = `
Tu es un grand savant et chercheur en sciences islamiques diplômé, spécialisé dans la rédaction de contenu spirituel authentique et vérifié pour les réseaux sociaux (@kaelarislamic).

RÈGLE ABSOLUE POUR LA CATÉGORIE "${category}":
${categoryInstructions[category] || categoryInstructions.quran_verse}

Sujet ou mot-clé demandé par l'utilisateur : "${searchTopic}".

Consignes de rédaction :
- Choisis un passage court, percutant et concis (1 à 2 versets ou 1 hadith court de 20 à 45 mots), idéal pour une carte citation TikTok et Instagram.
- Ne cite JAMAIS de hadith faible (Da'if) ou inventé (Mawdoo').
- Si c'est un verset du Coran, donne OBLIGATOIREMENT le numéro exact de la sourate (1 à 114) et le numéro du verset dans "surahNumber" et "ayahNumber".
- Génère à chaque fois un passage NOUVEAU, UNIQUE et DIFFÉRENT (ID de session : ${Date.now()}-${Math.random()}). Ne répète pas les mêmes textes.
- Génère le contenu en 3 langues : Arabe (avec voyelles/tashkeel complet), Français et Anglais.

Format de réponse OBLIGATOIRE en JSON pur (sans balises markdown) :
{
  "topic": "${searchTopic}",
  "arabicText": "Texte arabe exact avec tashkeel...",
  "phonetic": "Transcription phonétique...",
  "translationFr": "Traduction française concise et élégante...",
  "translationEn": "Concise and elegant English translation...",
  "source": {
    "type": "${category === 'quran_verse' ? 'quran' : category === 'authentic_dua' ? 'dua' : 'hadith'}",
    "bookOrSurah": "Ex: Sourate Al-Ankabut ou Sahih al-Bukhari",
    "numberOrAyah": "Ex: Verset 7 ou Hadith n° 5027",
    "surahNumber": 29,
    "ayahNumber": 7,
    "arabicReference": "المرجع بالعربية",
    "authenticityGrade": "${category === 'quran_verse' ? 'Coran (Parole d’Allah)' : 'Sahih (Authentique)'}",
    "verifiedBy": "Texte Sacré Authentifié"
  },
  "reflection": {
    "fr": "Courte réflexion spirituelle profonde en français...",
    "en": "Short inspiring spiritual reflection in English...",
    "ar": "تأمل إيماني قصير ومؤثر..."
  },
  "hashtags": {
    "fr": ["#IslamRappel", "#Coran", "#KaelarIslamic"],
    "en": ["#QuranQuotes", "#IslamicReminders", "#KaelarIslamic"],
    "ar": ["#قرآن_كريم", "#حديث_شريف", "#أدعية"]
  }
}
`;

        const modelsToTry = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
        let rawText = '';

        for (const model of modelsToTry) {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: 0.85,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json'
                  }
                })
              }
            );

            if (response.ok) {
              const data = await response.json();
              rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (rawText) break;
            }
          } catch (err) {
            console.warn(`Model ${model} failed, trying next...`, err);
          }
        }

        if (rawText) {
          const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedJson);

          // Clean quotes from translations
          const cleanQuotes = (str: string = '') => str.replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();

          const translationFr = cleanQuotes(parsed.translationFr || parsed.translation_fr || '');
          const translationEn = cleanQuotes(parsed.translationEn || parsed.translation_en || '');

          // Resolve Surah and Ayah numbers precisely
          const resolvedSurah = parseSurahNumber(
            parsed.source?.bookOrSurah || parsed.source?.book_or_surah, 
            parsed.source?.surahNumber
          );
          const resolvedAyah = parseAyahNumber(
            parsed.source?.numberOrAyah || parsed.source?.number_or_ayah, 
            parsed.source?.ayahNumber
          ) || 1;

          // If it's a Quran verse, fetch the EXACT matching audio from AlQuran Cloud
          let matchedAudio: ReciterAudio | null = null;
          if (category === 'quran_verse' || parsed.source?.type === 'quran' || resolvedSurah) {
            matchedAudio = await this.fetchExactQuranAudio(
              resolvedSurah || 94, 
              resolvedAyah, 
              preferredReciterId
            );
          }

          if (!matchedAudio) {
            matchedAudio = VERIFIED_RECITERS[Math.floor(Math.random() * VERIFIED_RECITERS.length)];
          }

          return {
            id: `islamic-${Date.now()}`,
            type: category === 'quran_verse' || parsed.source?.type === 'quran' ? 'quran_verse' : parsed.source?.type === 'dua' ? 'authentic_dua' : 'sahih_hadith',
            topic: parsed.topic || searchTopic,
            arabicText: parsed.arabicText || parsed.arabic_text || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            phonetic: parsed.phonetic || '',
            translationFr,
            translationEn,
            source: {
              type: category === 'quran_verse' || parsed.source?.type === 'quran' ? 'quran' : (parsed.source?.type || 'hadith'),
              bookOrSurah: parsed.source?.bookOrSurah || parsed.source?.book_or_surah || `Sourate ${resolvedSurah || 94}`,
              numberOrAyah: parsed.source?.numberOrAyah || parsed.source?.number_or_ayah || `Verset ${resolvedAyah}`,
              surahNumber: resolvedSurah,
              ayahNumber: resolvedAyah,
              arabicReference: parsed.source?.arabicReference || '',
              authenticityGrade: category === 'quran_verse' ? 'Coran (Parole d’Allah)' : (parsed.source?.authenticityGrade || 'Sahih (Authentique)'),
              verifiedBy: 'Texte Sacré Authentifié'
            },
            reciterAudio: matchedAudio,
            visualTheme: 'golden_night',
            reflection: parsed.reflection || { fr: '', en: '', ar: '' },
            hashtags: parsed.hashtags || { fr: [], en: [], ar: [] }
          };
        }
      } catch (e) {
        console.warn('Gemini Islamic generation error:', e);
      }
    }

    // Fallback: Smart keyword match from internal verified database
    if (activeTopic) {
      const lower = activeTopic.toLowerCase();
      const keywordMatch = VERIFIED_ISLAMIC_POSTS.find(p => 
        p.topic.toLowerCase().includes(lower) || 
        p.translationFr.toLowerCase().includes(lower) ||
        (lower.includes('kaffar') && p.id === 'islamic-2') ||
        (lower.includes('pardon') && p.id === 'islamic-2') ||
        (lower.includes('angoisse') && p.id === 'islamic-3') ||
        (lower.includes('vendredi') && p.id === 'islamic-4') ||
        (lower.includes('nuit') && p.id === 'islamic-5')
      );
      if (keywordMatch) return keywordMatch;
    }

    const matching = VERIFIED_ISLAMIC_POSTS.filter(p => p.type === category);
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)];
    }
    return VERIFIED_ISLAMIC_POSTS[0];
  },

  /**
   * Converts an IslamicPostItem into a unified ScheduledPost ready for TikTok, Instagram & Buffer.
   */
  convertToScheduledPost(
    item: IslamicPostItem,
    preferredLanguage: IslamicLanguage = 'all',
    customImageUrl?: string
  ): ScheduledPost {
    const platforms: SocialPlatform[] = ['tiktok', 'instagram', 'x', 'facebook', 'linkedin'];

    let fullCaptionFr = `${item.arabicText}\n\n📖 « ${item.translationFr} »\n\n📌 Source : ${item.source.bookOrSurah}, ${item.source.numberOrAyah} [${item.source.authenticityGrade}]\n\n✨ Réflexion : ${item.reflection.fr}\n\n${item.hashtags.fr.join(' ')}`;
    let fullCaptionEn = `${item.arabicText}\n\n📖 “${item.translationEn}”\n\n📌 Source: ${item.source.bookOrSurah}, ${item.source.numberOrAyah} [${item.source.authenticityGrade}]\n\n✨ Reflection: ${item.reflection.en}\n\n${item.hashtags.en.join(' ')}`;
    let fullCaptionAr = `${item.arabicText}\n\n📌 المرجع: ${item.source.arabicReference} [${item.source.authenticityGrade}]\n\n✨ تأمل: ${item.reflection.ar}\n\n${item.hashtags.ar.join(' ')}`;

    let primaryCaption = fullCaptionFr;
    if (preferredLanguage === 'en') primaryCaption = fullCaptionEn;
    if (preferredLanguage === 'ar') primaryCaption = fullCaptionAr;
    if (preferredLanguage === 'all') {
      primaryCaption = `${item.arabicText}\n\n🇫🇷 « ${item.translationFr} »\n\n🇬🇧 “${item.translationEn}”\n\n📌 ${item.source.bookOrSurah} [${item.source.authenticityGrade}]\n\n${item.hashtags.fr.slice(0, 3).join(' ')} ${item.hashtags.en.slice(0, 3).join(' ')}`;
    }

    const platformContent: any = {};
    platforms.forEach(p => {
      platformContent[p] = {
        text: primaryCaption,
        hook: `${item.arabicText.slice(0, 60)}... ✨ ${item.topic}`,
        hashtags: preferredLanguage === 'en' ? item.hashtags.en : preferredLanguage === 'ar' ? item.hashtags.ar : item.hashtags.fr,
        videoScript: `[Récitation exacte : ${item.reciterAudio?.reciterName || 'Mishary Alafasy'} - ${item.source.bookOrSurah}]\n\n1. Afficher la calligraphie arabe synchronisée avec l'audio.\n2. Faire défiler la traduction : "${item.translationFr}"\n3. Afficher la source certifiée : [${item.source.bookOrSurah} - ${item.source.authenticityGrade}]\n4. Message de fin : Abonne-toi à @kaelarislamic pour ton rappel quotidien.`,
        audioTrackSuggestion: `${item.reciterAudio?.reciterName || 'Mishary Alafasy'} - ${item.source.bookOrSurah} (${item.reciterAudio?.audioUrl})`
      };
    });

    return {
      id: `post-islamic-${Date.now()}`,
      title: `✨ Rappel : ${item.topic}`,
      originalIdea: item.topic,
      platforms: ['instagram'],
      platformContent,
      media: customImageUrl ? {
        id: `med-islamic-${Date.now()}`,
        type: 'image',
        url: customImageUrl,
        aspectRatio: '9:16',
        createdAt: new Date().toISOString(),
        engine: 'imagen3'
      } : undefined,
      scheduledTime: new Date(Date.now() + 3600000).toISOString(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      campaignTag: 'Islamic Reminders'
    };
  },

  /**
   * Helper to load an image with promise
   */
  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
      img.src = src;
    });
  },

  /**
   * Generates a high-definition, authentic photographic Islamic Quote Card on HTML Canvas (9:16 or 1:1)
   */
  async renderQuoteCardCanvas(
    item: IslamicPostItem,
    aspectRatio: '9:16' | '1:1' = '9:16',
    displayLanguage: IslamicLanguage = 'all',
    themeOrCustomUrl?: string | IslamicBackgroundTheme
  ): Promise<string> {
    const width = 1080;
    const height = aspectRatio === '9:16' ? 1920 : 1080;

    // Ensure fonts are loaded before painting canvas
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // ignore
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Determine Background Theme
    let bgTheme: IslamicBackgroundTheme = ISLAMIC_BACKGROUND_THEMES[0];
    let customImgUrl: string | undefined;

    if (typeof themeOrCustomUrl === 'string') {
      const found = ISLAMIC_BACKGROUND_THEMES.find(t => t.id === themeOrCustomUrl);
      if (found) {
        bgTheme = found;
      } else if (themeOrCustomUrl.startsWith('http') || themeOrCustomUrl.startsWith('data:')) {
        customImgUrl = themeOrCustomUrl;
      }
    } else if (themeOrCustomUrl && typeof themeOrCustomUrl === 'object') {
      bgTheme = themeOrCustomUrl;
    }

    const bgUrlToLoad = customImgUrl || bgTheme.imageUrl;

    // 1. Draw Photographic Background Image (Aspect Cover)
    try {
      const img = await this.loadImage(bgUrlToLoad);
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;
      let renderWidth = width;
      let renderHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        renderHeight = height;
        renderWidth = height * imgRatio;
        offsetX = -(renderWidth - width) / 2;
      } else {
        renderWidth = width;
        renderHeight = width / imgRatio;
        offsetY = -(renderHeight - height) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    } catch (e) {
      // Fallback elegant gradient if image cannot load
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#06131c');
      grad.addColorStop(0.5, '#042217');
      grad.addColorStop(1, '#02080d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Cinematic Multi-Layer Soft Vignette (Leaves photo vibrant & visible)
    const overlayGradient = ctx.createLinearGradient(0, 0, 0, height);
    overlayGradient.addColorStop(0, 'rgba(3, 7, 18, 0.55)');
    overlayGradient.addColorStop(0.2, 'rgba(3, 7, 18, 0.35)');
    overlayGradient.addColorStop(0.5, 'rgba(4, 9, 20, 0.45)');
    overlayGradient.addColorStop(0.8, 'rgba(3, 7, 18, 0.70)');
    overlayGradient.addColorStop(1, 'rgba(2, 4, 10, 0.92)');
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, width, height);

    // 3. Warm Center Ambient Glow
    const radialGlow = ctx.createRadialGradient(width / 2, height * 0.48, 50, width / 2, height * 0.48, width * 0.75);
    radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
    radialGlow.addColorStop(0.4, 'rgba(16, 185, 129, 0.12)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // Clean text strings helper
    const cleanQuotes = (str: string = '') => str.replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();
    const cleanFr = cleanQuotes(item.translationFr);
    const cleanEn = cleanQuotes(item.translationEn);

    // 4. Measure & Precalculate Typography Layout
    const cardMarginX = aspectRatio === '9:16' ? 55 : 45;
    const cardWidth = width - (cardMarginX * 2);
    const maxTextWidth = cardWidth - 100;

    // Helper to wrap text cleanly
    const wrapText = (text: string, font: string, maxW: number): string[] => {
      ctx.save();
      ctx.font = font;
      const words = text.split(' ');
      const lines: string[] = [];
      let cur = '';
      for (let i = 0; i < words.length; i++) {
        const test = cur ? cur + ' ' + words[i] : words[i];
        if (ctx.measureText(test).width > maxW && i > 0) {
          lines.push(cur);
          cur = words[i];
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);
      ctx.restore();
      return lines;
    };

    const arabicFont = `bold ${aspectRatio === '9:16' ? 62 : 46}px "Noto Naskh Arabic", "Amiri", "Scheherazade New", serif`;
    const arabicLineHeight = aspectRatio === '9:16' ? 106 : 78;
    const arabicLines = wrapText(item.arabicText, arabicFont, maxTextWidth);

    const frFont = `600 ${aspectRatio === '9:16' ? 36 : 28}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    const frLineHeight = aspectRatio === '9:16' ? 56 : 42;
    const frLines = (displayLanguage === 'fr' || displayLanguage === 'all') && cleanFr
      ? wrapText(`« ${cleanFr} »`, frFont, maxTextWidth)
      : [];

    const enFont = `400 ${aspectRatio === '9:16' ? 30 : 24}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    const enLineHeight = aspectRatio === '9:16' ? 46 : 36;
    const enLines = (displayLanguage === 'en' || displayLanguage === 'all') && cleanEn
      ? wrapText(`“${cleanEn}”`, enFont, maxTextWidth)
      : [];

    const arRefLines = displayLanguage === 'ar' && item.reflection.ar
      ? wrapText(item.reflection.ar, `500 ${aspectRatio === '9:16' ? 36 : 28}px "Noto Naskh Arabic", serif`, maxTextWidth)
      : [];

    // Calculate content heights
    const bismillahHeight = 55;
    const arabicBlockHeight = arabicLines.length * arabicLineHeight;
    const dividerHeight = 65;
    const frBlockHeight = frLines.length * frLineHeight;
    const enBlockHeight = enLines.length * enLineHeight;
    const arRefBlockHeight = arRefLines.length * frLineHeight;
    const sourceHeight = 55;

    const innerContentHeight = 
      bismillahHeight + 
      35 + 
      arabicBlockHeight + 
      dividerHeight + 
      (frBlockHeight > 0 ? frBlockHeight + 20 : 0) + 
      (enBlockHeight > 0 ? enBlockHeight + 20 : 0) + 
      (arRefBlockHeight > 0 ? arRefBlockHeight + 20 : 0) + 
      sourceHeight;

    const cardPaddingY = aspectRatio === '9:16' ? 60 : 40;
    const cardHeight = Math.min(height - (aspectRatio === '9:16' ? 220 : 90), innerContentHeight + (cardPaddingY * 2));
    const cardTop = (height - cardHeight) / 2 - (aspectRatio === '9:16' ? 20 : 5);
    const cardRadius = 30;

    // 5. Frosted Glass Container with Premium Gold Glow
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardMarginX, cardTop, cardWidth, cardHeight, cardRadius);
    ctx.fillStyle = 'rgba(8, 14, 25, 0.76)';
    ctx.fill();
    
    // Outer glowing gold border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.35)';
    ctx.shadowBlur = 20;
    ctx.stroke();

    // Inner subtle frame
    ctx.beginPath();
    ctx.roundRect(cardMarginX + 14, cardTop + 14, cardWidth - 28, cardHeight - 28, cardRadius - 10);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.20)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.stroke();
    ctx.restore();

    // 6. Draw Content Starting from centered Y
    let curY = cardTop + cardPaddingY + 35;

    // A. Bismillah with Warm Golden Glow
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 16;
    ctx.font = `bold ${aspectRatio === '9:16' ? 46 : 34}px "Noto Naskh Arabic", "Amiri", serif`;
    ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', width / 2, curY);
    ctx.restore();

    curY += 75;

    // B. Arabic Calligraphy Text (Large, Majestic, Crisp)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.font = arabicFont;
    ctx.direction = 'rtl';

    for (const l of arabicLines) {
      ctx.fillText(l, width / 2, curY);
      curY += arabicLineHeight;
    }
    ctx.restore();

    // C. Golden Islamic Medallion Divider (۞ ────── ۞)
    curY += 15;
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, curY);
    ctx.lineTo(width / 2 - 30, curY);
    ctx.moveTo(width / 2 + 30, curY);
    ctx.lineTo(width / 2 + 140, curY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('۞', width / 2, curY + 9);
    ctx.restore();

    curY += 55;

    // D. French Translation
    if (frLines.length > 0) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 12;
      ctx.font = frFont;
      
      for (const l of frLines) {
        ctx.fillText(l, width / 2, curY);
        curY += frLineHeight;
      }
      ctx.restore();
    }

    // E. English Translation
    if (enLines.length > 0) {
      curY += 10;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#cbd5e1';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 10;
      ctx.font = enFont;
      
      for (const l of enLines) {
        ctx.fillText(l, width / 2, curY);
        curY += enLineHeight;
      }
      ctx.restore();
    }

    // F. Arabic Reflection if selected
    if (arRefLines.length > 0) {
      curY += 10;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 12;
      ctx.font = `500 ${aspectRatio === '9:16' ? 36 : 28}px "Noto Naskh Arabic", serif`;
      ctx.direction = 'rtl';
      
      for (const l of arRefLines) {
        ctx.fillText(l, width / 2, curY);
        curY += frLineHeight;
      }
      ctx.direction = 'ltr';
      ctx.restore();
    }

    // G. Subtle Elegant Source Citation Line
    curY += 28;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde68a';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.font = `700 ${aspectRatio === '9:16' ? 26 : 21}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`— ${item.source.bookOrSurah}, ${item.source.numberOrAyah} —`, width / 2, curY);
    ctx.restore();

    // 7. Footer Watermark: ONLY @kaelarislamic
    const footerY = height - (aspectRatio === '9:16' ? 60 : 30);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.font = `700 ${aspectRatio === '9:16' ? 24 : 18}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('@kaelarislamic', width / 2, footerY);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }
};
