import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  { name: 'Belladonna', potency: '30C', dosage: '4 drops', frequency: '2x Daily' },
  { name: 'Arnica Montana', potency: '200C', dosage: '2 pills', frequency: '3x Daily' },
  { name: 'Ignatia Amara', potency: '1M', dosage: '5 drops', frequency: 'Once Daily' },
];

export default function PrescriptionDashboard() {
  const [items, setItems] = useState([
    { id: 1, name: 'Belladonna', potency: '30C', dosage: '4 drops', frequency: '2x Daily' },
    { id: 2, name: 'Natrum Muriaticum', potency: '200C', dosage: '2 pills', frequency: 'Once Weekly' },
  ]);

  const [newRemedy, setNewRemedy] = useState({
    name: '',
    potency: '30C',
    dosage: '',
    frequency: '2x Daily'
  });

  const addItem = () => {
    if (!newRemedy.name) return;
    setItems([...items, { ...newRemedy, id: Date.now() }]);
    setNewRemedy({ name: '', potency: '30C', dosage: '', frequency: '2x Daily' });
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Layout title="Prescriptions">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Add Remedy Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-2xl p-8 premium-shadow">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">add_circle</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Add New Remedy</h2>
                <p className="text-sm text-muted-foreground">Select from database or enter custom remedy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 ml-1">Remedy Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]">search</span>
                  <input
                    type="text"
                    value={newRemedy.name}
                    onChange={(e) => setNewRemedy({...newRemedy, name: e.target.value})}
                    placeholder="Search remedy database (e.g. Arnica)..."
                    className="w-full bg-secondary/50 border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 ml-1">Potency</label>
                <select 
                  value={newRemedy.potency}
                  onChange={(e) => setNewRemedy({...newRemedy, potency: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                >
                  {['6C', '30C', '200C', '1M', '10M', 'CM', 'Q'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 ml-1">Dosage</label>
                <input
                  type="text"
                  value={newRemedy.dosage}
                  onChange={(e) => setNewRemedy({...newRemedy, dosage: e.target.value})}
                  placeholder="e.g. 4 drops / 2 pills"
                  className="w-full bg-secondary/50 border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 ml-1">Frequency</label>
                <div className="flex flex-wrap gap-2">
                  {['Once Daily', '2x Daily', '3x Daily', 'As Needed', 'SOS'].map(f => (
                    <button
                      key={f}
                      onClick={() => setNewRemedy({...newRemedy, frequency: f})}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        newRemedy.frequency === f 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                onClick={addItem}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">add</span>
                Add to Prescription
              </button>
            </div>
          </div>

          {/* Clinical Instructions */}
          <div className="bg-card border border-border rounded-2xl p-8 premium-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">stylus</span>
              </div>
              <h2 className="text-xl font-bold">Clinical Instructions</h2>
            </div>
            <textarea
              placeholder="Enter dietary restrictions, lifestyle advice, or specific administration rules..."
              className="w-full bg-secondary/30 border border-border rounded-2xl p-6 outline-none focus:border-primary/50 transition-all min-h-[150px] resize-none"
            />
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 premium-shadow sticky top-24">
            <div className="text-center pb-6 border-b border-border mb-6">
              <h3 className="text-2xl font-bold text-foreground">Summary</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <span className="material-symbols-outlined text-[48px] opacity-20 block mb-2 font-light">medication</span>
                    <p className="text-sm italic">No remedies added yet</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-secondary/40 border border-border rounded-xl p-4 group relative hover:border-primary/30 transition-all"
                    >
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                      <div className="flex justify-between items-start mb-1 pr-6">
                        <h4 className="font-bold text-foreground">{item.name}</h4>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-[10px] font-bold">{item.potency}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.dosage}, {item.frequency}</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-8 border-t border-border space-y-3">
              <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-4 font-bold flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">send</span>
                Finalize & Send
              </button>
              <button className="w-full border border-border hover:bg-secondary text-foreground rounded-xl py-3.5 font-semibold flex justify-center items-center gap-2 transition-all">
                <span className="material-symbols-outlined text-[18px]">print</span>
                Download PDF
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* History Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Past Prescriptions</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/30 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Remedy</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Potency</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Instructions</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: 'Ignatia Amara', potency: '1M', text: '3 drops, As Needed', status: 'Active' },
                { name: 'Arnica Montana', potency: '30C', text: '2 pills, 3x Daily', status: 'Completed' },
              ].map((p, idx) => (
                <tr key={idx} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.potency}</td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">{p.text}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      p.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-muted border-border text-muted-foreground'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline text-sm font-bold">Repeat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
