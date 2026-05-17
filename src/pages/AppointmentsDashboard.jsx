
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function AppointmentsDashboard() {
    return (
        <React.Fragment>
            

<header className="bg-surface/80 backdrop-blur-xl text-deep-navy font-headline-md text-headline-md docked full-width top-0 sticky z-50 border-b border-lavender-mist/20 shadow-[0_40px_60px_-15px_rgba(0,26,61,0.05)] flex justify-between items-center px-container-desktop h-20 w-full pl-[calc(16rem+64px)] hidden md:flex">
<div className="flex-1 max-w-xl mx-4">
<div className="relative focus-within:ring-2 focus-within:ring-electric-blue/50 rounded-full">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" data-icon="search">search</span>
<input className="w-full bg-surface-container-low border-outline-variant text-on-surface rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-electric-blue font-body-md text-body-md placeholder:text-on-surface-variant/50" placeholder="Search patients, appointments..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<button className="relative text-on-surface-variant hover:text-cta-pink transition-colors duration-300">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-cta-pink rounded-full"></span>
</button>
<div className="w-10 h-10 rounded-full overflow-hidden border border-lavender-mist/50">
<img alt="Doctor profile" className="w-full h-full object-cover" data-alt="A close-up, soft-focus portrait of a professional healthcare practitioner in a modern, well-lit clinic setting. They are wearing subtle, premium medical attire. The background is a blurred, airy, luxury wellness space with natural light. The mood is calm, authoritative, and cinematic, using a serene color palette of soft whites and deep navy tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_8DSxzk__qR7t1BdyHqKdpFZU_TIer9OM9e9KWR11cyzF9fewK7uY6KidF3kbdLEXLgPIjaMzG6O41AstYS_lwdQTquANnAcWz9AaehBjOK9fxpxDc-2YnCVVs25b01aGdzjSBGH2ZIVcj4VLf4v395E3rX7WNE8JYNXynVXF61j9HCTM97WXtqLThgGlt_54iknCcL3byFNwvc_F0pm_FmmdLQe1x_q2zyfx9wn_VQpm-EZ_8T2KQkQlSJvHgoYZoz1l4ziJ28o"/>
</div>
</div>
</header>

<nav className="bg-cream-white/60 backdrop-blur-2xl text-deep-navy font-label-md text-label-md docked left-0 h-screen w-64 fixed border-r border-lavender-mist shadow-sm flex flex-col h-full py-8 overflow-y-auto hidden md:flex z-50">
<div className="px-8 mb-10 flex flex-col items-start gap-4">
<div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-cta-pink">
<span className="material-symbols-outlined" data-icon="spa">spa</span>
</div>
<div>
<h1 className="font-headline-md text-headline-md font-light tracking-tight text-deep-navy">Homeopathway</h1>
<p className="font-label-sm text-label-sm text-on-surface-variant mt-1 uppercase tracking-widest">Premium Care</p>
</div>
</div>
<div className="px-4 mb-8">
<button className="w-full bg-cta-pink text-on-primary rounded-full py-3 px-6 font-label-md text-label-md flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,45,120,0.4)] transition-all duration-300">
<span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                New Appointment
            </button>
</div>
<ul className="flex-1 px-4 flex flex-col gap-1">
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/dashboard-appointments">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                    Dashboard</Link>
</li>
<li>
<Link className="text-deep-navy font-bold border-r-2 border-cta-pink bg-lavender-mist/30 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl opacity-90 scale-95" to="#">
<span className="material-symbols-outlined" data-icon="event" style={{"fontVariationSettings":"'FILL' 1"}}>event</span>
                    Appointments</Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/dashboard-appointments">
<span className="material-symbols-outlined" data-icon="person">person</span>
                    Patients
                </Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/video-consultation">
<span className="material-symbols-outlined" data-icon="videocam">videocam</span>
                    Video Consultations</Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/prescriptions">
<span className="material-symbols-outlined" data-icon="description">description</span>
                    Prescriptions</Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/medical-records">
<span className="material-symbols-outlined" data-icon="folder_shared">folder_shared</span>
                    Medical Records</Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/follow-ups">
<span className="material-symbols-outlined" data-icon="history">history</span>
                    Follow-Ups</Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/reports">
<span className="material-symbols-outlined" data-icon="assessment">assessment</span>
                    Reports</Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/calendar">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
                    Calendar</Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
                    Settings
                </Link>
</li>
</ul>
<div className="px-4 mt-auto pt-8 border-t border-lavender-mist/30">
<ul className="flex flex-col gap-1">
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
                        Help
                    </Link>
</li>
<li>
<Link className="text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl" to="/video-consultation">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
                        Logout
                    </Link>
</li>
</ul>
</div>
</nav>

<main className="md:pl-64 pt-8 pb-32 px-container-mobile md:px-container-desktop min-h-screen">
<div className="max-w-[1440px] mx-auto">

<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
<div>
<h2 className="font-headline-lg text-headline-lg text-deep-navy font-light mb-2">Daily Schedule</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Manage your appointments and consultations for today.</p>
</div>
<div className="flex items-center bg-surface border border-lavender-mist/50 rounded-full px-6 py-3 shadow-[0_10px_30px_-10px_rgba(0,26,61,0.05)] cursor-pointer hover:bg-lavender-mist/10 transition-colors">
<span className="material-symbols-outlined text-deep-navy mr-3" data-icon="calendar_month">calendar_month</span>
<span className="font-label-md text-label-md text-deep-navy font-semibold mr-4">Tuesday, October 24th</span>
<span className="material-symbols-outlined text-on-surface-variant" data-icon="expand_more">expand_more</span>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">

<div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-lavender-mist/30 shadow-[0_20px_40px_-15px_rgba(0,26,61,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_30px_50px_-15px_rgba(0,26,61,0.08)] transition-all duration-300">
<div className="flex items-center gap-6 w-full md:w-auto">
<div className="text-center min-w-[80px]">
<div className="font-headline-md text-headline-md text-deep-navy font-semibold">09:00</div>
<div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">AM</div>
</div>
<div className="w-px h-16 bg-lavender-mist hidden md:block"></div>
<div className="flex flex-col gap-1">
<h3 className="font-body-lg text-body-lg text-deep-navy font-semibold">Eleanor Vance</h3>
<div className="flex items-center gap-2 text-on-surface-variant">
<span className="material-symbols-outlined text-[16px]" data-icon="history">history</span>
<span className="font-label-md text-label-md">Follow-up</span>
</div>
</div>
</div>
<div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
<span className="bg-primary-fixed text-primary-fixed-dim bg-opacity-20 text-electric-blue font-label-sm text-label-sm px-4 py-2 rounded-full uppercase tracking-widest border border-primary-fixed-dim/30">Arrived</span>
<div className="flex gap-3 mt-4 md:mt-0">
<button className="font-label-md text-label-md text-deep-navy px-4 py-2 hover:text-electric-blue transition-colors">View Profile</button>
<button className="bg-cta-pink text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:shadow-[0_0_20px_rgba(255,45,120,0.3)] transition-all duration-300">Start</button>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-lavender-mist/30 shadow-[0_20px_40px_-15px_rgba(0,26,61,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_30px_50px_-15px_rgba(0,26,61,0.08)] transition-all duration-300">
<div className="flex items-center gap-6 w-full md:w-auto">
<div className="text-center min-w-[80px]">
<div className="font-headline-md text-headline-md text-deep-navy font-semibold">10:30</div>
<div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">AM</div>
</div>
<div className="w-px h-16 bg-lavender-mist hidden md:block"></div>
<div className="flex flex-col gap-1">
<h3 className="font-body-lg text-body-lg text-deep-navy font-semibold">Julian Carter</h3>
<div className="flex items-center gap-2 text-on-surface-variant">
<span className="material-symbols-outlined text-[16px]" data-icon="videocam">videocam</span>
<span className="font-label-md text-label-md">Video Consult</span>
</div>
</div>
</div>
<div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
<span className="bg-surface-variant text-secondary font-label-sm text-label-sm px-4 py-2 rounded-full uppercase tracking-widest border border-outline-variant/30">Waiting</span>
<div className="flex gap-3 mt-4 md:mt-0">
<button className="font-label-md text-label-md text-deep-navy px-4 py-2 hover:text-electric-blue transition-colors">View Profile</button>
<button className="border border-deep-navy text-deep-navy font-label-md text-label-md px-6 py-2 rounded-full hover:bg-deep-navy hover:text-on-primary transition-all duration-300 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="call">call</span>
                                    Join Call
                                </button>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-lavender-mist/30 shadow-[0_20px_40px_-15px_rgba(0,26,61,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_30px_50px_-15px_rgba(0,26,61,0.08)] transition-all duration-300 opacity-70">
<div className="flex items-center gap-6 w-full md:w-auto">
<div className="text-center min-w-[80px]">
<div className="font-headline-md text-headline-md text-deep-navy font-semibold">01:00</div>
<div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">PM</div>
</div>
<div className="w-px h-16 bg-lavender-mist hidden md:block"></div>
<div className="flex flex-col gap-1">
<h3 className="font-body-lg text-body-lg text-deep-navy font-semibold">Sarah Jenkins</h3>
<div className="flex items-center gap-2 text-on-surface-variant">
<span className="material-symbols-outlined text-[16px]" data-icon="description">description</span>
<span className="font-label-md text-label-md">Initial Intake</span>
</div>
</div>
</div>
<div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
<span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-4 py-2 rounded-full uppercase tracking-widest border border-outline-variant/30">Confirmed</span>
<div className="flex gap-3 mt-4 md:mt-0">
<button className="font-label-md text-label-md text-deep-navy px-4 py-2 hover:text-electric-blue transition-colors">View Profile</button>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 xl:col-span-3">
<div className="bg-cream-white rounded-xl p-8 border border-lavender-mist/50 shadow-[0_40px_60px_-15px_rgba(0,26,61,0.05)] sticky top-28">
<h3 className="font-headline-md text-headline-md text-deep-navy font-light mb-8 border-b border-lavender-mist/30 pb-4">Queue Overview</h3>
<div className="flex flex-col gap-6">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3 text-on-surface-variant">
<div className="w-10 h-10 rounded-full bg-lavender-mist/50 flex items-center justify-center text-deep-navy">
<span className="material-symbols-outlined" data-icon="groups">groups</span>
</div>
<span className="font-body-md text-body-md">Total Today</span>
</div>
<span className="font-headline-md text-headline-md text-deep-navy font-semibold">12</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-3 text-on-surface-variant">
<div className="w-10 h-10 rounded-full bg-primary-fixed/30 flex items-center justify-center text-electric-blue">
<span className="material-symbols-outlined" data-icon="videocam">videocam</span>
</div>
<span className="font-body-md text-body-md">Online Consults</span>
</div>
<span className="font-headline-md text-headline-md text-deep-navy font-semibold">4</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-3 text-on-surface-variant">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
<span className="material-symbols-outlined" data-icon="history">history</span>
</div>
<span className="font-body-md text-body-md">Pending Follow-ups</span>
</div>
<span className="font-headline-md text-headline-md text-deep-navy font-semibold">8</span>
</div>
</div>
</div>
</div>
</div>
</div>
</main>

        </React.Fragment>
    );
}
