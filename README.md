# OSINT-SO — Open Source Intelligence Tool

<p align="center">
  <strong>🔍 Ethical & Legal OSINT Reconnaissance Platform</strong><br>
  <em>Search publicly available information using official APIs and generated search queries</em>
</p>

---

## ⚡ Features

- **Smart Query Generator** — Generates Google dork-style search queries across multiple categories
- **GitHub Intelligence** — Search users, profiles, and repositories via GitHub REST API
- **News Aggregation** — Search news articles via GNews API with fallback to direct links
- **WHOIS/RDAP Lookup** — Domain registration data via public RDAP protocol
- **Risk Analysis** — Exposure scoring, connection mapping, and security recommendations
- **Dark Terminal UI** — Clean, hacker-style interface with neon green accents
- **Ethical Safeguards** — Disclaimer modal, rate limiting, no data storage

## 🏗️ Architecture

```
OSINT-SO/
├── client/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── services/        # API client
│   │   ├── App.jsx          # Main application
│   │   └── index.css        # Dark theme styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                  # Node.js + Express Backend
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic & API clients
│   ├── index.js             # Express server entry
│   └── package.json
├── .env.example             # Environment variable template
├── vercel.json              # Vercel deployment config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ installed
- **npm** 9+ installed

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/osint-so.git
cd osint-so

# Install all dependencies
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add your API keys:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3001) |
| `GITHUB_TOKEN` | No | GitHub PAT for higher rate limits (60→5000 req/hr) |
| `GNEWS_API_KEY` | No | GNews API key for news articles ([get free key](https://gnews.io/)) |
| `ENABLE_LOGGING` | No | Enable request logging (default: true) |

> **Note:** The tool works without any API keys! GitHub search and WHOIS work without auth. News fallbacks to search links. Add keys for enhanced results.

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## 📋 Example Queries

| Type | Query | What it finds |
|------|-------|---------------|
| Name | `Linus Torvalds` | Social profiles, news mentions, documents |
| Username | `torvalds` | GitHub profile + repos, cross-platform search |
| Email | `info@example.com` | Email in documents, username cross-ref, domain WHOIS |
| Domain | `github.com` | WHOIS/RDAP data, registration info, nameservers |
| Keyword | `cybersecurity researcher` | Wide search across all categories |

## 🔧 API Sources

| Source | Method | Auth |
|--------|--------|------|
| GitHub | REST API v3 | Optional (token for rate limits) |
| GNews | REST API | API Key (free tier: 100/day) |
| WHOIS | RDAP Protocol | None |
| Dork Links | Generated locally | None |

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

The `vercel.json` configuration is already included.

### GitHub Pages (Frontend Only)

```bash
# Build the frontend
cd client
npm run build

# Deploy the `dist` folder to GitHub Pages
```

> When hosting frontend-only on GitHub Pages, the backend must be deployed separately (e.g., Render, Railway, Heroku).

### Docker (Optional)

```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/ ./server/
COPY client/ ./client/
COPY .env.example ./.env
RUN cd server && npm install
RUN cd client && npm install && npm run build
EXPOSE 3001
CMD ["node", "server/index.js"]
```

## 🛡️ Ethical & Legal Compliance

This tool is designed with strict ethical guidelines:

1. **Public Data Only** — Only accesses publicly available information
2. **No Scraping** — Uses official APIs and generates search links
3. **No Data Storage** — Results are never persisted to disk
4. **Rate Limiting** — Built-in request throttling to prevent abuse
5. **User Agreement** — Mandatory ethical use disclaimer
6. **No PII Aggregation** — Does not aggregate sensitive personal data

### ⚠️ Responsible Use

- Do **NOT** use this tool to stalk, harass, or target individuals
- Do **NOT** use findings for unauthorized access or social engineering
- Do **NOT** violate any laws or terms of service
- **DO** use this for security research, OSINT education, and self-assessment

## 🔮 Future Improvements

- [ ] **Shodan API** — Internet-connected device search
- [ ] **Wayback Machine** — Historical web page snapshots
- [ ] **PGP Key Servers** — Public key discovery
- [ ] **Pastebin Monitoring** — Public paste search
- [ ] **Export Reports** — PDF/JSON report generation
- [ ] **User Accounts** — Saved searches and history
- [ ] **Plugin System** — Custom data source integrations
- [ ] **Tor Integration** — .onion site search capability
- [ ] **Social Graph** — Visual network relationship mapping
- [ ] **AI Analysis** — ML-powered pattern detection
- [ ] **Real-time Monitoring** — Continuous OSINT alerts

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

<p align="center">
  <em>Built for security researchers, journalists, and OSINT enthusiasts.</em><br>
  <strong>Use responsibly. Stay ethical. Stay legal.</strong>
</p>
