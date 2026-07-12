import { useState } from 'react';
import './App.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState('home');

  const renderContent = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <div>
            <section className="hero">
              <h2>Welcome to Empire of Trust</h2>
              <p>An offline-first digital publishing, interactive reading, vendor discovery, and commerce platform.</p>
              <button onClick={() => alert('Download Reader Shell')}>Download Reader Shell App</button>
            </section>
            <section className="featured">
              <h3>Featured Books Placeholder</h3>
              <div className="grid">
                <div className="card">Book 1</div>
                <div className="card">Book 2</div>
                <div className="card">Book 3</div>
              </div>
            </section>
            <section className="featured">
              <h3>Featured Vendors Placeholder</h3>
              <div className="grid">
                <div className="card">Vendor A</div>
                <div className="card">Vendor B</div>
              </div>
            </section>
          </div>
        );
      case 'news': return <h2>Latest News</h2>;
      case 'privacy': return <h2>Privacy Policy</h2>;
      case 'terms': return <h2>Terms of Service</h2>;
      default: return <h2>Not Found</h2>;
    }
  };

  return (
    <div className="web-container">
      <header className="web-header">
        <h1 className="brand-logo" onClick={() => setCurrentRoute('home')}>EOT Platform</h1>
        <nav className="top-nav">
          <button onClick={() => setCurrentRoute('home')}>Home</button>
          <button onClick={() => setCurrentRoute('news')}>News</button>
          <button onClick={() => setCurrentRoute('privacy')}>Privacy</button>
          <button onClick={() => setCurrentRoute('terms')}>Terms</button>
        </nav>
      </header>
      <main className="web-main">
        {renderContent()}
      </main>
      <footer className="web-footer">
        <p>&copy; 2026 Empire of Trust Platform</p>
      </footer>
    </div>
  );
}

export default App;
