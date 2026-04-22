import { useState } from 'react';
import RiskAnalysis from './RiskAnalysis';
import DorkGenerator from './DorkGenerator';

const CATEGORIES = [
  { id: 'all', label: '⊕ All Results', icon: '⊕' },
  { id: 'professional', label: '💼 Professional', icon: '💼' },
  { id: 'social', label: '👥 Social', icon: '👥' },
  { id: 'documents', label: '📄 Documents', icon: '📄' },
  { id: 'mentions', label: '📰 Mentions', icon: '📰' },
  { id: 'whois', label: '🌐 WHOIS', icon: '🌐' }
];

function Dashboard({ results }) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (results.error) {
    return (
      <div className="dashboard" id="dashboard">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Search Error</h2>
          <p className="empty-state-text">{results.error}</p>
        </div>
      </div>
    );
  }

  // Count results per category
  const counts = {
    professional: (results.github?.users?.length || 0),
    social: 0,
    documents: 0,
    mentions: (results.news?.articles?.length || 0) + (results.news?.searchLinks?.length || 0),
    whois: results.whois && !results.whois.error ? 1 : 0
  };
  counts.all = Object.values(counts).reduce((a, b) => a + b, 0);

  const timestamp = new Date().toLocaleString();

  return (
    <div className="dashboard" id="dashboard">
      {/* Analysis Panel */}
      {results.analysis && (
        <RiskAnalysis analysis={results.analysis} />
      )}

      {/* Dashboard header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <span>◉</span> Intelligence Report: <span className="mono">"{results.query}"</span>
        </h2>
        <span className="dashboard-meta">{timestamp}</span>
      </div>

      {/* Category tabs */}
      <div className="category-tabs" id="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            id={`cat-tab-${cat.id}`}
          >
            {cat.label}
            {counts[cat.id] > 0 && (
              <span className="category-count">{counts[cat.id]}</span>
            )}
          </button>
        ))}
      </div>

      {/* GitHub / Professional Results */}
      {(activeCategory === 'all' || activeCategory === 'professional') && results.github && (
        <section>
          <p className="section-label">→ GitHub Intelligence</p>

          {/* GitHub Profile Card */}
          {results.github.profile && (
            <div className="github-profile" id="github-profile">
              <img
                src={results.github.profile.avatarUrl}
                alt={results.github.profile.login}
                className="github-avatar"
              />
              <div className="github-info">
                <h3 className="github-name">{results.github.profile.name || results.github.profile.login}</h3>
                <p className="github-username">@{results.github.profile.login}</p>
                {results.github.profile.bio && (
                  <p className="github-bio">{results.github.profile.bio}</p>
                )}
                <div className="github-stats">
                  <span className="github-stat">
                    <span className="github-stat-value">{results.github.profile.publicRepos}</span> repos
                  </span>
                  <span className="github-stat">
                    <span className="github-stat-value">{results.github.profile.followers}</span> followers
                  </span>
                  <span className="github-stat">
                    <span className="github-stat-value">{results.github.profile.following}</span> following
                  </span>
                  {results.github.profile.location && (
                    <span className="github-stat">📍 {results.github.profile.location}</span>
                  )}
                </div>
                <a
                  href={results.github.profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="result-card-link"
                  style={{ marginTop: '12px', display: 'inline-flex' }}
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          )}

          {/* GitHub user search results */}
          {results.github.users && results.github.users.length > 0 && (
            <div className="results-grid">
              {results.github.users.map(user => (
                <div key={user.id} className="result-card">
                  <div className="result-card-header">
                    <div className="result-card-icon">
                      <img
                        src={user.avatarUrl}
                        alt={user.login}
                        style={{ width: '100%', height: '100%', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <h3 className="result-card-title">{user.login}</h3>
                      <p className="result-card-source">GitHub · {user.type}</p>
                    </div>
                  </div>
                  <div className="result-card-meta">
                    <span className="result-meta-tag">Score: {user.score?.toFixed(1)}</span>
                    <span className="result-meta-tag">{user.type}</span>
                  </div>
                  <a
                    href={user.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="result-card-link"
                  >
                    View Profile →
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Top Repos */}
          {results.github.profile?.topRepos && results.github.profile.topRepos.length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: '20px' }}>→ Top Repositories</p>
              <div className="results-grid">
                {results.github.profile.topRepos.map(repo => (
                  <div key={repo.name} className="result-card">
                    <div className="result-card-header">
                      <div className="result-card-icon">📦</div>
                      <div>
                        <h3 className="result-card-title">{repo.name}</h3>
                        <p className="result-card-source">{repo.language || 'Unknown language'}</p>
                      </div>
                    </div>
                    {repo.description && (
                      <p className="result-card-description">{repo.description}</p>
                    )}
                    <div className="result-card-meta">
                      <span className="result-meta-tag">⭐ {repo.stars}</span>
                      <span className="result-meta-tag">🔀 {repo.forks}</span>
                    </div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="result-card-link"
                    >
                      View Repo →
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* News / Mentions */}
      {(activeCategory === 'all' || activeCategory === 'mentions') && results.news && (
        <section style={{ marginTop: '24px' }}>
          <p className="section-label">→ News & Mentions</p>

          {/* API results */}
          {results.news.articles && results.news.articles.length > 0 && (
            <div className="results-grid">
              {results.news.articles.map((article, i) => (
                <div key={i} className="result-card">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="news-image"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="result-card-header">
                    <div className="result-card-icon">📰</div>
                    <div>
                      <h3 className="result-card-title">{article.title}</h3>
                      <p className="result-card-source">{article.source?.name}</p>
                    </div>
                  </div>
                  {article.description && (
                    <p className="result-card-description">{article.description}</p>
                  )}
                  <div className="result-card-meta">
                    <span className="news-date">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="result-card-link"
                  >
                    Read Article →
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Search links fallback */}
          {results.news.searchLinks && results.news.searchLinks.length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: '16px' }}>
                Search news sources directly:
              </p>
              <div className="news-links-grid">
                {results.news.searchLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link-card"
                  >
                    <span className="news-link-icon">{link.icon}</span>
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* WHOIS Results */}
      {(activeCategory === 'all' || activeCategory === 'whois') && results.whois && !results.whois.error && (
        <section style={{ marginTop: '24px' }}>
          <p className="section-label">→ WHOIS / RDAP Data</p>
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">🌐</div>
              <div>
                <h3 className="result-card-title">Domain: {results.whois.domain}</h3>
                <p className="result-card-source">RDAP Registry Lookup</p>
              </div>
            </div>

            <div className="whois-data">
              {results.whois.status && results.whois.status.length > 0 && (
                <div className="whois-field">
                  <span className="whois-label">Status:</span>
                  <span className="whois-value">{results.whois.status.join(', ')}</span>
                </div>
              )}

              {results.whois.events && results.whois.events.map((event, i) => (
                <div key={i} className="whois-field">
                  <span className="whois-label">{event.action}:</span>
                  <span className="whois-value">{new Date(event.date).toLocaleString()}</span>
                </div>
              ))}

              {results.whois.nameservers && results.whois.nameservers.length > 0 && (
                <div className="whois-field">
                  <span className="whois-label">Nameservers:</span>
                  <span className="whois-value">
                    {results.whois.nameservers.map(ns => ns.name).join(', ')}
                  </span>
                </div>
              )}

              {results.whois.entities && results.whois.entities.map((entity, i) => (
                <div key={i}>
                  {entity.roles && (
                    <div className="whois-field">
                      <span className="whois-label">Role:</span>
                      <span className="whois-value">{entity.roles.join(', ')}</span>
                    </div>
                  )}
                  {entity.name && (
                    <div className="whois-field">
                      <span className="whois-label">Name:</span>
                      <span className="whois-value">{entity.name}</span>
                    </div>
                  )}
                  {entity.organization && (
                    <div className="whois-field">
                      <span className="whois-label">Organization:</span>
                      <span className="whois-value">{entity.organization}</span>
                    </div>
                  )}
                  {entity.handle && (
                    <div className="whois-field">
                      <span className="whois-label">Handle:</span>
                      <span className="whois-value">{entity.handle}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dork Queries */}
      {(activeCategory === 'all' || activeCategory === 'documents' || activeCategory === 'social') && results.dorks && (
        <DorkGenerator dorks={results.dorks} activeCategory={activeCategory} />
      )}

      {/* Errors */}
      {results.errors && results.errors.length > 0 && (
        <section style={{ marginTop: '24px' }}>
          <p className="section-label">→ Errors & Warnings</p>
          {results.errors.map((err, i) => (
            <div key={i} className="recommendation-item">
              <span className="recommendation-icon">⚠️</span>
              <span className="recommendation-text">
                <strong>{err.source}:</strong> {err.error}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default Dashboard;
