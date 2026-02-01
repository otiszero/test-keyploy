import { Link } from 'react-router-dom';
import { ChatContainer } from '../components/chat';
import { SocketProvider } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

export const ChatPage = () => {
  const { user, logout } = useAuth();

  return (
    <SocketProvider>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: 16, borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Xin chào, {user?.displayName}</span>
          <div>
            <Link to="/profile" style={{ marginRight: 16 }}>Hồ sơ</Link>
            <button onClick={logout}>Đăng xuất</button>
          </div>
        </header>
        <main style={{ flex: 1, overflow: 'hidden' }}>
          <ChatContainer />
        </main>
      </div>
    </SocketProvider>
  );
};

export default ChatPage;
