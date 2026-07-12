import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import type { User } from 'firebase/auth';

import {
  getCustomerProfile,
  observeCustomerAuth,
  signInCustomerWithGoogle,
  signOutCustomer,
  updateCustomerProfile,
  type CustomerProfile,
} from './services/customer-auth-service';

import PassportPhotoUploader from './components/PassportPhotoUploader';

import './App.css';

interface ProfileFormState {
  phoneNumber: string;
  dateOfBirth: string;
  addressLine1: string;
  suburb: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

const initialProfileForm: ProfileFormState = {
  phoneNumber: '',
  dateOfBirth: '',
  addressLine1: '',
  suburb: '',
  city: 'Harare',
  province: 'Harare',
  country: 'Zimbabwe',
  postalCode: '',
};

function calculateAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) {
    return null;
  }

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference =
    today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age -= 1;
  }

  return age;
}

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentRoute, setCurrentRoute] = useState('library');

  const [customer, setCustomer] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] =
    useState<CustomerProfile | null>(null);

  const [profileForm, setProfileForm] =
    useState<ProfileFormState>(initialProfileForm);

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [authError, setAuthError] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const unsubscribe = observeCustomerAuth((user) => {
      setCustomer(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!customer) {
        setCustomerProfile(null);
        setProfileForm(initialProfileForm);
        return;
      }

      setProfileLoading(true);
      setProfileError('');

      try {
        const profile = await getCustomerProfile(customer.uid);

        if (cancelled) {
          return;
        }

        setCustomerProfile(profile);

        if (profile) {
          setProfileForm({
            phoneNumber: profile.phoneNumber ?? '',
            dateOfBirth: profile.dateOfBirth ?? '',
            addressLine1: profile.addressLine1 ?? '',
            suburb: profile.suburb ?? '',
            city: profile.city ?? 'Harare',
            province: profile.province ?? 'Harare',
            country: profile.country ?? 'Zimbabwe',
            postalCode: profile.postalCode ?? '',
          });
        }
      } catch (error) {
        console.error('Could not load customer profile:', error);

        if (!cancelled) {
          setProfileError(
            error instanceof Error
              ? error.message
              : 'Could not load your customer profile.',
          );
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [customer]);

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
    setProfileError('');

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

  const handleProfileChange = (
    field: keyof ProfileFormState,
    value: string,
  ) => {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleEditProfile = () => {
    if (!customerProfile) {
      return;
    }

    setProfileForm({
      phoneNumber: customerProfile.phoneNumber ?? '',
      dateOfBirth: customerProfile.dateOfBirth ?? '',
      addressLine1: customerProfile.addressLine1 ?? '',
      suburb: customerProfile.suburb ?? '',
      city: customerProfile.city ?? '',
      province: customerProfile.province ?? '',
      country: customerProfile.country ?? 'Zimbabwe',
      postalCode: customerProfile.postalCode ?? '',
    });

    setProfileError('');
    setEditingProfile(true);
  };

  const handleCancelProfileEdit = () => {
    setProfileError('');
    setEditingProfile(false);
  };

  const handleProfileSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!customer) {
      return;
    }

    setProfileError('');

    if (!customerProfile?.passportPhotoUrl) {
      setProfileError(
        'Upload your passport-size photograph before continuing.',
      );
      return;
    }

    const age = calculateAge(profileForm.dateOfBirth);

    if (age === null || age < 5 || age > 120) {
      setProfileError('Enter a valid date of birth.');
      return;
    }

    const phonePattern = /^(\+2637\d{8}|07\d{8})$/;

    if (!phonePattern.test(profileForm.phoneNumber.trim())) {
      setProfileError(
        'Use a Zimbabwean number such as 0771234567 or +263771234567.',
      );

      return;
    }

    setSavingProfile(true);

    try {
      await updateCustomerProfile(
        customer.uid,
        profileForm,
      );

      const updatedProfile =
        await getCustomerProfile(customer.uid);

      setCustomerProfile(updatedProfile);
      setEditingProfile(false);
    } catch (error) {
      console.error('Could not save customer profile:', error);

      setProfileError(
        error instanceof Error
          ? error.message
          : 'Could not save your customer profile.',
      );
    } finally {
      setSavingProfile(false);
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
            {signingIn
              ? 'Signing in...'
              : 'Continue with Google'}
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

  if (profileLoading) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1>Complete Your Profile</h1>
          <p>Loading your customer details...</p>
        </div>
      </div>
    );
  }

  if (!customerProfile?.profileCompleted) {
    const calculatedAge =
      calculateAge(profileForm.dateOfBirth);

    return (
      <div className="profile-screen">
        <div className="profile-card">
          <h1>Complete Your Customer Profile</h1>

          <p>
            Please provide your contact and residential details before
            opening your reader library.
          </p>

          <PassportPhotoUploader
            uid={customer.uid}
            currentPhotoUrl={
              customerProfile?.passportPhotoUrl
            }
            required
            onUploaded={(downloadUrl) => {
              setCustomerProfile((current) => (
                current
                  ? {
                      ...current,
                      passportPhotoUrl: downloadUrl,
                    }
                  : current
              ));
            }}
          />

          <form
            className="profile-form"
            onSubmit={handleProfileSubmit}
          >
            <label>
              Phone number
              <input
                type="tel"
                value={profileForm.phoneNumber}
                onChange={(event) =>
                  handleProfileChange(
                    'phoneNumber',
                    event.target.value,
                  )
                }
                placeholder="0771234567"
                required
              />
            </label>

            <label>
              Date of birth
              <input
                type="date"
                value={profileForm.dateOfBirth}
                onChange={(event) =>
                  handleProfileChange(
                    'dateOfBirth',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            {calculatedAge !== null && (
              <p className="calculated-age">
                Calculated age: {calculatedAge}
              </p>
            )}

            <label>
              Street or residential address
              <input
                type="text"
                value={profileForm.addressLine1}
                onChange={(event) =>
                  handleProfileChange(
                    'addressLine1',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              Suburb
              <input
                type="text"
                value={profileForm.suburb}
                onChange={(event) =>
                  handleProfileChange(
                    'suburb',
                    event.target.value,
                  )
                }
                placeholder="Southview"
                required
              />
            </label>

            <label>
              City or town
              <input
                type="text"
                value={profileForm.city}
                onChange={(event) =>
                  handleProfileChange(
                    'city',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              Province
              <input
                type="text"
                value={profileForm.province}
                onChange={(event) =>
                  handleProfileChange(
                    'province',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              Country
              <input
                type="text"
                value={profileForm.country}
                onChange={(event) =>
                  handleProfileChange(
                    'country',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              Postal code, if applicable
              <input
                type="text"
                value={profileForm.postalCode}
                onChange={(event) =>
                  handleProfileChange(
                    'postalCode',
                    event.target.value,
                  )
                }
              />
            </label>

            {profileError && (
              <div className="auth-error" role="alert">
                {profileError}
              </div>
            )}

            <button
              type="submit"
              className="profile-save-button"
              disabled={savingProfile}
            >
              {savingProfile
                ? 'Saving profile...'
                : 'Save and Open Library'}
            </button>
          </form>

          <button
            type="button"
            className="profile-sign-out-button"
            onClick={handleSignOut}
          >
            Sign in with another account
          </button>
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
              <p>
                Your library is empty. Install data packs to start
                reading.
              </p>
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
        if (editingProfile) {
          const calculatedEditAge =
            calculateAge(profileForm.dateOfBirth);

          return (
            <div className="content">
              <h2>Edit Customer Profile</h2>

              <div className="settings-profile-editor">
                <PassportPhotoUploader
                  uid={customer.uid}
                  currentPhotoUrl={
                    customerProfile.passportPhotoUrl
                  }
                  onUploaded={(downloadUrl) => {
                    setCustomerProfile((current) => (
                      current
                        ? {
                            ...current,
                            passportPhotoUrl: downloadUrl,
                          }
                        : current
                    ));
                  }}
                />

                <form
                  className="profile-form"
                  onSubmit={handleProfileSubmit}
                >
                  <label>
                    Phone number
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(event) =>
                        handleProfileChange(
                          'phoneNumber',
                          event.target.value,
                        )
                      }
                      placeholder="0771234567"
                      required
                    />
                  </label>

                  <label>
                    Date of birth
                    <input
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(event) =>
                        handleProfileChange(
                          'dateOfBirth',
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  {calculatedEditAge !== null && (
                    <p className="calculated-age">
                      Calculated age: {calculatedEditAge}
                    </p>
                  )}

                  <label>
                    Street or residential address
                    <input
                      type="text"
                      value={profileForm.addressLine1}
                      onChange={(event) =>
                        handleProfileChange(
                          'addressLine1',
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Suburb
                    <input
                      type="text"
                      value={profileForm.suburb}
                      onChange={(event) =>
                        handleProfileChange(
                          'suburb',
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    City or town
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(event) =>
                        handleProfileChange(
                          'city',
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Province
                    <input
                      type="text"
                      value={profileForm.province}
                      onChange={(event) =>
                        handleProfileChange(
                          'province',
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Country
                    <input
                      type="text"
                      value={profileForm.country}
                      onChange={(event) =>
                        handleProfileChange(
                          'country',
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Postal code, if applicable
                    <input
                      type="text"
                      value={profileForm.postalCode}
                      onChange={(event) =>
                        handleProfileChange(
                          'postalCode',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  {profileError && (
                    <div className="auth-error" role="alert">
                      {profileError}
                    </div>
                  )}

                  <div className="profile-edit-actions">
                    <button
                      type="submit"
                      className="profile-save-button"
                      disabled={savingProfile}
                    >
                      {savingProfile
                        ? 'Saving changes...'
                        : 'Save Changes'}
                    </button>

                    <button
                      type="button"
                      className="profile-cancel-button"
                      onClick={handleCancelProfileEdit}
                      disabled={savingProfile}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        }

        return (
          <div className="content">
            <h2>Settings</h2>

            <div className="customer-profile">
              {(customerProfile.passportPhotoUrl ||
                customer.photoURL) && (
                <img
                  src={
                    customerProfile.passportPhotoUrl ??
                    customer.photoURL ??
                    ''
                  }
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

              <p>
                <strong>Phone:</strong>{' '}
                {customerProfile.phoneNumber ?? ''}
              </p>

              <p>
                <strong>Date of birth:</strong>{' '}
                {customerProfile.dateOfBirth ?? ''}
              </p>

              <p>
                <strong>Age:</strong>{' '}
                {calculateAge(
                  customerProfile.dateOfBirth ?? '',
                ) ?? ''}
              </p>

              <p>
                <strong>Address:</strong>{' '}
                {customerProfile.addressLine1 ?? ''}
              </p>

              <p>
                <strong>Suburb:</strong>{' '}
                {customerProfile.suburb ?? ''}
              </p>

              <p>
                <strong>City:</strong>{' '}
                {customerProfile.city ?? ''}
              </p>

              <p>
                <strong>Province:</strong>{' '}
                {customerProfile.province ?? ''}
              </p>

              <p>
                <strong>Country:</strong>{' '}
                {customerProfile.country ?? ''}
              </p>

              <div className="settings-actions">
                <button
                  type="button"
                  className="edit-profile-button"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  className="sign-out-button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
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



