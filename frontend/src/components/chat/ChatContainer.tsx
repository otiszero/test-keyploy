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
    <div className="chat-container">
      <div className="chat-channel-header">
        <div className="channel-info">
          <div className="channel-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="channel-details">
            <h3 className="channel-name">Kênh Chat Toàn Cầu</h3>
            <span className="channel-description">Trò chuyện với mọi người</span>
          </div>
        </div>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
          <span className="status-text">
            {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
          </span>
        </div>
      </div>
      <MessageList messages={messages} currentUserId={user?.id || ''} />
      <div className="chat-input-wrapper">
        <MessageInput onSend={handleSend} disabled={!isConnected || sending} />
      </div>
      <style>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-primary);
        }

        .chat-channel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) var(--space-6);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-primary);
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .channel-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          color: var(--color-primary-light);
        }

        .channel-details {
          display: flex;
          flex-direction: column;
        }

        .channel-name {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          margin: 0;
          color: var(--text-primary);
        }

        .channel-description {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
        }

        .status-text {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .chat-input-wrapper {
          padding: var(--space-4) var(--space-6);
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-primary);
        }

        @media (max-width: 640px) {
          .chat-channel-header {
            padding: var(--space-3) var(--space-4);
          }

          .channel-description {
            display: none;
          }

          .status-text {
            display: none;
          }

          .chat-input-wrapper {
            padding: var(--space-3) var(--space-4);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatContainer;
