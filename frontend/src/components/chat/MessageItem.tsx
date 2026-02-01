interface MessageItemProps {
  message: { id: string; content: string; senderDisplayName: string; senderId: string; createdAt: Date };
  isOwn: boolean;
}

export const MessageItem = ({ message, isOwn }: MessageItemProps) => (
  <div style={{ marginBottom: 12, textAlign: isOwn ? 'right' : 'left' }}>
    <div style={{ display: 'inline-block', maxWidth: '70%', padding: 10, borderRadius: 8, background: isOwn ? '#007bff' : '#e9ecef', color: isOwn ? '#fff' : '#000' }}>
      <div style={{ fontSize: 12, marginBottom: 4, opacity: 0.8 }}>{message.senderDisplayName}</div>
      <div>{message.content}</div>
      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>{new Date(message.createdAt).toLocaleTimeString()}</div>
    </div>
  </div>
);

export default MessageItem;
