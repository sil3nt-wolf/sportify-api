# Sportify API

**Free, unlimited Spotify search API — no API keys, no sign-ups, no rate limits.**

Built and maintained by **CASPER TECH** · **TRABY CASPER**

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api` | API info and endpoint list |
| GET | `/api/health` | Health check |
| GET | `/api/token` | Get a live Spotify access token |
| GET | `/api/search?q=QUERY&type=track&limit=10` | Search Spotify |
| GET | `/api/track/:id` | Track details |
| GET | `/api/album/:id` | Album details |
| GET | `/api/playlist/:id` | Playlist details |
| GET | `/api/artist/:id` | Artist profile |
| GET | `/api/artist/:id/top-tracks?market=US` | Artist top tracks |

**Search types:** `track`, `album`, `artist`, `playlist`, `episode`, `show`

---

## Response Format

Every response is pretty-printed JSON:

```json
{
  "provider": "CASPER TECH",
  "creator": "TRABY CASPER",
  "success": true,
  ...data
}
```

---

## Using the Token Endpoint

If you only need a Spotify access token to use directly with Spotify's API:

### 1. Get a token

```bash
curl https://your-deployment-url/api/token
```

Response:

```json
{
  "provider": "CASPER TECH",
  "creator": "TRABY CASPER",
  "success": true,
  "note": "Anonymous Spotify web-player token. Valid for ~1 hour.",
  "access_token": "BQD...",
  "token_type": "Bearer"
}
```

### 2. Use the token with Spotify's API directly

Copy the `access_token` value and use it as a `Bearer` token in any Spotify API request:

**Search for a track:**
```bash
curl -H "Authorization: Bearer BQD..." \
  "https://api.spotify.com/v1/search?q=Faded&type=track&limit=5"
```

**Get a track by ID:**
```bash
curl -H "Authorization: Bearer BQD..." \
  "https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1iaRUIOKE"
```

**Get an album:**
```bash
curl -H "Authorization: Bearer BQD..." \
  "https://api.spotify.com/v1/albums/1weenld61qoidwYuZ1GESA"
```

**Get a playlist:**
```bash
curl -H "Authorization: Bearer BQD..." \
  "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF"
```

**Get an artist:**
```bash
curl -H "Authorization: Bearer BQD..." \
  "https://api.spotify.com/v1/artists/3TVXtAsR1Inumwj472S9r4"
```

The token is valid for approximately **1 hour**. Fetch a new one from `/api/token` when it expires.

---

## Deploy

### Environment Variables

```env
PORT=3001
REFRESH_INTERVAL_MINUTES=30
```

---

### Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add `PORT` and `REFRESH_INTERVAL_MINUTES` under the **Environment** tab
6. Deploy

---

### Heroku

```bash
heroku create sportify-api
git push heroku main
```

Or via Dashboard:
1. New → Create new app
2. Connect GitHub repo → Enable auto deploy
3. Heroku sets `PORT` automatically

---

### Fly.io

```bash
npm install -g flyctl
fly auth login
fly launch --name sportify-api
fly deploy
```

`fly launch` auto-detects Node.js. `PORT` is set automatically by Fly.

---

### VPS (Ubuntu / Debian)

```bash
# 1. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Clone and install
git clone https://github.com/Casper-Tech-ke/sportify-api.git
cd sportify-api
npm install
cp .env.example .env
nano .env

# 3. Run with PM2
npm install -g pm2
pm2 start src/index.js --name sportify-api
pm2 startup && pm2 save
```

**Nginx reverse proxy:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
2. Select your repo
3. Railway auto-detects Node.js and sets `PORT`
4. Deploy

---

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

```bash
docker build -t sportify-api .
docker run -p 3001:3001 sportify-api
```

---

## License

MIT — free to use, modify and deploy.

**CASPER TECH** · Built by TRABY CASPER
