import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore, useUIStore } from '../store';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/dashboard' },
  { icon: 'group', label: 'Patients', to: '/patients' },
  { icon: 'calendar_today', label: 'Appointments', to: '/appointments' },
  { icon: 'video_call', label: 'Video Consult', to: '/video-consultation' },
  { icon: 'description', label: 'Prescriptions', to: '/prescriptions' },
  { icon: 'folder_open', label: 'Reports', to: '/reports' },
  { icon: 'menu_book', label: 'Books', to: '/books' },
  { icon: 'notifications', label: 'Notifications', to: '/notifications' },
  { icon: 'settings', label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { doctor, logout } = useAuthStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5"/>
            <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <p className="text-sm font-semibold text-foreground leading-tight">Homeopathway</p>
            <p className="text-[10px] text-muted-foreground">Clinical Dashboard</p>
          </motion.div>
        )}
        <button onClick={toggleSidebar} className="ml-auto text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">{sidebarCollapsed ? 'chevron_right' : 'chevron_left'}</span>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`material-symbols-outlined text-[20px] flex-shrink-0 relative z-10 ${isActive ? 'text-primary' : ''}`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium relative z-10 whitespace-nowrap">{item.label}</span>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Doctor Profile + Logout */}
      <div className="border-t border-sidebar-border p-3">
        {!sidebarCollapsed && doctor && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {doctor.name?.charAt(0) || 'D'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground/80 truncate">{doctor.name || 'Dr. Varsha Bandi'}</p>
              <p className="text-[10px] text-muted-foreground/60 truncate">{doctor.email || 'doctor@homeopathway.com'}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); window.location.href = '/login'; }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 w-full"
        >
          <span className="material-symbols-outlined text-[20px] flex-shrink-0">logout</span>
          {!sidebarCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
