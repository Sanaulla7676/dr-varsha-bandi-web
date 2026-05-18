import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { getPatient, getVisits } from '../lib/api';

const MOCK_PATIENT = { _id: '1', patientId: 'HP0001', firstName: 'Rahul', lastName: 'Sharma', phone: '9876543210', email: 'rahul@email.com', gender: 'Male', age: 34, bloodGroup: 'B+', address: 'Hyderabad, Telangana', occupation: 'Software Engineer', status: 'Active', firstVisitDate: new Date('2023-01-15'), lastVisitDate: new Date() };
const MOCK_VISITS = [
  { _id: 'v1', visitDate: new Date(), visitType: 'In-Person', status: 'Completed', caseStudy: { chiefComplaints: 'Headache, fatigue', diagnosis: 'Stress-related' }, prescriptions: [{ medicine: 'Arnica 30C', dosage: '4 pills', frequency: 'Twice daily', duration: '2 weeks' }] },
  { _id: 'v2', visitDate: new Date(Date.now() - 86400000 * 30), visitType: 'Follow-Up', status: 'Completed', caseStudy: { chiefComplaints: 'Mild headache persists', diagnosis: 'Improving' }, prescriptions: [{ medicine: 'Nux Vomica 30C', dosage: '4 pills', frequency: 'Once daily', duration: '1 week' }] },
];

export default function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([getPatient(id), getVisits({ patientId: id })])
      .then(([{ data: p }, { data: v }]) => { setPatient(p); setVisits(v); })
      .catch(() => { setPatient(MOCK_PATIENT); setVisits(MOCK_VISITS); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout title="Patient Profile"><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin" /></div></Layout>;

  const TABS = ['overview', 'visits', 'prescriptions'];

  return (
    <Layout title="Patient Profile">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Patient Header Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/30 border border-border rounded-2xl p-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-border flex items-center justify-center text-2xl font-semibold text-foreground/70 flex-shrink-0">
              {patient?.firstName?.charAt(0)}{patient?.lastName?.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-semibold text-foreground">{patient?.firstName} {patient?.lastName}</h2>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${patient?.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-muted-foreground bg-secondary'}`}>{patient?.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{patient?.patientId} · {patient?.gender} · {patient?.age}y · {patient?.bloodGroup}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="material-symbols-outlined text-[14px]">phone</span>{patient?.phone}</span>
                {patient?.email && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="material-symbols-outlined text-[14px]">mail</span>{patient?.email}</span>}
                {patient?.address && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="material-symbols-outlined text-[14px]">location_on</span>{patient?.address}</span>}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/case-study/${id}`} className="flex items-center gap-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-400 rounded-xl px-3 py-2 text-xs font-medium transition-colors">
                <span className="material-symbols-outlined text-[15px]">article</span>Case Study
              </Link>
              <Link to={`/video-consultation?patient=${id}`} className="flex items-center gap-1.5 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/20 text-violet-400 rounded-xl px-3 py-2 text-xs font-medium transition-colors">
                <span className="material-symbols-outlined text-[15px]">video_call</span>Video Call
              </Link>
              <Link to={`/patients/${id}/edit`} className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/50 rounded-xl px-3 py-2 text-xs font-medium transition-colors">
                <span className="material-symbols-outlined text-[15px]">edit</span>Edit
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/30 border border-border rounded-xl p-1 w-fit">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-indigo-500/20 text-indigo-400' : 'text-muted-foreground hover:text-foreground'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'First Visit', value: patient?.firstVisitDate ? new Date(patient.firstVisitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—', icon: 'calendar_today' },
              { label: 'Last Visit', value: patient?.lastVisitDate ? new Date(patient.lastVisitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—', icon: 'history' },
              { label: 'Total Visits', value: visits.length.toString(), icon: 'stethoscope' },
            ].map(card => (
              <div key={card.label} className="bg-secondary/30 border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                </div>
                <div><p className="text-xl font-semibold text-foreground">{card.value}</p><p className="text-xs text-muted-foreground mt-0.5">{card.label}</p></div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'visits' && (
          <motion.div key="visits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 relative ml-4 sm:ml-0">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-medium text-white/60">Chronological Medical History</h3>
              <Link to={`/case-study/${id}`} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[14px]">add</span>New Visit
              </Link>
            </div>
            
            {/* Timeline Vertical Line */}
            {visits.length > 0 && (
              <motion.div 
                initial={{ height: 0 }} 
                whileInView={{ height: '100%' }} 
                viewport={{ once: true }} 
                transition={{ duration: 1.5, ease: "easeOut" }} 
                className="absolute left-[27px] top-16 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/50 via-violet-500/30 to-transparent hidden sm:block" 
              />
            )}

            {visits.length === 0 ? (
              <div className="text-center py-10 text-white/25"><span className="material-symbols-outlined text-[40px] mb-2 block">history</span><p className="text-sm">No consultations recorded</p></div>
            ) : visits.map((v, i) => (
              <motion.div 
                key={v._id} 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true, margin: "-50px" }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative flex items-start gap-6 group"
              >
                {/* Timeline Dot */}
                <div className="hidden sm:flex flex-col items-center z-10 mt-2">
                  <div className="w-14 h-14 rounded-full bg-background border border-white/10 flex items-center justify-center p-1">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-indigo-400 text-[20px]">event</span>
                    </div>
                  </div>
                </div>

                {/* Visit Card */}
                <div className="flex-1 bg-secondary/30 border border-border rounded-2xl p-6 transition-all hover:bg-secondary/50 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{new Date(v.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span className="bg-secondary px-2 py-0.5 rounded-full">{v.visitType}</span>
                        <span className={`px-2 py-0.5 rounded-full ${v.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>{v.status}</span>
                      </p>
                    </div>
                    
                    {/* Zero-UI Hover Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <Link to={`/case-study/${id}`} className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-indigo-500/20 text-white/50 hover:text-indigo-400 flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </Link>
                      {v.googleMeetLink && (
                        <button onClick={() => window.open(v.googleMeetLink, '_blank')} className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-violet-500/20 text-white/50 hover:text-violet-400 flex items-center justify-center transition-all">
                          <span className="material-symbols-outlined text-[16px]">video_call</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {v.caseStudy?.chiefComplaints && (
                    <div className="mb-4 bg-secondary/20 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Chief Complaints</p>
                      <p className="text-sm text-foreground/80">{v.caseStudy.chiefComplaints}</p>
                    </div>
                  )}

                  {v.prescriptions?.length > 0 && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Prescriptions</p>
                      <div className="flex flex-wrap gap-2">
                        {v.prescriptions.map((rx, j) => (
                          <span key={j} className="text-xs text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">medication</span>
                            {rx.medicine} <span className="text-violet-300/50">({rx.potency})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'prescriptions' && (
          <motion.div key="prescriptions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {visits.flatMap(v => v.prescriptions || []).length === 0 ? (
              <div className="text-center py-10 text-white/25"><span className="material-symbols-outlined text-[40px] mb-2 block">medication</span><p className="text-sm">No prescriptions yet</p></div>
            ) : visits.map(v => v.prescriptions?.length > 0 && (
              <div key={v._id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-xs text-white/30 mb-3">{new Date(v.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <div className="space-y-2">
                  {v.prescriptions.map((rx, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white/[0.03] rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-violet-400 text-[16px]">medication</span></div>
                      <div className="flex-1"><p className="text-sm font-medium text-white/80">{rx.medicine} {rx.potency && `· ${rx.potency}`}</p><p className="text-xs text-white/40">{rx.dosage} · {rx.frequency} · {rx.duration}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
