import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProfileForm } from '../components/profile';
import { userApi } from '../services/api';

export const ProfilePage = () => {
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getProfile()
      .then((res) => setUser(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!user) return <div style={{ padding: 40 }}>Error loading profile</div>;

  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/chat">← Quay lại Chat</Link>
      </div>
      <h2>Hồ sơ cá nhân</h2>
      <ProfileForm user={user} onUpdate={(displayName) => setUser({ ...user, displayName })} />
    </div>
  );
};

export default ProfilePage;
