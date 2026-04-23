import { Router } from 'express';
import { generateDorks, generateEmailDorks } from '../services/dorkEngine.js';

const router = Router();

// Generate dork queries
router.post('/generate', (req, res) => {
  try {
    const { query, type, categories } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    let results;
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(query)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      results = {
        ...generateDorks(query, categories),
        ...generateEmailDorks(query)
      };
    } else {
      results = generateDorks(query.trim(), categories);
    }

    res.json({ query: query.trim(), type: type || 'general', dorks: results });
  } catch (error) {
    console.error('Dork generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
