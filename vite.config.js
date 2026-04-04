import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to simulate Vercel serverless functions locally
const vercelApiMock = () => {
  return {
    name: 'vercel-api-mock',
    configureServer(server) {
      server.middlewares.use('/api/poster', async (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const i = url.searchParams.get('i');
        
        // Load env variables manually since this is server setup
        const env = loadEnv(server.config.mode, process.cwd(), '');
        const apiKey = env.OMDB_API_KEY || env.VITE_OMDB_API_KEY;

        if (!i) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Missing IMDB ID' }));
        }

        try {
          const apiRes = await fetch(`https://www.omdbapi.com/?i=${i}&apikey=${apiKey}`);
          const data = await apiRes.json();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Server error' }));
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiMock()],
})
