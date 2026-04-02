require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { getSpotifyToken } = require('../src/totp');
const { pushTokenToGitHub } = require('../src/github');

(async () => {
  console.log('Generating Spotify token via TOTP...');
  try {
    const token = await getSpotifyToken();
    console.log('Token generated:', token.slice(0, 30) + '...');
    await pushTokenToGitHub(token);
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
