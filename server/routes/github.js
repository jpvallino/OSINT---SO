import { Router } from 'express';
import { searchUsers, getUserProfile, searchRepos } from '../services/githubService.js';

const router = Router();

// Search GitHub users
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const users = await searchUsers(q.trim());
    res.json({ query: q, results: users, count: users.length });
  } catch (error) {
    console.error('GitHub search error:', error.message);
    res.status(error.message.includes('rate limit') ? 429 : 500)
       .json({ error: error.message });
  }
});

// Get user profile
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username || username.trim().length < 1) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const profile = await getUserProfile(username.trim());
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('GitHub profile error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search repositories
router.get('/repos', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const repos = await searchRepos(q.trim());
    res.json({ query: q, results: repos, count: repos.length });
  } catch (error) {
    console.error('GitHub repos error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
