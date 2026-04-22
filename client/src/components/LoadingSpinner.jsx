function LoadingSpinner({ steps = [] }) {
  return (
    <div className="loading-container" id="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Executing OSINT reconnaissance...</p>

      {steps.length > 0 && (
        <div className="loading-progress">
          {steps.map(step => (
            <div key={step.id} className={`loading-step ${step.status}`}>
              <span className="loading-step-icon">
                {step.status === 'done' ? '✓' :
                 step.status === 'active' ? '⟳' : '○'}
              </span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LoadingSpinner;
