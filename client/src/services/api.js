const API_BASE = '/api';

/**
 * API client for communicating with the OSINT-SO backend
 */
class ApiClient {
  async request(path, options = {}) {
    try {
      const url = `${API_BASE}${path}`;
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Backend server not reachable. Make sure the server is running on port 3001.');
      }
      throw error;
    }
  }

  // GitHub
  async searchGitHub(query) {
    return this.request(`/github/search?q=${encodeURIComponent(query)}`);
  }

  async getGitHubProfile(username) {
    return this.request(`/github/user/${encodeURIComponent(username)}`);
  }

  async searchGitHubRepos(query) {
    return this.request(`/github/repos?q=${encodeURIComponent(query)}`);
  }

  // News
  async searchNews(query) {
    return this.request(`/news/search?q=${encodeURIComponent(query)}`);
  }

  // WHOIS
  async lookupDomain(domain) {
    return this.request(`/whois/domain/${encodeURIComponent(domain)}`);
  }

  // Dorks
  async generateDorks(query, type = 'general', categories = null) {
    return this.request('/dorks/generate', {
      method: 'POST',
      body: JSON.stringify({ query, type, categories })
    });
  }

  // Analysis
  async analyze(data) {
    return this.request('/analysis/analyze', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Run full OSINT scan — aggregates all sources
   */
  async fullScan(query, type = 'name') {
    const results = {
      query,
      type,
      github: null,
      news: null,
      whois: null,
      dorks: null,
      analysis: null,
      errors: []
    };

    // Define tasks based on search type
    const tasks = [];

    // Always do GitHub search
    tasks.push(
      this.searchGitHub(query)
        .then(data => { results.github = { users: data.results }; })
        .catch(err => { results.errors.push({ source: 'github', error: err.message }); })
    );

    // If it looks like a username, also get profile
    if (type === 'username') {
      tasks.push(
        this.getGitHubProfile(query)
          .then(data => {
            if (!results.github) results.github = {};
            results.github.profile = data.profile;
          })
          .catch(() => {}) // Silently fail for profile lookup
      );
    }

    // News search
    tasks.push(
      this.searchNews(query)
        .then(data => { results.news = data; })
        .catch(err => { results.errors.push({ source: 'news', error: err.message }); })
    );

    // WHOIS lookup for domain type
    if (type === 'domain') {
      tasks.push(
        this.lookupDomain(query)
          .then(data => { results.whois = data; })
          .catch(err => { results.errors.push({ source: 'whois', error: err.message }); })
      );
    }

    // Email specific: also do WHOIS on the email domain
    if (type === 'email' && query.includes('@')) {
      const domain = query.split('@')[1];
      tasks.push(
        this.lookupDomain(domain)
          .then(data => { results.whois = data; })
          .catch(err => { results.errors.push({ source: 'whois', error: err.message }); })
      );
    }

    // Dork generation
    tasks.push(
      this.generateDorks(query, type)
        .then(data => { results.dorks = data.dorks; })
        .catch(err => { results.errors.push({ source: 'dorks', error: err.message }); })
    );

    // Wait for all initial tasks
    await Promise.allSettled(tasks);

    // Now run analysis on collected data
    try {
      const analysisResult = await this.analyze({
        query,
        github: results.github,
        news: results.news,
        whois: results.whois,
        dorks: results.dorks
      });
      results.analysis = analysisResult.analysis;
    } catch (err) {
      results.errors.push({ source: 'analysis', error: err.message });
    }

    return results;
  }
}

export const api = new ApiClient();
export default api;
