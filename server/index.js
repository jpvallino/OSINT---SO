import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import githubRoutes from './routes/github.js';
import newsRoutes from './routes/news.js';
import whoisRoutes from './routes/whois.js';
import dorksRoutes from './routes/dorks.js';
import analysisRoutes from './routes/analysis.js';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use(globalLimiter);

// Request logging
if (process.env.ENABLE_LOGGING === 'true') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/github', githubRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/whois', whoisRoutes);
app.use('/api/dorks', dorksRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      github: 'available',
      news: process.env.GNEWS_API_KEY ? 'configured' : 'link-only',
      whois: 'available',
      dorks: 'available'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║          OSINT-SO API Server             ║
  ║          Running on port ${PORT}            ║
  ╚══════════════════════════════════════════╝
  `);
});
