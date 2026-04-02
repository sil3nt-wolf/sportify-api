# Contributing to Sportify API

**Project:** Sportify API  
**Maintainer:** TRABY CASPER · CASPER TECH  

Thank you for your interest in contributing! All contributions are welcome and appreciated.

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 8 or higher
- Git

### Local Setup

```bash
git clone https://github.com/Casper-Tech-ke/sportify-api.git
cd sportify-api
npm install
cp .env.example .env
npm run dev
```

The API will be available at `http://localhost:3001`.

---

## How to Contribute

### 1. Bug Reports

Before opening an issue, please:
- Search existing issues to avoid duplicates
- Confirm the bug is reproducible

When opening a bug report, include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behaviour
- Node.js version and OS

### 2. Feature Requests

Open an issue with the label `enhancement`. Describe:
- What you want to achieve
- Why it would benefit users
- Any implementation ideas you have

### 3. Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** — keep commits focused and descriptive
4. **Test your changes** — ensure all endpoints still work correctly
5. **Open a Pull Request** against `main` with a clear description

---

## Code Style

- Use `const`/`let`, not `var`
- Async/await over callbacks
- Keep functions small and single-purpose
- All API responses must follow the standard format:
  ```json
  {
    "provider": "CASPER TECH",
    "creator": "TRABY CASPER",
    "success": true,
    ...data
  }
  ```
- Error responses must include `success: false` and an `error` string

---

## Project Structure

```
sportify-api/
├── src/
│   ├── index.js          — Express server entry point
│   ├── totp.js           — Spotify TOTP token generation
│   ├── token-manager.js  — Token cache and scheduler
│   ├── response.js       — Shared response helpers
│   └── routes/           — Endpoint route handlers
├── scripts/
│   └── refresh.js        — Manual token refresh script
├── public/               — Static frontend files
└── tokens.json           — Auto-updated token file
```

---

## Commit Message Format

Use clear, present-tense messages:

```
feat: add artist albums endpoint
fix: handle 429 rate limit on token refresh
docs: update README deployment guide
chore: bump express to 4.19.2
```

---

## Code of Conduct

Be respectful, constructive, and inclusive. Harassment of any kind will not be tolerated.

---

© 2025 CASPER TECH · TRABY CASPER · Kenya 🇰🇪
