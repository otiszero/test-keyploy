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
    <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
