import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { getPatient, createPatient, updatePatient } from '../lib/api';

const FIELDS = [
  { key: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'First name' },
  { key: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Last name' },
  { key: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '9876543210' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'patient@email.com' },
  { key: 'gender', label: 'Gender', type: 'select', options: ['', 'Male', 'Female', 'Other'] },
  { key: 'age', label: 'Age', type: 'number', placeholder: '30' },
  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { key: 'bloodGroup', label: 'Blood Group', type: 'select', options: ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Software Engineer' },
  { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Full address...', colSpan: 2 },
];

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== 'new');
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getPatient(id).then(({ data }) => { setForm(data); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await updatePatient(id, form);
      } else {
        await createPatient(form);
      }
      navigate('/patients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
      setSaving(false);
    }
  };

  if (loading) return (
    <Layout title={isEdit ? 'Edit Patient' : 'Add Patient'}>
      <div className="max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-card rounded-xl animate-pulse" />)}
      </div>
    </Layout>
  );

  return (
    <Layout title={isEdit ? 'Edit Patient' : 'Add Patient'}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-foreground mb-6">{isEdit ? 'Update Patient Details' : 'Register New Patient'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELDS.map(f => (
                  <div key={f.key} className={f.colSpan === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      {f.label}{f.required && <span className="text-destructive ml-0.5">*</span>}
                    </label>
                    {f.type === 'select' ? (
                      <select value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors">
                        {f.options.map(o => <option key={o} value={o} className="bg-background">{o || `Select ${f.label}`}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} rows={3}
                        placeholder={f.placeholder} className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors resize-none" />
                    ) : (
                      <input type={f.type} value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)}
                        placeholder={f.placeholder} required={f.required}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors" />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>{error}
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                <button type="button" onClick={() => navigate('/patients')}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground border border-border rounded-xl hover:bg-secondary transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : (isEdit ? 'Update Patient' : 'Add Patient')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
