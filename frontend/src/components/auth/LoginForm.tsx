import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from './AuthLayout';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Đăng nhập thành công!');
      navigate('/chat');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Chào mừng trở lại" subtitle="Đăng nhập để tiếp tục trò chuyện">
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
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? (
            <>
              <span className="spinner" />
              Đang xử lý...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
        <div className="auth-links">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <span className="text-muted">|</span>
          <Link to="/register">Tạo tài khoản mới</Link>
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
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-sm);
        }

        .auth-links .text-muted {
          color: var(--border-primary);
        }
      `}</style>
    </AuthLayout>
  );
};

export default LoginForm;
