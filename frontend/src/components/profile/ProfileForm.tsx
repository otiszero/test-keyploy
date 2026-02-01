import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi, userApi } from '../../services/api';

interface ProfileFormProps {
  user: { email: string; displayName: string };
  onUpdate: (displayName: string) => void;
}

export const ProfileForm = ({ user, onUpdate }: ProfileFormProps) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userApi.updateProfile(displayName);
      onUpdate(displayName);
      toast.success('Cập nhật hồ sơ thành công!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast.success('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>Thông tin hồ sơ</h3>
      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: 16 }}>
          <label>Email (không thể thay đổi)</label>
          <input type="email" value={user.email} disabled style={{ width: '100%', padding: 8, background: '#eee' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Tên hiển thị</label>
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: 10 }}>{loading ? 'Đang xử lý...' : 'Cập nhật'}</button>
      </form>

      <h3 style={{ marginTop: 32 }}>Đổi mật khẩu</h3>
      <form onSubmit={handleChangePassword}>
        <div style={{ marginBottom: 16 }}>
          <input type="password" placeholder="Mật khẩu hiện tại" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="password" placeholder="Mật khẩu mới (ít nhất 8 ký tự)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: 10 }}>{loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</button>
      </form>
    </div>
  );
};

export default ProfileForm;
