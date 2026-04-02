const express = require('express');
const router = express.Router();
const { getToken } = require('../token-manager');

router.get('/', async (req, res) => {
  const { q, type = 'track', limit = 10, offset = 0 } = req.query;

  if (!q) {
    return res.status(400).json({ success: false, error: 'Missing query parameter: q' });
  }

  const validTypes = ['track', 'album', 'artist', 'playlist', 'episode', 'show'];
  const types = type.split(',').filter(t => validTypes.includes(t));
  if (types.length === 0) {
    return res.status(400).json({ success: false, error: `Invalid type. Valid: ${validTypes.join(', ')}` });
  }

  try {
    const token = await getToken();
    if (!token) return res.status(503).json({ success: false, error: 'Spotify token unavailable' });

    const params = new URLSearchParams({ q, type: types.join(','), limit, offset });
    const result = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!result.ok) throw new Error(`Spotify API: ${result.status}`);
    const data = await result.json();

    res.json({ success: true, provider: 'CASPER TECH', ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
