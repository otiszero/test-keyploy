import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      <div className="auth-background">
        <div className="auth-gradient" />
      </div>
      <div className="auth-container animate-fade-in">
        <div className="auth-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />
            <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="auth-brand">Keploy Chat</span>
        </div>
        <div className="auth-card card">
          <div className="auth-header">
            <h2>{title}</h2>
            {subtitle && <p className="text-muted">{subtitle}</p>}
          </div>
          {children}
        </div>
        <p className="auth-footer text-sm text-muted">
          Secure, real-time messaging for everyone
        </p>
      </div>
      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          position: relative;
          overflow: hidden;
        }

        .auth-background {
          position: absolute;
          inset: 0;
          z-index: -1;
        }

        .auth-gradient {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
        }

        .auth-container {
          width: 100%;
          max-width: 420px;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }

        .auth-brand {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        .auth-card {
          margin-bottom: var(--space-6);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .auth-header h2 {
          margin-bottom: var(--space-2);
        }

        .auth-header p {
          margin: 0;
        }

        .auth-footer {
          text-align: center;
          margin: 0;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: var(--space-6);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
