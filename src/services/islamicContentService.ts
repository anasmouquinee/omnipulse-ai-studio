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

    if (apiKey && apiKey.trim() !== '') {
      const activeTopic = customTopic?.trim() || 'La patience, le repentir et la miséricorde d’Allah';
      try {
        const prompt = `
Tu es un grand savant et chercheur en sciences islamiques diplômé, spécialisé dans la rédaction de contenu spirituel authentique et vérifié pour les réseaux sociaux (@kaelarislamic).

Consigne STRICTE :
- N'utilise QUE des versets authentiques du Noble Coran ou des Hadiths SAHIH (Bukhari, Muslim, Tirmidhi, Abu Dawud) ou des invocations authentiques de Hisn al-Muslim (Citadelle du Musulman).
- Ne cite JAMAIS de hadith faible (Da'if) ou inventé (Mawdoo').
- Si le sujet demandé est "${activeTopic}", trouve le verset coranique ou le hadith sahih le plus pertinent pour ce thème précis.
- Fournis TOUJOURS la référence exacte (Nom du livre + Numéro de hadith ou Nom de sourate + numéro de verset).
- Si c'est un verset du Coran, donne OBLIGATOIREMENT le numéro exact de la sourate (1 à 114) et le numéro du verset dans "surahNumber" et "ayahNumber".
- Génère le contenu en 3 langues : Arabe (avec voyelles/tashkeel complet), Français et Anglais.

Sujet demandé : "${activeTopic}" (Catégorie : "${category}")

Format de réponse OBLIGATOIRE en JSON pur (sans balises markdown) :
{
  "topic": "${activeTopic}",
  "arabicText": "Texte arabe exact avec tashkeel...",
  "phonetic": "Transcription phonétique...",
  "translationFr": "Traduction française fidèle et élégante...",
  "translationEn": "Faithful and elegant English translation...",
  "source": {
    "type": "${category === 'quran_verse' ? 'quran' : category === 'authentic_dua' ? 'dua' : 'hadith'}",
    "bookOrSurah": "Sourate ... ou Sahih al-Bukhari",
    "numberOrAyah": "Verset ... ou Hadith n° ...",
    "surahNumber": 94,
    "ayahNumber": 5,
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

        const modelsToTry = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash'];
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
                    temperature: 0.25,
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
            type: category,
            topic: parsed.topic || activeTopic,
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

    // Fallback to verified internal database
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

    // 2. Cinematic Dark Multi-Vignette (Top, Bottom, and Radial Glow)
    const overlayGradient = ctx.createLinearGradient(0, 0, 0, height);
    overlayGradient.addColorStop(0, 'rgba(4, 7, 14, 0.85)');
    overlayGradient.addColorStop(0.2, 'rgba(4, 7, 14, 0.60)');
    overlayGradient.addColorStop(0.5, 'rgba(6, 12, 22, 0.72)');
    overlayGradient.addColorStop(0.85, 'rgba(4, 7, 14, 0.90)');
    overlayGradient.addColorStop(1, 'rgba(2, 4, 8, 0.98)');
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, width, height);

    // 3. Ambient Gold / Emerald Soft Backlight Glow
    const radialGlow = ctx.createRadialGradient(width / 2, height * 0.48, 100, width / 2, height * 0.48, width * 0.8);
    radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
    radialGlow.addColorStop(0.6, 'rgba(16, 185, 129, 0.08)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // Clean text strings helper
    const cleanQuotes = (str: string = '') => str.replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();
    const cleanFr = cleanQuotes(item.translationFr);
    const cleanEn = cleanQuotes(item.translationEn);

    // 4. Measure & Precalculate Typography Layout for Perfect Centering
    const maxContentWidth = width - 180;

    // Helper to split text into lines
    const getLines = (text: string, font: string, maxW: number): string[] => {
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

    const arabicFontSize = aspectRatio === '9:16' ? 62 : 46;
    const arabicLineHeight = aspectRatio === '9:16' ? 95 : 70;
    const arabicLines = getLines(item.arabicText, `bold ${arabicFontSize}px "Amiri", serif`, maxContentWidth);

    const frFontSize = aspectRatio === '9:16' ? 36 : 28;
    const frLineHeight = frFontSize + 20;
    const frLines = (displayLanguage === 'fr' || displayLanguage === 'all') && cleanFr
      ? getLines(`« ${cleanFr} »`, `500 ${frFontSize}px Georgia, serif`, maxContentWidth)
      : [];

    const enFontSize = aspectRatio === '9:16' ? 30 : 24;
    const enLineHeight = enFontSize + 16;
    const enLines = (displayLanguage === 'en' || displayLanguage === 'all') && cleanEn
      ? getLines(`“${cleanEn}”`, `italic 400 ${enFontSize}px Georgia, serif`, maxContentWidth)
      : [];

    const arRefLines = displayLanguage === 'ar' && item.reflection.ar
      ? getLines(item.reflection.ar, `500 ${frFontSize}px "Amiri", serif`, maxContentWidth)
      : [];

    // Calculate total height of inner content
    const bismillahHeight = 60;
    const arabicBlockHeight = arabicLines.length * arabicLineHeight;
    const dividerHeight = 70;
    const frBlockHeight = frLines.length * frLineHeight;
    const enBlockHeight = enLines.length * enLineHeight;
    const arRefBlockHeight = arRefLines.length * frLineHeight;
    const sourceHeight = 60;

    const totalContentHeight = 
      bismillahHeight + 
      30 + // gap
      arabicBlockHeight + 
      dividerHeight + 
      frBlockHeight + 
      (enBlockHeight > 0 ? enBlockHeight + 15 : 0) + 
      (arRefBlockHeight > 0 ? arRefBlockHeight + 15 : 0) + 
      sourceHeight;

    // Centered Card Coordinates
    const cardPaddingY = aspectRatio === '9:16' ? 60 : 40;
    const cardHeight = Math.min(height - (aspectRatio === '9:16' ? 260 : 120), totalContentHeight + (cardPaddingY * 2));
    const cardMarginX = 60;
    const cardWidth = width - (cardMarginX * 2);
    const cardTop = (height - cardHeight) / 2 - (aspectRatio === '9:16' ? 30 : 10);
    const cardRadius = 24;

    // 5. Frosted Glassmorphism Center Container (Harmoniously Centered)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardMarginX, cardTop, cardWidth, cardHeight, cardRadius);
    ctx.fillStyle = 'rgba(7, 12, 22, 0.65)';
    ctx.fill();
    
    // Golden border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.40)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner hairline frame
    ctx.beginPath();
    ctx.roundRect(cardMarginX + 10, cardTop + 10, cardWidth - 20, cardHeight - 20, cardRadius - 8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 6. Draw Content Starting from centered Y
    let curY = cardTop + cardPaddingY + 30;

    // A. Bismillah
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 14;
    ctx.font = `bold ${aspectRatio === '9:16' ? 44 : 34}px "Amiri", serif`;
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, curY);
    ctx.restore();

    curY += 65;

    // B. Arabic Calligraphy Text
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 4;
    ctx.font = `bold ${arabicFontSize}px "Amiri", "Scheherazade New", serif`;
    ctx.direction = 'rtl';

    for (const l of arabicLines) {
      ctx.fillText(l, width / 2, curY);
      curY += arabicLineHeight;
    }
    ctx.restore();

    // C. Golden Islamic Medallion Divider (۞ ────── ۞)
    curY += 10;
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, curY);
    ctx.lineTo(width / 2 - 25, curY);
    ctx.moveTo(width / 2 + 25, curY);
    ctx.lineTo(width / 2 + 120, curY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '26px serif';
    ctx.textAlign = 'center';
    ctx.fillText('۞', width / 2, curY + 9);
    ctx.restore();

    curY += 50;

    // D. French Translation
    if (frLines.length > 0) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 12;
      ctx.font = `500 ${frFontSize}px Georgia, serif`;
      
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
      ctx.shadowBlur = 10;
      ctx.font = `italic 400 ${enFontSize}px Georgia, serif`;
      
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
      ctx.shadowBlur = 12;
      ctx.font = `500 ${frFontSize}px "Amiri", serif`;
      ctx.direction = 'rtl';
      
      for (const l of arRefLines) {
        ctx.fillText(l, width / 2, curY);
        curY += frLineHeight;
      }
      ctx.direction = 'ltr';
      ctx.restore();
    }

    // G. Subtle Elegant Source Citation Line
    curY += 24;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.font = `600 ${aspectRatio === '9:16' ? 24 : 19}px Georgia, "Plus Jakarta Sans", serif`;
    ctx.fillText(`— ${item.source.bookOrSurah}, ${item.source.numberOrAyah} —`, width / 2, curY);
    ctx.restore();

    // 7. Footer Watermark: ONLY @kaelarislamic
    const footerY = height - (aspectRatio === '9:16' ? 60 : 30);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 10;
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('@kaelarislamic', width / 2, footerY);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }
};
