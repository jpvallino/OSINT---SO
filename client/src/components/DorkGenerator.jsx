const CATEGORY_LABELS = {
  social: '👥 Social Media',
  professional: '💼 Professional',
  documents: '📄 Documents',
  mentions: '📰 Mentions',
  email: '📧 Email Intelligence'
};

function DorkGenerator({ dorks, activeCategory }) {
  if (!dorks) return null;

  // Filter categories based on active tab
  const categoriesToShow = activeCategory === 'all'
    ? Object.keys(dorks)
    : Object.keys(dorks).filter(cat => {
        if (activeCategory === 'social') return cat === 'social';
        if (activeCategory === 'professional') return cat === 'professional';
        if (activeCategory === 'documents') return cat === 'documents';
        if (activeCategory === 'mentions') return cat === 'mentions';
        return true;
      });

  if (categoriesToShow.length === 0) return null;

  return (
    <section className="dork-section" id="dork-section" style={{ marginTop: '24px' }}>
      <p className="section-label">→ Advanced Search Queries (Google Dorks)</p>

      {categoriesToShow.map(category => (
        <div key={category} className="dork-category">
          <h3 className="dork-category-title">
            {CATEGORY_LABELS[category] || category}
          </h3>

          <div className="dork-list">
            {dorks[category].map((dork, i) => (
              <div key={i} className="dork-item">
                <span className="dork-item-icon">{dork.icon}</span>
                <span className="dork-item-label">{dork.label}</span>
                <span className="dork-item-query" title={dork.dorkQuery}>
                  {dork.dorkQuery}
                </span>
                <div className="dork-item-links">
                  {dork.searchEngines.google && (
                    <a
                      href={dork.searchEngines.google}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dork-engine-link google"
                    >
                      Google
                    </a>
                  )}
                  {dork.searchEngines.duckduckgo && (
                    <a
                      href={dork.searchEngines.duckduckgo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dork-engine-link ddg"
                    >
                      DDG
                    </a>
                  )}
                  {dork.searchEngines.bing && (
                    <a
                      href={dork.searchEngines.bing}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dork-engine-link bing"
                    >
                      Bing
                    </a>
                  )}
                  {dork.searchEngines.hibp && (
                    <a
                      href={dork.searchEngines.hibp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dork-engine-link google"
                    >
                      HIBP
                    </a>
                  )}
                  {dork.searchEngines.rdap && (
                    <a
                      href={dork.searchEngines.rdap}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dork-engine-link ddg"
                    >
                      RDAP
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default DorkGenerator;
