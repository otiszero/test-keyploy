import { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';

interface Message {
  id: string;
  content: string;
  senderDisplayName: string;
  senderId: string;
  createdAt: Date;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="empty-title">Chưa có tin nhắn</p>
          <p className="empty-subtitle">Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
          ))}
        </>
      )}
      <div ref={bottomRef} />
      <style>{`
        .message-list {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4) var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border-radius: var(--radius-2xl);
          margin-bottom: var(--space-4);
          color: var(--text-muted);
        }

        .empty-title {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          margin: 0 0 var(--space-1);
        }

        .empty-subtitle {
          font-size: var(--text-sm);
          margin: 0;
        }

        @media (max-width: 640px) {
          .message-list {
            padding: var(--space-3) var(--space-4);
          }
        }
      `}</style>
    </div>
  );
};

export default MessageList;
