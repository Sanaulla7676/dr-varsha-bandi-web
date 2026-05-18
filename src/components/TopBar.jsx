import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUIStore, useAuthStore } from '../store';

export default function TopBar({ title }) {
  const { globalSearch, setGlobalSearch, theme, toggleTheme } = useUIStore();
  const { doctor } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center gap-4 px-6 sticky top-0 z-30">
      {/* Page Title */}
      <h1 className="text-base font-semibold text-foreground/90 flex-shrink-0">{title}</h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-3 py-2 focus-within:border-primary/40 transition-colors">
          <span className="material-symbols-outlined text-muted-foreground text-[18px]">search</span>
          <input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search patients, appointments..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none"
          />
          {globalSearch && (
            <button onClick={() => setGlobalSearch('')} className="text-muted-foreground hover:text-foreground">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all duration-200"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* Quick Add Patient */}
        <Link
          to="/patients/new"
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          <span className="hidden sm:inline">Add Patient</span>
        </Link>

        {/* Notifications */}
        <button onClick={() => navigate('/notifications')} className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors" title="View Notifications">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </button>

        {/* Doctor Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-semibold cursor-pointer">
          {doctor?.name?.charAt(0) || 'D'}
        </div>
      </div>
    </header>
  );
}
