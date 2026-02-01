import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../services/api';
import { AuthLayout } from './AuthLayout';

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      toast.success('Mật khẩu đã được đặt lại thành công!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Link không hợp lệ" subtitle="Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ">
        <div className="error-message">
          <div className="error-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="rgba(239, 68, 68, 0.1)" />
              <path d="M24 24L40 40M40 24L24 40" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-muted">
            Vui lòng yêu cầu link mới để đặt lại mật khẩu.
          </p>
          <Link to="/forgot-password" className="request-link">
            Yêu cầu link mới
          </Link>
        </div>
        <style>{`
          .error-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: var(--space-6);
          }

          .error-icon {
            animation: fadeIn 0.5s ease-out;
          }

          .error-message p {
            margin: 0;
          }

          .request-link {
            padding: var(--space-3) var(--space-6);
            background: var(--color-primary);
            color: white;
            border-radius: var(--radius-lg);
            font-weight: var(--font-semibold);
            transition: all var(--transition-fast);
          }

          .request-link:hover {
            background: var(--color-primary-hover);
            color: white;
          }
        `}</style>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Đặt lại mật khẩu" subtitle="Tạo mật khẩu mới cho tài khoản của bạn">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Tối thiểu 8 ký tự"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? (
            <>
              <span className="spinner" />
              Đang xử lý...
            </>
          ) : (
            'Đặt lại mật khẩu'
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

export default ResetPasswordForm;
