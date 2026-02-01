import { Link } from 'react-router-dom';
import { ChatContainer } from '../components/chat';
import { SocketProvider } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

export const ChatPage = () => {
  const { user, logout } = useAuth();

  return (
    <SocketProvider>
      <div className="chat-page">
        <header className="chat-header">
          <div className="header-left">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />
                <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB" />
                    <stop offset="1" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="brand-name">Keploy Chat</span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="avatar">
                {user?.displayName?.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user?.displayName}</span>
            </div>
            <nav className="header-nav">
              <Link to="/profile" className="nav-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Hồ sơ
              </Link>
              <button onClick={logout} className="btn-logout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Đăng xuất
              </button>
            </nav>
          </div>
        </header>
        <main className="chat-main">
          <ChatContainer />
        </main>
      </div>
      <style>{`
        .chat-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-primary);
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) var(--space-6);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-primary);
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
        }

        .header-left .logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .brand-name {
          font-family: var(--font-heading);
          font-weight: var(--font-bold);
          font-size: var(--text-lg);
          color: var(--text-primary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-semibold);
          font-size: var(--text-sm);
        }

        .user-name {
          font-weight: var(--font-medium);
          color: var(--text-primary);
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: transparent;
          color: var(--text-secondary);
          font-size: var(--text-sm);
          border-radius: var(--radius-md);
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
          transform: none;
          box-shadow: none;
        }

        .chat-main {
          flex: 1;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .chat-header {
            padding: var(--space-3) var(--space-4);
          }

          .brand-name,
          .user-name {
            display: none;
          }

          .header-right {
            gap: var(--space-3);
          }

          .nav-link span,
          .btn-logout span {
            display: none;
          }

          .nav-link,
          .btn-logout {
            padding: var(--space-2);
          }
        }
      `}</style>
    </SocketProvider>
  );
};

export default ChatPage;
