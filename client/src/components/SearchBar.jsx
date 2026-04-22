import { useState } from 'react';

const SEARCH_TYPES = [
  { id: 'name', label: '👤 Name', placeholder: 'Enter full name (e.g., John Doe)' },
  { id: 'username', label: '🏷️ Username', placeholder: 'Enter username (e.g., johndoe)' },
  { id: 'email', label: '📧 Email', placeholder: 'Enter email (e.g., john@example.com)' },
  { id: 'domain', label: '🌐 Domain', placeholder: 'Enter domain (e.g., example.com)' },
  { id: 'keyword', label: '🔑 Keyword', placeholder: 'Enter keyword or phrase' }
];

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('name');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2 && !isLoading) {
      onSearch(query.trim(), searchType);
    }
  };

  const currentType = SEARCH_TYPES.find(t => t.id === searchType);

  return (
    <section className="search-section" id="search-section">
      <div className="search-container">
        <div className="search-type-tabs" id="search-type-tabs">
          {SEARCH_TYPES.map(type => (
            <button
              key={type.id}
              className={`search-type-tab ${searchType === type.id ? 'active' : ''}`}
              onClick={() => setSearchType(type.id)}
              id={`search-tab-${type.id}`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder={currentType?.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              id="search-input"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className="search-btn"
              disabled={query.trim().length < 2 || isLoading}
              id="search-btn"
            >
              {isLoading ? '⟳ SCANNING...' : '▸ SCAN'}
            </button>
          </div>
        </form>

        <p className="search-hint">
          💡 Tip: Use the tabs above to specify the type of search for more accurate results.
          All lookups use publicly available data only.
        </p>
      </div>
    </section>
  );
}

export default SearchBar;
