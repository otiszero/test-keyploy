import { useEffect, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatContainer = () => {
  const { messages, sendMessage, isConnected, loadRecentMessages } = useSocket();
  const { user } = useAuth();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isConnected) loadRecentMessages();
  }, [isConnected, loadRecentMessages]);

  const handleSend = (content: string) => {
    setSending(true);
    sendMessage(content);
    setTimeout(() => setSending(false), 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Kênh Chat Toàn Cầu</span>
        <span style={{ fontSize: 12, color: isConnected ? 'green' : 'red' }}>{isConnected ? '● Đã kết nối' : '○ Đang kết nối...'}</span>
      </div>
      <MessageList messages={messages} currentUserId={user?.id || ''} />
      <div style={{ padding: 16, borderTop: '1px solid #ccc' }}>
        <MessageInput onSend={handleSend} disabled={!isConnected || sending} />
      </div>
    </div>
  );
};

export default ChatContainer;
