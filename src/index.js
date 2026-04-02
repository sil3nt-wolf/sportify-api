require('dotenv').config();
const express = require('express');
const path = require('path');
const { startScheduler, getToken } = require('./token-manager');
const { respond, respondError, PROVIDER, CREATOR } = require('./response');

const app = express();
const PORT = process.env.PORT || 3001;
const REFRESH_INTERVAL = parseInt(process.env.REFRESH_INTERVAL_MINUTES || '30');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api', (req, res) => {
  respond(res, 200, {
    name: 'Sportify API',
    description: 'Free Spotify Search API — no credentials, no rate limits, unlimited access',
    version: '1.0.0',
    note: 'Anonymous TOTP-based token. Token auto-refreshes every 30 minutes.',
    endpoints: {
      token:           'GET /api/token',
      search:          'GET /api/search?q=QUERY&type=track|album|artist|playlist&limit=10',
      track:           'GET /api/track/:id',
      album:           'GET /api/album/:id',
      playlist:        'GET /api/playlist/:id',
      artist:          'GET /api/artist/:id',
      'artist-tracks': 'GET /api/artist/:id/top-tracks?market=US',
      health:          'GET /api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  respond(res, 200, { status: 'ok', uptime_seconds: Math.floor(process.uptime()) });
});

app.get('/api/token', async (req, res) => {
  try {
    const token = await getToken();
    if (!token) return respondError(res, 503, 'Could not obtain a Spotify access token, please try again shortly');
    respond(res, 200, {
      note: 'Anonymous Spotify web-player token. Valid for ~1 hour. Use as: Authorization: Bearer <access_token>',
      access_token: token,
      token_type: 'Bearer',
      usage: {
        search:   'GET https://api.spotify.com/v1/search?q=Faded&type=track&limit=10',
        track:    'GET https://api.spotify.com/v1/tracks/{id}',
        album:    'GET https://api.spotify.com/v1/albums/{id}',
        playlist: 'GET https://api.spotify.com/v1/playlists/{id}',
        artist:   'GET https://api.spotify.com/v1/artists/{id}',
      },
    });
  } catch (err) {
    respondError(res, 500, err.message);
  }
});

app.use('/api/search',   require('./routes/search'));
app.use('/api/track',    require('./routes/track'));
app.use('/api/album',    require('./routes/album'));
app.use('/api/playlist', require('./routes/playlist'));
app.use('/api/artist',   require('./routes/artist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((req, res) => {
  respondError(res, 404, `Endpoint not found. Visit /api for available endpoints.`);
});

app.listen(PORT, () => {
  console.log(`Sportify API running on port ${PORT}`);
  startScheduler(REFRESH_INTERVAL);
});
