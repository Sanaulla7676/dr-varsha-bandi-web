import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { getPatients, deletePatient } from '../lib/api';

const statusColors = {
  Active: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Inactive: 'text-muted-foreground bg-muted border-border',
  Completed: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const MOCK_PATIENTS = [
  { _id: '1', patientId: 'HP0001', firstName: 'Rahul', lastName: 'Sharma', phone: '9876543210', gender: 'Male', age: 34, address: 'Hyderabad', lastVisitDate: new Date(), status: 'Active' },
  { _id: '2', patientId: 'HP0002', firstName: 'Priya', lastName: 'Patel', phone: '9876543211', gender: 'Female', age: 28, address: 'Bangalore', lastVisitDate: new Date(), status: 'Active' },
  { _id: '3', patientId: 'HP0003', firstName: 'Amit', lastName: 'Kumar', phone: '9876543212', gender: 'Male', age: 45, address: 'Mumbai', lastVisitDate: new Date(), status: 'Inactive' },
  { _id: '4', patientId: 'HP0004', firstName: 'Sneha', lastName: 'Reddy', phone: '9876543213', gender: 'Female', age: 31, address: 'Chennai', lastVisitDate: new Date(), status: 'Active' },
  { _id: '5', patientId: 'HP0005', firstName: 'Vikram', lastName: 'Singh', phone: '9876543214', gender: 'Male', age: 52, address: 'Delhi', lastVisitDate: new Date(), status: 'Completed' },
];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 350);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPatients({ search: debouncedSearch, page, limit: 15 });
      setPatients(data.patients || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setPatients(MOCK_PATIENTS.filter(p =>
        !debouncedSearch || `${p.firstName} ${p.lastName} ${p.phone}`.toLowerCase().includes(debouncedSearch.toLowerCase())
      ));
      setTotal(MOCK_PATIENTS.length); setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await deletePatient(deleteId); } catch {}
    setDeleteId(null); setDeleting(false); fetchPatients();
  };

  return (
    <Layout title="Patients">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-2xl px-4 py-3 focus-within:border-primary/40 transition-all max-w-md w-full">
            <span className="material-symbols-outlined text-muted-foreground text-[20px]">search</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients by name or ID..." className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none" />
            {search && <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground"><span className="material-symbols-outlined text-[18px]">close</span></button>}
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{total} patients found</span>
             <Link to="/patients/new" className="flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-3 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
               <span className="material-symbols-outlined text-[20px]">person_add</span> Add Patient
             </Link>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2rem] overflow-hidden premium-shadow">
          <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1.5fr_1fr_auto] gap-6 px-8 py-5 border-b border-border bg-secondary/10 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>Patient Info</span><span>Contact</span><span>Status & Details</span><span>Last Visit</span><span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-border">
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse bg-secondary/10 mx-4 my-2 rounded-xl" />
            )) : patients.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <span className="material-symbols-outlined text-[64px] mb-4 block font-light opacity-20">person_search</span>
                <p className="text-lg font-medium italic">No patients match your search criteria</p>
              </div>
            ) : patients.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ delay: (i % 10) * 0.05, duration: 0.4 }}
                className="px-8 py-5 grid lg:grid-cols-[1.5fr_1fr_1.5fr_1fr_auto] gap-6 items-center hover:bg-secondary/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0">
                    {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{p.firstName} {p.lastName}</p>
                    <p className="text-xs font-bold text-muted-foreground/60 tracking-wider">{p.patientId}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{p.phone}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.address || '—'}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${statusColors[p.status] || 'bg-muted border-border text-muted-foreground'}`}>{p.status}</span>
                  {p.gender && <span className="text-[10px] font-bold text-muted-foreground border border-border px-3 py-1 rounded-full uppercase">{p.gender}</span>}
                  {p.age && <span className="text-[10px] font-bold text-muted-foreground border border-border px-3 py-1 rounded-full uppercase">{p.age}y</span>}
                </div>
                <p className="text-xs font-bold text-muted-foreground">{p.lastVisitDate ? new Date(p.lastVisitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No visits recorded'}</p>
                <div className="flex items-center gap-1 justify-end">
                  {[
                    { icon: 'person', to: `/patients/${p._id}`, color: 'hover:text-primary' },
                    { icon: 'article', to: `/case-study/${p._id}`, color: 'hover:text-emerald-500' },
                    { icon: 'video_call', to: `/video-consultation?patient=${p._id}`, color: 'hover:text-cyan-500' },
                    { icon: 'edit', to: `/patients/${p._id}/edit`, color: 'hover:text-amber-500' },
                  ].map((btn, idx) => (
                    <Link key={idx} to={btn.to} className={`p-2.5 text-muted-foreground ${btn.color} hover:bg-secondary rounded-xl transition-all`}>
                      <span className="material-symbols-outlined text-[20px]">{btn.icon}</span>
                    </Link>
                  ))}
                  <button onClick={() => setDeleteId(p._id)} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-6 py-2.5 text-xs font-bold text-muted-foreground border border-border rounded-xl hover:bg-secondary disabled:opacity-30 transition-all uppercase tracking-widest">Previous</button>
            <span className="text-xs font-bold text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-6 py-2.5 text-xs font-bold text-muted-foreground border border-border rounded-xl hover:bg-secondary disabled:opacity-30 transition-all uppercase tracking-widest">Next</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-[2rem] p-8 max-w-sm w-full premium-shadow">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 text-destructive"><span className="material-symbols-outlined text-[32px]">delete_forever</span></div>
              <h3 className="text-2xl font-bold mb-2">Archive Patient</h3>
              <p className="text-muted-foreground mb-8">This patient will be moved to archives. You can restore their profile later if needed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-4 text-xs font-bold text-muted-foreground border border-border rounded-2xl hover:bg-secondary transition-all uppercase tracking-widest">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 py-4 text-xs font-bold text-white bg-destructive hover:bg-destructive/90 rounded-2xl transition-all shadow-lg shadow-destructive/20 uppercase tracking-widest">{deleting ? 'Archiving...' : 'Archive'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
