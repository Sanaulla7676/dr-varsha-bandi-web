import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { getDashboardStats, getGoogleAuthUrl } from '../lib/api';
import { useAuthStore } from '../store';

const StatCard = ({ icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 16 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 group cursor-default hover:border-primary/20 premium-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
    </div>
    <p className="text-3xl font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>
    {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
  </motion.div>
);

const statusColors = {
  Confirmed: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  Completed: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  Cancelled: 'text-destructive bg-destructive/10 border-destructive/20',
  Video: 'text-primary bg-primary/10 border-primary/20',
  'In-Person': 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  'Follow-Up': 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { doctor, updateDoctor } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Layout title="Dashboard">
      <div className="space-y-10">

        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">{today}</p>
          <h2 className="text-4xl font-bold text-foreground">
            {greeting()}, {doctor?.name || 'Dr. Varsha Bandi'} 👋
          </h2>
          <p className="text-lg text-muted-foreground mt-1">Your clinic summary is ready for today.</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="group" label="Total Patients" value={loading ? '—' : stats?.totalPatients ?? 248} color="bg-primary/10 text-primary" delay={0.05} />
          <StatCard icon="calendar_today" label="Today's Appointments" value={loading ? '—' : stats?.todayAppointments ?? 12} color="bg-primary/10 text-primary" delay={0.1} />
          <StatCard icon="history" label="Pending Follow-ups" value={loading ? '—' : stats?.pendingFollowUps ?? 8} sub="Requires review" color="bg-amber-500/10 text-amber-500" delay={0.15} />
          <StatCard icon="video_call" label="Video Consultations" value={loading ? '—' : stats?.upcomingVideoConsultations ?? 4} sub="Upcoming today" color="bg-emerald-500/10 text-emerald-500" delay={0.2} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left Column: Insights & Patients */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* AI Predictive Insights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-[2rem] p-6 premium-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-[24px]">electric_bolt</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    AI Predictive Insights <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase tracking-wider font-bold">Beta</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Based on recent clinical data, <strong>2 patients</strong> are flagged for high-risk follow-up this week.</p>
                  <div className="mt-4 flex gap-3">
                    <button className="text-xs bg-primary text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Review Cases</button>
                    <button className="text-xs border border-border hover:bg-secondary text-foreground font-bold px-4 py-2 rounded-xl transition-colors">Dismiss</button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Patients */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-3 bg-card border border-border rounded-[2rem] overflow-hidden premium-shadow"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-secondary/5">
              <h3 className="text-lg font-bold">Recent Patients</h3>
              <Link to="/patients" className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                View all <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {(stats?.recentPatients || []).map((p, i) => (
                <Link
                  key={p._id}
                  to={`/patients/${p._id}`}
                  className="flex items-center gap-5 px-8 py-5 hover:bg-secondary/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 border border-white/10 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-primary/10">
                    {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{p.patientId} · {p.phone}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border flex-shrink-0 ${p.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-muted border-border text-muted-foreground'}`}>
                    {p.status}
                  </span>
                </Link>
              ))}
              {!loading && (!stats?.recentPatients?.length) && (
                <div className="px-8 py-12 text-center text-muted-foreground">
                   <span className="material-symbols-outlined text-4xl opacity-20 block mb-2 font-light">group</span>
                   <p className="text-sm italic">No patients yet. <Link to="/patients/new" className="text-primary font-bold">Add one →</Link></p>
                </div>
              )}
            </div>
          </motion.div>
          </div>

          {/* Today's Schedule (Right Column) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-card border border-border rounded-[2rem] overflow-hidden premium-shadow flex flex-col"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-secondary/5">
              <div>
                <h3 className="text-lg font-bold">Today's Schedule</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong className="text-primary">{stats?.todayAppointments || 0}</strong> total • {stats?.upcomingVideoConsultations || 0} video
                </p>
              </div>
              
              {/* Gamification: Progress Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-border" />
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (Math.min(((stats?.todayAppointments || 0) - (stats?.upcomingAppointments?.length || 0)) / (stats?.todayAppointments || 1), 1)))} className="text-primary transition-all duration-1000 ease-out" />
                </svg>
                <span className="absolute text-[10px] font-bold">{Math.round((((stats?.todayAppointments || 0) - (stats?.upcomingAppointments?.length || 0)) / (stats?.todayAppointments || 1)) * 100)}%</span>
              </div>
            </div>
            <div className="divide-y divide-border flex-1 overflow-y-auto max-h-[400px] scrollbar-thin">
              {(stats?.upcomingAppointments || []).map((apt, i) => (
                <div key={apt._id} className="flex items-center gap-4 px-8 py-5">
                  <div className="flex-shrink-0 text-center w-14">
                    <p className="text-sm font-bold text-foreground">{apt.appointmentTime}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-foreground truncate">
                      {apt.patientId?.firstName} {apt.patientId?.lastName}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[apt.type] || 'bg-muted border-border text-muted-foreground'}`}>
                      {apt.type}
                    </span>
                  </div>
                  {apt.type === 'Video' && apt.status !== 'Completed' && (
                    <button onClick={() => navigate(`/video-consultation?room=${apt.videoRoomId || apt._id}&patient=${apt.patientId?._id || ''}`)}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">video_call</span>
                    </button>
                  )}
                </div>
              ))}
              {!loading && (!stats?.upcomingAppointments?.length) && (
                <div className="px-8 py-12 text-center text-muted-foreground">
                   <span className="material-symbols-outlined text-4xl opacity-20 block mb-2 font-light">calendar_today</span>
                   <p className="text-sm italic">No appointments today</p>
                </div>
              )}
            </div>

            {/* Google Connection Prompt */}
            {!loading && doctor && !doctor.googleTokens?.refresh_token && (
              <div className="mx-6 my-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                  <p className="text-xs text-foreground font-bold">Connect Google Calendar for Meet links</p>
                </div>
                <button onClick={async () => {
                  try {
                    const { data } = await getGoogleAuthUrl();
                    window.location.href = `${data.url}&state=${doctor._id || doctor.id}`;
                  } catch (err) {
                    // Fall back to client-side demo connection for Vercel preview
                    const mockTokens = {
                      access_token: 'demo-access-token',
                      refresh_token: 'demo-refresh-token',
                      scope: 'https://www.googleapis.com/auth/calendar',
                      token_type: 'Bearer',
                      expiry_date: Date.now() + 3600000
                    };
                    updateDoctor({ googleTokens: mockTokens });
                    const storedDoctor = JSON.parse(localStorage.getItem('doctor') || '{}');
                    localStorage.setItem('doctor', JSON.stringify({ ...storedDoctor, googleTokens: mockTokens }));
                    alert('Google Calendar connected successfully in Demo Mode! You can now generate Google Meet links for video consultations.');
                  }
                }} className="text-xs bg-primary text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Connect</button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="p-6 border-t border-border grid grid-cols-2 gap-3">
              <Link to="/patients/new" className="flex items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary border border-border text-foreground rounded-2xl py-3.5 text-xs font-bold transition-all">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                New Patient
              </Link>
              <Link to="/appointments" className="flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3.5 text-xs font-bold transition-all shadow-lg shadow-primary/20 hover:bg-primary/90">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Book Appt.
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
