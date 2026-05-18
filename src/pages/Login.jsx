import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { loginDoctor } from '../lib/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginDoctor(form);
      if (data.success) {
        login(data.token, data.refreshToken, data.doctor);
        navigate('/dashboard');
      }
    } catch (err) {
      // If the backend is unreachable (not deployed), fall back to a client-side
      // demo session so the Vercel preview is always usable with demo credentials.
      const isNetworkError = !err.response;
      const isDemoCredentials =
        form.email === 'doctor@homeopathway.com' && form.password === 'doctor123';

      if (isNetworkError && isDemoCredentials) {
        const mockDoctor = {
          id: '000000000000000000000000',
          name: 'Dr. Varsha Bandi',
          email: form.email,
          clinicName: 'Homeopathway Clinic',
        };
        // Build a minimal fake JWT-like token (header.payload.sig) using btoa
        const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ ...mockDoctor, exp: 9999999999 }));
        const mockToken = `${header}.${payload}.demo-sig`;
        login(mockToken, 'mock-refresh-token', mockDoctor);
        navigate('/dashboard');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080C] flex items-center justify-center overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[80px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '50px 50px'}} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo & Brand */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_40px_rgba(99,102,241,0.4)] mb-6"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5"/>
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Homeopathway</h1>
          <p className="text-sm text-white/40 mt-1">Clinical Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
          <h2 className="text-lg font-medium text-white mb-1">Welcome back, Doctor</h2>
          <p className="text-sm text-white/40 mb-8">Sign in to your clinical dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="doctor@homeopathway.com"
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3 rounded-xl text-sm transition-all duration-200 shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:shadow-[0_0_32px_rgba(99,102,241,0.5)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <p className="text-xs text-white/30 font-medium mb-1">Demo Credentials</p>
            <p className="text-xs text-white/50">Email: <span className="text-white/70">doctor@homeopathway.com</span></p>
            <p className="text-xs text-white/50">Password: <span className="text-white/70">doctor123</span></p>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">© 2024 Homeopathway · Premium Clinical Platform</p>
      </motion.div>
    </div>
  );
}
