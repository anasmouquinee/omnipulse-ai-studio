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
const INSTAGRAM_CHANNEL_ID = process.env.BUFFER_INSTAGRAM_CHANNEL_ID || '6a8f4ce9ccaf649a672154f6'; // @kae.islamic
const TIKTOK_CHANNEL_ID = process.env.BUFFER_TIKTOK_CHANNEL_ID || '6a8f4dcfccaf649a672158cf'; // @kaelar.islamic
const YOUTUBE_CHANNEL_ID = process.env.BUFFER_YOUTUBE_CHANNEL_ID || '6a999279065799be467f1f35'; // @kaelar.islamics (YouTube Shorts)
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'zmgzjmpl';
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1542317690255839402/lJKv3K4988iwAhvc7Jpay8zvBhJ4aXB3dL6GMPGR8o4D9FauC3cuGoIcrOTfJBzAZkPU';

const REGISTRY_PATH = path.join(__dirname, '..', 'data', 'publishedRegistry.json');
const CAROUSEL_PACKS_PATH = path.join(__dirname, '..', 'data', 'dailyCarouselPacks.json');

function loadDailyCarouselPacks() {
  try {
    if (fs.existsSync(CAROUSEL_PACKS_PATH)) {
      const packs = JSON.parse(fs.readFileSync(CAROUSEL_PACKS_PATH, 'utf8'));
      if (Array.isArray(packs) && packs.length > 0) {
        console.log(`📑 Loaded ${packs.length} authentic Daily Carousel Packs.`);
        return packs;
      }
    }
  } catch (e) {
    console.warn('Could not read dailyCarouselPacks.json:', e.message);
  }
  return [];
}

const DAILY_CAROUSEL_PACKS = loadDailyCarouselPacks();

// 7-Pillar Rotation Definitions
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
    id: 'theme-adhkar',
    category: 'adhkar_routine',
    title: 'Routine Adhkar & Checklist Sérénité 🤍',
    badge: 'Adhkar 🤍'
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

// Helper: Upload file to Cloudinary (Supports both Videos and Images)
function uploadToCloudinary(filePath, resourceType = null) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filePath).toLowerCase();
    const isImage = resourceType === 'image' || ext === '.png' || ext === '.jpg' || ext === '.jpeg';
    const type = isImage ? 'image' : 'video';
    const mime = isImage ? (ext === '.png' ? 'image/png' : 'image/jpeg') : 'video/mp4';

    const fileData = fs.readFileSync(filePath);
    const base64Data = `data:${mime};base64,${fileData.toString('base64')}`;

    const postData = JSON.stringify({
      file: base64Data,
      upload_preset: CLOUDINARY_UPLOAD_PRESET
    });

    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`,
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

// Helper: Publish to Buffer with Rate-Limiting & Quota Guard (Supports Video Reels & Multi-Slide Carousels)
function publishToBuffer(channelId, text, media, platform = 'general', title = '') {
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

    const isCarousel = Array.isArray(media) && media.length > 0;
    const isSingleImage = typeof media === 'string' && (media.includes('.png') || media.includes('.jpg') || media.includes('.jpeg') || media.startsWith('data:image/'));

    let assets = [];
    if (isCarousel) {
      assets = media.map(url => ({ image: { url } }));
    } else if (isSingleImage) {
      assets = [{ image: { url: media } }];
    } else {
      assets = [{ video: { url: typeof media === 'string' ? media : '' } }];
    }

    const input = {
      channelId,
      text,
      mode: 'shareNow',
      schedulingType: 'automatic',
      needsApproval: false,
      assets
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
          type: (isCarousel || isSingleImage) ? 'post' : 'reel',
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
function sendDiscordNotification(item, theme, publicVideoUrl, carouselUrls = []) {
  if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.startsWith('http')) return Promise.resolve();

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(DISCORD_WEBHOOK_URL);
      const isCarousel = Array.isArray(carouselUrls) && carouselUrls.length > 0;
      const embed = {
        title: isCarousel
          ? `🕋 Auto-Pilot : Carrousel 5 Slides (Instagram) & Reel (TikTok) !`
          : `🕋 Auto-Pilot 6h : Nouveau Reel Publié !`,
        description: `${item.arabicText}\n\n*${item.translationFr}*`,
        color: isCarousel ? 0xd97706 : 0x10b981,
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
            value: isCarousel
              ? (YOUTUBE_CHANNEL_ID
                  ? '📷 Instagram (`@kae.islamic` — Carrousel 5p)\n🎵 TikTok (`@kaelar.islamic` — Reel)\n🔴 YouTube Shorts (Reel)'
                  : '📷 Instagram (`@kae.islamic` — Carrousel 5p)\n🎵 TikTok (`@kaelar.islamic` — Reel)')
              : (YOUTUBE_CHANNEL_ID 
                  ? '📷 Instagram (`@kae.islamic`)\n🎵 TikTok (`@kaelar.islamic`)\n🔴 YouTube Shorts' 
                  : '📷 Instagram (`@kae.islamic`)\n🎵 TikTok (`@kaelar.islamic`)'),
            inline: false
          },
          ...(isCarousel ? [{
            name: '📑 Carrousel Multi-Slides (Instagram)',
            value: `5 Slides HD créées & publiées en swipe post !\n[Voir Slide 1 Couverture](${carouselUrls[0]})`,
            inline: false
          }] : []),
          {
            name: '🎬 Lien Direct Vidéo Reel HD',
            value: `[Cliquer ici pour regarder le Reel MP4](${publicVideoUrl})`,
            inline: false
          },
          ...(bufferRateLimitState.isLimited ? [{
            name: '⚠️ Statut Quota Buffer API',
            value: `Quota Buffer 24h atteint (250 req/jour). Le contenu a été généré & hébergé sur Cloudinary avec succès. Publication Buffer en pause jusqu'à la réinitialisation (~${Math.ceil(bufferRateLimitState.retryAfterSeconds / 3600)}h).`,
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

// Helper: Check if item uses minimal cream aesthetic
function isMinimalCream(item) {
  return item.type === 'adhkar_routine' || item.visualStyle === 'minimal_cream' || (Array.isArray(item.checklistItems) && item.checklistItems.length > 0);
}

// 7 Tested High-Retention Viral Hooks for 3-Second Retention Optimization
const VIRAL_ISLAMIC_HOOKS = [
  'نصف دقيقة فقط 🤍',
  'لا تمر دون أن تستغفر ✨',
  'رسالة إلى قلبك الليلة 🌙',
  '30 ثانية تمحو بها ذنوبك 🤍',
  'خُذ استراحة مع ذكر الله 🕊️',
  'كنز عظيم من كنوز الجنة 💎',
  '﴿وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ﴾'
];

function pickViralHook(item, reg) {
  if (item.type === 'adhkar_routine') {
    const idx = (reg?.currentIndex || 0) % VIRAL_ISLAMIC_HOOKS.length;
    return VIRAL_ISLAMIC_HOOKS[idx];
  }
  return item.arabicText || 'نصف دقيقة فقط 🤍';
}

// Minimal Cream Checklist SVG Generator (Matches Aesthetic Cream Dhikr Routine Checklist)
function generateMinimalCreamSvg(item, hookOverride = '') {
  const escapeXml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Checklist items
  const rawItems = (Array.isArray(item.checklistItems) && item.checklistItems.length > 0)
    ? item.checklistItems
    : [
        "سُبْحَانَ اللَّهِ (3 مرات)",
        "الْحَمْدُ لِلَّهِ (3 مرات)",
        "لَا إِلَهَ إِلَّا اللَّهُ (3 مرات)",
        "اللَّهُ أَكْبَرُ (3 مرات)",
        "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ (3 مرات)",
        "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ (3 مرات)"
      ];

  // Header hook capsule text (dynamically picked or item text)
  const hookText = hookOverride || item.arabicText || "نصف دقيقة فقط 🤍";

  // Closing Quranic Ayah
  const closingAyah = item.closingAyah || "﴿وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ﴾";

  const cleanFr = (item.translationFr || '').replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();

  // Layout geometry
  const cardX = 70;
  const cardY = 270;
  const cardW = 940;
  const cardH = 1240;

  // Render checklist rows
  const rowCount = Math.min(rawItems.length, 7);
  const availableH = 860;
  const rowGap = Math.min(145, Math.floor(availableH / rowCount));
  const startRowY = cardY + 95;

  const rowsSvg = rawItems.slice(0, 7).map((rawLine, idx) => {
    const rowY = startRowY + (idx * rowGap);
    const match = rawLine.match(/^(.*?)\s*(\((?:\d+|مرة|\s*مرات)+\))\s*$/);
    const mainText = match ? match[1].trim() : rawLine;
    const badgeText = match ? match[2].trim() : '';

    return `
      <!-- Row ${idx + 1} -->
      <g transform="translate(540, ${rowY})">
        <!-- Soft translucent background pill for each dhikr row -->
        <rect x="-420" y="-38" width="840" height="76" rx="20" fill="rgba(255, 255, 255, 0.94)" stroke="rgba(231, 229, 228, 0.88)" stroke-width="1.2" />
        
        <!-- Left side badge (repetition count) -->
        ${badgeText ? `
        <rect x="-400" y="-22" width="135" height="44" rx="14" fill="#F5F5F4" stroke="#E7E5E4" stroke-width="1" />
        <text x="-332" y="7" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="22" font-weight="600" fill="#78716C" text-anchor="middle">${escapeXml(badgeText)}</text>
        ` : ''}

        <!-- Arabic Dhikr Text -->
        <text x="${badgeText ? 40 : 0}" y="10" font-family="'Amiri Quran', 'Amiri', 'Noto Naskh Arabic', serif" font-size="34" font-weight="bold" fill="#1C1917" text-anchor="middle">
          ${escapeXml(mainText)}
        </text>

        <!-- Right side subtle indicator ring -->
        <circle cx="380" cy="0" r="13" fill="none" stroke="#D6D3D1" stroke-width="1.5" />
        <circle cx="380" cy="0" r="4.5" fill="#A8A29E" />
      </g>`;
  }).join('\n');

  // Divider above closing Ayah
  const ayahDividerY = cardY + cardH - 145;
  const ayahY = ayahDividerY + 70;

  // French translation below card
  const frLines = cleanFr ? wrapWords(`« ${cleanFr} »`, 48) : [];
  const frTspans = frLines.slice(0, 2).map((line, idx) => {
    const yPos = 1555 + (idx * 36);
    return `<tspan x="540" y="${yPos}">${escapeXml(line)}</tspan>`;
  }).join('\n      ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Warm Linen / Cream Background Gradient -->
    <linearGradient id="creamBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FCFAF6" />
      <stop offset="35%" stop-color="#FAF5EE" />
      <stop offset="70%" stop-color="#F5EFE6" />
      <stop offset="100%" stop-color="#EFE8DC" />
    </linearGradient>

    <!-- Warm Soft Card Gradient -->
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.96)" />
      <stop offset="100%" stop-color="rgba(253, 251, 247, 0.92)" />
    </linearGradient>

    <!-- Subtle Taupe/Sand Waves -->
    <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E7DFD5" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#D8CEC1" stop-opacity="0.10" />
    </linearGradient>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="rgba(120, 113, 108, 0.08)" />
    </filter>
  </defs>

  <!-- Cream Canvas Base -->
  <rect width="1080" height="1920" fill="url(#creamBg)" />

  <!-- Organic Warm Linen Geometry / Wavy Silhouettes -->
  <path d="M -50 400 Q 200 250 540 380 T 1130 300 L 1130 -50 L -50 -50 Z" fill="url(#waveGrad)" />
  <path d="M -50 1600 Q 300 1750 650 1620 T 1130 1700 L 1130 1970 L -50 1970 Z" fill="url(#waveGrad)" />

  <!-- Elegant Double Outer Frame -->
  <rect x="42" y="42" width="996" height="1836" rx="36" fill="none" stroke="#E2DDD5" stroke-width="1.8" />
  <rect x="54" y="54" width="972" height="1812" rx="28" fill="none" stroke="#D6CEC3" stroke-width="1" stroke-dasharray="6,4" stroke-opacity="0.6" />

  <!-- Corner Minimalist Marks -->
  <g stroke="#C7BEB1" stroke-width="1.5" fill="none">
    <path d="M 72 96 L 96 96 L 96 72" />
    <path d="M 1008 96 L 984 96 L 984 72" />
    <path d="M 72 1824 L 96 1824 L 96 1848" />
    <path d="M 1008 1824 L 984 1824 L 984 1848" />
  </g>

  <!-- Header Hook Capsule Pill Badge (Matches User Screenshot: نصف دقيقة فقط 🤍) -->
  <g transform="translate(540, 175)" filter="url(#softShadow)">
    <rect x="-240" y="-36" width="480" height="72" rx="36" fill="#FFFFFF" stroke="#E5E0D8" stroke-width="1.8" />
    <text x="0" y="11" font-family="'Amiri Quran', 'Amiri', 'Noto Naskh Arabic', serif" font-size="34" font-weight="bold" fill="#292524" text-anchor="middle">
      ${escapeXml(hookText)}
    </text>
  </g>

  <!-- Main Checklist Glass Container -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="32" fill="url(#cardGrad)" stroke="#E7E2DA" stroke-width="1.8" filter="url(#softShadow)" />

  <!-- Checklist Rows -->
  ${rowsSvg}

  <!-- Divider Line Above Closing Ayah -->
  <line x1="160" y1="${ayahDividerY}" x2="920" y2="${ayahDividerY}" stroke="#E7E0D6" stroke-width="1.5" stroke-dasharray="4,4" />

  <!-- Closing Quranic Ayah ﴿وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ﴾ -->
  <text x="540" y="${ayahY}" font-family="'Amiri Quran', 'Amiri', 'Noto Naskh Arabic', serif" font-size="34" font-weight="bold" fill="#44403C" text-anchor="middle">
    ${escapeXml(closingAyah)}
  </text>

  <!-- French Meaning / Meditation (Under the Card) -->
  ${frLines.length > 0 ? `
  <text x="540" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="24" font-weight="600" fill="#57534E" text-anchor="middle">
      ${frTspans}
  </text>` : ''}

  <!-- Source Reference Pill Badge -->
  <g transform="translate(540, 1640)">
    <rect x="-300" y="-24" width="600" height="48" rx="24" fill="#FFFFFF" stroke="#D6CEC3" stroke-width="1.4" />
    <text x="0" y="8" font-family="'Plus Jakarta Sans', -apple-system, 'Segoe UI', sans-serif" font-size="22" font-weight="bold" fill="#78716C" text-anchor="middle">
      ✦ ${escapeXml(item.bookOrSurah)} — ${escapeXml(item.numberOrAyah)} ✦
    </text>
  </g>

  <!-- Footer Watermark (@kae.islamic • @kaelar.islamic) -->
  <text x="540" y="1700" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="22" font-weight="600" fill="#A8A29E" text-anchor="middle">
    @kae.islamic • @kaelar.islamic
  </text>
</svg>`;
}

// Royal Dark Gold Poster SVG Generator
function generateRoyalPosterSvg(item) {
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
    @kae.islamic • @kaelar.islamic
  </text>
</svg>`;
}

// Master Poster SVG Dispatcher (Pure SVG 1.1 native text compatible with rsvg-convert & FFmpeg)
function generatePosterSvg(item, hookOverride = '') {
  if (isMinimalCream(item)) {
    return generateMinimalCreamSvg(item, hookOverride);
  }
  return generateRoyalPosterSvg(item);
}

// Minimal Cream 5-Slide Carousel SVG Generator (Pure SVG 1.1 compatible with rsvg-convert & mobile carousels)
function generateCarouselSvgSlides(packOrItem, hookOverride = '') {
  const escapeXml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Normalize: if passed item instead of pack, pick a pack from DAILY_CAROUSEL_PACKS or build safe pack
  let pack = packOrItem;
  if (!pack || !pack.slide2) {
    pack = DAILY_CAROUSEL_PACKS[0] || {
      hook: "أذكار الصباح ☀️",
      badge: "أذكار الصباح ☀️",
      themeTitle: "Routine Adhkar & Sérénité",
      coverTitle: "« لَا يَزَالُ لِسَانُكَ رَطْبًا مِنْ ذِكْرِ اللَّهِ »",
      coverSubtitleFr: "« Que ta langue ne cesse d’être humide par l’évocation d’Allah »",
      coverNote: "✦ 5 rappels authentiques pour illuminer ta journée ✦",
      slide2: {
        item1: { dhikr: "سُبْحَانَ اللَّهِ", count: "(33 مرة)", fr: "« Gloire et pureté absolue à Allah »", merit: "✦ Plante un palmier au Paradis ✦" },
        item2: { dhikr: "الْحَمْدُ لِلَّهِ", count: "(33 مرة)", fr: "« Toutes les louanges appartiennent à Allah »", merit: "✦ Remplit la balance des mérites ✦" }
      },
      slide3: {
        item1: { dhikr: "لَا إِلَهَ إِلَّا اللَّهُ", count: "(33 مرة)", fr: "« Nul divinité digne d'adoration sauf Allah »", merit: "✦ La plus noble parole ✦" },
        item2: { dhikr: "اللَّهُ أَكْبَرُ", count: "(34 مرة)", fr: "« Allah est infiniment plus Grand que tout »", merit: "✦ Plus précieux que ce bas monde ✦" }
      },
      slide4: {
        item1: { dhikr: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: "(100 مرة)", fr: "« Je demande pardon à Allah et me repens à Lui »", merit: "✦ Efface les fautes et ouvre les cœurs ✦" },
        item2: { dhikr: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: "(10 مرات)", fr: "« Ô Allah, prie et salue notre Prophète Muhammad »", merit: "✦ 10 bénédictions en retour ✦" }
      },
      slide5: {
        closingAyah: "﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾",
        closingAyahFr: "« N’est-ce point par l’évocation d’Allah que les cœurs se tranquillisent ? »",
        source: "Sourate Ar-Ra'd — Verset 28",
        ctaTitle: "احفظ هذا الذكر لتكراره يومياً 🤍",
        ctaFr: "Enregistre ce carrousel pour réciter chaque jour et partage la récompense"
      }
    };
  }

  const badgeText = (hookOverride || pack.badge || pack.hook || "أذكار مباركة 🤍").slice(0, 24);
  const hookPill = (hookOverride || pack.hook || badgeText).slice(0, 24);
  const coverTitle = pack.coverTitle || "« لَا يَزَالُ لِسَانُكَ رَطْبًا مِنْ ذِكْرِ اللَّهِ »";
  const coverSubtitleFr = pack.coverSubtitleFr || "« Que ta langue ne cesse d’être humide par l’évocation d’Allah »";
  const coverNote = pack.coverNote || "✦ 5 rappels authentiques pour illuminer ta journée ✦";

  const getHeaderAndDefs = (slideIndex, totalSlides = 5) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="creamBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FCFAF6" />
      <stop offset="35%" stop-color="#FAF5EE" />
      <stop offset="70%" stop-color="#F5EFE6" />
      <stop offset="100%" stop-color="#EFE8DC" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.96)" />
      <stop offset="100%" stop-color="rgba(253, 251, 247, 0.92)" />
    </linearGradient>
    <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E7DFD5" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#D8CEC1" stop-opacity="0.10" />
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="rgba(120, 113, 108, 0.10)" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1920" fill="url(#creamBg)" />
  <path d="M -50 400 Q 200 250 540 380 T 1130 300 L 1130 -50 L -50 -50 Z" fill="url(#waveGrad)" />
  <path d="M -50 1600 Q 300 1750 650 1620 T 1130 1700 L 1130 1970 L -50 1970 Z" fill="url(#waveGrad)" />

  <!-- Double Outer Frame -->
  <rect x="42" y="42" width="996" height="1836" rx="36" fill="none" stroke="#E2DDD5" stroke-width="1.8" />
  <rect x="54" y="54" width="972" height="1812" rx="28" fill="none" stroke="#D6CEC3" stroke-width="1" stroke-dasharray="6,4" stroke-opacity="0.6" />

  <!-- Corner Minimal Marks -->
  <g stroke="#C7BEB1" stroke-width="1.5" fill="none">
    <path d="M 72 96 L 96 96 L 96 72" />
    <path d="M 1008 96 L 984 96 L 984 72" />
    <path d="M 72 1824 L 96 1824 L 96 1848" />
    <path d="M 1008 1824 L 984 1824 L 984 1848" />
  </g>

  <!-- Top Counter Badge -->
  <g transform="translate(540, 110)">
    <rect x="-110" y="-23" width="220" height="46" rx="23" fill="rgba(255, 255, 255, 0.92)" stroke="#E2DDD5" stroke-width="1.2" />
    <text x="0" y="7" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="20" font-weight="700" fill="#78716C" text-anchor="middle">${slideIndex} / ${totalSlides} 🤍</text>
  </g>

  <!-- Footer Watermark -->
  <text x="540" y="1865" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="22" font-weight="600" fill="#A8A29E" text-anchor="middle">
    @kae.islamic • @kaelar.islamic
  </text>`;

  const slides = [];

  // SLIDE 1: Cover Hook Slide
  const titleLines = wrapWords(coverTitle, 28);
  const titleFontSize = titleLines.length > 2 ? 36 : 42;
  const titleLineHeight = titleLines.length > 2 ? 48 : 56;
  const titleStartY = 680 - ((titleLines.length - 1) * titleLineHeight) / 2;

  const subLines = wrapWords(coverSubtitleFr, 42);
  const subStartY = 870;

  const noteLines = wrapWords(coverNote, 46);
  const noteStartY = 1040;

  slides.push(`${getHeaderAndDefs(1, 5)}
  <!-- Header Hook Capsule Pill -->
  <g transform="translate(540, 340)" filter="url(#softShadow)">
    <rect x="-240" y="-38" width="480" height="76" rx="38" fill="#FFFFFF" stroke="#E5E0D8" stroke-width="2" />
    <text x="0" y="12" font-family="'Amiri Quran', 'Amiri', serif" font-size="30" font-weight="bold" fill="#1C1917" text-anchor="middle">
      ${escapeXml(hookPill)}
    </text>
  </g>

  <!-- Main Card -->
  <rect x="70" y="440" width="940" height="880" rx="32" fill="url(#cardGrad)" stroke="#E7E2DA" stroke-width="2" filter="url(#softShadow)" />

  <!-- Emblem -->
  <g transform="translate(540, 540) scale(1.2)" stroke="#d97706" stroke-width="1.5" fill="rgba(217, 119, 6, 0.12)">
    <rect x="-18" y="-18" width="36" height="36" rx="4" />
    <rect x="-18" y="-18" width="36" height="36" rx="4" transform="rotate(45)" />
    <circle cx="0" cy="0" r="7" fill="#d97706" />
  </g>

  <!-- Title -->
  <text font-family="'Amiri Quran', 'Amiri', serif" font-size="${titleFontSize}" font-weight="bold" fill="#1C1917" text-anchor="middle">
    ${titleLines.map((l, idx) => `<tspan x="540" y="${titleStartY + idx * titleLineHeight}">${escapeXml(l)}</tspan>`).join('')}
  </text>

  <!-- Divider -->
  <line x1="280" y1="810" x2="800" y2="810" stroke="#E2DDD5" stroke-width="1.5" stroke-dasharray="6,4" />

  <!-- Subtitle FR -->
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="25" font-weight="600" fill="#44403C" text-anchor="middle">
    ${subLines.map((l, idx) => `<tspan x="540" y="${subStartY + idx * 38}">${escapeXml(l)}</tspan>`).join('')}
  </text>

  <!-- Merit Note -->
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="21" font-weight="bold" fill="#d97706" text-anchor="middle">
    ${noteLines.map((l, idx) => `<tspan x="540" y="${noteStartY + idx * 34}">${escapeXml(l)}</tspan>`).join('')}
  </text>

  <!-- CTA Swipe Button -->
  <g transform="translate(540, 1440)" filter="url(#softShadow)">
    <rect x="-190" y="-34" width="380" height="68" rx="34" fill="#1C1917" />
    <text x="0" y="9" font-family="'Plus Jakarta Sans', sans-serif" font-size="23" font-weight="700" fill="#FFFFFF" text-anchor="middle">
      Glisse pour réciter ➔
    </text>
  </g>
</svg>`);

  // Helper for Slides 2, 3, 4
  function renderCard(item, yCenter) {
    const arLines = wrapWords(item.dhikr, 32);
    const arFontSize = arLines.length > 2 ? 34 : (arLines.length > 1 ? 40 : 48);
    const arLineHeight = arLines.length > 2 ? 46 : 54;
    const arStartY = yCenter - 80 - ((arLines.length - 1) * arLineHeight) / 2;

    const frLines = wrapWords(item.fr, 44);
    const frStartY = yCenter + 25;

    const meritLines = wrapWords(item.merit, 46);
    const meritStartY = yCenter + 155;

    return `
  <!-- Dhikr Card at Y=${yCenter} -->
  <g transform="translate(540, ${yCenter})" filter="url(#softShadow)">
    <rect x="-460" y="-260" width="920" height="520" rx="30" fill="url(#cardGrad)" stroke="#E7E2DA" stroke-width="2" />
    <!-- Count Badge -->
    <rect x="230" y="-230" width="180" height="42" rx="14" fill="#F5F5F4" stroke="#E7E5E4" stroke-width="1" />
    <text x="320" y="-202" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="bold" fill="#78716C" text-anchor="middle">${escapeXml(item.count || '(مرة واحدة)')}</text>
  </g>
  <!-- Arabic -->
  <text font-family="'Amiri Quran', 'Amiri', serif" font-size="${arFontSize}" font-weight="bold" fill="#1C1917" text-anchor="middle">
    ${arLines.map((l, idx) => `<tspan x="540" y="${arStartY + idx * arLineHeight}">${escapeXml(l)}</tspan>`).join('')}
  </text>
  <!-- French -->
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="600" fill="#44403C" text-anchor="middle">
    ${frLines.map((l, idx) => `<tspan x="540" y="${frStartY + idx * 36}">${escapeXml(l)}</tspan>`).join('')}
  </text>
  <!-- Merit -->
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="bold" fill="#d97706" text-anchor="middle">
    ${meritLines.map((l, idx) => `<tspan x="540" y="${meritStartY + idx * 32}">${escapeXml(l)}</tspan>`).join('')}
  </text>`;
  }

  // Slide 2, 3, 4
  const slideKeys = ['slide2', 'slide3', 'slide4'];
  slideKeys.forEach((key, idx) => {
    const sData = pack[key] || {
      item1: { dhikr: "سُبْحَانَ اللَّهِ", count: "(33x)", fr: "« Gloire à Allah »", merit: "✦ Mérite sublime ✦" },
      item2: { dhikr: "الْحَمْدُ لِلَّهِ", count: "(33x)", fr: "« Louange à Allah »", merit: "✦ Remplit la balance ✦" }
    };
    slides.push(`${getHeaderAndDefs(idx + 2, 5)}
    ${renderCard(sData.item1, 560)}
    ${renderCard(sData.item2, 1180)}
</svg>`);
  });

  // Slide 5: Closing Ayah & CTA
  const slide5Data = pack.slide5 || {
    closingAyah: "﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾",
    closingAyahFr: "« N’est-ce point par l’évocation d’Allah que les cœurs se tranquillisent ? »",
    source: "Sourate Ar-Ra'd — Verset 28",
    ctaTitle: "احفظ هذا الذكر لتكراره يومياً 🤍",
    ctaFr: "Enregistre ce carrousel pour réciter chaque jour et partage la récompense"
  };

  const ayahLines = wrapWords(slide5Data.closingAyah, 30);
  const ayahFontSize = ayahLines.length > 2 ? 34 : 40;
  const ayahLineHeight = 52;
  const ayahStartY = 540 - ((ayahLines.length - 1) * ayahLineHeight) / 2;

  const ayahFrLines = wrapWords(slide5Data.closingAyahFr, 44);
  const ayahFrStartY = 720;

  const ctaFrLines = wrapWords(slide5Data.ctaFr, 42);

  slides.push(`${getHeaderAndDefs(5, 5)}
  <!-- Closing Card -->
  <g transform="translate(540, 600)" filter="url(#softShadow)">
    <rect x="-460" y="-270" width="920" height="540" rx="32" fill="url(#cardGrad)" stroke="#E7E2DA" stroke-width="2" />
    <!-- Emblem -->
    <circle cx="0" cy="-190" r="24" fill="rgba(217, 119, 6, 0.12)" stroke="#d97706" stroke-width="1.5" />
    <text x="0" y="-180" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="bold" fill="#d97706" text-anchor="middle">۞</text>
  </g>

  <!-- Ayah Arabic -->
  <text font-family="'Amiri Quran', 'Amiri', serif" font-size="${ayahFontSize}" font-weight="bold" fill="#1C1917" text-anchor="middle">
    ${ayahLines.map((l, idx) => `<tspan x="540" y="${ayahStartY + idx * ayahLineHeight}">${escapeXml(l)}</tspan>`).join('')}
  </text>

  <!-- Ayah French -->
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="600" fill="#44403C" text-anchor="middle">
    ${ayahFrLines.map((l, idx) => `<tspan x="540" y="${ayahFrStartY + idx * 36}">${escapeXml(l)}</tspan>`).join('')}
  </text>

  <!-- Source Badge -->
  <g transform="translate(540, 810)">
    <rect x="-240" y="-23" width="480" height="46" rx="23" fill="#F5F5F4" stroke="#E7E5E4" stroke-width="1" />
    <text x="0" y="8" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="bold" fill="#78716C" text-anchor="middle">✦ ${escapeXml(slide5Data.source)} ✦</text>
  </g>

  <!-- CTA Box -->
  <g transform="translate(540, 1220)" filter="url(#softShadow)">
    <rect x="-460" y="-230" width="920" height="460" rx="32" fill="#1C1917" stroke="#292524" stroke-width="2" />
    <text x="0" y="-110" font-family="'Amiri Quran', 'Amiri', serif" font-size="38" font-weight="bold" fill="#FEF08A" text-anchor="middle">
      ${escapeXml(slide5Data.ctaTitle)}
    </text>
  </g>
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="25" font-weight="600" fill="#F8FAFC" text-anchor="middle">
    ${ctaFrLines.map((l, idx) => `<tspan x="540" y="${1180 + idx * 38}">${escapeXml(l)}</tspan>`).join('')}
  </text>
  <text x="540" y="1290" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="500" fill="#CBD5E1" text-anchor="middle">
    Partage pour récolter les récompenses (Sadaqah Jariyah 🤲)
  </text>
  <text x="540" y="1370" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="bold" fill="#94A3B8" text-anchor="middle">
    Sauvegarde 🔖 • Partage ↗️ • Like ❤️
  </text>
</svg>`);

  return slides;
}


// Dynamic Viral Islamic Hashtags Generator (TikTok FYP, Instagram Reels Explore, YouTube Shorts)
function getViralIslamicTags(type, platform = 'all', limit = 14) {
  const typeMap = {
    quran_verse: ['#quranrecitation', '#quranverses', '#surah', '#tilawat', '#beautifultilawat', '#holyquran', '#قرآن', '#تلاوة'],
    sahih_hadith: ['#hadith', '#hadithoftheday', '#sahihbukhari', '#sahihmuslim', '#propheticwisdom', '#sunnahrasul', '#حديث', '#سنة'],
    authentic_dua: ['#dua', '#dhikr', '#adhkar', '#hisnulmuslim', '#supplication', '#istighfar', '#subhanallah', '#دعاء', '#أذكار'],
    adhkar_routine: ['#adhkar', '#dhikr', '#subhanallah', '#alhamdulillah', '#astaghfirullah', '#salawat', '#نصف_دقيقة', '#أذكار', '#راحة_نفسية'],
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
    selected.add('#kaelar_islamic');
    selected.add('#kaelarislamic');
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
    selected.add('#kaeislamic');
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
  const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

  // Candidates not published in the last 60 days
  const eligible = candidates.filter(c => {
    const hash = contentHash(c.arabicText);
    const verseId = `${c.surahNumber}:${c.ayahNumber}`;
    const lastPub = Math.max(lastPublishedTime.get(hash) || 0, lastPublishedTime.get(verseId) || 0);
    return (now - lastPub) > SIXTY_DAYS_MS;
  });

  const sortOldest = (list) => {
    return list.slice().sort((a, b) => {
      const aHash = contentHash(a.arabicText);
      const bHash = contentHash(b.arabicText);
      const aLast = Math.max(lastPublishedTime.get(aHash) || 0, lastPublishedTime.get(`${a.surahNumber}:${a.ayahNumber}`) || 0);
      const bLast = Math.max(lastPublishedTime.get(bHash) || 0, lastPublishedTime.get(`${b.surahNumber}:${b.ayahNumber}`) || 0);
      return aLast - bLast;
    });
  };

  if (eligible.length > 0) {
    const sorted = sortOldest(eligible);
    // Pick among the top 3 oldest candidates to avoid static repetition
    const topPool = sorted.slice(0, Math.min(3, sorted.length));
    const picked = topPool[Math.floor(Math.random() * topPool.length)];
    console.log(`📋 ${eligible.length}/${candidates.length} eligible (60d cooldown) for "${theme.category}". Selected: "${picked.bookOrSurah}"`);
    return picked;
  }

  // If all were published within 60 days, pick among the absolute least-recently published (LRU pool)
  const sortedAll = sortOldest(candidates);
  const topPool = sortedAll.slice(0, Math.min(3, sortedAll.length));
  const picked = topPool[Math.floor(Math.random() * topPool.length)];
  console.log(`🔄 Picking least-recently published item from top pool for "${theme.category}". Selected: "${picked.bookOrSurah}"`);
  return picked;
}

// Time-Aware Sunnah Scheduler: selects authentic theme based on prayer time & day
function getSunnahThemeForCurrentTime(now = new Date(), reg = null) {
  const day = now.getUTCDay(); // 0 = Sun, 4 = Thu, 5 = Fri
  const hour = now.getUTCHours(); // 00, 06, 12, 18 UTC
  const currentIdx = reg?.currentIndex ?? Math.floor(Math.random() * THEMES.length);

  // 1. Spécial Jumu'ah: Thursday night (>=16:00 UTC) through all of Friday
  if ((day === 4 && hour >= 16) || day === 5) {
    console.log("🕌 Sunnah Time: Spécial Jumu'ah (Sourate Al-Kahf & Salawat)");
    if (hour <= 14) {
      return THEMES.find(t => t.id === 'theme-jumuah') || THEMES[6];
    }
    return (currentIdx % 2 === 0)
      ? (THEMES.find(t => t.id === 'theme-jumuah') || THEMES[6])
      : (THEMES.find(t => t.id === 'theme-adhkar') || THEMES[2]);
  }

  // 2. Tahajjud & Prière de Nuit: 23:00 - 04:00 UTC (Qiyam al-Layl & Istighfar)
  if (hour >= 23 || hour <= 4) {
    console.log("🌙 Sunnah Time: Tahajjud & Qiyam al-Layl / Routine Nuit");
    return (currentIdx % 2 === 0)
      ? (THEMES.find(t => t.id === 'theme-tahajjud') || THEMES[4])
      : (THEMES.find(t => t.id === 'theme-adhkar') || THEMES[2]);
  }

  // 3. Morning Invocations & Protection: 05:00 - 09:00 UTC (Fajr & Adhkar as-Sabah)
  if (hour >= 5 && hour <= 9) {
    console.log("🌅 Sunnah Time: Adhkar as-Sabah & Routine Sérénité 🤍");
    return (currentIdx % 2 === 0)
      ? (THEMES.find(t => t.id === 'theme-adhkar') || THEMES[2])
      : (THEMES.find(t => t.id === 'theme-dua') || THEMES[3]);
  }

  // 4. Evening Invocations & Gratitude: 16:00 - 20:00 UTC (Maghrib & Adhkar al-Masaa)
  if (hour >= 16 && hour <= 20) {
    console.log("🌆 Sunnah Time: Adhkar al-Masaa & Sagesse du Soir (Tawakkul)");
    const eveningThemes = ['theme-reminder', 'theme-adhkar', 'theme-hadith'];
    const chosenId = eveningThemes[currentIdx % eveningThemes.length];
    return THEMES.find(t => t.id === chosenId) || THEMES[5];
  }

  // 5. General / Midday Slots (10:00 - 15:00 UTC): Balanced rotation between Quran, Hadith, and Adhkar
  const middayThemes = ['theme-quran', 'theme-hadith', 'theme-adhkar'];
  const chosenId = middayThemes[currentIdx % middayThemes.length];
  console.log(`☀️ Midday Rotation: ${chosenId}`);
  return THEMES.find(t => t.id === chosenId) || THEMES[0];
}

// Main Execution Routine
async function runCloudAutoPilot() {
  console.log('🕋 === Kaelar Islamic AI Studio — 24/7 Cloud Auto-Pilot Runner === 🕋');
  console.log(`⏰ Execution Time: ${new Date().toISOString()}`);

  const reg = loadRegistry();
  const currentIdx = reg.currentIndex || 0;

  // Intelligently select theme aligned with Sunnah and prayer time
  const theme = getSunnahThemeForCurrentTime(new Date(), reg);
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

  // 2. Write SVG Poster with Dynamic 3-Second Viral Hook
  const viralHook = pickViralHook(item, reg);
  console.log(`🪝 Active Viral 3-Second Hook: "${viralHook}"`);
  fs.writeFileSync(svgPath, generatePosterSvg(item, viralHook), 'utf8');

  // 1. Determine Carousel eligibility: strictly ONCE per day (20-hour minimum cooldown)
  const lastCarouselTime = reg.lastCarouselRunAt ? new Date(reg.lastCarouselRunAt).getTime() : 0;
  const hoursSinceLastCarousel = (Date.now() - lastCarouselTime) / (1000 * 60 * 60);
  const currentUtcHour = new Date().getUTCHours();
  const isMorningSlot = (currentUtcHour >= 5 && currentUtcHour <= 10);

  // Exactly ONCE a day: only when 20+ hours have passed AND either in morning/adhkar or if > 23h elapsed
  const isCarouselCycle = (hoursSinceLastCarousel >= 20) && (isMorningSlot || theme.id === 'theme-adhkar' || hoursSinceLastCarousel >= 23);
  console.log(`📑 Cycle Format: ${isCarouselCycle ? 'Carrousel Quotidien Inédit 5p (Instagram) + Reel Vidéo (TikTok / YouTube)' : 'Reel Vidéo Plein Écran (Toutes plateformes)'}`);
  console.log(`⏳ Cooldown Carrousel: ${hoursSinceLastCarousel.toFixed(1)}h écoulées depuis le dernier carrousel (Seuil: 20h)`);

  let carouselSlideUrls = [];
  let activeCarouselPack = null;

  if (isCarouselCycle && DAILY_CAROUSEL_PACKS.length > 0) {
    const publishedPackIds = Array.isArray(reg.publishedCarouselPackIds) ? reg.publishedCarouselPackIds : [];
    activeCarouselPack = DAILY_CAROUSEL_PACKS.find(p => !publishedPackIds.includes(p.id));
    if (!activeCarouselPack) {
      // Cycled through all 30 packs, loop cleanly
      activeCarouselPack = DAILY_CAROUSEL_PACKS[publishedPackIds.length % DAILY_CAROUSEL_PACKS.length];
    }

    console.log(`🌟 Selected Daily Carousel Pack [Jour ${activeCarouselPack.dayNumber || 1}]: "${activeCarouselPack.themeTitle}" (${activeCarouselPack.hook})`);
    console.log('🎨 Generating 5 High-Quality SVG Carousel Slides (Cream Aesthetic, No Text Overflow)...');
    const svgSlides = generateCarouselSvgSlides(activeCarouselPack);
    for (let i = 0; i < svgSlides.length; i++) {
      const slideNum = i + 1;
      const slideSvgPath = path.join(tempDir, `carousel_slide_${slideNum}.svg`);
      const slidePngPath = path.join(tempDir, `carousel_slide_${slideNum}.png`);
      fs.writeFileSync(slideSvgPath, svgSlides[i], 'utf8');
      try {
        execSync(`rsvg-convert -w 1080 -h 1920 "${slideSvgPath}" -o "${slidePngPath}"`, { stdio: 'ignore' });
      } catch {
        fs.copyFileSync(slideSvgPath, slidePngPath);
      }
      console.log(`📡 Uploading Carousel Slide ${slideNum}/5 to Cloudinary...`);
      const slideUrl = await uploadToCloudinary(slidePngPath, 'image');
      carouselSlideUrls.push(slideUrl);
      console.log(`✅ Slide ${slideNum}/5 uploaded: ${slideUrl}`);
    }
  }

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
      const waveColor = isMinimalCream(item) ? '0xd97706@0.80' : '0xfbbf24@0.85';
      const cinematicCmd = `ffmpeg -y -loop 1 -framerate 30 -i "${pngPath}" -i "${audioPath}" -filter_complex "[0:v]scale=1144:2034,zoompan=z='min(zoom+0.0005,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30[vbg];[1:a]showwaves=s=880x90:mode=line:colors=${waveColor}[waves];[vbg][waves]overlay=(W-w)/2:H-220:shortest=1[vout]" -map "[vout]" -map 1:a -c:v libx264 -preset veryfast -profile:v high -level 4.1 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 -movflags +faststart -shortest "${videoPath}"`;
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

  // 6. Post with Viral Optimized Tags & Sunnah Event Triggers to Instagram, TikTok & YouTube Shorts
  const igTags = getViralIslamicTags(item.type, 'instagram');
  const ttTags = getViralIslamicTags(item.type, 'tiktok');
  const ytTags = getViralIslamicTags(item.type, 'youtube');

  // Sunnah & Day Event Triggers (Monday/Thursday fasting, Friday Sa'at al-Istijabah)
  const nowDay = new Date().getUTCDay();
  const nowHour = new Date().getUTCHours();
  let sunnahCallout = '';
  let extraTags = '';
  if (nowDay === 1) {
    sunnahCallout = '🌿 سنة صيام يوم الاثنين — ترفع فيه الأعمال إلى الله 🤍\n\n';
    extraTags = ' #صيام_الاثنين #SunnahFasting';
  } else if (nowDay === 4) {
    sunnahCallout = '🌿 سنة صيام يوم الخميس — ترفع فيه الأعمال إلى الله 🤍\n\n';
    extraTags = ' #صيام_الخميس #SunnahFasting';
  } else if (nowDay === 5 && nowHour >= 13 && nowHour <= 19) {
    sunnahCallout = '🤲 ساعة الاستجابة يوم الجمعة — ارفع حاجتك إلى الله ولا تفوّت الدعاء قبل الغروب 🤍\n\n';
    extraTags = ' #ساعة_الاستجابة #جمعة_مباركة';
  }

  const cleanCaptionFr = (item.translationFr || '').replace(/^[«"“' ]+|[»"”' ]+$/g, '').trim();

  // Custom caption for Carousel post if carousel cycle, else standard Video Reel caption
  const igCaption = (isCarouselCycle && activeCarouselPack && carouselSlideUrls.length > 0)
    ? `${activeCarouselPack.badge} • ${activeCarouselPack.themeTitle}\n\n${activeCarouselPack.coverTitle}\n\n« ${activeCarouselPack.coverSubtitleFr.replace(/^[«"“' ]+|[»"”' ]+$/g, '')} »\n\n📌 5 rappels authentiques à faire défiler et réciter.\n📍 ${activeCarouselPack.slide5.source}\n\n🤍 Enregistre ce carrousel pour le retrouver facilement et partage pour la récompense (Sadaqah Jariyah 🤲).\n\n${igTags}${extraTags}`
    : `${sunnahCallout}${item.arabicText}\n\n« ${cleanCaptionFr} »\n\n📍 ${item.bookOrSurah} — ${item.numberOrAyah}\n\n${igTags}${extraTags}`;

  const ttCaption = `${sunnahCallout}${item.arabicText}\n\n« ${cleanCaptionFr} »\n\n📍 ${item.bookOrSurah} — ${item.numberOrAyah}\n\n${ttTags}${extraTags}`;
  const ytCaption = `${item.bookOrSurah} — ${item.numberOrAyah} 🕋\n\n${sunnahCallout}${item.arabicText}\n\n« ${cleanCaptionFr} »\n\n${ytTags}${extraTags}`;

  // 6a. Publish to Instagram (5-Slide Carousel if carousel cycle, else Reel)
  try {
    if (isCarouselCycle && carouselSlideUrls.length > 0) {
      console.log('📤 Publishing Multi-Slide Carousel (5 slides) to Instagram (@kae.islamic)...');
      const igPostTitle = activeCarouselPack ? `${activeCarouselPack.badge} • ${activeCarouselPack.themeTitle}` : `${item.bookOrSurah} — ${item.numberOrAyah}`;
      const igRes = await publishToBuffer(INSTAGRAM_CHANNEL_ID, igCaption, carouselSlideUrls, 'instagram', igPostTitle);
      if (igRes?.status || igRes?.id) {
        console.log('✅ Instagram 5-Slide Carousel queued successfully in Buffer!');
      } else if (igRes?.isRateLimited) {
        console.warn(`🛑 Instagram Buffer rate-limited: ${igRes?.error || 'Rate limit reached'}`);
      } else {
        console.warn(`⚠️ Instagram Buffer issue: ${igRes?.error || igRes?.message || 'Non-fatal'}`);
      }
    } else {
      console.log('📤 Publishing to Instagram Reel (@kae.islamic) with Viral Tags...');
      const igRes = await publishToBuffer(INSTAGRAM_CHANNEL_ID, igCaption, publicVideoUrl, 'instagram', `${item.bookOrSurah} — ${item.numberOrAyah}`);
      if (igRes?.status || igRes?.id) {
        console.log('✅ Instagram Reel publication queued successfully in Buffer!');
      } else if (igRes?.isRateLimited) {
        console.warn(`🛑 Instagram Buffer rate-limited: ${igRes?.error || 'Rate limit reached'}`);
      } else {
        console.warn(`⚠️ Instagram Buffer issue: ${igRes?.error || igRes?.message || 'Non-fatal'}`);
      }
    }
  } catch (err) {
    console.warn('⚠️ Instagram publication notice:', err.message);
  }

  // Inter-platform throttle delay (5s) to avoid Buffer burst limits
  if (!bufferRateLimitState.isLimited) {
    console.log('⏳ Throttling: waiting 5 seconds before next platform dispatch...');
    await sleep(5000);
  }

  // 6b. Publish to TikTok (Video Reel)
  try {
    if (bufferRateLimitState.isLimited) {
      console.log('⏸️ Skipping TikTok Buffer dispatch (Buffer API 24h rate limit active).');
    } else {
      console.log('📤 Publishing to TikTok (@kaelar.islamic) with FYP Booster Tags...');
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
  if (isCarouselCycle && activeCarouselPack && carouselSlideUrls.length > 0) {
    reg.lastCarouselRunAt = reg.lastRunAt || new Date().toISOString();
    reg.lastCarouselPackId = activeCarouselPack.id;
    if (!Array.isArray(reg.publishedCarouselPackIds)) reg.publishedCarouselPackIds = [];
    reg.publishedCarouselPackIds.push(activeCarouselPack.id);
  }
  reg.publishedItems.push({
    id: `autopilot-${Date.now()}`,
    timestamp: reg.lastRunAt,
    theme: theme.title,
    type: item.type,
    format: (isCarouselCycle && carouselSlideUrls.length > 0) ? 'carousel' : 'reel',
    carouselPackId: (isCarouselCycle && activeCarouselPack) ? activeCarouselPack.id : undefined,
    bookOrSurah: (isCarouselCycle && activeCarouselPack) ? `${activeCarouselPack.badge} • ${activeCarouselPack.themeTitle}` : item.bookOrSurah,
    numberOrAyah: (isCarouselCycle && activeCarouselPack) ? activeCarouselPack.slide5.source : item.numberOrAyah,
    surahNumber: item.surahNumber,
    ayahNumber: item.ayahNumber,
    arabicText: (isCarouselCycle && activeCarouselPack) ? activeCarouselPack.coverTitle : item.arabicText,
    translationFr: (isCarouselCycle && activeCarouselPack) ? activeCarouselPack.coverSubtitleFr : item.translationFr,
    translationEn: item.translationEn,
    contentHash: contentHash(item.arabicText),
    audioUrl: item.audioUrl,
    videoUrl: publicVideoUrl,
    carouselSlides: carouselSlideUrls,
    cardImageUrl: (carouselSlideUrls.length > 0) ? carouselSlideUrls[0] : (publicVideoUrl ? publicVideoUrl.replace(/\.mp4$/, '.png') : ''),
    platforms: YOUTUBE_CHANNEL_ID ? ['instagram', 'tiktok', 'youtube'] : ['instagram', 'tiktok'],
    reciterName: item.reciterName || 'Mishary Rashid Alafasy'
  });
  saveRegistry(reg);

  // 8. Send Discord Notification
  console.log('🔔 Sending Discord notification...');
  await sendDiscordNotification(item, theme, publicVideoUrl, carouselSlideUrls);

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
  generateCarouselSvgSlides,
  VERIFIED_ITEMS, 
  loadRegistry 
};
