/**
 * Analysis Engine - Computes risk/insight metrics from aggregated results
 */

/**
 * Analyze aggregated OSINT results and compute exposure metrics
 */
export function analyzeResults(data) {
  const { query, github, news, whois, dorks } = data;

  const metrics = {
    overallExposure: 'low',
    exposureScore: 0,
    totalMentions: 0,
    categories: {
      social: { count: 0, level: 'none' },
      professional: { count: 0, level: 'none' },
      documents: { count: 0, level: 'none' },
      mentions: { count: 0, level: 'none' }
    },
    insights: [],
    connections: [],
    recommendations: []
  };

  // Analyze GitHub presence
  if (github) {
    if (github.users && github.users.length > 0) {
      metrics.categories.professional.count += github.users.length;
      metrics.totalMentions += github.users.length;
      metrics.insights.push({
        type: 'professional',
        icon: '💻',
        text: `Found ${github.users.length} GitHub profile(s) matching the query`,
        severity: 'info'
      });
    }

    if (github.profile) {
      const p = github.profile;
      metrics.exposureScore += 15;

      if (p.publicRepos > 20) {
        metrics.insights.push({
          type: 'professional',
          icon: '📦',
          text: `Active developer with ${p.publicRepos} public repositories`,
          severity: 'info'
        });
        metrics.exposureScore += 10;
      }

      if (p.followers > 100) {
        metrics.insights.push({
          type: 'social',
          icon: '👥',
          text: `Notable following with ${p.followers} GitHub followers`,
          severity: 'medium'
        });
        metrics.exposureScore += 15;
        metrics.categories.social.count += 1;
      }

      if (p.email) {
        metrics.insights.push({
          type: 'personal',
          icon: '📧',
          text: 'Public email address found on GitHub profile',
          severity: 'warning'
        });
        metrics.exposureScore += 20;
        metrics.connections.push({ type: 'email', value: p.email, source: 'GitHub' });
      }

      if (p.blog) {
        metrics.connections.push({ type: 'website', value: p.blog, source: 'GitHub' });
        metrics.exposureScore += 5;
      }

      if (p.twitterUsername) {
        metrics.connections.push({ type: 'twitter', value: `@${p.twitterUsername}`, source: 'GitHub' });
        metrics.exposureScore += 10;
      }

      if (p.company) {
        metrics.connections.push({ type: 'company', value: p.company, source: 'GitHub' });
        metrics.exposureScore += 5;
      }

      if (p.location) {
        metrics.insights.push({
          type: 'personal',
          icon: '📍',
          text: `Location publicly visible: ${p.location}`,
          severity: 'medium'
        });
        metrics.exposureScore += 10;
      }
    }
  }

  // Analyze news results
  if (news) {
    if (news.articles && news.articles.length > 0) {
      metrics.categories.mentions.count += news.articles.length;
      metrics.totalMentions += news.articles.length;
      metrics.exposureScore += Math.min(news.articles.length * 5, 25);

      metrics.insights.push({
        type: 'mentions',
        icon: '📰',
        text: `Found ${news.articles.length} news article(s) mentioning the query`,
        severity: news.articles.length > 5 ? 'medium' : 'info'
      });
    }
  }

  // Analyze WHOIS data
  if (whois && !whois.error) {
    metrics.categories.professional.count += 1;
    metrics.exposureScore += 10;

    if (whois.entities && whois.entities.length > 0) {
      for (const entity of whois.entities) {
        if (entity.name) {
          metrics.connections.push({ type: 'registrant', value: entity.name, source: 'WHOIS' });
        }
        if (entity.email) {
          metrics.connections.push({ type: 'email', value: entity.email, source: 'WHOIS' });
          metrics.exposureScore += 15;
        }
        if (entity.organization) {
          metrics.connections.push({ type: 'organization', value: entity.organization, source: 'WHOIS' });
        }
      }
    }

    metrics.insights.push({
      type: 'professional',
      icon: '🌐',
      text: `Domain registration data available via RDAP`,
      severity: 'info'
    });
  }

  // Calculate category levels
  for (const [cat, data] of Object.entries(metrics.categories)) {
    if (data.count === 0) data.level = 'none';
    else if (data.count <= 2) data.level = 'low';
    else if (data.count <= 5) data.level = 'medium';
    else data.level = 'high';
  }

  // Calculate overall exposure
  if (metrics.exposureScore <= 15) {
    metrics.overallExposure = 'low';
  } else if (metrics.exposureScore <= 40) {
    metrics.overallExposure = 'medium';
  } else if (metrics.exposureScore <= 70) {
    metrics.overallExposure = 'high';
  } else {
    metrics.overallExposure = 'critical';
  }

  // Cap score at 100
  metrics.exposureScore = Math.min(metrics.exposureScore, 100);

  // Generate recommendations
  if (metrics.exposureScore > 50) {
    metrics.recommendations.push({
      icon: '🛡️',
      text: 'High public exposure detected. Consider reviewing privacy settings on public profiles.'
    });
  }

  if (metrics.connections.some(c => c.type === 'email')) {
    metrics.recommendations.push({
      icon: '📧',
      text: 'Public email addresses found. Consider using alias emails for public-facing profiles.'
    });
  }

  if (metrics.connections.length > 3) {
    metrics.recommendations.push({
      icon: '🔗',
      text: 'Multiple cross-referenced accounts detected. Connected profiles increase digital footprint.'
    });
  }

  if (metrics.totalMentions > 10) {
    metrics.recommendations.push({
      icon: '📊',
      text: 'Significant online presence. Set up Google Alerts to monitor future mentions.'
    });
  }

  return metrics;
}
