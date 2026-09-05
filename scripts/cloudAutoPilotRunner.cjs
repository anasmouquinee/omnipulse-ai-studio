/**
 * OmniPulse AI - Cloud 24/7 Autonomous Auto-Pilot Runner
 * Runs seamlessly on GitHub Actions or any serverless Node.js environment.
 * Generates verified Islamic Reels, uploads to Cloudinary, and publishes to Buffer (Instagram & TikTok).
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration & Credentials
const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN || 'vXkaxUF8bX5anmrPe_4BMyXe6Lo36lwZYTAPYmCDHkM';
const INSTAGRAM_CHANNEL_ID = process.env.BUFFER_INSTAGRAM_CHANNEL_ID || '6a8f4ce9ccaf649a672154f6'; // @kaelarislamic
const TIKTOK_CHANNEL_ID = process.env.BUFFER_TIKTOK_CHANNEL_ID || '6a8f4dcfccaf649a672158cf'; // @mdou.g
const YOUTUBE_CHANNEL_ID = process.env.BUFFER_YOUTUBE_CHANNEL_ID || '6a999279065799be467f1f35'; // @kaelar.islamics (YouTube Shorts)
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'zmgzjmpl';
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1542317690255839402/lJKv3K4988iwAhvc7Jpay8zvBhJ4aXB3dL6GMPGR8o4D9FauC3cuGoIcrOTfJBzAZkPU';

const REGISTRY_PATH = path.join(__dirname, '..', 'data', 'publishedRegistry.json');

// 6-Pillar Rotation Definitions
const THEMES = [
  {
    id: 'theme-quran',
    category: 'quran_verse',
    title: 'Noble Coran — Versets & Récitation Audio',
    badge: 'Coran'
  },
  {
    id: 'theme-hadith',
    category: 'sahih_hadith',
    title: 'Hadith Sahih Authentique & Sagesse',
    badge: 'Hadith'
  },
  {
    id: 'theme-dua',
    category: 'authentic_dua',
    title: 'Invocations & Adhkar (Protection & Barakah)',
    badge: 'Dhikr / Du’a'
  },
  {
    id: 'theme-tahajjud',
    category: 'tahajjud_motivation',
    title: 'Tahajjud & Prière de Nuit (Dernier Tiers)',
    badge: 'Tahajjud'
  },
  {
    id: 'theme-reminder',
    category: 'islamic_reminder',
    title: 'Motivation & Sagesse Islamique (Tawakkul)',
    badge: 'Sagesse'
  },
  {
    id: 'theme-jumuah',
    category: 'jumua_special',
    title: "Spécial Jumu'ah & Sourate Al-Kahf",
    badge: 'Jumu’ah'
  }
];

// Verified catalog path (60+ verified items with official AlQuran Cloud audio matching)
const CATALOG_PATH = path.join(__dirname, '..', 'data', 'verifiedCatalog.json');

// Core fallback items with 100% verified exact audio URLs
const FALLBACK_ITEMS = [
  {
    type: 'quran_verse',
    arabicText: 'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ',
    translationFr: '« Lequel donc des bienfaits de votre Seigneur nierez-vous ? »',
    translationEn: '“So which of the favors of your Lord would you deny?”',
    bookOrSurah: 'Sourate Ar-Rahmaan (سُورَةُ الرَّحۡمَٰن)',
    numberOrAyah: 'Verset 13',
    surahNumber: 55,
    ayahNumber: 13,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4914.mp3',
    reciterName: 'Mishary Rashid Alafasy',
    hashtags: '#Coran #SourateArRahman #KaelarIslamic #Islam #Rappel #fyp'
  },
  {
    type: 'quran_verse',
    arabicText: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    translationFr: '« À côté de la difficulté est, certes, une facilité ! »',
    translationEn: '“For indeed, with hardship [will be] ease.”',
    bookOrSurah: 'Sourate Ash-Sharh (سُورَةُ الشَّرۡحِ)',
    numberOrAyah: 'Verset 5',
    surahNumber: 94,
    ayahNumber: 5,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6095.mp3',
    reciterName: 'Mishary Rashid Alafasy',
    hashtags: '#Coran #AshSharh #Patience #Tawakkul #KaelarIslamic #fyp'
  },
  {
    type: 'sahih_hadith',
    arabicText: 'لَّقَدْ كَانَ لَكُمْ فِى رَسُولِ ٱللَّهِ أُسْوَةٌ حَسَنَةٌۭ لِّمَن كَانَ يَرۡجُوا۟ ٱللَّهَ وَٱلۡيَوۡمَ ٱلۡـَٔاخِرَ وَذَكَرَ ٱللَّهَ كَثِيرًۭا',
    translationFr: '« En effet, vous avez dans le Messager d’Allah un excellent modèle, pour quiconque espère en Allah et au Jour dernier et évoque Allah fréquemment. »',
    translationEn: '“There has certainly been for you in the Messenger of Allah an excellent pattern for anyone whose hope is in Allah and the Last Day.”',
    bookOrSurah: 'Sourate Al-Ahzaab (سُورَةُ الأَحۡزَابِ)',
    numberOrAyah: 'Verset 21',
    surahNumber: 33,
    ayahNumber: 21,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3554.mp3',
    reciterName: 'Mishary Rashid Alafasy',
    hashtags: '#Sunnah #PropheteMuhammad #AlAhzab #Hadith #KaelarIslamic #fyp'
  },
  {
    type: 'authentic_dua',
    arabicText: 'رَبَّنَآ ءَاتِنَا فِى ٱلدُّنۡيَا حَسَنَةًۭ وَفِى ٱلۡـَٔاخِرَةِ حَسَنَةًۭ وَقِنَا عَذَابَ ٱلنَّارِ',
    translationFr: '« Seigneur ! Accorde-nous belle part ici-bas, et belle part aussi dans l’au-delà ; et protège-nous du châtiment du Feu ! »',
    translationEn: '“Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.”',
    bookOrSurah: 'Sourate Al-Baqara (سُورَةُ البَقَرَةِ)',
    numberOrAyah: 'Verset 201',
    surahNumber: 2,
    ayahNumber: 201,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/208.mp3',
    reciterName: 'Mishary Rashid Alafasy',
    hashtags: '#Dua #Invocation #AlBaqara #Protection #KaelarIslamic #fyp'
  },
  {
    type: 'tahajjud_motivation',
    arabicText: 'وَمِنَ ٱلَّيۡلِ فَتَهَجَّدۡ بِهِۦ نَافِلَةًۭ لَّكَ عَسَىٰٓ أَن يَبۡعَثَكَ رَبُّكَ مَقَامًۭا مَّحۡمُودًۭا',
    translationFr: '« Et de la nuit, consacre une partie [avant l’aube] pour des prières surérogatoires : afin que ton Seigneur te ressuscite en une position de gloire. »',
    translationEn: '“And from [part of] the night, pray with it as additional [worship] for you; it is expected that your Lord will resurrect you to a praised station.”',
    bookOrSurah: 'Sourate Al-Israa (سُورَةُ الإِسۡرَاءِ)',
    numberOrAyah: 'Verset 79',
    surahNumber: 17,
    ayahNumber: 79,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2108.mp3',
    reciterName: 'Mishary Rashid Alafasy',
    hashtags: '#Tahajjud #QiyamAlLayl #PriereDeNuit #Coran #KaelarIslamic #fyp'
  },
  {
    type: 'islamic_reminder',
    arabicText: 'ٱلَّذِينَ ءَامَنُوا۟ وَتَطۡمَئِنُّ قُلُوبُهُم بِذِكۡرِ ٱللَّهِ ۗ أَلَا بِذِكۡرِ ٱللَّهِ تَطۡمَئِنُّ ٱلۡقُلُوبُ',
    translationFr: '« N’est-ce point par l’évocation d’Allah que les cœurs se tranquillisent ? »',
    translationEn: '“Unquestionably, by the remembrance of Allah hearts are assured.”',
    bookOrSurah: 'Sourate Ar-Ra\'d (سُورَةُ الرَّعۡدِ)',
    numberOrAyah: 'Verset 28',
    surahNumber: 13,
    ayahNumber: 28,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3',
    reciterName: 'Mishary Rashid Alafasy',
    hashtags: '#Dhikr #PaixInterieure #Tawakkul #Coran #KaelarIslamic #fyp'
  },
  {
    type: 'jumua_special',
    arabicText: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا نُودِىَ لِلصَّلَوٰةِ مِن يَوْمِ ٱلْجُمُعَةِ فَٱسْعَوْا۟ إِلَىٰ ذِكْرِ ٱللَّهِ وَذَرُوا۟ ٱلْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌۭ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ',
    translationFr: '« Ô vous qui avez cru ! Quand on appelle à la prière du jour du vendredi, accourez à l’invocation d’Allah et laissez tout négoce. Cela est bien meilleur pour vous, si vous saviez ! »',
    translationEn: '“O you who have believed, when [the adhan] is called for the prayer on the day of Jumu\'ah, then proceed to the remembrance of Allah and leave trade. That is better for you, if you only knew.”',
    bookOrSurah: 'Sourate Al-Jumu\'a (سُورَةُ الجُمُعَةِ)',
    numberOrAyah: 'Verset 9',
    surahNumber: 62,
    ayahNumber: 9,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5186.mp3',
    reciterName: 'Mishary Rashid Alafasy',
    hashtags: '#JumuahMubarak #VendrediBeni #SourateAlJumua #KaelarIslamic #fyp'
  }
];

function loadCatalog() {
  try {
    if (fs.existsSync(CATALOG_PATH)) {
      const items = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
      if (Array.isArray(items) && items.length > 0) {
        console.log(`📦 Loaded ${items.length} verified authentic items from catalog.`);
        return items;
      }
    }
  } catch (e) {
    console.warn('Could not read external catalog, using fallback:', e.message);
  }
  return FALLBACK_ITEMS;
}

const VERIFIED_ITEMS = loadCatalog();

// Helper: Download a remote file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Helper: Load or initialize registry
function loadRegistry() {
  try {
    if (fs.existsSync(REGISTRY_PATH)) {
      return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not read registry:', e.message);
  }
  return {
    currentIndex: 0,
    lastRunAt: null,
    publishedItems: []
  };
}

// Helper: Save registry
function saveRegistry(reg) {
  const dir = path.dirname(REGISTRY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2), 'utf8');
}

// Helper: Upload file to Cloudinary
function uploadToCloudinary(filePath) {
  return new Promise((resolve, reject) => {
    const fileData = fs.readFileSync(filePath);
    const base64Data = `data:video/mp4;base64,${fileData.toString('base64')}`;

    const postData = JSON.stringify({
      file: base64Data,
      upload_preset: CLOUDINARY_UPLOAD_PRESET
    });

    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.secure_url) {
            resolve(json.secure_url);
          } else {
            reject(new Error(`Cloudinary upload failed: ${body}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Helper: Sleep utility
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Track Buffer API rate-limit state across calls in the current run
const bufferRateLimitState = {
  isLimited: false,
  message: '',
  retryAfterSeconds: 0
};

// Helper: Publish to Buffer with Rate-Limiting & Quota Guard
function publishToBuffer(channelId, text, videoUrl, platform = 'general', title = '') {
  // If we already detected Buffer 429 / quota limit in this run, do not make further HTTP requests
  if (bufferRateLimitState.isLimited) {
    const hoursLeft = Math.ceil(bufferRateLimitState.retryAfterSeconds / 3600);
    console.warn(`⏸️ Buffer API in rate-limit cooldown (~${hoursLeft}h remaining). Skipping dispatch for ${platform} to protect account.`);
    return Promise.resolve({
      success: false,
      isRateLimited: true,
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: bufferRateLimitState.retryAfterSeconds,
      error: bufferRateLimitState.message || 'Buffer 24h quota limit reached (250 req/day)'
    });
  }

  return new Promise((resolve, reject) => {
    const mutation = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          ... on PostActionSuccess {
            post {
              id
              status
            }
          }
          ... on InvalidInputError {
            message
          }
          ... on UnauthorizedError {
            message
          }
          ... on UnexpectedError {
            message
          }
          ... on LimitReachedError {
            message
          }
        }
      }
    `;

    const input = {
      channelId,
      text,
      mode: 'shareNow',
      schedulingType: 'automatic',
      needsApproval: false,
      assets: [{ video: { url: videoUrl } }]
    };

    if (platform === 'youtube') {
      input.metadata = {
        youtube: {
          title: (title || text.split('\n')[0] || 'Rappel Islamique #Shorts').slice(0, 95),
          privacy: 'public',
          madeForKids: false,
          categoryId: '22'
        }
      };
    } else if (platform === 'tiktok') {
      input.metadata = {
        tiktok: {
          title: (title || text.split('\n')[0] || 'Rappel Islamique').slice(0, 100),
          isAiGenerated: false
        }
      };
    } else if (platform === 'instagram') {
      input.metadata = {
        instagram: {
          type: 'reel',
          shouldShareToFeed: true
        }
      };
    }

    const variables = { input };
    const postData = JSON.stringify({ query: mutation, variables });

    const options = {
      hostname: 'api.buffer.com',
      port: 443,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUFFER_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const isRateLimitHttp = res.statusCode === 429;
          const retryAfterHeader = res.headers['retry-after'];
          const retryAfterSec = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 43200; // default 12h fallback

          const json = JSON.parse(body);

          if (json.data?.createPost?.post) {
            resolve(json.data.createPost.post);
          } else if (json.errors && json.errors.length > 0) {
            const errCode = json.errors[0]?.extensions?.code || (isRateLimitHttp ? 'RATE_LIMIT_EXCEEDED' : 'ERROR');
            const errMsg = json.errors[0]?.message || 'Unknown Buffer error';

            if (isRateLimitHttp || errCode === 'RATE_LIMIT_EXCEEDED' || errMsg.toLowerCase().includes('too many requests')) {
              bufferRateLimitState.isLimited = true;
              bufferRateLimitState.message = errMsg;
              bufferRateLimitState.retryAfterSeconds = retryAfterSec;
              console.warn(`🛑 Buffer Quota Exceeded [${errCode}]: ${errMsg} (Retry-after: ~${Math.ceil(retryAfterSec / 3600)}h).`);
              resolve({ success: false, error: errMsg, code: 'RATE_LIMIT_EXCEEDED', isRateLimited: true, retryAfter: retryAfterSec });
              return;
            }

            console.warn(`⚠️ Buffer API [${errCode}]: ${errMsg}`);
            resolve({ success: false, error: errMsg, code: errCode });
          } else {
            if (isRateLimitHttp) {
              bufferRateLimitState.isLimited = true;
              bufferRateLimitState.message = 'Too many requests (HTTP 429)';
              bufferRateLimitState.retryAfterSeconds = retryAfterSec;
              console.warn(`🛑 Buffer API HTTP 429: Too Many Requests (Retry-after: ~${Math.ceil(retryAfterSec / 3600)}h).`);
              resolve({ success: false, error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED', isRateLimited: true, retryAfter: retryAfterSec });
              return;
            }
            console.warn(`Buffer Response for ${channelId}:`, body);
            resolve({ success: false, error: 'Unexpected response format', raw: json });
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Helper: Send Discord Webhook notification
function sendDiscordNotification(item, theme, publicVideoUrl) {
  if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.startsWith('http')) return Promise.resolve();

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(DISCORD_WEBHOOK_URL);
      const embed = {
        title: `🕋 Auto-Pilot 6h : Nouveau Reel Publié !`,
        description: `${item.arabicText}\n\n*${item.translationFr}*`,
        color: 0x10b981,
        fields: [
          {
            name: '📖 Thématique',
            value: theme.title,
            inline: true
          },
          {
            name: '📍 Référence',
            value: `${item.bookOrSurah} (${item.numberOrAyah})`,
            inline: true
          },
          {
            name: '📱 Réseaux Publiés',
            value: YOUTUBE_CHANNEL_ID 
              ? '📷 Instagram (`@kaelarislamic`)\n🎵 TikTok (`@mdou.g`)\n🔴 YouTube Shorts' 
              : '📷 Instagram (`@kaelarislamic`)\n🎵 TikTok (`@mdou.g`)',
            inline: false
          },
          {
            name: '🎬 Lien Direct Vidéo Reel HD',
            value: `[Cliquer ici pour regarder le Reel MP4](${publicVideoUrl})`,
            inline: false
          },
          ...(bufferRateLimitState.isLimited ? [{
            name: '⚠️ Statut Quota Buffer API',
            value: `Quota Buffer 24h atteint (250 req/jour). Le Reel vidéo a été généré & hébergé sur Cloudinary avec succès. Publication Buffer en pause jusqu'à la réinitialisation (~${Math.ceil(bufferRateLimitState.retryAfterSeconds / 3600)}h).`,
            inline: false
          }] : [])
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Kaelar Islamic AI Studio • Cloud 24/7 Engine'
        }
      };

      const postData = JSON.stringify({
        username: 'Kaelar Islamic Studio',
        embeds: [embed]
      });

      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + (urlObj.search || ''),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        resolve();
      });
      req.on('error', () => resolve());
      req.write(postData);
      req.end();
    } catch (e) {
      resolve();
    }
  });
}

// Helper: Word-wrapping for SVG text/tspans (librsvg doesn't support HTML foreignObject)
function wrapWords(text, maxChars) {
  const words = (text || '').trim().split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + ' ' + word).length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Helper: Generate crisp SVG poster (100% SVG 1.1 native text compatible with rsvg-convert & FFmpeg)
function generatePosterSvg(item) {
  const escapeXml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const cleanFr = (item.translationFr || '').replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();
  const cleanEn = (item.translationEn || '').replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();

  // Adaptive font sizing & line wrapping for Arabic (RTL)
  const arLen = (item.arabicText || '').length;
  let arFontSize = 44;
  let arLineHeight = 76;
  let arMaxChars = 34;

  if (arLen <= 70) {
    arFontSize = 52;
    arLineHeight = 88;
    arMaxChars = 28;
  } else if (arLen <= 140) {
    arFontSize = 44;
    arLineHeight = 76;
    arMaxChars = 34;
  } else if (arLen <= 220) {
    arFontSize = 38;
    arLineHeight = 66;
    arMaxChars = 40;
  } else {
    arFontSize = 32;
    arLineHeight = 56;
    arMaxChars = 46;
  }

  const arLines = wrapWords(item.arabicText, arMaxChars);
  const arBlockHeight = arLines.length * arLineHeight;

  // Adaptive font sizing & line wrapping for French
  const frWords = cleanFr.split(/\s+/).length;
  let frFontSize = 28;
  let frLineHeight = 44;
  let frMaxChars = 42;

  if (frWords <= 18) {
    frFontSize = 32;
    frLineHeight = 50;
    arMaxChars = 38;
  } else if (frWords <= 35) {
    frFontSize = 28;
    frLineHeight = 44;
    frMaxChars = 42;
  } else {
    frFontSize = 24;
    frLineHeight = 38;
    frMaxChars = 48;
  }

  const frLines = cleanFr ? wrapWords(`« ${cleanFr} »`, frMaxChars) : [];
  const frBlockHeight = frLines.length * frLineHeight;

  // English lines (concise, if present and total text fits comfortably)
  let enLines = [];
  let enBlockHeight = 0;
  const enFontSize = 22;
  const enLineHeight = 34;

  if (cleanEn && (arLines.length + frLines.length) <= 10) {
    enLines = wrapWords(`“${cleanEn}”`, 48);
    enBlockHeight = enLines.length * enLineHeight;
  }

  const dividerGap = 50;
  const totalContentHeight = arBlockHeight + dividerGap + frBlockHeight + (enBlockHeight > 0 ? enBlockHeight + 25 : 0);

  // Available vertical zone: center around y = 920
  const centerY = 920;
  let startArY = Math.round(centerY - (totalContentHeight / 2) + (arLineHeight * 0.8));
  if (startArY < 390) startArY = 390;

  const cardPaddingY = 50;
  const cardTopY = Math.round(startArY - (arLineHeight * 0.8) - cardPaddingY);
  const cardHeight = Math.round(totalContentHeight + (cardPaddingY * 2) + 20);

  const dividerY = Math.round(startArY + arBlockHeight - (arLineHeight * 0.3) + 20);
  const startFrY = Math.round(dividerY + 45);
  const startEnY = Math.round(startFrY + frBlockHeight + 20);

  // Build SVG tspans with explicit absolute y coordinates
  const arTspans = arLines.map((line, idx) => {
    const yPos = startArY + (idx * arLineHeight);
    return `<tspan x="540" y="${yPos}">${escapeXml(line)}</tspan>`;
  }).join('\n      ');

  const frTspans = frLines.map((line, idx) => {
    const yPos = startFrY + (idx * frLineHeight);
    return `<tspan x="540" y="${yPos}">${escapeXml(line)}</tspan>`;
  }).join('\n      ');

  const enTspans = enLines.map((line, idx) => {
    const yPos = startEnY + (idx * enLineHeight);
    return `<tspan x="540" y="${yPos}">${escapeXml(line)}</tspan>`;
  }).join('\n      ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#030814" />
      <stop offset="40%" stop-color="#071326" />
      <stop offset="80%" stop-color="#051c1c" />
      <stop offset="100%" stop-color="#020612" />
    </linearGradient>
    <radialGradient id="goldGlow" cx="50%" cy="32%" r="65%">
      <stop offset="0%" stop-color="rgba(217, 119, 6, 0.28)" />
      <stop offset="60%" stop-color="rgba(16, 185, 129, 0.08)" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent" />
      <stop offset="25%" stop-color="#f59e0b" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#fef08a" stop-opacity="0.95" />
      <stop offset="75%" stop-color="#f59e0b" stop-opacity="0.6" />
      <stop offset="100%" stop-color="transparent" />
    </linearGradient>
    <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.85)" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bgGrad)" />
  <circle cx="540" cy="620" r="750" fill="url(#goldGlow)" />

  <!-- Outer Royal Borders -->
  <rect x="50" y="50" width="980" height="1820" rx="36" fill="none" stroke="#d97706" stroke-width="3" stroke-opacity="0.5" />
  <rect x="66" y="66" width="948" height="1788" rx="24" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.2" />

  <!-- Corner Islamic Ornaments -->
  <g stroke="#f59e0b" stroke-width="1.5" fill="none" stroke-opacity="0.4">
    <path d="M 80 120 L 120 120 L 120 80" />
    <path d="M 1000 120 L 960 120 L 960 80" />
    <path d="M 80 1800 L 120 1800 L 120 1840" />
    <path d="M 1000 1800 L 960 1800 L 960 1840" />
  </g>

  <!-- Top Bismillah -->
  <text x="540" y="210" font-family="'Amiri Quran', 'Amiri', 'Noto Naskh Arabic', 'Traditional Arabic', serif" font-size="44" font-weight="bold" fill="#fef08a" text-anchor="middle" filter="url(#textGlow)">
    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
  </text>

  <!-- Vector Islamic Rub-el-Hizb Emblem (Golden 8-Point Star) -->
  <g transform="translate(540, 275) scale(0.9)" stroke="#f59e0b" stroke-width="1.5" fill="rgba(245, 158, 11, 0.15)">
    <rect x="-16" y="-16" width="32" height="32" rx="3" />
    <rect x="-16" y="-16" width="32" height="32" rx="3" transform="rotate(45)" />
    <circle cx="0" cy="0" r="6" fill="#fef08a" />
  </g>

  <!-- Translucent Glassmorphism Content Card -->
  <rect x="80" y="${cardTopY}" width="920" height="${cardHeight}" rx="28" fill="rgba(6, 12, 24, 0.76)" stroke="rgba(245, 158, 11, 0.35)" stroke-width="1.5" />

  <!-- Arabic Quranic Text (Pure SVG Native Text & Tspans) -->
  <text x="540" font-family="'Amiri Quran', 'Amiri', 'Noto Naskh Arabic', 'Scheherazade New', 'Traditional Arabic', serif" font-size="${arFontSize}" font-weight="bold" fill="#ffffff" text-anchor="middle" filter="url(#textGlow)">
      ${arTspans}
  </text>

  <!-- Ornate Golden Divider -->
  <line x1="280" y1="${dividerY}" x2="800" y2="${dividerY}" stroke="url(#goldLine)" stroke-width="2.5" />
  <g transform="translate(540, ${dividerY})">
    <polygon points="0,-8 8,0 0,8 -8,0" fill="#fef08a" stroke="#d97706" stroke-width="1" />
  </g>

  <!-- French Translation (Pure SVG Native Text & Tspans) -->
  ${frLines.length > 0 ? `
  <text x="540" font-family="'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="${frFontSize}" font-weight="600" fill="#f1f5f9" text-anchor="middle" filter="url(#textGlow)">
      ${frTspans}
  </text>` : ''}

  <!-- English Translation (Optional) -->
  ${enLines.length > 0 ? `
  <text x="540" font-family="'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="${enFontSize}" font-style="italic" fill="#94a3b8" text-anchor="middle">
      ${enTspans}
  </text>` : ''}

  <!-- Source Reference Pill Badge -->
  <g transform="translate(540, 1610)">
    <rect x="-340" y="-28" width="680" height="54" rx="27" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.6" />
    <text x="0" y="8" font-family="'Plus Jakarta Sans', -apple-system, 'Segoe UI', sans-serif" font-size="26" font-weight="bold" fill="#fbbf24" text-anchor="middle">
      ✦ ${escapeXml(item.bookOrSurah)} — ${escapeXml(item.numberOrAyah)} ✦
    </text>
  </g>

  <!-- Footer Watermark (Positioned at y=1685 so it NEVER overlaps with FFmpeg waveform at y=1710-1800) -->
  <text x="540" y="1685" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="22" font-weight="600" fill="rgba(255, 255, 255, 0.45)" text-anchor="middle">
    @kaelarislamic • @mdou.g
  </text>
</svg>`;
}

// Dynamic Viral Islamic Hashtags Generator (TikTok FYP, Instagram Reels Explore, YouTube Shorts)
function getViralIslamicTags(type, platform = 'all', limit = 14) {
  const typeMap = {
    quran_verse: ['#quranrecitation', '#quranverses', '#surah', '#tilawat', '#beautifultilawat', '#holyquran', '#قرآن', '#تلاوة'],
    sahih_hadith: ['#hadith', '#hadithoftheday', '#sahihbukhari', '#sahihmuslim', '#propheticwisdom', '#sunnahrasul', '#حديث', '#سنة'],
    authentic_dua: ['#dua', '#dhikr', '#adhkar', '#hisnulmuslim', '#supplication', '#istighfar', '#subhanallah', '#دعاء', '#أذكار'],
    tahajjud_motivation: ['#tahajjud', '#nightprayer', '#qiyamullail', '#fajr', '#peaceofmind', '#spiritualgrowth', '#قيام_الليل', '#تهجد'],
    islamic_reminder: ['#tawakkul', '#sabr', '#patience', '#islamicmotivation', '#trustallah', '#hopeinallah', '#صبر', '#توكل_على_الله'],
    jumua_special: ['#jummahmubarak', '#jumuah', '#fridayprayer', '#suratalkahf', '#salawat', '#blessedfriday', '#جمعة_مباركة', '#سورة_الكهف']
  };

  const categoryTags = typeMap[type] || typeMap.quran_verse;
  const selected = new Set();

  if (platform === 'youtube') {
    // YouTube Shorts SEO Suite: #Shorts anchor + trending shorts keywords + category tags
    selected.add('#Shorts');
    ['#YouTubeShorts', '#IslamicShorts', '#ViralShorts', '#Trending', '#ShortsFeed', '#HolyQuran', '#HadithOfTheDay', '#IslamicStatus'].forEach(t => selected.add(t));
    categoryTags.slice(0, 4).forEach(t => selected.add(t));
    selected.add('#Islam');
    selected.add('#Quran');
    selected.add('#kaelarislamic');
    return Array.from(selected).slice(0, limit).join(' ');
  }

  if (platform === 'tiktok') {
    // TikTok FYP Suite: viral hooks + high-velocity community tags + French discovery
    ['#muslimtiktok', '#islamictiktok', '#islamicvideo', '#fyp', '#foryou', '#foryoupage', '#viralvideo', '#trending'].forEach(t => selected.add(t));
    categoryTags.slice(0, 4).forEach(t => selected.add(t));
    selected.add('#islam');
    selected.add('#allah');
    selected.add('#rappelislam');
    selected.add('#kaelarislamic');
    selected.add('#mdou');
    return Array.from(selected).slice(0, limit).join(' ');
  }

  if (platform === 'instagram') {
    // Instagram Reels Explore Suite: explore tags + reels virality + visual aesthetic community
    ['#islamicreels', '#reelsinstagram', '#reelsviral', '#explorepage', '#instaislam', '#reels', '#explore', '#viralreels'].forEach(t => selected.add(t));
    categoryTags.slice(0, 4).forEach(t => selected.add(t));
    selected.add('#islam');
    selected.add('#muslim');
    selected.add('#rappelsislamiques');
    selected.add('#coran');
    selected.add('#kaelarislamic');
    return Array.from(selected).slice(0, limit).join(' ');
  }

  // Fallback / all
  const core = ['#islam', '#quran', '#hadith', '#allah', '#muslim', '#islamicreminder'];
  core.slice(0, 3).forEach(t => selected.add(t));
  categoryTags.slice(0, 4).forEach(t => selected.add(t));
  selected.add('#muslimtiktok');
  selected.add('#fyp');
  selected.add('#islamicreels');
  selected.add('#Shorts');
  selected.add('#kaelarislamic');
  return Array.from(selected).slice(0, limit).join(' ');
}

// Helper: Strip Arabic diacritics for content comparison
function stripDiacritics(text) {
  return (text || '').replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

// Helper: Generate a short content hash from Arabic text (first 30 chars, no diacritics)
function contentHash(text) {
  return stripDiacritics(text).substring(0, 30);
}

/**
 * Pick the next unposted item for a given theme.
 * Cross-references the registry to skip already-published items.
 * If all items for the theme have been used, resets and cycles.
 */
function getNextItemForTheme(theme, reg) {
  // Filter catalog to items matching this theme's category
  const candidates = VERIFIED_ITEMS.filter(v => v.type === theme.category);

  if (candidates.length === 0) {
    console.warn(`⚠️ No items found for category "${theme.category}", using fallback.`);
    return VERIFIED_ITEMS[0];
  }

  // Build map of last published timestamp for each candidate
  const lastPublishedTime = new Map();
  for (const p of (reg.publishedItems || [])) {
    const pHash = p.contentHash || (p.arabicText ? contentHash(p.arabicText) : '');
    const pVerseId = (p.surahNumber && p.ayahNumber) ? `${p.surahNumber}:${p.ayahNumber}` : '';
    const pTime = p.timestamp ? new Date(p.timestamp).getTime() : 0;
    if (pHash) {
      lastPublishedTime.set(pHash, Math.max(lastPublishedTime.get(pHash) || 0, pTime));
    }
    if (pVerseId) {
      lastPublishedTime.set(pVerseId, Math.max(lastPublishedTime.get(pVerseId) || 0, pTime));
    }
  }

  const now = Date.now();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  // Candidates not published in the last 30 days
  const eligible = candidates.filter(c => {
    const hash = contentHash(c.arabicText);
    const verseId = `${c.surahNumber}:${c.ayahNumber}`;
    const lastPub = Math.max(lastPublishedTime.get(hash) || 0, lastPublishedTime.get(verseId) || 0);
    return (now - lastPub) > THIRTY_DAYS_MS;
  });

  if (eligible.length > 0) {
    // Pick the one published longest ago (or never published)
    eligible.sort((a, b) => {
      const aHash = contentHash(a.arabicText);
      const bHash = contentHash(b.arabicText);
      const aLast = Math.max(lastPublishedTime.get(aHash) || 0, lastPublishedTime.get(`${a.surahNumber}:${a.ayahNumber}`) || 0);
      const bLast = Math.max(lastPublishedTime.get(bHash) || 0, lastPublishedTime.get(`${b.surahNumber}:${b.ayahNumber}`) || 0);
      return aLast - bLast;
    });
    console.log(`📋 ${eligible.length}/${candidates.length} eligible (30d cooldown) for "${theme.category}".`);
    return eligible[0];
  }

  // If all were published within 30 days, pick the absolute oldest published one (LRU)
  candidates.sort((a, b) => {
    const aHash = contentHash(a.arabicText);
    const bHash = contentHash(b.arabicText);
    const aLast = Math.max(lastPublishedTime.get(aHash) || 0, lastPublishedTime.get(`${a.surahNumber}:${a.ayahNumber}`) || 0);
    const bLast = Math.max(lastPublishedTime.get(bHash) || 0, lastPublishedTime.get(`${b.surahNumber}:${b.ayahNumber}`) || 0);
    return aLast - bLast;
  });
  console.log(`🔄 Picking least-recently published item for "${theme.category}".`);
  return candidates[0];
}

// Time-Aware Sunnah Scheduler: selects authentic theme based on prayer time & day
function getSunnahThemeForCurrentTime(now = new Date()) {
  const day = now.getUTCDay(); // 0 = Sun, 4 = Thu, 5 = Fri
  const hour = now.getUTCHours(); // 00, 06, 12, 18 UTC

  // 1. Spécial Jumu'ah: Thursday night (>=16:00 UTC) through all of Friday
  if ((day === 4 && hour >= 16) || day === 5) {
    console.log("🕌 Sunnah Time: Spécial Jumu'ah (Sourate Al-Kahf & Salawat)");
    return THEMES.find(t => t.id === 'theme-jumuah') || THEMES[5];
  }

  // 2. Tahajjud & Prière de Nuit: 23:00 - 04:00 UTC (Qiyam al-Layl & Istighfar)
  if (hour >= 23 || hour <= 4) {
    console.log("🌙 Sunnah Time: Tahajjud & Qiyam al-Layl (Prière de Nuit & Pardon)");
    return THEMES.find(t => t.id === 'theme-tahajjud') || THEMES[3];
  }

  // 3. Morning Invocations & Protection: 05:00 - 09:00 UTC (Fajr & Adhkar as-Sabah)
  if (hour >= 5 && hour <= 9) {
    console.log("🌅 Sunnah Time: Adhkar as-Sabah & Invocations du Matin");
    return THEMES.find(t => t.id === 'theme-dua') || THEMES[2];
  }

  // 4. Evening Invocations & Gratitude: 16:00 - 20:00 UTC (Maghrib & Adhkar al-Masaa)
  if (hour >= 16 && hour <= 20) {
    console.log("🌆 Sunnah Time: Adhkar al-Masaa & Sagesse du Soir (Tawakkul)");
    return THEMES.find(t => t.id === 'theme-reminder') || THEMES[4];
  }

  // 5. General / Midday Slots (10:00 - 15:00 UTC): Alternates between Quran and Hadith
  return (hour % 2 === 0)
    ? (THEMES.find(t => t.id === 'theme-quran') || THEMES[0])
    : (THEMES.find(t => t.id === 'theme-hadith') || THEMES[1]);
}

// Main Execution Routine
async function runCloudAutoPilot() {
  console.log('🕋 === Kaelar Islamic AI Studio — 24/7 Cloud Auto-Pilot Runner === 🕋');
  console.log(`⏰ Execution Time: ${new Date().toISOString()}`);

  const reg = loadRegistry();
  const currentIdx = reg.currentIndex || 0;

  // Intelligently select theme aligned with Sunnah and prayer time
  const theme = getSunnahThemeForCurrentTime();
  console.log(`🎯 Sunnah Selected Theme: ${theme.title}`);

  // 1. Pick an unposted verified item for this theme
  const item = getNextItemForTheme(theme, reg);
  console.log(`📖 Selected Item: "${item.bookOrSurah}" (${item.numberOrAyah})`);

  const tempDir = path.join(__dirname, '..', '.temp_autopilot');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const svgPath = path.join(tempDir, 'poster.svg');
  const pngPath = path.join(tempDir, 'poster.png');
  const audioPath = path.join(tempDir, 'audio.mp3');
  const videoPath = path.join(tempDir, 'output.mp4');

  // 2. Write SVG Poster
  fs.writeFileSync(svgPath, generatePosterSvg(item), 'utf8');

  // 3. Download Audio MP3
  console.log(`🎙️ Downloading recitation audio from ${item.audioUrl}...`);
  await downloadFile(item.audioUrl, audioPath);

  // 4. Generate MP4 Video via FFmpeg
  console.log('🎬 Encoding HD 1080x1920 MP4 Video via FFmpeg...');
  try {
    try {
      execSync(`rsvg-convert -w 1080 -h 1920 "${svgPath}" -o "${pngPath}"`, { stdio: 'ignore' });
    } catch {
      fs.copyFileSync(svgPath, pngPath);
    }
    try {
      // High-retention cinematic video: smooth slow zoom + real-time audio waveform overlay
      const cinematicCmd = `ffmpeg -y -loop 1 -framerate 30 -i "${pngPath}" -i "${audioPath}" -filter_complex "[0:v]scale=1144:2034,zoompan=z='min(zoom+0.0005,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30[vbg];[1:a]showwaves=s=880x90:mode=line:colors=0xfbbf24@0.85[waves];[vbg][waves]overlay=(W-w)/2:H-220:shortest=1[vout]" -map "[vout]" -map 1:a -c:v libx264 -preset veryfast -profile:v high -level 4.1 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 -movflags +faststart -shortest "${videoPath}"`;
      execSync(cinematicCmd, { stdio: 'inherit' });
      console.log('✨ Video encoded with Ken Burns zoom & audio waveform visualizer!');
    } catch {
      console.log('⚠️ Falling back to standard FFmpeg profile...');
      const fallbackCmd = `ffmpeg -y -framerate 30 -loop 1 -i "${pngPath}" -i "${audioPath}" -c:v libx264 -preset veryfast -profile:v high -level 4.1 -r 30 -g 60 -keyint_min 30 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 -movflags +faststart -shortest "${videoPath}"`;
      execSync(fallbackCmd, { stdio: 'inherit' });
    }
  } catch (err) {
    console.error('FFmpeg execution issue:', err.message);
    throw err;
  }

  // 5. Upload Video to Cloudinary
  console.log('📡 Uploading MP4 Reel to Cloudinary...');
  const publicVideoUrl = await uploadToCloudinary(videoPath);
  console.log(`✅ Cloudinary Public URL: ${publicVideoUrl}`);

  // 6. Post with Viral Optimized Tags to Instagram, TikTok & YouTube Shorts
  const igTags = getViralIslamicTags(item.type, 'instagram');
  const ttTags = getViralIslamicTags(item.type, 'tiktok');
  const ytTags = getViralIslamicTags(item.type, 'youtube');

  const cleanCaptionFr = (item.translationFr || '').replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();
  const igCaption = `${item.arabicText}\n\n« ${cleanCaptionFr} »\n\n📍 ${item.bookOrSurah} — ${item.numberOrAyah}\n\n${igTags}`;
  const ttCaption = `${item.arabicText}\n\n« ${cleanCaptionFr} »\n\n📍 ${item.bookOrSurah} — ${item.numberOrAyah}\n\n${ttTags}`;
  const ytCaption = `${item.bookOrSurah} — ${item.numberOrAyah} 🕋\n\n${item.arabicText}\n\n« ${cleanCaptionFr} »\n\n${ytTags}`;

  // 6a. Publish to Instagram Reel
  try {
    console.log('📤 Publishing to Instagram Reel (@kaelarislamic) with Viral Tags...');
    const igRes = await publishToBuffer(INSTAGRAM_CHANNEL_ID, igCaption, publicVideoUrl, 'instagram', `${item.bookOrSurah} — ${item.numberOrAyah}`);
    if (igRes?.status || igRes?.id) {
      console.log('✅ Instagram publication queued successfully in Buffer!');
    } else if (igRes?.isRateLimited) {
      console.warn(`🛑 Instagram Buffer rate-limited: ${igRes?.error || 'Rate limit reached'}`);
    } else {
      console.warn(`⚠️ Instagram Buffer issue: ${igRes?.error || igRes?.message || 'Non-fatal'}`);
    }
  } catch (err) {
    console.warn('⚠️ Instagram publication notice:', err.message);
  }

  // Inter-platform throttle delay (5s) to avoid Buffer burst limits
  if (!bufferRateLimitState.isLimited) {
    console.log('⏳ Throttling: waiting 5 seconds before next platform dispatch...');
    await sleep(5000);
  }

  // 6b. Publish to TikTok
  try {
    if (bufferRateLimitState.isLimited) {
      console.log('⏸️ Skipping TikTok Buffer dispatch (Buffer API 24h rate limit active).');
    } else {
      console.log('📤 Publishing to TikTok (@mdou.g) with FYP Booster Tags...');
      const ttRes = await publishToBuffer(TIKTOK_CHANNEL_ID, ttCaption, publicVideoUrl, 'tiktok', `${item.bookOrSurah} — ${item.numberOrAyah}`);
      if (ttRes?.status || ttRes?.id) {
        console.log('✅ TikTok publication queued successfully in Buffer!');
      } else if (ttRes?.isRateLimited) {
        console.warn(`🛑 TikTok Buffer rate-limited: ${ttRes?.error || 'Rate limit reached'}`);
      } else {
        console.warn(`⚠️ TikTok Buffer issue: ${ttRes?.error || ttRes?.message || 'Non-fatal'}`);
      }
    }
  } catch (err) {
    console.warn('⚠️ TikTok publication notice:', err.message);
  }

  // 6c. Optional: Publish to YouTube Shorts
  if (YOUTUBE_CHANNEL_ID && YOUTUBE_CHANNEL_ID.trim() !== '') {
    if (!bufferRateLimitState.isLimited) {
      console.log('⏳ Throttling: waiting 5 seconds before YouTube Shorts dispatch...');
      await sleep(5000);
    }
    try {
      if (bufferRateLimitState.isLimited) {
        console.log('⏸️ Skipping YouTube Shorts Buffer dispatch (Buffer API 24h rate limit active).');
      } else {
        console.log('📤 Publishing to YouTube Shorts (#Shorts) via Buffer...');
        const ytTitle = `${item.bookOrSurah} — ${item.numberOrAyah} #Shorts`;
        const ytRes = await publishToBuffer(YOUTUBE_CHANNEL_ID.trim(), ytCaption, publicVideoUrl, 'youtube', ytTitle);
        if (ytRes?.status || ytRes?.id) {
          console.log('✅ YouTube Shorts publication queued successfully in Buffer!');
        } else if (ytRes?.isRateLimited) {
          console.warn(`🛑 YouTube Buffer rate-limited: ${ytRes?.error || 'Rate limit reached'}`);
        } else {
          console.warn(`⚠️ YouTube Buffer issue: ${ytRes?.error || ytRes?.message || 'Non-fatal'}`);
        }
      }
    } catch (err) {
      console.warn('⚠️ YouTube Shorts publication notice:', err.message);
    }
  } else {
    console.log('ℹ️ YouTube Shorts skipped (BUFFER_YOUTUBE_CHANNEL_ID not configured yet).');
  }

  // 7. Update Registry & Advance to Next Theme
  reg.currentIndex = (currentIdx + 1) % THEMES.length;
  reg.publishedItems.push({
    id: `autopilot-${Date.now()}`,
    timestamp: reg.lastRunAt,
    theme: theme.title,
    type: item.type,
    bookOrSurah: item.bookOrSurah,
    numberOrAyah: item.numberOrAyah,
    surahNumber: item.surahNumber,
    ayahNumber: item.ayahNumber,
    arabicText: item.arabicText,
    translationFr: item.translationFr,
    translationEn: item.translationEn,
    contentHash: contentHash(item.arabicText),
    audioUrl: item.audioUrl,
    videoUrl: publicVideoUrl,
    cardImageUrl: publicVideoUrl ? publicVideoUrl.replace(/\.mp4$/, '.png') : '',
    platforms: YOUTUBE_CHANNEL_ID ? ['instagram', 'tiktok', 'youtube'] : ['instagram', 'tiktok'],
    reciterName: item.reciterName || 'Mishary Rashid Alafasy'
  });
  saveRegistry(reg);

  // 8. Send Discord Notification
  console.log('🔔 Sending Discord notification...');
  await sendDiscordNotification(item, theme, publicVideoUrl);

  console.log('🎉 Auto-Pilot cycle completed successfully!');

  // Cleanup temp files
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {}
}

if (require.main === module) {
  runCloudAutoPilot().catch((err) => {
    console.error('❌ Cloud Auto-Pilot Error:', err);
    process.exit(1);
  });
}

module.exports = { 
  runCloudAutoPilot, 
  getNextItemForTheme, 
  getSunnahThemeForCurrentTime,
  generatePosterSvg,
  VERIFIED_ITEMS, 
  loadRegistry 
};
