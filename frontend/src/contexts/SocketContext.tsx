import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  senderDisplayName: string;
  senderId: string;
  createdAt: Date;
}

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (content: string) => void;
  messages: Message[];
  loadRecentMessages: () => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(SOCKET_URL, { auth: { token }, reconnection: true, reconnectionDelay: 3000 });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => {
      setIsConnected(false);
      reconnectTimeout.current = setTimeout(() => newSocket.connect(), 3000);
    });
    newSocket.on('new_message', (msg: Message) => setMessages((prev) => [...prev, msg]));
    newSocket.on('error', (err) => console.error('Socket error:', err));

    setSocket(newSocket);

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = useCallback((content: string) => {
    socket?.emit('send_message', { content });
  }, [socket]);

  const loadRecentMessages = useCallback(() => {
    socket?.emit('get_recent_messages', {}, (msgs: Message[]) => setMessages(msgs));
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMessage, messages, loadRecentMessages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export default SocketContext;
