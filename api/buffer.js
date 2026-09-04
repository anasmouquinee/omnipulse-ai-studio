export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { query, variables, token } = body;

    const authHeader = token 
      ? `Bearer ${token}` 
      : (req.headers.authorization || 'Bearer vXkaxUF8bX5anmrPe_4BMyXe6Lo36lwZYTAPYmCDHkM');

    const bufferRes = await fetch('https://api.buffer.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await bufferRes.json();
    
    // Forward rate-limiting and retry headers if present
    const retryAfter = bufferRes.headers.get('retry-after');
    if (retryAfter) res.setHeader('Retry-After', retryAfter);
    const rateLimitPolicy = bufferRes.headers.get('ratelimit-policy');
    if (rateLimitPolicy) res.setHeader('ratelimit-policy', rateLimitPolicy);
    const rateLimit = bufferRes.headers.get('ratelimit');
    if (rateLimit) res.setHeader('ratelimit', rateLimit);

    return res.status(bufferRes.status).json(data);
  } catch (err) {
    console.error('Buffer proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
