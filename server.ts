import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const dataDir = path.join(__dirname, 'src', 'data');
  const dataFilePath = path.join(dataDir, 'sharedProjectState.json');

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // GET shared project data
  app.get('/api/project-data', (req, res) => {
    try {
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        return res.json({ found: true, data: JSON.parse(fileContent) });
      }
      return res.json({ found: false });
    } catch (err) {
      console.error('Error reading shared project data:', err);
      return res.status(500).json({ error: 'Failed to read data' });
    }
  });

  // POST save shared project data
  app.post('/api/project-data', (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error('Error saving shared project data:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  });

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
