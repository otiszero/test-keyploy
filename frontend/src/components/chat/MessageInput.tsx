import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="input-wrapper">
        <textarea
          ref={inputRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          disabled={disabled}
          rows={1}
          className="message-textarea"
        />
        <button type="submit" disabled={disabled || !content.trim()} className="send-button" aria-label="Gửi tin nhắn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <p className="input-hint">Nhấn Enter để gửi, Shift + Enter để xuống dòng</p>
      <style>{`
        .message-input-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: var(--space-3);
          background: var(--bg-input);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-2) var(--space-3);
          transition: all var(--transition-fast);
        }

        .input-wrapper:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .message-textarea {
          flex: 1;
          border: none;
          background: transparent;
          resize: none;
          outline: none;
          padding: var(--space-2) 0;
          min-height: 24px;
          max-height: 120px;
          line-height: 1.5;
        }

        .message-textarea:disabled {
          opacity: 0.6;
        }

        .send-button {
          width: 40px;
          height: 40px;
          min-width: 40px;
          padding: 0;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-primary);
          color: white;
          transition: all var(--transition-fast);
        }

        .send-button:hover:not(:disabled) {
          background: var(--color-primary-hover);
        }

        .send-button:disabled {
          background: var(--bg-tertiary);
          color: var(--text-muted);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .input-hint {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin: 0;
          padding-left: var(--space-1);
        }

        @media (max-width: 640px) {
          .input-hint {
            display: none;
          }
        }
      `}</style>
    </form>
  );
};

export default MessageInput;
