function RiskAnalysis({ analysis }) {
  if (!analysis) return null;

  const getExposureClass = (level) => {
    switch (level) {
      case 'low': return 'exposure-low';
      case 'medium': return 'exposure-medium';
      case 'high': return 'exposure-high';
      case 'critical': return 'exposure-critical';
      default: return 'exposure-low';
    }
  };

  const getScoreClass = (score) => {
    if (score <= 30) return '';
    if (score <= 60) return 'medium';
    if (score <= 85) return 'high';
    return 'critical';
  };

  return (
    <div className="risk-panel" id="risk-analysis-panel">
      <div className="risk-header">
        <h2 className="risk-title">
          <span>🛡️</span> Risk & Insight Analysis
        </h2>
        <span className={`exposure-badge ${getExposureClass(analysis.overallExposure)}`}>
          {analysis.overallExposure} exposure
        </span>
      </div>

      {/* Exposure Score Bar */}
      <div className="score-bar-container">
        <div className="score-bar-label">
          <span>Exposure Score</span>
          <span>{analysis.exposureScore}/100</span>
        </div>
        <div className="score-bar">
          <div
            className={`score-bar-fill ${getScoreClass(analysis.exposureScore)}`}
            style={{ width: `${analysis.exposureScore}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {Object.entries(analysis.categories).map(([cat, data]) => (
          <div key={cat} className="connection-tag">
            <span className="connection-type">{cat}</span>
            <span>{data.count} found · {data.level}</span>
          </div>
        ))}
        <div className="connection-tag">
          <span className="connection-type">Total</span>
          <span>{analysis.totalMentions} mentions</span>
        </div>
      </div>

      {/* Insights */}
      {analysis.insights && analysis.insights.length > 0 && (
        <>
          <p className="section-label">Insights</p>
          <div className="insights-grid">
            {analysis.insights.map((insight, i) => (
              <div key={i} className={`insight-item ${insight.severity}`}>
                <span className="insight-icon">{insight.icon}</span>
                <span className="insight-text">{insight.text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Connections */}
      {analysis.connections && analysis.connections.length > 0 && (
        <>
          <p className="section-label">Cross-Referenced Connections</p>
          <div className="connections-list">
            {analysis.connections.map((conn, i) => (
              <div key={i} className="connection-tag">
                <span className="connection-type">{conn.type}</span>
                <span>{conn.value}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>via {conn.source}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <>
          <p className="section-label">Recommendations</p>
          {analysis.recommendations.map((rec, i) => (
            <div key={i} className="recommendation-item">
              <span className="recommendation-icon">{rec.icon}</span>
              <span className="recommendation-text">{rec.text}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default RiskAnalysis;
