export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
};

// In-memory cache for recorded video blobs
const videoCache = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Upload video chunk/base64
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const videoBase64 = body.videoBase64 || body.video;

      if (!videoBase64) {
        return res.status(400).json({ error: 'Missing videoBase64' });
      }

      const cleanBase64 = videoBase64.replace(/^data:video\/\w+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');
      const id = 'vid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

      // Keep cache bounded
      if (videoCache.size > 50) {
        const firstKey = videoCache.keys().next().value;
        videoCache.delete(firstKey);
      }

      videoCache.set(id, { buffer, mimeType: 'video/mp4' });

      // Return public URL on current domain
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['x-forwarded-host'] || req.headers.host || 'omnipulse-ai-studio.vercel.app';
      const publicUrl = `${protocol}://${host}/api/video?id=${id}`;

      return res.status(200).json({ success: true, url: publicUrl, id });
    } catch (err) {
      console.error('Video upload error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  // GET: Serve video stream
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id || !videoCache.has(id)) {
      return res.status(404).send('Video not found or expired');
    }

    const item = videoCache.get(id);
    res.setHeader('Content-Type', item.mimeType || 'video/mp4');
    res.setHeader('Content-Length', item.buffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(item.buffer);
  }

  return res.status(405).end();
}
