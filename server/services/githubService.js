import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

/**
 * Search GitHub users by query string
 */
export async function searchUsers(query) {
  try {
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(`${GITHUB_API}/search/users`, {
      params: { q: query, per_page: 10 },
      headers,
      timeout: 10000
    });

    return response.data.items.map(user => ({
      id: user.id,
      login: user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      type: user.type,
      score: user.score
    }));
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Try again later or add a GITHUB_TOKEN.');
    }
    throw error;
  }
}

/**
 * Get detailed user profile from GitHub
 */
export async function getUserProfile(username) {
  try {
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      axios.get(`${GITHUB_API}/users/${encodeURIComponent(username)}`, { headers, timeout: 10000 }),
      axios.get(`${GITHUB_API}/users/${encodeURIComponent(username)}/repos`, {
        params: { per_page: 10, sort: 'updated' },
        headers,
        timeout: 10000
      })
    ]);

    const user = userRes.data;
    const repos = reposRes.data;

    return {
      login: user.login,
      name: user.name,
      bio: user.bio,
      company: user.company,
      location: user.location,
      email: user.email,
      blog: user.blog,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      twitterUsername: user.twitter_username,
      topRepos: repos.slice(0, 5).map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        updatedAt: repo.updated_at
      }))
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Search GitHub repositories
 */
export async function searchRepos(query) {
  try {
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(`${GITHUB_API}/search/repositories`, {
      params: { q: query, per_page: 5, sort: 'stars' },
      headers,
      timeout: 10000
    });

    return response.data.items.map(repo => ({
      name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      url: repo.html_url,
      owner: repo.owner.login
    }));
  } catch (error) {
    throw error;
  }
}
