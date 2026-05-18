import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment, getPatients } from '../lib/api';
import { useAuthStore } from '../store';

const STATUS_COLORS = {
  Pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  Confirmed: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Completed: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  Cancelled: 'text-destructive bg-destructive/10 border-destructive/20',
  Missed: 'text-muted-foreground bg-muted border-border',
};

const TYPE_COLORS = {
  'In-Person': 'text-primary bg-primary/10 border-primary/20',
  'Video': 'text-primary bg-primary/10 border-primary/20',
  'Follow-Up': 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
};

const MOCK_APPTS = [
  { _id: 'a1', appointmentDate: new Date(), appointmentTime: '09:30 AM', type: 'In-Person', status: 'Confirmed', notes: '', patientId: { _id: '1', firstName: 'Rahul', lastName: 'Sharma', phone: '9876543210' } },
  { _id: 'a2', appointmentDate: new Date(), appointmentTime: '11:00 AM', type: 'Video', status: 'Pending', notes: '', patientId: { _id: '2', firstName: 'Priya', lastName: 'Patel', phone: '9876543211' } },
  { _id: 'a3', appointmentDate: new Date(), appointmentTime: '02:30 PM', type: 'Follow-Up', status: 'Completed', notes: '', patientId: { _id: '3', firstName: 'Amit', lastName: 'Kumar', phone: '9876543212' } },
];

function Modal({ onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Appointments() {
  const { doctor } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', appointmentDate: new Date().toISOString().split('T')[0], appointmentTime: '10:00 AM', type: 'In-Person', status: 'Pending', notes: '' });
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [joiningConsultation, setJoiningConsultation] = useState(null);

  const handleJoinConsultation = (apt) => {
    setJoiningConsultation(apt);
    setTimeout(() => {
      navigate(`/video-consultation?room=${apt.videoRoomId || apt._id}&patient=${apt.patientId?._id || ''}`);
      setJoiningConsultation(null);
    }, 1500);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await getAppointments(filterStatus ? { status: filterStatus } : {});
      setAppointments(data);
    } catch { setAppointments(MOCK_APPTS); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [filterStatus]);

  useEffect(() => {
    getPatients({ limit: 100 }).then(({ data }) => setPatients(data.patients || [])).catch(() => {
      setPatients([
        { _id: '1', firstName: 'Rahul', lastName: 'Sharma' },
        { _id: '2', firstName: 'Priya', lastName: 'Patel' },
        { _id: '3', firstName: 'Amit', lastName: 'Kumar' },
      ]);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await createAppointment(form); setShowModal(false); fetchAll(); }
    catch {
      const isGoogleConnected = doctor?.googleTokens?.refresh_token;
      const newApt = {
        _id: Date.now().toString(),
        ...form,
        patientId: patients.find(p => p._id === form.patientId) || { firstName: 'New', lastName: 'Patient', phone: '9876543210' },
        googleMeetLink: null,
        videoRoomId: form.type === 'Video' ? `hp-room-${Date.now()}` : null
      };
      setShowModal(false);
      setAppointments(prev => [newApt, ...prev]);
    }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateAppointment(id, { status }); }
    catch {}
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
  };

  const grouped = appointments.reduce((acc, apt) => {
    const d = new Date(apt.appointmentDate).toDateString();
    if (!acc[d]) acc[d] = [];
    acc[d].push(apt);
    return acc;
  }, {});

  return (
    <Layout title="Appointments">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-2 flex-wrap">
            {['', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border uppercase tracking-widest ${filterStatus === s ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary/50 border-border text-muted-foreground hover:text-foreground'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-3 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span> New Appointment
          </button>
        </div>

        {/* Appointment List */}
        <div className="space-y-10">
          {loading ? (
            <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-card rounded-[2rem] animate-pulse border border-border" />)}</div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <span className="material-symbols-outlined text-[64px] mb-4 block font-light opacity-20">calendar_today</span>
              <p className="text-lg font-medium italic">No appointments scheduled for this criteria</p>
            </div>
          ) : Object.entries(grouped).map(([date, apts]) => (
            <div key={date}>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-sm font-bold text-primary uppercase tracking-widest">{date === new Date().toDateString() ? 'Today' : date}</p>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="space-y-4">
                {apts.map((apt, i) => (
                  <motion.div key={apt._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ delay: (i % 10) * 0.05, duration: 0.4 }}
                    className="flex items-center gap-6 bg-card hover:bg-secondary/20 border border-border rounded-[2rem] px-8 py-5 transition-all premium-shadow group">
                    
                    <div className="flex-shrink-0 text-center w-16">
                      <p className="text-lg font-bold text-foreground">{apt.appointmentTime}</p>
                    </div>
                    
                    <div className="w-px h-10 bg-border" />
                    
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0">
                        {apt.patientId?.firstName?.charAt(0)}{apt.patientId?.lastName?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">{apt.patientId?.firstName} {apt.patientId?.lastName}</p>
                        <p className="text-xs font-bold text-muted-foreground/60 tracking-wider">{apt.patientId?.phone}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border hidden sm:block ${TYPE_COLORS[apt.type] || 'bg-muted border-border'}`}>{apt.type}</span>
                    
                    <select value={apt.status} onChange={e => handleStatusChange(apt._id, e.target.value)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full border cursor-pointer bg-transparent outline-none appearance-none hover:border-primary/50 transition-colors ${STATUS_COLORS[apt.status] || ''}`}>
                      {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="bg-card text-foreground">{s}</option>)}
                    </select>

                    <div className="flex items-center gap-2">
                      {apt.type === 'Video' && apt.status !== 'Completed' && (
                        <>
                          <button onClick={() => handleJoinConsultation(apt)}
                            className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">video_call</span> Join
                          </button>
                          {apt.googleMeetLink && (
                            <button onClick={() => { navigator.clipboard.writeText(apt.googleMeetLink); alert('Link copied!'); }}
                              className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl px-3 py-2 text-xs font-bold transition-all border border-border">
                              <span className="material-symbols-outlined text-[16px]">content_copy</span> Copy Link
                            </button>
                          )}
                        </>
                      )}
                      <Link to={`/case-study/${apt.patientId?._id}`}
                        className="p-2.5 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-all border border-border">
                        <span className="material-symbols-outlined text-[18px]">article</span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Appointment Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <h3 className="text-2xl font-bold mb-6">New Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block ml-1">Select Patient</label>
                <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                  <option value="">Choose Patient...</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block ml-1">Date</label>
                  <input type="date" value={form.appointmentDate} onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block ml-1">Time</label>
                  <input type="text" value={form.appointmentTime} onChange={e => setForm({ ...form, appointmentTime: e.target.value })}
                    placeholder="10:30 AM" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block ml-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                    <option value="In-Person">In-Person</option>
                    <option value="Video">Video</option>
                    <option value="Follow-Up">Follow-Up</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block ml-1">Initial Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block ml-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Clinical notes or reason for visit..." rows={3}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-bold text-muted-foreground border border-border rounded-2xl hover:bg-secondary transition-all uppercase tracking-widest">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.patientId} className="flex-1 py-4 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 uppercase tracking-widest">
                {saving ? 'Scheduling...' : 'Confirm Booking'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Joining Consultation Modal */}
      <AnimatePresence>
        {joiningConsultation && (
          <Modal onClose={() => setJoiningConsultation(null)}>
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-[2rem] animate-spin" />
                <span className="material-symbols-outlined text-primary text-[32px]">video_call</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Preparing Consultation</h3>
              <p className="text-sm text-muted-foreground mb-8">Securely connecting to video consultation room...</p>
              <div className="space-y-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Preparing Case Study...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>Syncing Records...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>Launching Google Meet...</motion.p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </Layout>
  );
}
