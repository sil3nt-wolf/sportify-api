const { getSpotifyToken } = require('./totp');
const { commitToken } = require('./github');

let cachedToken = null;
let expiresAt = 0;

async function refreshToken() {
  try {
    const token = await getSpotifyToken();
    cachedToken = token;
    expiresAt = Date.now() + 30 * 60 * 1000;
    await commitToken(token);
  } catch {}
}

async function getToken() {
  if (cachedToken && Date.now() < expiresAt) return cachedToken;
  await refreshToken();
  return cachedToken;
}

function startScheduler(intervalMinutes = 30) {
  const cron = require('node-cron');
  const expr = `*/${intervalMinutes} * * * *`;
  cron.schedule(expr, refreshToken);
  refreshToken();
}

module.exports = { getToken, refreshToken, startScheduler };
