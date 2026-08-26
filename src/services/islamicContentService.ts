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
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.sudais', name: 'Abdul Rahman Al-Sudais' }
];

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
      const searchTopic = activeTopic || 'La foi, la patience et le pardon en Islam';
      try {
        const prompt = `
Tu es un grand savant et chercheur en sciences islamiques diplômé, spécialisé dans la rédaction de contenu spirituel authentique et vérifié pour les réseaux sociaux (@kaelarislamic).

Consigne STRICTE :
- N'utilise QUE des versets authentiques du Noble Coran ou des Hadiths SAHIH (Bukhari, Muslim, Tirmidhi, Abu Dawud) ou des invocations authentiques de Hisn al-Muslim (Citadelle du Musulman).
- Ne cite JAMAIS de hadith faible (Da'if) ou inventé (Mawdoo').
- Sujet demandé par l'utilisateur : "${searchTopic}".
- Trouve le verset coranique le plus majestueux, le hadith sahih le plus pertinent ou la meilleure invocation pour ce sujet précis (« ${searchTopic} »).
- Fournis TOUJOURS la référence exacte (Nom du livre + Numéro de hadith ou Nom de sourate + numéro de verset).
- Si c'est un verset du Coran, donne OBLIGATOIREMENT le numéro exact de la sourate (1 à 114) et le numéro du verset dans "surahNumber" et "ayahNumber".
- Génère le contenu en 3 langues : Arabe (avec voyelles/tashkeel complet), Français et Anglais.

Format de réponse OBLIGATOIRE en JSON pur (sans balises markdown) :
{
  "topic": "${searchTopic}",
  "arabicText": "Texte arabe exact avec tashkeel...",
  "phonetic": "Transcription phonétique...",
  "translationFr": "Traduction française fidèle et élégante...",
  "translationEn": "Faithful and elegant English translation...",
  "source": {
    "type": "quran",
    "bookOrSurah": "Sourate ... ou Sahih al-Bukhari",
    "numberOrAyah": "Verset ... ou Hadith n° ...",
    "surahNumber": 11,
    "ayahNumber": 114,
    "arabicReference": "المرجع بالعربية",
    "authenticityGrade": "Coran (Parole d’Allah)",
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
                    temperature: 0.2,
                    maxOutputTokens: 2048,
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

          // If it's a Quran verse, fetch the EXACT matching audio from AlQuran Cloud
          let matchedAudio: ReciterAudio | null = null;
          if (parsed.source?.type === 'quran' && parsed.source?.surahNumber && parsed.source?.ayahNumber) {
            matchedAudio = await this.fetchExactQuranAudio(
              Number(parsed.source.surahNumber), 
              Number(parsed.source.ayahNumber), 
              preferredReciterId
            );
          }

          if (!matchedAudio) {
            matchedAudio = VERIFIED_RECITERS[Math.floor(Math.random() * VERIFIED_RECITERS.length)];
          }

          return {
            id: `islamic-${Date.now()}`,
            type: parsed.source?.type === 'quran' ? 'quran_verse' : parsed.source?.type === 'dua' ? 'authentic_dua' : 'sahih_hadith',
            topic: parsed.topic || searchTopic,
            arabicText: parsed.arabicText || parsed.arabic_text || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            phonetic: parsed.phonetic || '',
            translationFr,
            translationEn,
            source: {
              type: parsed.source?.type || (category === 'quran_verse' ? 'quran' : 'hadith'),
              bookOrSurah: parsed.source?.bookOrSurah || parsed.source?.book_or_surah || 'Coran & Sunnah',
              numberOrAyah: parsed.source?.numberOrAyah || parsed.source?.number_or_ayah || 'Authentifié',
              surahNumber: parsed.source?.surahNumber ? Number(parsed.source.surahNumber) : undefined,
              ayahNumber: parsed.source?.ayahNumber ? Number(parsed.source.ayahNumber) : undefined,
              arabicReference: parsed.source?.arabicReference || '',
              authenticityGrade: parsed.source?.authenticityGrade || 'Sahih (Authentique)',
              verifiedBy: parsed.source?.verifiedBy || 'Sources Islamiques Vérifiées'
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
      platforms: ['tiktok', 'instagram'],
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

    // 2. Cinematic Multi-Layer Dark Vignette
    const overlayGradient = ctx.createLinearGradient(0, 0, 0, height);
    overlayGradient.addColorStop(0, 'rgba(4, 7, 14, 0.88)');
    overlayGradient.addColorStop(0.25, 'rgba(4, 7, 14, 0.65)');
    overlayGradient.addColorStop(0.5, 'rgba(6, 12, 22, 0.76)');
    overlayGradient.addColorStop(0.85, 'rgba(4, 7, 14, 0.90)');
    overlayGradient.addColorStop(1, 'rgba(2, 4, 8, 0.98)');
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, width, height);

    // 3. Subtle Center Ambient Glow
    const radialGlow = ctx.createRadialGradient(width / 2, height * 0.5, 60, width / 2, height * 0.5, width * 0.7);
    radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
    radialGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // Clean text strings helper
    const cleanQuotes = (str: string = '') => str.replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();
    const cleanFr = cleanQuotes(item.translationFr);
    const cleanEn = cleanQuotes(item.translationEn);

    // 4. Measure & Precalculate Typography Layout
    const cardMarginX = aspectRatio === '9:16' ? 90 : 70;
    const cardWidth = width - (cardMarginX * 2);
    const maxTextWidth = cardWidth - 120;

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

    const arabicFont = `bold ${aspectRatio === '9:16' ? 52 : 42}px "Noto Naskh Arabic", "Amiri", "Scheherazade New", serif`;
    const arabicLineHeight = aspectRatio === '9:16' ? 92 : 72;
    const arabicLines = wrapText(item.arabicText, arabicFont, maxTextWidth);

    const frFont = `500 ${aspectRatio === '9:16' ? 31 : 25}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    const frLineHeight = aspectRatio === '9:16' ? 48 : 38;
    const frLines = (displayLanguage === 'fr' || displayLanguage === 'all') && cleanFr
      ? wrapText(`« ${cleanFr} »`, frFont, maxTextWidth)
      : [];

    const enFont = `400 ${aspectRatio === '9:16' ? 26 : 22}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    const enLineHeight = aspectRatio === '9:16' ? 40 : 32;
    const enLines = (displayLanguage === 'en' || displayLanguage === 'all') && cleanEn
      ? wrapText(`“${cleanEn}”`, enFont, maxTextWidth)
      : [];

    const arRefLines = displayLanguage === 'ar' && item.reflection.ar
      ? wrapText(item.reflection.ar, `500 ${aspectRatio === '9:16' ? 32 : 26}px "Noto Naskh Arabic", serif`, maxTextWidth)
      : [];

    // Calculate content heights
    const bismillahHeight = 50;
    const arabicBlockHeight = arabicLines.length * arabicLineHeight;
    const dividerHeight = 60;
    const frBlockHeight = frLines.length * frLineHeight;
    const enBlockHeight = enLines.length * enLineHeight;
    const arRefBlockHeight = arRefLines.length * frLineHeight;
    const sourceHeight = 45;

    const innerContentHeight = 
      bismillahHeight + 
      30 + 
      arabicBlockHeight + 
      dividerHeight + 
      (frBlockHeight > 0 ? frBlockHeight + 15 : 0) + 
      (enBlockHeight > 0 ? enBlockHeight + 15 : 0) + 
      (arRefBlockHeight > 0 ? arRefBlockHeight + 15 : 0) + 
      sourceHeight;

    const cardPaddingY = aspectRatio === '9:16' ? 55 : 35;
    const cardHeight = Math.min(height - (aspectRatio === '9:16' ? 240 : 100), innerContentHeight + (cardPaddingY * 2));
    const cardTop = (height - cardHeight) / 2 - (aspectRatio === '9:16' ? 25 : 5);
    const cardRadius = 26;

    // 5. Frosted Glass Container
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardMarginX, cardTop, cardWidth, cardHeight, cardRadius);
    ctx.fillStyle = 'rgba(7, 12, 22, 0.72)';
    ctx.fill();
    
    // Golden border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.38)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner subtle gold frame
    ctx.beginPath();
    ctx.roundRect(cardMarginX + 12, cardTop + 12, cardWidth - 24, cardHeight - 24, cardRadius - 8);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 6. Draw Content Starting from centered Y
    let curY = cardTop + cardPaddingY + 30;

    // A. Bismillah with Warm Golden Glow
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 12;
    ctx.font = `bold ${aspectRatio === '9:16' ? 42 : 32}px "Noto Naskh Arabic", "Amiri", serif`;
    ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', width / 2, curY);
    ctx.restore();

    curY += 65;

    // B. Arabic Calligraphy Text
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    ctx.font = arabicFont;
    ctx.direction = 'rtl';

    for (const l of arabicLines) {
      ctx.fillText(l, width / 2, curY);
      curY += arabicLineHeight;
    }
    ctx.restore();

    // C. Golden Islamic Medallion Divider (۞ ────── ۞)
    curY += 10;
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, curY);
    ctx.lineTo(width / 2 - 25, curY);
    ctx.moveTo(width / 2 + 25, curY);
    ctx.lineTo(width / 2 + 120, curY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('۞', width / 2, curY + 8);
    ctx.restore();

    curY += 45;

    // D. French Translation
    if (frLines.length > 0) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 10;
      ctx.font = frFont;
      
      for (const l of frLines) {
        ctx.fillText(l, width / 2, curY);
        curY += frLineHeight;
      }
      ctx.restore();
    }

    // E. English Translation
    if (enLines.length > 0) {
      curY += 8;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#cbd5e1';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 8;
      ctx.font = enFont;
      
      for (const l of enLines) {
        ctx.fillText(l, width / 2, curY);
        curY += enLineHeight;
      }
      ctx.restore();
    }

    // F. Arabic Reflection if selected
    if (arRefLines.length > 0) {
      curY += 8;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 10;
      ctx.font = `500 ${aspectRatio === '9:16' ? 32 : 26}px "Noto Naskh Arabic", serif`;
      ctx.direction = 'rtl';
      
      for (const l of arRefLines) {
        ctx.fillText(l, width / 2, curY);
        curY += frLineHeight;
      }
      ctx.direction = 'ltr';
      ctx.restore();
    }

    // G. Subtle Elegant Source Citation Line
    curY += 22;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 8;
    ctx.font = `600 ${aspectRatio === '9:16' ? 23 : 19}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`— ${item.source.bookOrSurah}, ${item.source.numberOrAyah} —`, width / 2, curY);
    ctx.restore();

    // 7. Footer Watermark: ONLY @kaelarislamic
    const footerY = height - (aspectRatio === '9:16' ? 55 : 25);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 10;
    ctx.font = '700 23px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('@kaelarislamic', width / 2, footerY);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }
};
