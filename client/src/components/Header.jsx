function Header() {
  return (
    <header className="header" id="app-header">
      <div className="header-inner">
        <div className="header-logo">
          <div className="header-logo-icon">⊕</div>
          <div>
            <div className="header-title">OSINT-SO</div>
            <div className="header-subtitle">Open Source Intelligence</div>
          </div>
        </div>

        <div className="header-status">
          <div className="status-dot"></div>
          <span>SYSTEMS ONLINE</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
