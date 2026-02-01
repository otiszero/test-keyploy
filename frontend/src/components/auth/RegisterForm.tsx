import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from './AuthLayout';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, displayName);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Bắt đầu trò chuyện miễn phí">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="displayName">Tên hiển thị</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Tên của bạn"
            required
            autoComplete="name"
          />
        </div>
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
            placeholder="Tối thiểu 8 ký tự"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <span className="input-hint">Mật khẩu phải có ít nhất 8 ký tự</span>
        </div>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? (
            <>
              <span className="spinner" />
              Đang xử lý...
            </>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
        <div className="auth-links">
          <span className="text-muted">Đã có tài khoản?</span>
          <Link to="/login">Đăng nhập</Link>
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

        .input-hint {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: var(--space-1);
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
          gap: var(--space-2);
          font-size: var(--text-sm);
        }
      `}</style>
    </AuthLayout>
  );
};

export default RegisterForm;
