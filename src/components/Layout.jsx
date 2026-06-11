import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useUIStore } from '../store';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function Layout({ children, title }) {
  const { sidebarCollapsed, addNotification } = useUIStore();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('new-notification', (notification) => {
      console.log('New real-time notification received:', notification);
      addNotification(notification);
      
      // Browser notification fallback
      if (Notification.permission === 'granted') {
        new Notification(notification.title, { body: notification.message });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <Sidebar />
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-w-0"
      >
        <TopBar title={title} />
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-[1600px] mx-auto animate-slide-up">
            {children}
          </div>
        </main>
      </motion.div>
    </div>
  );
}
