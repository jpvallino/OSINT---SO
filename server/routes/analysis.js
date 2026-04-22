import { Router } from 'express';
import { analyzeResults } from '../services/analysisEngine.js';

const router = Router();

// Analyze aggregated results
router.post('/analyze', (req, res) => {
  try {
    const { query, github, news, whois, dorks } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const analysis = analyzeResults({ query, github, news, whois, dorks });
    res.json({ query, analysis });
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
