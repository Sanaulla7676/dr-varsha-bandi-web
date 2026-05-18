import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuthStore } from '../store';
import { getGoogleAuthUrl } from '../lib/api';

export default function Settings() {
  const { doctor, updateDoctor } = useAuthStore();
  const [form, setForm] = useState({
    name: doctor?.name || 'Dr. Varsha Bandi',
    email: doctor?.email || 'doctor@homeopathway.com',
    phone: doctor?.phone || '',
    clinicName: doctor?.clinicName || 'Homeopathway Clinic',
    clinicAddress: doctor?.clinicAddress || '',
    specialization: doctor?.specialization || 'Homeopathy',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateDoctor(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-5">Profile Settings</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Dr. Varsha Bandi' },
                { key: 'email', label: 'Email', placeholder: 'doctor@homeopathway.com' },
                { key: 'phone', label: 'Phone', placeholder: '+91 9876543210' },
                { key: 'specialization', label: 'Specialization', placeholder: 'Homeopathy' },
                { key: 'clinicName', label: 'Clinic Name', placeholder: 'My Clinic' },
              ].map(f => (
                <div key={f.key} className={f.key === 'clinicName' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{f.label}</label>
                  <input value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">Clinic Address</label>
                <textarea value={form.clinicAddress || ''} onChange={e => setForm({ ...form, clinicAddress: e.target.value })} rows={2}
                  placeholder="Clinic full address" className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              {saved && <span className="text-xs text-emerald-500 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span>Saved</span>}
              <button type="submit" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>

        {/* Automated Follow-ups Setup */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">mark_email_read</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Automated Follow-ups</h3>
              <p className="text-xs text-muted-foreground">Zero-cost system powered by Nodemailer & WhatsApp Web</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">Send a follow-up via Gmail 7 days after visit</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">WhatsApp Notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">Send automated WhatsApp messages (Requires server QR scan)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">Default Message Template</label>
              <textarea rows={3}
                defaultValue="Hello [Name], Dr. Bandi from Homeopathway Clinic is checking in on your progress. How have you been feeling since your last visit?" 
                className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors resize-none" />
            </div>

            <div className="flex justify-end pt-2">
              <button type="button" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Google Calendar Integration */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Google Calendar Integration</h3>
              <p className="text-xs text-muted-foreground">Connect your Google account to generate Meet links for Video Consultations</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {doctor?.googleTokens?.refresh_token ? 'Connected' : 'Not Connected'}
              </p>
            </div>
            {doctor?.googleTokens?.refresh_token ? (
              <span className="text-xs text-emerald-500 flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span> Linked
              </span>
            ) : (
              <button 
                onClick={async () => {
                  try {
                    const { data } = await getGoogleAuthUrl();
                    if (data.url) window.location.href = data.url;
                  } catch (err) {
                    alert('Failed to get auth URL');
                  }
                }}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
                <span className="material-symbols-outlined text-[18px]">link</span> Connect Google
              </button>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">System</h3>
          <div className="space-y-3">
            {[
              { label: 'Platform', value: 'Homeopathway Clinical System' },
              { label: 'Version', value: '2.0.0' },
              { label: 'Backend', value: 'Node.js + Express + MongoDB' },
              { label: 'Status', value: 'Operational' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                <span className="text-xs text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
