import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentRoute, setCurrentRoute] = useState('library');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const renderContent = () => {
    switch (currentRoute) {
      case 'library':
        return (
          <div className="content">
            <h2>My Library</h2>
            <div className="empty-state">
              <p>Your library is empty. Install data packs to start reading.</p>
            </div>
          </div>
        );
      case 'packs':
        return (
          <div className="content">
            <h2>Installed Packs</h2>
            <div className="empty-state">
              <p>No data packs installed yet.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="content">
            <h2>Settings</h2>
            <p>Theme, sync preferences, and storage management will go here.</p>
          </div>
        );
      case 'reader':
        return (
          <div className="content">
            <h2>Reader</h2>
            <p>Placeholder reader route.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container mobile-first">
      {isOffline && <div className="offline-banner">Offline Mode Active</div>}
      
      <header className="app-header">
        <h1>Empire of Trust Reader</h1>
      </header>
      
      <main className="app-main">
        {renderContent()}
      </main>

      <nav className="bottom-nav">
        <button onClick={() => setCurrentRoute('library')} className={currentRoute === 'library' ? 'active' : ''}>Library</button>
        <button onClick={() => setCurrentRoute('packs')} className={currentRoute === 'packs' ? 'active' : ''}>Packs</button>
        <button onClick={() => setCurrentRoute('reader')} className={currentRoute === 'reader' ? 'active' : ''}>Reader</button>
        <button onClick={() => setCurrentRoute('settings')} className={currentRoute === 'settings' ? 'active' : ''}>Settings</button>
      </nav>
    </div>
  );
}

export default App;
