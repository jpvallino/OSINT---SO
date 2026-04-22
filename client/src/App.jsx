import { useState, useEffect } from 'react';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import api from './services/api';

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const accepted = localStorage.getItem('osint-so-disclaimer');
    if (accepted === 'true') {
      setDisclaimerAccepted(true);
    }
  }, []);

  const handleDisclaimerAccept = () => {
    localStorage.setItem('osint-so-disclaimer', 'true');
    setDisclaimerAccepted(true);
  };

  const handleSearch = async (query, type) => {
    setIsLoading(true);
    setResults(null);
    setLoadingSteps([
      { id: 'github', label: 'Scanning GitHub...', status: 'active' },
      { id: 'news', label: 'Searching news sources...', status: 'pending' },
      { id: 'whois', label: type === 'domain' || type === 'email' ? 'Running WHOIS lookup...' : 'Skipping WHOIS (not a domain)', status: 'pending' },
      { id: 'dorks', label: 'Generating search queries...', status: 'pending' },
      { id: 'analysis', label: 'Analyzing results...', status: 'pending' }
    ]);

    try {
      // Simulate progressive loading for UX
      const updateStep = (id, status) => {
        setLoadingSteps(prev => prev.map(s =>
          s.id === id ? { ...s, status } : s
        ));
      };

      // Start the scan
      const scanPromise = api.fullScan(query, type);

      // Animate steps
      setTimeout(() => { updateStep('github', 'done'); updateStep('news', 'active'); }, 800);
      setTimeout(() => { updateStep('news', 'done'); updateStep('whois', 'active'); }, 1500);
      setTimeout(() => { updateStep('whois', 'done'); updateStep('dorks', 'active'); }, 2000);
      setTimeout(() => { updateStep('dorks', 'done'); updateStep('analysis', 'active'); }, 2500);

      const data = await scanPromise;

      updateStep('analysis', 'done');

      setResults(data);
      setSearchHistory(prev => [
        { query, type, timestamp: new Date().toISOString() },
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      console.error('Search error:', error);
      setResults({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!disclaimerAccepted && (
        <Disclaimer onAccept={handleDisclaimerAccept} />
      )}

      <Header />

      <main className="app-container">
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {isLoading && (
          <LoadingSpinner steps={loadingSteps} />
        )}

        {!isLoading && results && (
          <Dashboard results={results} />
        )}

        {!isLoading && !results && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">Ready to investigate</h2>
            <p className="empty-state-text">
              Enter a name, username, email, or domain above to begin your OSINT reconnaissance.
              All searches use only publicly available data.
            </p>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="app-container">
          <p className="footer-text">
            OSINT-SO — Open Source Intelligence Tool<br />
            For educational and ethical research purposes only.<br />
            Built with ⚡ React + Node.js | Uses only public APIs and generated search links.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
