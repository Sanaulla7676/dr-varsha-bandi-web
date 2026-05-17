import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const CATEGORIES = ['All Records', 'Laboratory', 'Imaging', 'Consultations', 'Prescriptions'];

const RECORDS = [
  { id: 1, title: 'Complete Blood Count (CBC)', patient: 'Eleanor Vance', category: 'Laboratory', date: 'Oct 12, 2023', size: '1.2 MB', icon: 'science' },
  { id: 2, title: 'MRI - Cervical Spine', patient: 'Marcus Thorne', category: 'Imaging', date: 'Oct 10, 2023', size: '45.0 MB', icon: 'medical_information' },
  { id: 3, title: 'Initial Consultation Notes', patient: 'Sophia Lin', category: 'Consultations', date: 'Oct 08, 2023', size: '450 KB', icon: 'description' },
  { id: 4, title: 'Arnica Montana 30C Dispensation', patient: 'Julian Reed', category: 'Prescriptions', date: 'Oct 05, 2023', size: '120 KB', icon: 'prescriptions' },
  { id: 5, title: 'Metabolic Panel', patient: 'Clara Hughes', category: 'Laboratory', date: 'Oct 02, 2023', size: '1.8 MB', icon: 'science' },
];

export default function MedicalRecordsRepository() {
  const [activeTab, setActiveTab] = useState('All Records');

  return (
    <Layout title="Medical Records">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Document Repository</h2>
          <p className="text-muted-foreground mt-1 text-lg">Manage and access all patient clinical files</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[20px]">upload_file</span>
          Upload Document
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-8 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === cat 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Main Records Grid */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECORDS.map((record) => (
            <motion.div
              layout
              key={record.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-6 premium-shadow hover:-translate-y-1 transition-all group cursor-pointer flex flex-col h-full"
            >
              <div className="h-32 rounded-xl bg-secondary/50 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors relative overflow-hidden">
                <span className="material-symbols-outlined text-[48px] text-muted-foreground group-hover:text-primary transition-all opacity-40">{record.icon}</span>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-card p-1.5 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider">{record.category}</span>
                </div>
                <h3 className="font-bold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">{record.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 font-medium">Patient: {record.patient}</p>
              </div>
              <div className="mt-auto border-t border-border pt-4 flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {record.date}</span>
                <span>{record.size}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Storage Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
            <h3 className="text-lg font-bold mb-6">Storage Overview</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-muted-foreground">Used Space</span>
                  <span className="text-foreground">42.5 GB / 100 GB</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(255,45,120,0.5)]" style={{ width: '42.5%' }} />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Imaging', size: '28 GB', color: 'bg-primary' },
                  { label: 'Documents', size: '10 GB', color: 'bg-emerald-500' },
                  { label: 'Others', size: '4.5 GB', color: 'bg-amber-500' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className="text-muted-foreground font-medium">{s.label}</span>
                    </div>
                    <span className="font-bold">{s.size}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-border text-xs font-bold hover:bg-secondary transition-all">
              Upgrade Storage
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
            <h3 className="text-lg font-bold mb-4">Quick Filters</h3>
            <div className="space-y-2">
              {['Modified recently', 'High resolution only', 'Lab flagged', 'Patient shared'].map((f, i) => (
                <label key={i} className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg cursor-pointer transition-all">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-muted-foreground">{f}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
