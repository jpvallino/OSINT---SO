import { useState } from 'react';

function Disclaimer({ onAccept }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="modal-overlay" id="disclaimer-modal">
      <div className="modal-content">
        <span className="modal-icon">⚠️</span>
        <h2 className="modal-title">Responsible Use Agreement</h2>
        <div className="modal-text">
          <p>
            <strong>OSINT-SO</strong> is an open-source intelligence tool designed for
            <strong> ethical and legal research</strong> purposes only.
          </p>
          <p>By using this tool, you agree to:</p>
          <ul>
            <li>Use it only for lawful and ethical purposes</li>
            <li>Not target private individuals for harassment or stalking</li>
            <li>Not aggregate sensitive personal data</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Respect the privacy and rights of all individuals</li>
            <li>Use findings responsibly and constructively</li>
          </ul>
          <p>
            This tool only accesses <strong>publicly available information</strong> through
            official APIs and search engine links. No scraping of restricted platforms is performed.
          </p>
        </div>

        <label className="modal-checkbox" id="agree-checkbox">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="modal-checkbox-label">
            I understand and agree to use this tool responsibly and ethically
          </span>
        </label>

        <button
          className="modal-btn"
          disabled={!agreed}
          onClick={onAccept}
          id="accept-btn"
        >
          {agreed ? '▸ PROCEED TO OSINT-SO' : 'Please agree to continue'}
        </button>
      </div>
    </div>
  );
}

export default Disclaimer;
