import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      let rawData = null;

      // 1. Try reading latest from GitHub Raw (always up-to-date with GitHub Actions)
      try {
        const ghRes = await fetch(
          'https://raw.githubusercontent.com/anasmouquinee/omnipulse-ai-studio/main/data/publishedRegistry.json',
          { headers: { 'Cache-Control': 'no-cache' } }
        );
        if (ghRes.ok) {
          rawData = await ghRes.json();
        }
      } catch (ghErr) {
        console.warn('Could not fetch remote registry, falling back to local file:', ghErr.message);
      }

      // 2. Fallback to local file if GitHub Raw failed
      if (!rawData) {
        try {
          const localPath = path.join(process.cwd(), 'data', 'publishedRegistry.json');
          if (fs.existsSync(localPath)) {
            rawData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          }
        } catch (fsErr) {
          console.warn('Local registry read failed:', fsErr.message);
        }
      }

      const publishedItems = (rawData && rawData.publishedItems) || [];

      // Format items to standard IslamicLibraryItem
      const formattedItems = publishedItems.map((item, idx) => {
        const isReel = Boolean(item.videoUrl && item.videoUrl.trim() !== '');
        return {
          id: item.id || `autopilot-${new Date(item.timestamp || Date.now()).getTime()}-${idx}`,
          type: item.type || (item.theme && item.theme.toLowerCase().includes('coran') ? 'quran' : 'hadith'),
          themeTitle: item.theme || item.themeTitle || 'Rappel Islamique Quotidien',
          arabicText: item.arabicText || '',
          translationFr: item.translationFr || '',
          translationEn: item.translationEn || '',
          referenceText: item.bookOrSurah 
            ? `${item.bookOrSurah}${item.numberOrAyah ? ' — ' + item.numberOrAyah : ''}` 
            : 'Rappel Islamique Authentique',
          canonicalKey: item.canonicalKey || item.contentHash || `key-${idx}`,
          reciterName: item.reciterName || 'Mishary Rashid Alafasy',
          audioUrl: item.audioUrl || '',
          cardImageUrl: item.cardImageUrl || '',
          videoUrl: item.videoUrl || '',
          publishedAt: item.timestamp || item.publishedAt || new Date().toISOString(),
          platforms: item.platforms || ['instagram', 'tiktok'],
          format: isReel ? 'reel' : 'photo',
          metadata: {
            surahNumber: item.surahNumber,
            ayahNumber: item.ayahNumber,
            contentHash: item.contentHash
          }
        };
      });

      // Cache for 60 seconds on CDN, stale-while-revalidate for 5 minutes
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.status(200).json({
        success: true,
        count: formattedItems.length,
        lastRunAt: rawData?.lastRunAt || null,
        currentIndex: rawData?.currentIndex || 0,
        items: formattedItems.reverse() // Most recent first
      });
    } catch (err) {
      console.error('Library API error:', err);
      return res.status(500).json({ error: err.message || 'Failed to retrieve library' });
    }
  }

  if (req.method === 'POST') {
    return res.status(200).json({ success: true, message: 'Item acknowledged' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
