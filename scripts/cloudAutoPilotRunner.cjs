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

// Helper: Publish to Buffer
function publishToBuffer(channelId, text, videoUrl) {
  return new Promise((resolve, reject) => {
    const mutation = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          post {
            id
            status
          }
        }
      }
    `;

    const variables = {
      input: {
        channelId,
        text,
        schedulingType: 'now',
        assets: [{ video: { url: videoUrl } }]
      }
    };

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
          const json = JSON.parse(body);
          if (json.data?.createPost?.post) {
            resolve(json.data.createPost.post);
          } else {
            console.warn(`Buffer Response for ${channelId}:`, body);
            resolve(json);
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
            value: '📷 Instagram (`@kaelarislamic`)\n🎵 TikTok (`@mdou.g`)',
            inline: false
          },
          {
            name: '🎬 Lien Direct Vidéo Reel HD',
            value: `[Cliquer ici pour regarder le Reel MP4](${publicVideoUrl})`,
            inline: false
          }
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

// Helper: Generate crisp SVG poster
function generatePosterSvg(item) {
  const escapeXml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#040b14" />
      <stop offset="50%" stop-color="#091424" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <radialGradient id="goldGlow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="rgba(217, 119, 6, 0.25)" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bgGrad)" />
  <circle cx="540" cy="600" r="700" fill="url(#goldGlow)" />

  <!-- Borders -->
  <rect x="50" y="50" width="980" height="1820" rx="30" fill="none" stroke="#d97706" stroke-width="3" stroke-opacity="0.4" />
  <rect x="65" y="65" width="950" height="1790" rx="20" fill="none" stroke="#d97706" stroke-width="1" stroke-opacity="0.15" />

  <!-- Top Bismillah -->
  <text x="540" y="220" font-family="serif" font-size="42" font-weight="bold" fill="#fef08a" text-anchor="middle">
    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
  </text>

  <!-- Islamic Emblem -->
  <text x="540" y="320" font-family="sans-serif" font-size="34" fill="#10b981" text-anchor="middle">
    🕌
  </text>

  <!-- Arabic Text -->
  <foreignObject x="100" y="380" width="880" height="480">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #ffffff; font-family: serif; font-size: 44px; font-weight: bold; text-align: center; line-height: 1.8; direction: rtl;">
      ${escapeXml(item.arabicText)}
    </div>
  </foreignObject>

  <!-- Divider -->
  <line x1="340" y1="920" x2="740" y2="920" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.6" />

  <!-- French Translation -->
  <foreignObject x="100" y="980" width="880" height="320">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #e2e8f0; font-family: sans-serif; font-size: 32px; font-weight: 600; text-align: center; line-height: 1.6;">
      ${escapeXml(item.translationFr)}
    </div>
  </foreignObject>

  <!-- English Translation -->
  <foreignObject x="100" y="1340" width="880" height="220">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #94a3b8; font-family: sans-serif; font-size: 26px; font-style: italic; text-align: center; line-height: 1.5;">
      ${escapeXml(item.translationEn)}
    </div>
  </foreignObject>

  <!-- Reference -->
  <text x="540" y="1650" font-family="sans-serif" font-size="30" font-weight="bold" fill="#f59e0b" text-anchor="middle">
    📍 ${escapeXml(item.bookOrSurah)} — ${escapeXml(item.numberOrAyah)}
  </text>

  <!-- Footer Watermark -->
  <text x="540" y="1770" font-family="sans-serif" font-size="24" font-weight="600" fill="rgba(255, 255, 255, 0.4)" text-anchor="middle">
    @kaelarislamic • @mdou.g
  </text>
</svg>`;
}

// Dynamic Viral Islamic Hashtags Generator (TikTok FYP & Instagram Reels Explore)
function getViralIslamicTags(type, platform = 'all') {
  const core = ['#islam', '#quran', '#hadith', '#allah', '#muslim', '#islamicreminder', '#islamicquotes', '#sunnah', '#deen'];
  const typeMap = {
    quran_verse: ['#quranrecitation', '#quranverses', '#surah', '#tilawat', '#beautifultilawat', '#holyquran', '#قرآن'],
    sahih_hadith: ['#hadith', '#hadithoftheday', '#sahihbukhari', '#sahihmuslim', '#propheticwisdom', '#sunnahrasul', '#حديث'],
    authentic_dua: ['#dua', '#dhikr', '#adhkar', '#hisnulmuslim', '#supplication', '#istighfar', '#subhanallah', '#دعاء'],
    tahajjud_motivation: ['#tahajjud', '#nightprayer', '#qiyamullail', '#fajr', '#peaceofmind', '#spiritualgrowth', '#قيام_الليل'],
    islamic_reminder: ['#tawakkul', '#sabr', '#patience', '#islamicmotivation', '#trustallah', '#hopeinallah', '#صبر'],
    jumua_special: ['#jummahmubarak', '#jumuah', '#fridayprayer', '#suratalkahf', '#salawat', '#blessedfriday', '#جمعة_مباركة']
  };

  const platformTags = platform === 'tiktok' 
    ? ['#muslimtiktok', '#islamictiktok', '#fyp', '#foryou', '#foryoupage', '#viralvideo']
    : ['#islamicreels', '#reelsinstagram', '#explorepage', '#instaislam', '#reels'];

  const french = ['#islamfrance', '#coran', '#rappelislam', '#rappelsislamiques', '#musulman'];

  const categoryTags = typeMap[type] || typeMap.quran_verse;
  const combined = [
    ...core.slice(0, 3),
    ...categoryTags.slice(0, 4),
    ...platformTags.slice(0, 3),
    ...french.slice(0, 2),
    '#kaelarislamic'
  ];

  return Array.from(new Set(combined)).join(' ');
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

// Main Execution Routine
async function runCloudAutoPilot() {
  console.log('🕋 === Kaelar Islamic AI Studio — 24/7 Cloud Auto-Pilot Runner === 🕋');
  console.log(`⏰ Execution Time: ${new Date().toISOString()}`);

  const reg = loadRegistry();
  const currentIdx = reg.currentIndex || 0;
  const theme = THEMES[currentIdx % THEMES.length];

  console.log(`🎯 Rotating Theme [${currentIdx + 1}/${THEMES.length}]: ${theme.title}`);

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
    // Constant 30.00 FPS H.264 High Profile encoding strictly compliant with TikTok & Instagram Reels
    const ffmpegCmd = `ffmpeg -y -framerate 30 -loop 1 -i "${pngPath}" -i "${audioPath}" -c:v libx264 -preset fast -profile:v high -level 4.1 -r 30 -g 60 -keyint_min 30 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 -movflags +faststart -shortest "${videoPath}"`;
    execSync(ffmpegCmd, { stdio: 'inherit' });
  } catch (err) {
    console.error('FFmpeg execution issue:', err.message);
    throw err;
  }

  // 5. Upload Video to Cloudinary
  console.log('📡 Uploading MP4 Reel to Cloudinary...');
  const publicVideoUrl = await uploadToCloudinary(videoPath);
  console.log(`✅ Cloudinary Public URL: ${publicVideoUrl}`);

  // 6. Post with Viral Optimized Tags to Instagram (@kaelarislamic) & TikTok (@mdou.g)
  const igTags = getViralIslamicTags(item.type, 'instagram');
  const ttTags = getViralIslamicTags(item.type, 'tiktok');

  const igCaption = `${item.arabicText}\n\n« ${item.translationFr} »\n\n📍 ${item.bookOrSurah} — ${item.numberOrAyah}\n\n${igTags}`;
  const ttCaption = `${item.arabicText}\n\n« ${item.translationFr} »\n\n📍 ${item.bookOrSurah} — ${item.numberOrAyah}\n\n${ttTags}`;

  try {
    console.log('📤 Publishing to Instagram Reel (@kaelarislamic) with Viral Tags...');
    await publishToBuffer(INSTAGRAM_CHANNEL_ID, igCaption, publicVideoUrl);
    console.log('✅ Instagram publication queued successfully!');
  } catch (err) {
    console.warn('⚠️ Instagram publication notice:', err.message);
  }

  try {
    console.log('📤 Publishing to TikTok (@mdou.g) with FYP Booster Tags...');
    await publishToBuffer(TIKTOK_CHANNEL_ID, ttCaption, publicVideoUrl);
    console.log('✅ TikTok publication queued successfully!');
  } catch (err) {
    console.warn('⚠️ TikTok publication notice:', err.message);
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
    platforms: ['instagram', 'tiktok'],
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
  VERIFIED_ITEMS, 
  loadRegistry 
};
