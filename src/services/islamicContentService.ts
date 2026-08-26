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
Tu es un grand savant et chercheur en sciences islamiques diplômé, spécialisé dans la rédaction de contenu spirituel authentique et vérifié pour les réseaux sociaux (@kaelarislamic & @mdou.g).

Consigne STRICTE :
- N'utilise QUE des versets authentiques du Noble Coran ou des Hadiths SAHIH (Bukhari, Muslim, Tirmidhi, Abu Dawud) ou des invocations authentiques de Hisn al-Muslim (Citadelle du Musulman).
- Ne cite JAMAIS de hadith faible (Da'if) ou inventé (Mawdoo').
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
    "bookOrSurah": "Ex: Sourate Ash-Sharh ou Sahih al-Bukhari",
    "numberOrAyah": "Ex: Verset 5 ou Hadith n° 5027",
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
    "fr": ["#IslamRappel", "#Coran", "#Patience", "#Foi", "#KaelarIslamic"],
    "en": ["#QuranQuotes", "#IslamicReminders", "#Sabr", "#TrustAllah", "#KaelarIslamic"],
    "ar": ["#قرآن_كريم", "#حديث_شريف", "#أدعية", "#راحة_نفسية"]
  }
}
`;

        const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
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
                    maxOutputTokens: 2000,
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
            arabicText: parsed.arabicText,
            phonetic: parsed.phonetic,
            translationFr: parsed.translationFr,
            translationEn: parsed.translationEn,
            source: parsed.source,
            reciterAudio: matchedAudio,
            visualTheme: 'golden_night',
            reflection: parsed.reflection,
            hashtags: parsed.hashtags
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
        videoScript: `[Récitation exacte : ${item.reciterAudio?.reciterName || 'Mishary Alafasy'} - ${item.source.bookOrSurah}]\n\n1. Afficher la calligraphie arabe synchronisée avec l'audio.\n2. Faire défiler la traduction : "${item.translationFr}"\n3. Afficher la source certifiée : [${item.source.bookOrSurah} - ${item.source.authenticityGrade}]\n4. Message de fin : Abonne-toi à @kaelarislamic & @mdou.g pour ton rappel quotidien.`,
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
    overlayGradient.addColorStop(0, 'rgba(4, 7, 14, 0.78)');
    overlayGradient.addColorStop(0.2, 'rgba(4, 7, 14, 0.55)');
    overlayGradient.addColorStop(0.5, 'rgba(6, 12, 22, 0.68)');
    overlayGradient.addColorStop(0.85, 'rgba(4, 7, 14, 0.88)');
    overlayGradient.addColorStop(1, 'rgba(2, 4, 8, 0.96)');
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, width, height);

    // 3. Ambient Gold / Emerald Soft Backlight Glow
    const radialGlow = ctx.createRadialGradient(width / 2, height * 0.45, 80, width / 2, height * 0.45, width * 0.7);
    radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
    radialGlow.addColorStop(0.6, 'rgba(16, 185, 129, 0.08)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 4. Frosted Glassmorphism Center Container (Card with subtle border)
    const cardMarginX = 64;
    const cardTop = aspectRatio === '9:16' ? 140 : 80;
    const cardBottom = aspectRatio === '9:16' ? height - 130 : height - 70;
    const cardWidth = width - (cardMarginX * 2);
    const cardHeight = cardBottom - cardTop;
    const cardRadius = 24;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardMarginX, cardTop, cardWidth, cardHeight, cardRadius);
    ctx.fillStyle = 'rgba(7, 12, 22, 0.55)';
    ctx.fill();
    
    // Golden & Emerald subtle card border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner hairline frame
    ctx.beginPath();
    ctx.roundRect(cardMarginX + 12, cardTop + 12, cardWidth - 24, cardHeight - 24, cardRadius - 8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 5. Ornate Header: Bismillah with Calligraphic Shadow
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
    ctx.shadowBlur = 12;
    ctx.font = 'bold 38px "Amiri", "Traditional Arabic", serif';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, cardTop + (aspectRatio === '9:16' ? 75 : 60));
    ctx.restore();

    // 6. Verified Category Pill Badge
    const badgeY = cardTop + (aspectRatio === '9:16' ? 130 : 105);
    const badgeText = `✨ ${item.source.authenticityGrade.toUpperCase()}`;
    ctx.save();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 170, badgeY - 24, 340, 42, 21);
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 19px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, width / 2, badgeY + 4);
    ctx.restore();

    // 7. Main Arabic Calligraphy Text (Large, Center, Shadowed for High Contrast)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    ctx.font = 'bold 56px "Amiri", "Traditional Arabic", "Scheherazade New", serif';
    ctx.direction = 'rtl';

    const arabicWords = item.arabicText.split(' ');
    let line = '';
    let startY = cardTop + (aspectRatio === '9:16' ? 270 : 190);
    const maxWidth = cardWidth - 140;

    for (let n = 0; n < arabicWords.length; n++) {
      const testLine = line + arabicWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, startY);
        line = arabicWords[n] + ' ';
        startY += 82;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, startY);
    ctx.restore();

    // 8. Golden Islamic Medallion Divider (۞ ────── ۞)
    startY += 50;
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 130, startY);
    ctx.lineTo(width / 2 - 25, startY);
    ctx.moveTo(width / 2 + 25, startY);
    ctx.lineTo(width / 2 + 130, startY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '26px serif';
    ctx.textAlign = 'center';
    ctx.fillText('۞', width / 2, startY + 9);
    ctx.restore();

    // 9. Multilingual Translations (French / English / Arabic Reflection)
    startY += 65;
    const renderTranslationBlock = (text: string, fontSize: number, textColor: string) => {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 10;
      ctx.font = `500 ${fontSize}px Georgia, "Plus Jakarta Sans", serif`;
      
      const words = text.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(currentLine, width / 2, startY);
          currentLine = words[n] + ' ';
          startY += fontSize + 16;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine, width / 2, startY);
      startY += fontSize + 20;
      ctx.restore();
    };

    if (displayLanguage === 'fr' || displayLanguage === 'all') {
      renderTranslationBlock(`« ${item.translationFr} »`, 32, '#f1f5f9');
    }

    if (displayLanguage === 'en' || displayLanguage === 'all') {
      startY += 6;
      renderTranslationBlock(`“${item.translationEn}”`, 27, '#cbd5e1');
    }

    if (displayLanguage === 'ar') {
      startY += 10;
      ctx.direction = 'rtl';
      renderTranslationBlock(item.reflection.ar, 30, '#fef08a');
      ctx.direction = 'ltr';
    }

    // 10. Verified Source Bottom Banner Card
    const sourceCardY = cardBottom - (aspectRatio === '9:16' ? 95 : 75);
    ctx.save();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 280, sourceCardY - 26, 560, 52, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 21px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`📚 ${item.source.bookOrSurah} — ${item.source.numberOrAyah}`, width / 2, sourceCardY + 6);
    ctx.restore();

    // 11. Footer Branding & Social Handle
    const footerY = height - (aspectRatio === '9:16' ? 65 : 28);
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TikTok: @mdou.g  •  Instagram: @kaelarislamic', width / 2, footerY);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }
};
