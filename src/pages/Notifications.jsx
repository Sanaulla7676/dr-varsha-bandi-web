import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useUIStore } from '../store';

const INITIAL_NOTIFICATIONS = [
  { 
    id: '1', 
    type: 'appointment', 
    title: 'Urgent Consultation Requested', 
    message: 'Rahul Sharma requested an urgent video consultation for acute allergy symptoms today at 11:30 AM.', 
    time: '10 min ago', 
    read: false,
    patientId: 'PAT-2049',
    actionText: 'Join Video Call',
    actionLink: '/video-consultation?room=rahul-sharma',
    priority: 'high'
  },
  { 
    id: '2', 
    type: 'followup', 
    title: 'Follow-up Review Overdue', 
    message: 'Priya Patel (Chronic Migraine case) follow-up was scheduled for yesterday. AI analysis indicates potential remedy adjustment needed.', 
    time: '2 hours ago', 
    read: false,
    patientId: 'PAT-1084',
    actionText: 'View Case Study',
    actionLink: '/case-study/PAT-1084',
    priority: 'medium'
  },
  { 
    id: '3', 
    type: 'lab', 
    title: 'New Diagnostic Reports Uploaded', 
    message: 'Blood panel & IgE allergy reports uploaded for Ananya Desai. All parameters are within expected homeopathic prognosis range.', 
    time: '5 hours ago', 
    read: false,
    patientId: 'PAT-3021',
    actionText: 'View Reports',
    actionLink: '/reports',
    priority: 'low'
  },
  { 
    id: '4', 
    type: 'system', 
    title: 'System Update & AI Model Upgrade', 
    message: 'Homeopathway Clinical Intelligence v2.4 is now live. Enhanced repertorization and predictive potency recommendations are active.', 
    time: '1 day ago', 
    read: true,
    actionText: 'View Changelog',
    actionLink: '#',
    priority: 'low'
  },
  { 
    id: '5', 
    type: 'appointment', 
    title: 'Missed Consultation', 
    message: 'Amit Kumar missed his scheduled in-person consultation yesterday at 04:00 PM. Automated re-booking SMS was sent.', 
    time: '1 day ago', 
    read: true,
    patientId: 'PAT-0922',
    actionText: 'Reschedule',
    actionLink: '/appointments',
    priority: 'medium'
  },
  { 
    id: '6', 
    type: 'prescription', 
    title: 'Prescription Renewal Request', 
    message: 'Suresh Joshi requested a refill for Sulphur 200CH (2 doses). Approval required before dispensary dispatch.', 
    time: '2 days ago', 
    read: true,
    patientId: 'PAT-4410',
    actionText: 'Review Prescription',
    actionLink: '/prescriptions',
    priority: 'medium'
  }
];

const TYPE_CONFIG = {
  appointment: {
    icon: 'calendar_today',
    label: 'Appointment',
    color: 'text-primary bg-primary/10 border-primary/20',
    badge: 'bg-primary/10 text-primary border-primary/20',
  },
  followup: {
    icon: 'history',
    label: 'Follow-up',
    color: 'text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20',
  },
  lab: {
    icon: 'biotech',
    label: 'Laboratory',
    color: 'text-blue-600 dark:text-blue-500 bg-blue-500/10 border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20',
  },
  prescription: {
    icon: 'description',
    label: 'Prescription',
    color: 'text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20',
  },
  system: {
    icon: 'info',
    label: 'System',
    color: 'text-purple-600 dark:text-purple-500 bg-purple-500/10 border-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20',
  },
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications: storeNotifications, clearNotifications: clearStoreNotifications } = useUIStore();
  
  // Combine store notifications with initial mock data
  const [items, setItems] = useState(() => {
    const formattedStore = storeNotifications.map((n, index) => ({
      id: `store-${index}`,
      type: n.type || 'system',
      title: n.title || 'Notification',
      message: n.message || '',
      time: n.time || 'Just now',
      read: Boolean(n.read),
      actionText: n.actionText,
      actionLink: n.actionLink,
      priority: n.priority || 'low'
    }));
    return [...formattedStore, ...INITIAL_NOTIFICATIONS];
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = useMemo(() => items.filter(n => !n.read).length, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (activeTab === 'all') return true;
      if (activeTab === 'unread') return !item.read;
      if (activeTab === 'appointment') return item.type === 'appointment';
      if (activeTab === 'followup') return item.type === 'followup';
      if (activeTab === 'system') return item.type === 'system' || item.type === 'lab' || item.type === 'prescription';
      
      return true;
    });
  }, [items, activeTab, searchQuery]);

  const handleMarkAllRead = () => {
    setItems(prev => prev.map(item => ({ ...item, read: true })));
  };

  const handleToggleRead = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, read: !item.read } : item));
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearRead = () => {
    setItems(prev => prev.filter(item => !item.read));
    clearStoreNotifications();
  };

  return (
    <Layout title="Notifications & Alerts">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-[2rem] p-6 lg:p-8 premium-shadow">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Clinical Alerts</h2>
              {unreadCount > 0 && (
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md shadow-primary/20 animate-pulse">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Stay updated with patient consultation requests, follow-up schedules, and system intelligence reports.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary border border-border text-foreground px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:border-primary/30"
              >
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                Mark all as read
              </button>
            )}
            <button
              onClick={handleClearRead}
              className="flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              Clear Read
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-md border border-border rounded-2xl p-4 premium-shadow">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All', count: items.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'appointment', label: 'Appointments', count: items.filter(i => i.type === 'appointment').length },
              { id: 'followup', label: 'Follow-ups', count: items.filter(i => i.type === 'followup').length },
              { id: 'system', label: 'System & Labs', count: items.filter(i => ['system', 'lab', 'prescription'].includes(i.type)).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alerts..."
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((n, i) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 lg:p-6 rounded-[2rem] border transition-all duration-300 ${
                    n.read 
                      ? 'bg-card/90 border-border shadow-sm hover:shadow-md' 
                      : 'bg-card border-l-4 border-l-primary border-y-border border-r-border shadow-md hover:shadow-lg'
                  }`}
                >
                  {/* Left Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-sm ${config.color}`}>
                    <span className="material-symbols-outlined text-[24px]">{config.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1 w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className={`text-base font-bold truncate ${n.read ? 'text-foreground/80 font-semibold' : 'text-foreground font-bold'}`}>
                        {n.title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${config.badge}`}>
                        {config.label}
                      </span>
                      {n.priority === 'high' && !n.read && (
                        <span className="bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Urgent
                        </span>
                      )}
                    </div>

                    <p className={`text-sm leading-relaxed ${n.read ? 'text-muted-foreground/90' : 'text-muted-foreground font-medium'}`}>
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {n.time}
                      </span>
                      {n.patientId && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-foreground/70 font-bold">
                            <span className="material-symbols-outlined text-[14px]">person</span>
                            {n.patientId}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                    {n.actionText && n.actionLink && (
                      <Link
                        to={n.actionLink}
                        className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary hover:text-white border border-primary/20 text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        {n.actionText}
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    )}

                    <button
                      onClick={() => handleToggleRead(n.id)}
                      className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                        n.read
                          ? 'bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                          : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white'
                      }`}
                      title={n.read ? "Mark as unread" : "Mark as read"}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {n.read ? 'mark_email_unread' : 'mark_email_read'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-2 rounded-xl bg-secondary/50 border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all flex items-center justify-center"
                      title="Dismiss"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-[2rem] p-16 text-center premium-shadow space-y-4"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground/50 border border-border">
                <span className="material-symbols-outlined text-4xl">notifications_off</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">No notifications found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  {searchQuery 
                    ? `No results matching "${searchQuery}" in your alerts.` 
                    : "You're all caught up! There are no pending clinical alerts or notifications in this view."}
                </p>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}

