import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'Total Reports', value: '1,248', change: '+12%', icon: 'description', color: 'text-primary' },
  { label: 'Pending Review', value: '34', change: 'Requires Attention', icon: 'pending_actions', color: 'text-amber-500' },
  { label: 'Wellness Trend', value: 'Positive', change: 'Improving', icon: 'trending_up', color: 'text-emerald-500' },
];

const RECENT_DOCS = [
  { id: 1, title: 'Comprehensive Blood Panel', patient: 'Eleanor Vance', type: 'Constitutional Analysis', date: 'Oct 24, 2023', status: 'Complete', icon: 'science' },
  { id: 2, title: 'Vitality Progress Assessment', patient: 'Marcus Sterling', type: 'Follow-up', date: 'Oct 23, 2023', status: 'Pending Review', icon: 'monitor_heart' },
  { id: 3, title: 'Botanical Reaction Log', patient: 'Clara Oswald', type: 'Allergy Protocol', date: 'Oct 21, 2023', status: 'Complete', icon: 'spa' },
];

export default function ReportsDashboard() {
  return (
    <Layout title="Clinical Reports">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Comprehensive Reports</h2>
          <p className="text-muted-foreground mt-1 text-lg">In-depth clinical analysis and patient outcomes</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-secondary/50 border border-border px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            Last 30 Days
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Stats + List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 premium-shadow hover:border-primary/20 transition-all cursor-default">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-secondary/50 ${stat.color}`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                    stat.change.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Documents Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/10">
              <h3 className="text-xl font-bold">Recent Documents</h3>
              <button className="text-primary text-sm font-bold hover:underline">View Archive</button>
            </div>
            <div className="divide-y divide-border">
              {RECENT_DOCS.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-secondary/10 transition-all group flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">{doc.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{doc.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> {doc.patient}</span>
                        <span>•</span>
                        <span>{doc.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-xs font-bold text-muted-foreground mb-1">{doc.date}</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        doc.status === 'Complete' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-secondary/5 text-center">
              <button className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Load More Reports</button>
            </div>
          </div>
        </div>

        {/* Sidebar content for Reports */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 premium-shadow relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <h3 className="text-xl font-bold">Clinical Insights</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-card border border-border p-4 rounded-xl">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">trending_up</span>
                    <p className="text-xs leading-relaxed">Improved vitality metrics observed across <strong className="text-foreground">15%</strong> of current patients.</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl border-l-4 border-l-primary">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-[18px]">priority_high</span>
                    <p className="text-xs leading-relaxed">Action Recommended: Review <strong className="text-foreground">Case #452</strong> due to anomalous stress markers.</p>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-50">Powered by HomeoAI</p>
            </div>
          </div>

          {/* Upcoming Card */}
          <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
            <h3 className="text-lg font-bold mb-4">Scheduled Reviews</h3>
            <div className="space-y-4">
              {[
                { date: '26 Oct', title: 'Dr. Aris Thorne', sub: 'Monthly Panel' },
                { date: '02 Nov', title: 'Pharmacy Team', sub: 'Efficacy Audit' },
              ].map((ev, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{ev.date.split(' ')[1]}</span>
                    <span className="text-lg font-bold leading-none">{ev.date.split(' ')[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">{ev.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
