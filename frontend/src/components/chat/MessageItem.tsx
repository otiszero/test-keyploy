interface MessageItemProps {
  message: { id: string; content: string; senderDisplayName: string; senderId: string; createdAt: Date };
  isOwn: boolean;
}

export const MessageItem = ({ message, isOwn }: MessageItemProps) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`message-item ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <div className="message-avatar">
          {message.senderDisplayName.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="message-content">
        {!isOwn && <span className="message-sender">{message.senderDisplayName}</span>}
        <div className="message-bubble">
          <p className="message-text">{message.content}</p>
        </div>
        <span className="message-time">{formatTime(message.createdAt)}</span>
      </div>
      <style>{`
        .message-item {
          display: flex;
          gap: var(--space-2);
          max-width: 75%;
          animation: fadeIn 0.2s ease-out;
        }

        .message-item.own {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-item.other {
          align-self: flex-start;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: var(--radius-full);
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .message-item.own .message-content {
          align-items: flex-end;
        }

        .message-item.other .message-content {
          align-items: flex-start;
        }

        .message-sender {
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          color: var(--text-muted);
          margin-left: var(--space-1);
        }

        .message-bubble {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-xl);
          word-break: break-word;
        }

        .message-item.own .message-bubble {
          background: var(--msg-own-bg);
          color: var(--msg-own-text);
          border-bottom-right-radius: var(--radius-sm);
        }

        .message-item.other .message-bubble {
          background: var(--msg-other-bg);
          color: var(--msg-other-text);
          border-bottom-left-radius: var(--radius-sm);
        }

        .message-text {
          margin: 0;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .message-time {
          font-size: var(--text-xs);
          color: var(--text-muted);
          padding: 0 var(--space-1);
        }

        @media (max-width: 640px) {
          .message-item {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageItem;
