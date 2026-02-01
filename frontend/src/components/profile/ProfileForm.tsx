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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await userApi.updateProfile(displayName);
      onUpdate(displayName);
      toast.success('Cập nhật hồ sơ thành công!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoadingPassword(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast.success('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="profile-forms">
      <section className="form-section card">
        <div className="section-header">
          <div className="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3>Thông tin cá nhân</h3>
        </div>
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="input-disabled"
            />
            <span className="input-hint">Email không thể thay đổi</span>
          </div>
          <div className="form-group">
            <label htmlFor="displayName">Tên hiển thị</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tên của bạn"
              required
            />
          </div>
          <button type="submit" disabled={loadingProfile} className="btn-submit">
            {loadingProfile ? (
              <>
                <span className="spinner" />
                Đang xử lý...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </form>
      </section>

      <section className="form-section card">
        <div className="section-header">
          <div className="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3>Đổi mật khẩu</h3>
        </div>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              required
              autoComplete="current-password"
            />
          </div>
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
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
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
          <button type="submit" disabled={loadingPassword} className="btn-submit">
            {loadingPassword ? (
              <>
                <span className="spinner" />
                Đang xử lý...
              </>
            ) : (
              'Đổi mật khẩu'
            )}
          </button>
        </form>
      </section>

      <style>{`
        .profile-forms {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .form-section {
          padding: var(--space-6);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .section-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          color: var(--color-primary-light);
        }

        .section-header h3 {
          margin: 0;
          font-size: var(--text-lg);
        }

        form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .input-disabled {
          background: var(--bg-tertiary);
          opacity: 0.7;
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
      `}</style>
    </div>
  );
};

export default ProfileForm;
