import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProfileForm } from '../components/profile';
import { userApi } from '../services/api';

export const ProfilePage = () => {
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getProfile()
      .then((res) => setUser(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <span className="spinner" style={{ width: 32, height: 32 }} />
          <p>Đang tải...</p>
        </div>
        <style>{`
          .profile-page {
            min-height: 100vh;
            background: var(--bg-primary);
          }
          .profile-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: var(--space-4);
            color: var(--text-muted);
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p>Không thể tải thông tin hồ sơ</p>
          <Link to="/chat" className="btn-back">Quay lại Chat</Link>
        </div>
        <style>{`
          .profile-page {
            min-height: 100vh;
            background: var(--bg-primary);
          }
          .profile-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: var(--space-4);
            color: var(--text-muted);
          }
          .error-icon {
            color: var(--color-error);
          }
          .btn-back {
            padding: var(--space-3) var(--space-6);
            background: var(--color-primary);
            color: white;
            border-radius: var(--radius-lg);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/chat" className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Quay lại Chat
        </Link>
      </header>
      <main className="profile-content">
        <div className="profile-hero">
          <div className="profile-avatar">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <h1>{user.displayName}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
        <ProfileForm user={user} onUpdate={(displayName) => setUser({ ...user, displayName })} />
      </main>
      <style>{`
        .profile-page {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .profile-header {
          padding: var(--space-4) var(--space-6);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-primary);
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-weight: var(--font-medium);
          transition: color var(--transition-fast);
        }

        .back-button:hover {
          color: var(--text-primary);
        }

        .profile-content {
          max-width: 600px;
          margin: 0 auto;
          padding: var(--space-8) var(--space-6);
        }

        .profile-hero {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          margin: 0 auto var(--space-4);
        }

        .profile-hero h1 {
          margin: 0 0 var(--space-1);
          font-size: var(--text-2xl);
        }

        .profile-email {
          color: var(--text-muted);
          margin: 0;
        }

        @media (max-width: 640px) {
          .profile-content {
            padding: var(--space-6) var(--space-4);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
