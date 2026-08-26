/**
 * Kaelar Islamic AI Studio - Islamic Content & Quote Card Service
 * Handles authentic multilingual generation (FR, EN, AR) and Quote Card Canvas rendering.
 */

import type { IslamicPostItem, IslamicContentType, IslamicLanguage, VerifiedSource } from '../types/islamic';
import type { ScheduledPost, SocialPlatform } from '../types/content';
import { VERIFIED_ISLAMIC_POSTS, VERIFIED_RECITERS } from '../data/verifiedIslamicData';
import { StorageService } from './storageService';

export const IslamicContentService = {
  /**
   * Generates or fetches an authentic Islamic post item based on category, topic, and language preference.
   */
  async generateIslamicPost(
    category: IslamicContentType,
    customTopic?: string,
    language: IslamicLanguage = 'all'
  ): Promise<IslamicPostItem> {
    const apiKey = StorageService.getApiKey() || DEFAULT_GEMINI_KEY;

    // If Gemini API is available and custom topic is provided, generate via Gemini with strict Islamic verification prompt
    if (apiKey && customTopic && customTopic.trim() !== '') {
      try {
        const prompt = `
Tu es un grand savant et chercheur en sciences islamiques diplômé, spécialisé dans la rédaction de contenu spirituel authentique et vérifié pour les réseaux sociaux (@kaelarislamic & @mdou.g).

Consigne STRICTE :
- N'utilise QUE des versets authentiques du Noble Coran ou des Hadiths SAHIH (Bukhari, Muslim, Tirmidhi, Abu Dawud) ou des invocations authentiques de Hisn al-Muslim (Citadelle du Musulman).
- Ne cite JAMAIS de hadith faible (Da'if) ou inventé (Mawdoo').
- Fournis TOUJOURS la référence exacte (Nom du livre + Numéro de hadith ou Nom de sourate + numéro de verset).
- Génère le contenu en 3 langues : Arabe (avec voyelles/tashkeel complet), Français et Anglais.

Sujet demandé : "${customTopic}" (Catégorie : "${category}")

Format de réponse OBLIGATOIRE en JSON pur (sans balises markdown) :
{
  "topic": "${customTopic}",
  "arabicText": "Texte arabe exact avec tashkeel...",
  "phonetic": "Transcription phonétique...",
  "translationFr": "Traduction française fidèle et élégante...",
  "translationEn": "Faithful and elegant English translation...",
  "source": {
    "type": "${category === 'quran_verse' ? 'quran' : category === 'authentic_dua' ? 'dua' : 'hadith'}",
    "bookOrSurah": "Ex: Sahih al-Bukhari ou Sourate Al-Baqarah",
    "numberOrAyah": "Ex: Hadith n° 5027 ou Verset 286",
    "arabicReference": "المرجع بالعربية",
    "authenticityGrade": "Sahih Muslim",
    "verifiedBy": "Imam Muslim (Authentique)"
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
          const randomReciter = VERIFIED_RECITERS[Math.floor(Math.random() * VERIFIED_RECITERS.length)];

          return {
            id: `islamic-${Date.now()}`,
            type: category,
            topic: parsed.topic || customTopic,
            arabicText: parsed.arabicText,
            phonetic: parsed.phonetic,
            translationFr: parsed.translationFr,
            translationEn: parsed.translationEn,
            source: parsed.source,
            reciterAudio: randomReciter,
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

    // Construct multilingual captions
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
        videoScript: `[Audio Coran en fond : ${item.reciterAudio?.reciterName || 'Mishary Alafasy'}]\n\n1. Afficher le texte arabe avec calligraphie dorée.\n2. Faire défiler la traduction : "${item.translationFr}"\n3. Afficher la source certifiée : [${item.source.bookOrSurah} - ${item.source.authenticityGrade}]\n4. Message de fin : Abonne-toi à @kaelarislamic & @mdou.g pour ton rappel quotidien.`,
        audioTrackSuggestion: `${item.reciterAudio?.reciterName || 'Mishary Alafasy'} - ${item.source.bookOrSurah}`
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
   * Generates a high-definition Islamic Quote Card on HTML Canvas (9:16 or 1:1)
   */
  async renderQuoteCardCanvas(
    item: IslamicPostItem,
    aspectRatio: '9:16' | '1:1' = '9:16',
    displayLanguage: IslamicLanguage = 'all'
  ): Promise<string> {
    const width = 1080;
    const height = aspectRatio === '9:16' ? 1920 : 1080;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // 1. Background Gradient (Majestic Islamic Night / Emerald Gradient)
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    if (item.visualTheme === 'golden_night') {
      grad.addColorStop(0, '#0a0d14');
      grad.addColorStop(0.5, '#0d1527');
      grad.addColorStop(1, '#05070c');
    } else if (item.visualTheme === 'emerald_mosque') {
      grad.addColorStop(0, '#042217');
      grad.addColorStop(0.5, '#064e3b');
      grad.addColorStop(1, '#021810');
    } else if (item.visualTheme === 'desert_dunes') {
      grad.addColorStop(0, '#1c1307');
      grad.addColorStop(0.5, '#2d1b09');
      grad.addColorStop(1, '#0f0a04');
    } else {
      grad.addColorStop(0, '#05070d');
      grad.addColorStop(0.5, '#0b1120');
      grad.addColorStop(1, '#020408');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Star Particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Elegant Gold Geometric Border Frame
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // 4. Header Badge (Bismillah)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Traditional Arabic", "Amiri", serif';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, aspectRatio === '9:16' ? 200 : 130);

    // 5. Category Pill / Badge
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    const badgeY = aspectRatio === '9:16' ? 260 : 180;
    ctx.fillRect(width / 2 - 160, badgeY - 26, 320, 44);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.strokeRect(width / 2 - 160, badgeY - 26, 320, 44);

    ctx.fillStyle = '#10b981';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`✨ ${item.source.authenticityGrade.toUpperCase()}`, width / 2, badgeY + 4);

    // 6. Main Arabic Calligraphy Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px "Traditional Arabic", "Amiri", "Scheherazade New", serif';
    ctx.direction = 'rtl';
    
    // Multi-line Arabic wrap
    const arabicWords = item.arabicText.split(' ');
    let line = '';
    let startY = aspectRatio === '9:16' ? 440 : 300;
    const maxWidth = width - 180;

    for (let n = 0; n < arabicWords.length; n++) {
      const testLine = line + arabicWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, startY);
        line = arabicWords[n] + ' ';
        startY += 80;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, startY);
    ctx.direction = 'ltr';

    // 7. Golden Ornamental Divider
    startY += 50;
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, startY);
    ctx.lineTo(width / 2 + 120, startY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '24px serif';
    ctx.fillText('۞', width / 2, startY + 8);

    // 8. Translation Texts (French and/or English or Arabic Reflection)
    startY += 60;
    const renderWrappedText = (text: string, fontSize: number, color: string) => {
      ctx.fillStyle = color;
      ctx.font = `italic ${fontSize}px Georgia, serif`;
      const words = text.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(currentLine, width / 2, startY);
          currentLine = words[n] + ' ';
          startY += fontSize + 14;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine, width / 2, startY);
      startY += fontSize + 16;
    };

    if (displayLanguage === 'fr' || displayLanguage === 'all') {
      renderWrappedText(`« ${item.translationFr} »`, 30, '#cbd5e1');
    }

    if (displayLanguage === 'en' || displayLanguage === 'all') {
      startY += 8;
      renderWrappedText(`“${item.translationEn}”`, 26, '#94a3b8');
    }

    if (displayLanguage === 'ar') {
      startY += 10;
      ctx.direction = 'rtl';
      renderWrappedText(item.reflection.ar, 28, '#f59e0b');
      ctx.direction = 'ltr';
    }

    // 9. Verified Reference Gold Badge
    const footerSourceY = aspectRatio === '9:16' ? height - 200 : height - 120;
    ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
    ctx.fillRect(width / 2 - 300, footerSourceY - 30, 600, 56);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width / 2 - 300, footerSourceY - 30, 600, 56);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`📚 ${item.source.bookOrSurah} — ${item.source.numberOrAyah}`, width / 2, footerSourceY + 6);

    // 10. Channel Handle Branding Footer
    const handleY = aspectRatio === '9:16' ? height - 90 : height - 40;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('TikTok: @mdou.g  •  Instagram: @kaelarislamic', width / 2, handleY);

    return canvas.toDataURL('image/png');
  }
};
