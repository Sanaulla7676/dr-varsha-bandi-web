import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function DashboardAppointmentsSection() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/appointments', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.appointments) setAppointments(data.appointments);
            } catch (err) {
                console.error("Failed to fetch appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <React.Fragment>
            

<nav className="hidden md:flex flex-col h-screen w-72 py-8 px-6 gap-y-base bg-cream-white/40 dark:bg-matte-black/40 backdrop-blur-2xl border-r border-lavender-mist/20 dark:border-white/10 shadow-[40px_0_60px_-15px_rgba(0,26,61,0.03)] fixed left-0 top-0 z-40">
<div className="mb-10 px-4">
<h1 className="font-headline-md text-headline-md font-bold text-deep-navy dark:text-primary-fixed">Homeopathway</h1>
<p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mt-1">Premium Care</p>
</div>
<div className="flex flex-col gap-y-2 flex-grow overflow-y-auto pr-2">
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-deep-navy dark:text-primary-fixed font-bold border-r-2 border-electric-blue bg-white/10 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 translate-x-1 group" to="#">
<span className="material-symbols-outlined text-[20px] opacity-90" style={{"fontVariationSettings":"&quot"}}>dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group" to="/appointments">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">calendar_today</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Appointments</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group" to="/dashboard-appointments">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">group</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Patients</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group" to="/video-consultation">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">video_chat</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Video Consultations</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group" to="/prescriptions">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">description</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Prescriptions</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group" to="/medical-records">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">folder_shared</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Medical Records</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group" to="/follow-ups">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">history</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Follow-Ups</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group" to="/reports">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">assessment</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Reports</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group" to="/calendar">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">event</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Calendar</span>
</Link>
<Link className="flex items-center gap-x-4 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim opacity-70 hover:opacity-100 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 group mt-auto" to="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-deep-navy transition-colors">settings</span>
<span className="font-label-md text-label-md group-hover:text-deep-navy transition-colors">Settings</span>
</Link>
</div>
</nav>

<div className="flex-1 flex flex-col min-w-0 md:ml-72">

<header className="flex justify-between items-center w-full px-container-padding-desktop py-4 sticky top-0 z-50 bg-cream-white/80 dark:bg-matte-black/80 backdrop-blur-xl border-b border-lavender-mist/20 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,26,61,0.05)]">
<div className="flex items-center md:hidden">
<h1 className="font-headline-md text-headline-md font-bold tracking-tight text-deep-navy dark:text-primary-fixed">Homeopathway</h1>
</div>

<div className="hidden md:flex flex-1 max-w-md items-center bg-lavender-mist/30 rounded-full px-4 py-2 border border-lavender-mist/50 focus-within:border-electric-blue transition-colors">
<span className="material-symbols-outlined text-secondary mr-2 text-[20px]">search</span>
<input className="bg-transparent border-none outline-none text-deep-navy w-full font-label-md text-label-md placeholder:text-secondary/70 focus:ring-0" placeholder="Search patients, records..." type="text" />
</div>
<div className="flex items-center gap-x-6 ml-auto">
<button className="text-secondary dark:text-secondary-fixed-dim hover:bg-lavender-mist/50 dark:hover:bg-white/5 transition-colors duration-300 p-2 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-secondary dark:text-secondary-fixed-dim hover:bg-lavender-mist/50 dark:hover:bg-white/5 transition-colors duration-300 p-2 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined">videocam</span>
</button>
<div className="h-10 w-10 rounded-full bg-surface-tint/20 overflow-hidden border border-lavender-mist flex-shrink-0 cursor-pointer">
<img alt="Dr. Profile Avatar" className="h-full w-full object-cover" data-alt="A professional headshot of a doctor with a reassuring smile, wearing a white coat, brightly lit with soft, cinematic studio lighting against a clean, minimal white background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3JqfSHutMEoXTMcCpxbqo4_lPr3NT0KNL5m-2UHbfNjKuh9oHiZPBYLI4fu808ltKICnkbvDVf8vpywfrP98IhcMI6-WRxKwpOKwWUTtAIgNMdQggWgE9ldiQX6Elcw0YqIgKP7VW7ymA5qLLL83-sUNAHSn3D7JOHyVJ5JLMy8Gd1zNmaB2VryFXyTyvN3U3VFYiSNlZdgNQnOy9U7NnL-f3-emj5v7J7RLphGeRyKpGVOKpXGHbBJNM2zhXN3yFGetEBwvQheg" />
</div>
</div>
</header>

<main className="flex-1 px-container-padding-desktop py-12 flex flex-col gap-y-section-gap max-w-[1440px] mx-auto w-full">

<section className="flex flex-col gap-y-2">
<h2 className="font-headline-display text-headline-display text-deep-navy tracking-tight">Good Morning, Dr. Varsha Bandi</h2>
<p className="font-body-lg text-body-lg text-secondary max-w-2xl">Here is your clinical overview for today. You have a busy schedule with 12 appointments and 4 video consultations.</p>
</section>

<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">

<div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-[24px] p-8 shadow-[0_20px_40px_-15px_rgba(0,26,61,0.04)] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
<div className="flex justify-between items-start mb-6">
<div className="h-12 w-12 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue">
<span className="material-symbols-outlined text-[28px]" style={{"fontVariationSettings":"&quot"}}>calendar_today</span>
</div>
<span className="bg-electric-blue/10 text-electric-blue font-label-sm text-label-sm px-3 py-1 rounded-full">+2 from yesterday</span>
</div>
<div>
<p className="font-label-md text-label-md text-secondary mb-1">Today Appointments</p>
<p className="font-headline-lg text-headline-lg text-deep-navy font-semibold">12 <span className="font-body-md text-body-md text-secondary font-normal">Appointments</span></p>
</div>
</div>

<div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-[24px] p-8 shadow-[0_20px_40px_-15px_rgba(0,26,61,0.04)] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
<div className="flex justify-between items-start mb-6">
<div className="h-12 w-12 rounded-full bg-cta-pink/10 flex items-center justify-center text-cta-pink">
<span className="material-symbols-outlined text-[28px]" style={{"fontVariationSettings":"&quot"}}>video_chat</span>
</div>
<span className="bg-cta-pink/10 text-cta-pink font-label-sm text-label-sm px-3 py-1 rounded-full">Next in 30m</span>
</div>
<div>
<p className="font-label-md text-label-md text-secondary mb-1">Online Consultations</p>
<p className="font-headline-lg text-headline-lg text-deep-navy font-semibold">4 <span className="font-body-md text-body-md text-secondary font-normal">Video Calls</span></p>
</div>
</div>

<div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-[24px] p-8 shadow-[0_20px_40px_-15px_rgba(0,26,61,0.04)] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
<div className="flex justify-between items-start mb-6">
<div className="h-12 w-12 rounded-full bg-on-tertiary-fixed-variant/10 flex items-center justify-center text-on-tertiary-fixed-variant">
<span className="material-symbols-outlined text-[28px]" style={{"fontVariationSettings":"&quot"}}>history</span>
</div>
<span className="bg-surface-tint/10 text-surface-tint font-label-sm text-label-sm px-3 py-1 rounded-full">Requires Review</span>
</div>
<div>
<p className="font-label-md text-label-md text-secondary mb-1">Follow-Ups</p>
<p className="font-headline-lg text-headline-lg text-deep-navy font-semibold">8 <span className="font-body-md text-body-md text-secondary font-normal">Pending</span></p>
</div>
</div>

<div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-[24px] p-8 shadow-[0_20px_40px_-15px_rgba(0,26,61,0.04)] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
<div className="flex justify-between items-start mb-6">
<div className="h-12 w-12 rounded-full bg-deep-navy/10 flex items-center justify-center text-deep-navy">
<span className="material-symbols-outlined text-[28px]" style={{"fontVariationSettings":"&quot"}}>person_add</span>
</div>
</div>
<div>
<p className="font-label-md text-label-md text-secondary mb-1">New Patients</p>
<p className="font-headline-lg text-headline-lg text-deep-navy font-semibold">5 <span className="font-body-md text-body-md text-secondary font-normal">Today</span></p>
</div>
</div>
</section>
<section className="flex flex-col gap-y-6">
<div className="flex justify-between items-center">
<h3 className="font-headline-md text-headline-md text-deep-navy font-semibold">Today's Appointments</h3>
<Link className="text-electric-blue font-label-md hover:underline flex items-center gap-1"to="/appointments">View Full Schedule <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</Link>
</div>
<div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,26,61,0.04)] overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-lavender-mist/10 border-b border-lavender-mist/20">
<th className="px-8 py-4 font-label-sm text-secondary uppercase tracking-wider">Time</th>
<th className="px-8 py-4 font-label-sm text-secondary uppercase tracking-wider">Patient Name</th>
<th className="px-8 py-4 font-label-sm text-secondary uppercase tracking-wider">Type</th>
<th className="px-8 py-4 font-label-sm text-secondary uppercase tracking-wider">Status</th>
<th className="px-8 py-4 font-label-sm text-secondary uppercase tracking-wider text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-lavender-mist/10">

{loading ? (
    <tr><td colSpan="5" className="px-8 py-5 text-center text-secondary">Loading...</td></tr>
) : appointments.map((apt) => (
<tr key={apt.id} className="hover:bg-lavender-mist/5 transition-colors group">
<td className="px-8 py-5 font-label-md text-deep-navy">{apt.time}</td>
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="h-8 w-8 rounded-full bg-surface-tint/10 flex items-center justify-center text-xs font-bold text-surface-tint">{apt.patient.charAt(0)}</div>
<span className="font-body-md text-deep-navy font-medium">{apt.patient}</span>
</div>
</td>
<td className="px-8 py-5">
<span className="flex items-center gap-2 text-secondary font-label-md">
<span className="material-symbols-outlined text-[18px]">person</span> {apt.type}
              </span>
</td>
<td className="px-8 py-5">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{apt.status}</span>
</td>
<td className="px-8 py-5 text-right">
<div className="flex items-center justify-end gap-2">
<button className="p-2 hover:bg-electric-blue/10 rounded-full text-secondary hover:text-electric-blue transition-colors" title="Open Profile"><span className="material-symbols-outlined text-[20px]">account_circle</span></button>
<button className="p-2 hover:bg-cta-pink/10 rounded-full text-secondary hover:text-cta-pink transition-colors opacity-30 cursor-not-allowed" title="Start Video Call"><span className="material-symbols-outlined text-[20px]">videocam</span></button>
<button className="p-2 hover:bg-electric-blue/10 rounded-full text-secondary hover:text-electric-blue transition-colors" title="Add Prescription"><span className="material-symbols-outlined text-[20px]">description</span></button>
<button className="p-2 hover:bg-green-100 rounded-full text-secondary hover:text-green-600 transition-colors" title="Complete Visit"><span className="material-symbols-outlined text-[20px]">check_circle</span></button>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</section>
</main>
</div>





        </React.Fragment>
    );
}
