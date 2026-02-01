import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../services/api';

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Đặt lại mật khẩu</h2>
      <div style={{ marginBottom: 16 }}>
        <input type="password" placeholder="Mật khẩu mới (ít nhất 8 ký tự)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} style={{ width: '100%', padding: 8 }} />
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>{loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}</button>
      <p style={{ marginTop: 16 }}><Link to="/login">Quay lại đăng nhập</Link></p>
    </form>
  );
};

export default ResetPasswordForm;
