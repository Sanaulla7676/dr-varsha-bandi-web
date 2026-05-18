import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { getVisits, createVisit, updateVisit } from '../lib/api';

const SECTIONS = [
  { key: 'chiefComplaints', label: 'Chief Complaints', icon: 'report_problem' },
  { key: 'mentalSymptoms', label: 'Mental Symptoms', icon: 'psychology' },
  { key: 'physicalSymptoms', label: 'Physical Symptoms', icon: 'accessibility' },
  { key: 'appetite', label: 'Appetite', icon: 'restaurant' },
  { key: 'sleep', label: 'Sleep', icon: 'bedtime' },
  { key: 'thirst', label: 'Thirst', icon: 'water_drop' },
  { key: 'thermalReaction', label: 'Thermal', icon: 'thermostat' },
  { key: 'medicalHistory', label: 'Medical History', icon: 'history' },
  { key: 'familyHistory', label: 'Family History', icon: 'family_restroom' },
  { key: 'diagnosis', label: 'Diagnosis', icon: 'biotech' },
  { key: 'doctorNotes', label: 'Doctor Notes', icon: 'edit_note' },
  { key: 'followUpNotes', label: 'Follow-up Notes', icon: 'event_note' },
];

export default function CaseStudy() {
  const { patientId } = useParams();
  const [visitId, setVisitId] = useState(null);
  const [form, setForm] = useState({});
  const [rxList, setRxList] = useState([{ medicine: '', potency: '', dosage: '', frequency: '', duration: '' }]);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeSection, setActiveSection] = useState('chiefComplaints');
  const autoSaveTimer = useRef(null);

  useEffect(() => {
    getVisits({ patientId }).then(({ data }) => {
      if (data.length > 0) {
        const v = data[0];
        setVisitId(v._id);
        setForm(v.caseStudy || {});
        if (v.prescriptions?.length) setRxList(v.prescriptions);
      }
    }).catch(() => {});
  }, [patientId]);

  const save = useCallback(async (formData, rxData) => {
    setSaveStatus('saving');
    try {
      if (visitId) {
        await updateVisit(visitId, { caseStudy: formData, prescriptions: rxData });
      } else {
        const { data } = await createVisit({ patientId, caseStudy: formData, prescriptions: rxData });
        setVisitId(data._id);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch { setSaveStatus('error'); }
  }, [visitId, patientId]);

  const handleChange = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => save(updated, rxList), 2000);
  };

  const handleRx = (idx, key, value) => {
    const updated = rxList.map((r, i) => i === idx ? { ...r, [key]: value } : r);
    setRxList(updated);
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => save(form, updated), 2000);
  };

  const currentIdx = SECTIONS.findIndex(s => s.key === activeSection);

  return (
    <Layout title="Case Study">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-[180px_1fr] gap-6">
          {/* Sidebar Nav */}
          <div className="space-y-1">
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${activeSection === s.key ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
                <span className="material-symbols-outlined text-[15px]">{s.icon}</span>
                <span className="truncate">{s.label}</span>
                {form[s.key] && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </button>
            ))}
            <button onClick={() => setActiveSection('rx')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${activeSection === 'rx' ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
              <span className="material-symbols-outlined text-[15px]">medication</span>
              <span>Prescriptions</span>
            </button>

            <div className="pt-4 border-t border-white/[0.05] space-y-1">
              {saveStatus === 'saving' && <p className="text-[10px] text-amber-400 px-2">Saving...</p>}
              {saveStatus === 'saved' && <p className="text-[10px] text-emerald-400 px-2 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check</span>Saved</p>}
              <button onClick={() => save(form, rxList)} className="w-full flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                <span className="material-symbols-outlined text-[15px]">save</span>Save Now
              </button>
            </div>
          </div>

          {/* Content */}
          <motion.div key={activeSection} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            {activeSection === 'rx' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Prescriptions</h3>
                  <button onClick={() => setRxList([...rxList, { medicine: '', potency: '', dosage: '', frequency: '', duration: '' }])}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[15px]">add</span>Add Medicine
                  </button>
                </div>
                {rxList.map((rx, idx) => (
                  <div key={idx} className="bg-secondary/30 border border-border rounded-2xl p-4 space-y-3">
                    <input value={rx.medicine} onChange={e => handleRx(idx, 'medicine', e.target.value)} placeholder="Medicine name" className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-indigo-500/40" />
                    <div className="grid grid-cols-2 gap-3">
                      {['potency','dosage','frequency','duration'].map(k => (
                        <input key={k} value={rx[k]} onChange={e => handleRx(idx, k, e.target.value)} placeholder={k.charAt(0).toUpperCase() + k.slice(1)} className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-indigo-500/40" />
                      ))}
                    </div>
                    {rxList.length > 1 && <button onClick={() => setRxList(rxList.filter((_, i) => i !== idx))} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3 sticky top-0 z-10 bg-background/80 backdrop-blur-xl py-4 border-b border-border shadow-sm transition-all">
                  <span className="material-symbols-outlined text-indigo-400 text-[20px]">{SECTIONS.find(s => s.key === activeSection)?.icon}</span>
                  <h3 className="text-lg font-semibold text-foreground">{SECTIONS.find(s => s.key === activeSection)?.label}</h3>
                </div>
                <textarea value={form[activeSection] || ''} onChange={e => handleChange(activeSection, e.target.value)} rows={14}
                  className="w-full bg-secondary/30 border border-border rounded-2xl px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-indigo-500/30 transition-colors resize-none leading-relaxed"
                  placeholder={`Enter ${SECTIONS.find(s => s.key === activeSection)?.label.toLowerCase()}...`} />
                <div className="flex justify-between mt-4">
                  {currentIdx > 0 && <button onClick={() => setActiveSection(SECTIONS[currentIdx - 1].key)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"><span className="material-symbols-outlined text-[15px]">arrow_back</span>Previous</button>}
                  <div className="ml-auto">
                    {currentIdx < SECTIONS.length - 1
                      ? <button onClick={() => setActiveSection(SECTIONS[currentIdx + 1].key)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">Next<span className="material-symbols-outlined text-[15px]">arrow_forward</span></button>
                      : <button onClick={() => setActiveSection('rx')} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">Prescriptions<span className="material-symbols-outlined text-[15px]">arrow_forward</span></button>
                    }
                  </div>
                </div>

                {/* Contextual Action Bar Slide-Up */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ margin: "100px" }}
                  className="fixed bottom-6 right-6 left-64 mx-auto max-w-4xl bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl z-20"
                >
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">auto_awesome</span> Auto-saving active
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => save(form, rxList)} className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all">
                      <span className="material-symbols-outlined text-[18px]">save</span> Save Record
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
