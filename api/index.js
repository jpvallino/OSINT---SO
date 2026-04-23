import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Note: Imports updated to point to the new location or same relative structure
import githubRoutes from './routes/github.js';
import newsRoutes from './routes/news.js';
import whoisRoutes from './routes/whois.js';
import dorksRoutes from './routes/dorks.js';
import analysisRoutes from './routes/analysis.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: '*', // More permissive for Vercel deployment, can be tightened later
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

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
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
