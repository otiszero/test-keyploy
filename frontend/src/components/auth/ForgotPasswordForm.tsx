import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../services/api';
import { AuthLayout } from './AuthLayout';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.');
    } catch {
      toast.success('Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.');
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Kiểm tra email" subtitle="Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu">
        <div className="success-message">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(16, 185, 129, 0.1)" />
              <path d="M20 32L28 40L44 24" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-muted">
            Nếu có tài khoản với email <strong>{email}</strong>, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu trong vài phút.
          </p>
          <Link to="/login" className="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Quay lại đăng nhập
          </Link>
        </div>
        <style>{`
          .success-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: var(--space-6);
          }

          .success-icon {
            animation: fadeIn 0.5s ease-out;
          }

          .success-message p {
            margin: 0;
            line-height: 1.6;
          }

          .success-message strong {
            color: var(--text-primary);
          }

          .back-link {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
          }
        `}</style>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Quên mật khẩu" subtitle="Nhập email để nhận link đặt lại mật khẩu">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? (
            <>
              <span className="spinner" />
              Đang xử lý...
            </>
          ) : (
            'Gửi yêu cầu'
          )}
        </button>
        <div className="auth-links">
          <Link to="/login" className="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
      <style>{`
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .btn-submit {
          width: 100%;
          padding: var(--space-4);
          margin-top: var(--space-2);
        }

        .auth-links {
          display: flex;
          justify-content: center;
          font-size: var(--text-sm);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
        }
      `}</style>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
