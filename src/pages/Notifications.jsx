import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'appointment', title: 'Upcoming Appointment', message: 'Rahul Sharma at 09:30 AM today', time: '5 min ago', read: false },
  { id: 2, type: 'followup', title: 'Follow-up Due', message: 'Priya Patel follow-up was due yesterday', time: '2 hours ago', read: false },
  { id: 3, type: 'system', title: 'System Update', message: 'Homeopathway v2.0 is now live', time: '1 day ago', read: true },
  { id: 4, type: 'appointment', title: 'Missed Consultation', message: 'Amit Kumar missed his 02:00 PM appointment', time: '1 day ago', read: true },
];

const TYPE_ICONS = { appointment: 'calendar_today', followup: 'history', system: 'info' };
const TYPE_COLORS = { appointment: 'text-indigo-400 bg-indigo-400/10', followup: 'text-amber-400 bg-amber-400/10', system: 'text-white/40 bg-white/[0.06]' };

export default function Notifications() {
  return (
    <Layout title="Notifications">
      <div className="max-w-3xl mx-auto space-y-2">
        {MOCK_NOTIFICATIONS.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${n.read ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-white/[0.04] border-white/[0.08]'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[n.type] || ''}`}>
              <span className="material-symbols-outlined text-[20px]">{TYPE_ICONS[n.type] || 'notifications'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${n.read ? 'text-white/50' : 'text-white/85'}`}>{n.title}</p>
                {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />}
              </div>
              <p className="text-xs text-white/40 mt-0.5">{n.message}</p>
            </div>
            <span className="text-[10px] text-white/25 flex-shrink-0 whitespace-nowrap">{n.time}</span>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
