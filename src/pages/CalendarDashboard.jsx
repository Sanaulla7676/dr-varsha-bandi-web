
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CalendarDashboard() {
    return (
        <React.Fragment>
            

<nav className="hidden md:flex flex-col h-full py-base z-50 bg-deep-navy/95 dark:bg-matte-black/95 backdrop-blur-2xl fixed left-0 top-0 w-64 rounded-r-lg border-r border-lavender-mist/10 shadow-[40px_0_60px_-15px_rgba(0,26,61,0.08)]">
<div className="px-6 py-8 flex flex-col items-center">
<img alt="Homeopathway Logo" className="w-16 h-16 rounded-full mb-4" src="https://lh3.googleusercontent.com/aida/ADBb0uhRerGu1q4Mumyl2l9U5TPeoKhhi5wqPfbyJt09DdcIobfvYEN1VzvodMChZfvMrLw1RGrIDmoxUdA-cz3ZBS5KfAS6SyWbbwya0jwPv7WXKG9PRGYibWo03pLdvX_caME0gEFGEb_NUNbAMf0DrlRhYcYlvSdBcz9H6Ob3lV-qCsxntDyrsCK5g1cnNr39APKRR03ad2_bs2rOCW-MAG0hd-8-6rgMo2SKgEdFZOIo5Mm7fRfubyKJmg"/>
<h1 className="text-headline-md font-headline-md text-cream-white tracking-tight text-center">Homeopathway</h1>
<p className="text-label-sm font-label-sm text-lavender-mist/60 mt-2">Cinematic Wellness</p>
<button className="mt-8 w-full bg-cta-pink text-white rounded-full py-3 px-6 text-label-md font-label-md shadow-[0_0_20px_rgba(255,45,120,0.3)] hover:shadow-[0_0_30px_rgba(255,45,120,0.5)] transition-all">
                New Consultation
            </button>
</div>
<div className="flex-1 mt-8 space-y-2 px-4">
<Link className="flex items-center gap-4 text-lavender-mist/60 px-6 py-3 hover:text-cream-white hover:bg-cream-white/5 hover:translate-x-1 duration-300 transition-all rounded-full" to="/dashboard-appointments">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="text-label-md font-label-md">Dashboard</span>
</Link>
<Link className="flex items-center gap-4 text-lavender-mist/60 px-6 py-3 hover:text-cream-white hover:bg-cream-white/5 hover:translate-x-1 duration-300 transition-all rounded-full" to="/dashboard-appointments">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span className="text-label-md font-label-md">Patients</span>
</Link>

<Link className="flex items-center gap-4 bg-cream-white/10 text-cream-white rounded-full px-6 py-3 backdrop-blur-md border border-white/10 scale-95 transition-transform" to="/calendar">
<span className="material-symbols-outlined" data-icon="event">event</span>
<span className="text-label-md font-label-md">Calendar</span>
</Link>
<Link className="flex items-center gap-4 text-lavender-mist/60 px-6 py-3 hover:text-cream-white hover:bg-cream-white/5 hover:translate-x-1 duration-300 transition-all rounded-full" to="/video-consultation">
<span className="material-symbols-outlined" data-icon="medical_services">medical_services</span>
<span className="text-label-md font-label-md">Protocols</span>
</Link>
<Link className="flex items-center gap-4 text-lavender-mist/60 px-6 py-3 hover:text-cream-white hover:bg-cream-white/5 hover:translate-x-1 duration-300 transition-all rounded-full" to="/video-consultation">
<span className="material-symbols-outlined" data-icon="medication">medication</span>
<span className="text-label-md font-label-md">Pharmacy</span>
</Link>
<Link className="flex items-center gap-4 text-lavender-mist/60 px-6 py-3 hover:text-cream-white hover:bg-cream-white/5 hover:translate-x-1 duration-300 transition-all rounded-full" to="/video-consultation">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span className="text-label-md font-label-md">Analytics</span>
</Link>
</div>
<div className="mt-auto px-4 pb-8 space-y-2">
<Link className="flex items-center gap-4 text-lavender-mist/60 px-6 py-3 hover:text-cream-white hover:bg-cream-white/5 hover:translate-x-1 duration-300 transition-all rounded-full" to="/video-consultation">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span className="text-label-md font-label-md">Support</span>
</Link>
<Link className="flex items-center gap-4 text-lavender-mist/60 px-6 py-3 hover:text-cream-white hover:bg-cream-white/5 hover:translate-x-1 duration-300 transition-all rounded-full" to="/video-consultation">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="text-label-md font-label-md">Sign Out</span>
</Link>
</div>
</nav>

<main className="ml-64 flex-1 flex flex-col h-full bg-cream-white overflow-hidden relative">

<header className="h-24 flex items-center justify-between px-container-padding-desktop border-b border-surface-variant/50 bg-white/40 backdrop-blur-md z-10">
<div className="flex items-center gap-6">
<h2 className="text-headline-lg font-headline-lg text-deep-navy">November 2023</h2>
<div className="flex items-center gap-2">
<button className="p-2 rounded-full hover:bg-surface-variant/50 text-deep-navy transition-colors">
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="text-label-md font-label-md px-4 py-2 rounded-full hover:bg-surface-variant/50 text-deep-navy transition-colors">Today</button>
<button className="p-2 rounded-full hover:bg-surface-variant/50 text-deep-navy transition-colors">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
<div className="flex items-center gap-6">

<div className="flex items-center gap-3 bg-surface-container-low rounded-full p-1 border border-surface-variant/50">
<button className="text-label-md font-label-md px-4 py-1.5 rounded-full bg-white shadow-sm text-deep-navy">Month</button>
<button className="text-label-md font-label-md px-4 py-1.5 rounded-full text-secondary hover:text-deep-navy transition-colors">Week</button>
<button className="text-label-md font-label-md px-4 py-1.5 rounded-full text-secondary hover:text-deep-navy transition-colors">Day</button>
</div>
<div className="h-8 w-px bg-surface-variant"></div>
<div className="flex items-center gap-3">
<select className="bg-lavender-mist/50 border border-lavender-mist rounded-full px-4 py-2 text-label-md font-label-md text-deep-navy focus:border-electric-blue focus:ring-0 appearance-none outline-none">
<option>All Types</option>
<option>Constitutional</option>
<option>Acute</option>
<option>Follow-up</option>
</select>
<select className="bg-lavender-mist/50 border border-lavender-mist rounded-full px-4 py-2 text-label-md font-label-md text-deep-navy focus:border-electric-blue focus:ring-0 appearance-none outline-none">
<option>Dr. Sarah Jenkins</option>
<option>Dr. Michael Chen</option>
</select>
</div>
</div>
</header>

<div className="flex-1 flex overflow-hidden">

<div className="flex-1 p-gutter overflow-y-auto">
<div className="glass-card rounded-lg h-full flex flex-col">

<div className="grid grid-cols-7 border-b border-surface-variant/30 py-4 px-2">
<div className="text-center text-label-sm font-label-sm text-secondary uppercase tracking-wider">Sun</div>
<div className="text-center text-label-sm font-label-sm text-secondary uppercase tracking-wider">Mon</div>
<div className="text-center text-label-sm font-label-sm text-secondary uppercase tracking-wider">Tue</div>
<div className="text-center text-label-sm font-label-sm text-secondary uppercase tracking-wider">Wed</div>
<div className="text-center text-label-sm font-label-sm text-secondary uppercase tracking-wider">Thu</div>
<div className="text-center text-label-sm font-label-sm text-secondary uppercase tracking-wider">Fri</div>
<div className="text-center text-label-sm font-label-sm text-secondary uppercase tracking-wider">Sat</div>
</div>

<div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-surface-variant/20 p-px">

<div className="bg-white/80 p-2 min-h-[100px] relative group hover:bg-white transition-colors">
<span className="text-label-md font-label-md text-secondary-fixed-dim absolute top-2 right-2">29</span>
</div>
<div className="bg-white/80 p-2 min-h-[100px] relative group hover:bg-white transition-colors">
<span className="text-label-md font-label-md text-secondary-fixed-dim absolute top-2 right-2">30</span>
</div>
<div className="bg-white/80 p-2 min-h-[100px] relative group hover:bg-white transition-colors">
<span className="text-label-md font-label-md text-secondary-fixed-dim absolute top-2 right-2">31</span>
</div>

<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all flex flex-col gap-1">
<span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">1</span>
<div className="mt-8">
<div className="bg-lavender-mist text-deep-navy text-[10px] px-2 py-1 rounded-sm truncate mb-1 border-l-2 border-electric-blue">09:00 - Acute Consult</div>
<div className="bg-surface-container text-on-surface text-[10px] px-2 py-1 rounded-sm truncate">14:00 - Follow-up</div>
</div>
<button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-cta-pink text-white rounded-full p-1 shadow-md transition-opacity">
<span className="material-symbols-outlined text-[16px]" data-icon="add">add</span>
</button>
</div>

<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all flex flex-col gap-1">
<span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">2</span>
<button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-cta-pink text-white rounded-full p-1 shadow-md transition-opacity">
<span className="material-symbols-outlined text-[16px]" data-icon="add">add</span>
</button>
</div>

<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all flex flex-col gap-1">
<span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">3</span>
<div className="mt-8">
<div className="bg-primary-fixed-dim/30 text-deep-navy text-[10px] px-2 py-1 rounded-sm truncate border-l-2 border-primary-fixed-dim">10:30 - Constitutional</div>
</div>
<button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-cta-pink text-white rounded-full p-1 shadow-md transition-opacity">
<span className="material-symbols-outlined text-[16px]" data-icon="add">add</span>
</button>
</div>

<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all flex flex-col gap-1">
<span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">4</span>
<button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-cta-pink text-white rounded-full p-1 shadow-md transition-opacity">
<span className="material-symbols-outlined text-[16px]" data-icon="add">add</span>
</button>
</div>

<div className="bg-lavender-mist/20 p-2 min-h-[100px] relative group border-2 border-electric-blue/30 rounded-sm transition-all flex flex-col gap-1">
<div className="absolute top-2 right-2 bg-deep-navy text-white rounded-full w-6 h-6 flex items-center justify-center">
<span className="text-label-md font-label-md">5</span>
</div>
<div className="mt-8 space-y-1">
<div className="bg-error-container text-on-error-container text-[10px] px-2 py-1 rounded-sm truncate border-l-2 border-error">08:00 - Emergency</div>
<div className="bg-lavender-mist text-deep-navy text-[10px] px-2 py-1 rounded-sm truncate border-l-2 border-electric-blue">11:00 - E. Thompson</div>
<div className="bg-surface-container text-on-surface text-[10px] px-2 py-1 rounded-sm truncate">15:30 - M. Davies</div>
</div>
<button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-cta-pink text-white rounded-full p-1 shadow-md transition-opacity">
<span className="material-symbols-outlined text-[16px]" data-icon="add">add</span>
</button>
</div>

<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all">
<span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">6</span>
</div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all">
<span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">7</span>
</div>

<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">8</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">9</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">10</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">11</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">12</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">13</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">14</span></div>

<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">15</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">16</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">17</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">18</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">19</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">20</span></div>
<div className="bg-white p-2 min-h-[100px] relative group border border-transparent hover:border-lavender-mist rounded-sm transition-all"><span className="text-label-md font-label-md text-deep-navy absolute top-2 right-2">21</span></div>
</div>
</div>
</div>

<aside className="w-80 bg-white/60 backdrop-blur-xl border-l border-surface-variant/50 flex flex-col h-full shadow-[-20px_0_40px_-15px_rgba(0,26,61,0.03)] z-10">
<div className="p-6 border-b border-surface-variant/30">
<h3 className="text-headline-md font-headline-md text-deep-navy">Nov 5, 2023</h3>
<p className="text-label-md font-label-md text-secondary mt-1">Tuesday • 3 Appointments</p>
</div>
<div className="flex-1 overflow-y-auto p-6 space-y-6">

<div className="relative pl-6 border-l-2 border-error/30">
<div className="absolute w-3 h-3 bg-error rounded-full -left-[7px] top-1 border-2 border-white"></div>
<div className="text-label-sm font-label-sm text-secondary mb-1">08:00 - 09:00</div>
<div className="bg-white rounded-lg p-4 shadow-sm border border-surface-variant/50 hover:shadow-md transition-shadow">
<h4 className="text-body-md font-label-md text-deep-navy font-semibold">Emergency Acute Consult</h4>
<p className="text-label-md font-label-md text-secondary mt-1">Patient: Unregistered</p>
<div className="mt-3 flex gap-2">
<span className="bg-error-container text-on-error-container text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold">Urgent</span>
</div>
</div>
</div>

<div className="relative pl-6 border-l-2 border-electric-blue/30">
<div className="absolute w-3 h-3 bg-electric-blue rounded-full -left-[7px] top-1 border-2 border-white"></div>
<div className="text-label-sm font-label-sm text-secondary mb-1">11:00 - 12:30</div>
<div className="bg-white rounded-lg p-4 shadow-sm border border-surface-variant/50 hover:shadow-md transition-shadow">
<h4 className="text-body-md font-label-md text-deep-navy font-semibold">Eleanor Thompson</h4>
<p className="text-label-md font-label-md text-secondary mt-1">Initial Constitutional Review</p>
<div className="mt-3 flex gap-2">
<span className="bg-lavender-mist text-deep-navy text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold">Constitutional</span>
</div>
</div>
</div>

<div className="relative pl-6 border-l-2 border-surface-tint/30">
<div className="absolute w-3 h-3 bg-surface-tint rounded-full -left-[7px] top-1 border-2 border-white"></div>
<div className="text-label-sm font-label-sm text-secondary mb-1">15:30 - 16:00</div>
<div className="bg-white rounded-lg p-4 shadow-sm border border-surface-variant/50 hover:shadow-md transition-shadow">
<h4 className="text-body-md font-label-md text-deep-navy font-semibold">Marcus Davies</h4>
<p className="text-label-md font-label-md text-secondary mt-1">4-Week Follow-up (Arnica 30c)</p>
<div className="mt-3 flex gap-2">
<span className="bg-surface-container-high text-on-surface text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold">Follow-up</span>
</div>
</div>
</div>
</div>
</aside>
</div>
</main>

        </React.Fragment>
    );
}
