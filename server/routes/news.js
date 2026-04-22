import { Router } from 'express';
import { searchNews } from '../services/newsService.js';

const router = Router();

// Search news articles
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const results = await searchNews(q.trim());
    res.json({ query: q, ...results });
  } catch (error) {
    console.error('News search error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
