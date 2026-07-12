import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

import {
  observeCustomerAuth,
  signInCustomerWithGoogle,
  signOutCustomer,
} from './services/customer-auth-service';

import './App.css';

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentRoute, setCurrentRoute] = useState('library');
  const [customer, setCustomer] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = observeCustomerAuth((user) => {
      setCustomer(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

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

  const handleGoogleLogin = async () => {
    setAuthError('');
    setSigningIn(true);

    try {
      await signInCustomerWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);

      setAuthError(
        error instanceof Error
          ? error.message
          : 'Google sign-in failed. Please try again.',
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError('');

    try {
      await signOutCustomer();
      setCurrentRoute('library');
    } catch (error) {
      console.error('Sign-out failed:', error);

      setAuthError(
        error instanceof Error
          ? error.message
          : 'Sign-out failed. Please try again.',
      );
    }
  };

  if (authLoading) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1>Empire of Trust Reader</h1>
          <p>Checking your account...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1>Empire of Trust Reader</h1>

          <p>
            Sign in with your Google account to access your library,
            installed books and reading progress.
          </p>

          <button
            type="button"
            className="google-sign-in-button"
            onClick={handleGoogleLogin}
            disabled={signingIn}
          >
            {signingIn ? 'Signing in...' : 'Continue with Google'}
          </button>

          {authError && (
            <div className="auth-error" role="alert">
              {authError}
            </div>
          )}
        </div>
      </div>
    );
  }

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

      case 'reader':
        return (
          <div className="content">
            <h2>Reader</h2>
            <p>Select a book or installed data pack to begin reading.</p>
          </div>
        );

      case 'settings':
        return (
          <div className="content">
            <h2>Settings</h2>

            <div className="customer-profile">
              {customer.photoURL && (
                <img
                  src={customer.photoURL}
                  alt={customer.displayName ?? 'Customer'}
                  className="customer-avatar"
                />
              )}

              <p>
                <strong>Name:</strong>{' '}
                {customer.displayName ?? 'Reader'}
              </p>

              <p>
                <strong>Email:</strong>{' '}
                {customer.email ?? ''}
              </p>

              <button
                type="button"
                className="sign-out-button"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container mobile-first">
      {isOffline && (
        <div className="offline-banner">
          Offline Mode Active
        </div>
      )}

      <header className="app-header">
        <div>
          <h1>Empire of Trust Reader</h1>
          <p className="signed-in-customer">
            {customer.displayName ?? customer.email}
          </p>
        </div>
      </header>

      {authError && (
        <div className="auth-error" role="alert">
          {authError}
        </div>
      )}

      <main className="app-main">
        {renderContent()}
      </main>

      <nav className="bottom-nav">
        <button
          type="button"
          onClick={() => setCurrentRoute('library')}
          className={currentRoute === 'library' ? 'active' : ''}
        >
          Library
        </button>

        <button
          type="button"
          onClick={() => setCurrentRoute('packs')}
          className={currentRoute === 'packs' ? 'active' : ''}
        >
          Packs
        </button>

        <button
          type="button"
          onClick={() => setCurrentRoute('reader')}
          className={currentRoute === 'reader' ? 'active' : ''}
        >
          Reader
        </button>

        <button
          type="button"
          onClick={() => setCurrentRoute('settings')}
          className={currentRoute === 'settings' ? 'active' : ''}
        >
          Settings
        </button>
      </nav>
    </div>
  );
}

export default App;
