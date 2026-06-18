import { io } from 'socket.io-client';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE.replace('/api', '');

export const socket = io(SOCKET_URL, {
  autoConnect: true,
});

export default socket;
