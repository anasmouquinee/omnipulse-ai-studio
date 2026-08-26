export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb'
    }
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const imageBase64 = body.imageBase64 || body.image;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // 1. Try Imgur
    try {
      const form = new FormData();
      form.append('image', cleanBase64);
      form.append('type', 'base64');

      const imgurRes = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID 546c25a59c58ad7'
        },
        body: form
      });

      const json = await imgurRes.json();
      if (json.data && json.data.link) {
        return res.status(200).json({ success: true, url: json.data.link });
      }
    } catch (e) {
      console.warn('Imgur upload failed, trying Catbox:', e);
    }

    // 2. Try Catbox
    try {
      const form2 = new FormData();
      form2.append('reqtype', 'fileupload');
      form2.append('fileToUpload', new Blob([buffer], { type: 'image/png' }), 'card.png');
      const catRes = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form2 });
      const link = await catRes.text();
      if (link && link.startsWith('http')) {
        return res.status(200).json({ success: true, url: link.trim() });
      }
    } catch (e) {
      console.warn('Catbox upload failed, trying Tmpfiles:', e);
    }

    // 3. Try Tmpfiles
    try {
      const form3 = new FormData();
      form3.append('file', new Blob([buffer], { type: 'image/png' }), 'card.png');
      const tmpRes = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: form3 });
      const tmpJson = await tmpRes.json();
      if (tmpJson.data?.url) {
        return res.status(200).json({ success: true, url: tmpJson.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/') });
      }
    } catch (e) {
      console.warn('Tmpfiles upload failed:', e);
    }

    return res.status(500).json({ error: 'All image upload services failed' });
  } catch (err) {
    console.error('Server upload error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
