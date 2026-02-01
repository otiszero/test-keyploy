import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../services/api';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      toast.success('Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.');
    } catch {
      toast.success('Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Quên mật khẩu</h2>
      <div style={{ marginBottom: 16 }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>{loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}</button>
      <p style={{ marginTop: 16 }}><Link to="/login">Quay lại đăng nhập</Link></p>
    </form>
  );
};

export default ForgotPasswordForm;
