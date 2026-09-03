import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'node:https'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-dev-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/proxy-audio')) {
            const parsedUrl = new URL(req.url, 'http://localhost:5173');
            const targetUrl = parsedUrl.searchParams.get('url');
            if (!targetUrl) {
              res.statusCode = 400;
              return res.end('Missing url');
            }
            const client = targetUrl.startsWith('https') ? https : http;
            client.get(targetUrl, (upstreamRes) => {
              res.writeHead(upstreamRes.statusCode || 200, {
                'Content-Type': upstreamRes.headers['content-type'] || 'audio/mpeg',
                'Access-Control-Allow-Origin': '*'
              });
              upstreamRes.pipe(res);
            }).on('error', (err) => {
              res.statusCode = 500;
              res.end(err.message);
            });
            return;
          }

          if (req.url?.startsWith('/api/library')) {
            try {
              const regPath = path.resolve(process.cwd(), 'data/publishedRegistry.json');
              if (fs.existsSync(regPath)) {
                const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
                res.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                });
                return res.end(JSON.stringify({
                  items: reg.publishedItems || [],
                  total: (reg.publishedItems || []).length,
                  lastRunAt: reg.lastRunAt,
                  source: 'local_registry'
                }));
              }
            } catch {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: 'Failed to read local registry' }));
            }
          }

          next();
        });
      }
    }
  ],
})
