import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useUIStore } from '../store';
import { motion } from 'framer-motion';

export default function Layout({ children, title }) {
  const { sidebarCollapsed } = useUIStore();

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
