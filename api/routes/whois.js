import { Router } from 'express';
import { lookupDomain, lookupIP } from '../services/whoisService.js';

const router = Router();

// WHOIS/RDAP domain lookup
router.get('/domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const result = await lookupDomain(domain.trim().toLowerCase());
    res.json({ query: domain, ...result });
  } catch (error) {
    if (error.message === 'Invalid domain format') {
      return res.status(400).json({ error: 'Invalid domain format. Example: example.com' });
    }
    console.error('WHOIS lookup error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// RDAP IP lookup
router.get('/ip/:ip', async (req, res) => {
  try {
    const { ip } = req.params;
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    const result = await lookupIP(ip.trim());
    res.json({ query: ip, ...result });
  } catch (error) {
    console.error('IP lookup error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
