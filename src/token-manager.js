const { getSpotifyToken } = require('./totp');
const { pushTokenToGitHub } = require('./github');

let cachedToken = null;
let expiresAt = 0;

async function refreshToken() {
  console.log('[TokenManager] Refreshing Spotify token via TOTP...');
  try {
    const token = await getSpotifyToken();
    cachedToken = token;
    expiresAt = Date.now() + 30 * 60 * 1000;
    console.log('[TokenManager] Token refreshed successfully.');

    await pushTokenToGitHub(token);
  } catch (err) {
    console.error('[TokenManager] Failed to refresh token:', err.message);
  }
}

async function getToken() {
  if (cachedToken && Date.now() < expiresAt) {
    return cachedToken;
  }
  await refreshToken();
  return cachedToken;
}

function startScheduler(intervalMinutes = 30) {
  const cron = require('node-cron');
  const cronExpr = `*/${intervalMinutes} * * * *`;
  console.log(`[TokenManager] Scheduler started — refreshing every ${intervalMinutes} minutes.`);
  cron.schedule(cronExpr, refreshToken);
  refreshToken();
}

module.exports = { getToken, refreshToken, startScheduler };
