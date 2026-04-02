const PROVIDER = 'CASPER TECH';
const CREATOR = 'TRABY CASPER';

function respond(res, status, data) {
  res.status(status).set({
    'Content-Type': 'application/json; charset=utf-8',
    'X-API-Provider': PROVIDER,
    'X-API-Creator': CREATOR,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-cache',
  }).send(JSON.stringify({ provider: PROVIDER, creator: CREATOR, success: true, ...data }, null, 2));
}

function respondError(res, status, error) {
  res.status(status).set({
    'Content-Type': 'application/json; charset=utf-8',
    'X-API-Provider': PROVIDER,
    'X-API-Creator': CREATOR,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-cache',
  }).send(JSON.stringify({ provider: PROVIDER, creator: CREATOR, success: false, error }, null, 2));
}

module.exports = { respond, respondError, PROVIDER, CREATOR };
