require('dotenv').config();
const express = require('express');
const { startScheduler, getToken } = require('./token-manager');

const app = express();
const PORT = process.env.PORT || 3001;
const REFRESH_INTERVAL = parseInt(process.env.REFRESH_INTERVAL_MINUTES || '30');

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/', (req, res) => {
  res.json({
    name: 'Spotify Search API',
    provider: 'CASPER TECH',
    version: '1.0.0',
    note: 'Uses anonymous TOTP token — no credentials required',
    endpoints: {
      search:   'GET /search?q=QUERY&type=track|album|artist|playlist&limit=10',
      track:    'GET /track/:id',
      album:    'GET /album/:id',
      playlist: 'GET /playlist/:id',
      token:    'GET /token',
      health:   'GET /health',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/token', async (req, res) => {
  try {
    const token = await getToken();
    if (!token) return res.status(503).json({ success: false, error: 'Could not obtain token' });
    res.json({
      success: true,
      provider: 'CASPER TECH',
      access_token: token,
      token_type: 'Bearer',
      note: 'Anonymous Spotify web-player token. Valid ~1 hour.',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/search',   require('./routes/search'));
app.use('/track',    require('./routes/track'));
app.use('/album',    require('./routes/album'));
app.use('/playlist', require('./routes/playlist'));

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Spotify API running on port ${PORT}`);
  startScheduler(REFRESH_INTERVAL);
});
