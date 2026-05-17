
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function FollowUpsDashboard() {
    return (
        <React.Fragment>
            

<nav className="fixed left-0 top-0 h-full w-64 border-r border-lavender-mist/10 bg-deep-navy/80 backdrop-blur-xl dark:bg-matte-black/80 flex flex-col py-base shadow-[40px_0_60px_-15px_rgba(0,26,61,0.08)] z-50">
<div className="px-6 py-8 flex flex-col items-center border-b border-white/10 mb-6">
<img alt="Homeopathway Glass Logo" className="w-16 h-16 rounded-full mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)] object-cover" data-alt="A bold, 3D wordmark for 'Homeopathway' in a deep navy (#001a3d) color. The logo features realistic glass textures, soft reflections, and a cinematic depth-of-field effect. High-end clinical aesthetic, modern and premium, set against a minimal light background with soft shadows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3pjBTmWWabhXIlPDj9WxMo42r1eQs8GpaJYOfu7WLjHvg4rcny1B_wVMmbh9-9ZyyCIIEpT-3rR42eRQU84-FQUmUo3_XzmeP8k6KO6lZ1wsUf7ASy9jO-7pNJ51LrbFdSK3GmTk7xbTSwBtKbJaVAndabsZYQ6ysVZuv0jRuNu7Lwuvyy-wHGThyZIue8uLqPaQrYYzKWXMn5wnbWByYrNoGDdKmUmDYEp7gG1DMbM2qfb7EjXXIiuBbMS9nFozu_LIFZr4cpLZKFg" />
<h1 className="font-headline-md text-headline-md text-on-primary tracking-tight">Homeopathway</h1>
<p className="font-label-sm text-label-sm text-on-primary/60 mt-1 uppercase tracking-widest">Cinematic Wellness</p>
</div>
<div className="flex-1 flex flex-col gap-2">
<Link className="flex items-center gap-3 px-4 py-3 bg-white/10 text-on-primary rounded-r-full mr-4 scale-95 transition-transform duration-200" to="#">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"&quot"}}>dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-secondary-fixed-dim/70 hover:text-on-primary transition-colors hover:bg-white/5 duration-300 rounded-r-full mr-4" to="/dashboard-appointments">
<span className="material-symbols-outlined">group</span>
<span className="font-label-md text-label-md">Patients</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-secondary-fixed-dim/70 hover:text-on-primary transition-colors hover:bg-white/5 duration-300 rounded-r-full mr-4" to="/prescriptions">
<span className="material-symbols-outlined">medical_services</span>
<span className="font-label-md text-label-md">Prescriptions</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-secondary-fixed-dim/70 hover:text-on-primary transition-colors hover:bg-white/5 duration-300 rounded-r-full mr-4" to="/video-consultation">
<span className="material-symbols-outlined">leaderboard</span>
<span className="font-label-md text-label-md">Analytics</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-secondary-fixed-dim/70 hover:text-on-primary transition-colors hover:bg-white/5 duration-300 rounded-r-full mr-4" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</Link>
</div>
<div className="px-4 mt-auto mb-6">
<button className="w-full bg-cta-pink text-on-primary font-label-md text-label-md py-3 rounded-full shadow-[0_4px_16px_rgba(255,45,120,0.3)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">add</span>
                New Consultation
            </button>
</div>
<div className="border-t border-white/10 pt-4">
<Link className="flex items-center gap-3 px-4 py-3 text-secondary-fixed-dim/70 hover:text-on-primary transition-colors hover:bg-white/5 duration-300 rounded-r-full mr-4" to="#">
<span className="material-symbols-outlined">help</span>
<span className="font-label-md text-label-md">Help Center</span>
</Link>
</div>
</nav>

<div className="flex-1 ml-64 flex flex-col min-h-screen">

<header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-20 bg-surface/60 backdrop-blur-md dark:bg-matte-black/60 border-b border-surface-container-highest flex justify-between items-center px-gutter z-40">
<div className="flex items-center gap-8">
<div className="text-deep-navy font-headline-lg text-headline-lg hidden">Homeopathway</div>
<div className="relative w-64 hidden lg:block">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">search</span>
<input className="w-full bg-surface-container-low border border-lavender-mist rounded-full py-2 pl-12 pr-4 font-body-md text-body-md focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none transition-colors" placeholder="Search patients..." type="text" />
</div>
<nav className="flex gap-6">
<Link className="text-secondary hover:text-primary font-label-md text-label-md hover:text-cta-pink transition-colors" to="/video-consultation">Schedules</Link>
<Link className="text-secondary hover:text-primary font-label-md text-label-md hover:text-cta-pink transition-colors" to="/video-consultation">Pharmacy</Link>
</nav>
</div>
<div className="flex items-center gap-6">
<button className="bg-deep-navy text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:bg-deep-navy/90 transition-colors shadow-sm">Check In</button>
<div className="flex items-center gap-4 text-primary dark:text-on-primary">
<button className="hover:text-cta-pink transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="hover:text-cta-pink transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high">
<span className="material-symbols-outlined text-[32px]">account_circle</span>
</button>
</div>
</div>
</header>

<main className="flex-1 mt-20 p-container-padding-desktop">
<div className="max-w-7xl mx-auto space-y-12">

<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-lavender-mist/40 pb-8">
<div>
<h2 className="font-headline-display text-headline-display text-deep-navy tracking-tight">Follow-Ups</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Monitor patient progress and constitutional healing journeys.</p>
</div>
<div className="flex gap-4">
<button className="flex items-center gap-2 bg-cta-pink text-on-primary font-label-md text-label-md px-6 py-3 rounded-full shadow-[0_8px_24px_rgba(255,45,120,0.2)] hover:-translate-y-0.5 transition-transform">
<span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                            Schedule Follow-Up
                        </button>
<button className="flex items-center gap-2 bg-transparent border border-deep-navy text-deep-navy font-label-md text-label-md px-6 py-3 rounded-full hover:bg-deep-navy/5 transition-colors">
<span className="material-symbols-outlined text-[18px]">send</span>
                            Send Check-in Form
                        </button>
<button className="flex items-center gap-2 bg-transparent border border-deep-navy text-deep-navy font-label-md text-label-md px-6 py-3 rounded-full hover:bg-deep-navy/5 transition-colors">
<span className="material-symbols-outlined text-[18px]">medication</span>
                            Update Remedy
                        </button>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 glass-card rounded-[24px] p-8">
<div className="flex justify-between items-center mb-8">
<h3 className="font-headline-md text-headline-md text-deep-navy">Upcoming Consultations</h3>
<button className="text-electric-blue font-label-md text-label-md hover:underline">View All</button>
</div>
<div className="space-y-4">

<div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
<div className="flex items-center gap-4">
<img alt="Patient Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" data-alt="A portrait of a serene young woman with natural lighting, soft focus background, conveying health and wellness. Cinematic lighting, neutral tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxfqhVx2ab7Hk4kKw6RSUeQ79rBCBr2JNhegCjTUzGlbCXCUoe9qdVcrFQt_1lLw_MFzvCjU680XobCMQRReT2Ukz94YpD3Oe6TVt3JdM0hx-rYigAJRRe6M8_ZXxkm8dNtjjyMSt4TRQ584osxW3c92-EQLqgyvQAZGGQUYaJOsXj3jaHtD0ZGXYcRxeXhe8eTYCWDYUE5YHDhn51aySmILUW6LSd7H0xO_hrtB9GU7qc46VeAyyrop5hyOJH1k1Yc3xeX4Wc-cs" />
<div>
<h4 className="font-label-md text-label-md text-on-surface group-hover:text-deep-navy transition-colors">Eleanor Vance</h4>
<p className="font-label-sm text-label-sm text-secondary mt-0.5">Last: Natrum Mur 200C</p>
</div>
</div>
<div className="flex items-center gap-8">
<span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-label-sm text-label-sm flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                                        Improving
                                    </span>
<div className="text-right">
<p className="font-label-md text-label-md text-on-surface">Today</p>
<p className="font-label-sm text-label-sm text-secondary">2:30 PM</p>
</div>
<button className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-lavender-mist transition-colors">
<span className="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</div>

<div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
<div className="flex items-center gap-4">
<img alt="Patient Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" data-alt="A portrait of a thoughtful middle-aged man with a subtle smile, warm cinematic lighting, shallow depth of field, premium aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9oFTqbpXGbR1LuciCCQvfRfYSYZnRpL7jxcvaTMSRoTeOXJ3bcg2vmjgmk5ebhFUbrR6udN9OWy-UJVg1UVocrSzvLrPgiuZrHyuct-BidCMObCjXeAlEqk2_FupXMgy5w6GsXF5sut-JVI20OTywqEjGIFyaSMrgUFAOsA-39eNzvXph9PftzhhHYNA8r_oRTuu6w9bBcpv87r1XM2XI3gtgNIzaTn2sP3imRecjap2MuYARw9Fdo9iXS6S4LXPuQQ7auKwGHnQ" />
<div>
<h4 className="font-label-md text-label-md text-on-surface group-hover:text-deep-navy transition-colors">Arthur Pendelton</h4>
<p className="font-label-sm text-label-sm text-secondary mt-0.5">Last: Lycopodium 1M</p>
</div>
</div>
<div className="flex items-center gap-8">
<span className="px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container"></span>
                                        Plateau
                                    </span>
<div className="text-right">
<p className="font-label-md text-label-md text-on-surface">Tomorrow</p>
<p className="font-label-sm text-label-sm text-secondary">10:00 AM</p>
</div>
<button className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-lavender-mist transition-colors">
<span className="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</div>

<div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
<div className="flex items-center gap-4">
<img alt="Patient Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" data-alt="A profile view of an elegant young woman, soft diffused studio light, light grey background, high resolution, minimalist beauty." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD861YohP0Wov643CDAm-oAzwdX0XmzP-bEgohdP_6PmsgRJ_nOMit3nMNozKomiUbS-4nN_774fXGhbqwS6wXKVk5TVc35JVIiOLJl2EhXh_RX_8sZnzxhvybWQj_tzrTXveo6W9gWqBkerTrStV5vSXuouyRpjYPOhapANUvBQJW1cX9qoKbUWn_PakmtDtdanx_qOOwjdUWfuhNYpmixADw33GbhBFopBLIci7jJuaw3PM2A8yVfTuZA4hCsFoTOYxpZkwGPDOM" />
<div>
<h4 className="font-label-md text-label-md text-on-surface group-hover:text-deep-navy transition-colors">Clara Bow</h4>
<p className="font-label-sm text-label-sm text-secondary mt-0.5">Last: Ignatia 200C</p>
</div>
</div>
<div className="flex items-center gap-8">
<span className="px-3 py-1 rounded-full bg-error-container/50 text-on-error-container font-label-sm text-label-sm flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                        Relapse
                                    </span>
<div className="text-right">
<p className="font-label-md text-label-md text-on-surface">Thursday</p>
<p className="font-label-sm text-label-sm text-secondary">4:15 PM</p>
</div>
<button className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-lavender-mist transition-colors">
<span className="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 glass-card rounded-[24px] p-8 flex flex-col">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-cta-pink bg-cta-pink/10 p-2 rounded-full">notification_important</span>
<h3 className="font-headline-md text-headline-md text-deep-navy">Attention Required</h3>
</div>
<p className="font-body-md text-body-md text-secondary mb-6">Patients who have missed their scheduled check-ins or reported acute exacerbations.</p>
<div className="space-y-4 flex-1">
<div className="p-4 rounded-xl border border-error-container bg-error-container/10">
<div className="flex justify-between items-start mb-2">
<h4 className="font-label-md text-label-md text-on-surface">Marcus Thorne</h4>
<span className="font-label-sm text-label-sm text-error">Overdue 5 days</span>
</div>
<p className="font-label-sm text-label-sm text-secondary mb-3">Constitutional: Sulphur. Scheduled for form submission last Friday.</p>
<button className="text-electric-blue font-label-sm text-label-sm hover:underline flex items-center gap-1">
                                    Send Reminder <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
<div className="p-4 rounded-xl border border-surface-dim bg-surface-container-low">
<div className="flex justify-between items-start mb-2">
<h4 className="font-label-md text-label-md text-on-surface">Silvia Roth</h4>
<span className="font-label-sm text-label-sm text-on-surface-variant">Action Needed</span>
</div>
<p className="font-label-sm text-label-sm text-secondary mb-3">Reported partial proving symptoms via portal message.</p>
<button className="text-electric-blue font-label-sm text-label-sm hover:underline flex items-center gap-1">
                                    Review Message <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>

<div className="glass-card rounded-[24px] p-8 mt-8 relative overflow-hidden">

<div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
<div className="flex justify-between items-end mb-10">
<div>
<p className="font-label-sm text-label-sm text-electric-blue uppercase tracking-widest mb-2">Patient Focus</p>
<h3 className="font-headline-display text-headline-lg text-deep-navy">Constitutional Progress: Eleanor Vance</h3>
</div>
<button className="bg-surface-container-low border border-lavender-mist text-deep-navy font-label-md text-label-md px-6 py-2 rounded-full hover:bg-lavender-mist/50 transition-colors flex items-center gap-2">
                            View Full Chart <span className="material-symbols-outlined text-[18px]">open_in_new</span>
</button>
</div>

<div className="relative pt-8 pb-4">

<div className="absolute top-1/2 left-0 w-full h-[2px] bg-lavender-mist -translate-y-1/2 z-0"></div>

<div className="absolute top-1/2 left-0 w-[60%] h-[2px] bg-electric-blue -translate-y-1/2 z-0"></div>
<div className="relative z-10 flex justify-between items-center w-full px-4">

<div className="flex flex-col items-center group cursor-pointer">
<div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-deep-navy text-on-primary text-[10px] py-1 px-3 rounded shadow-lg whitespace-nowrap">Initial Intake</div>
<div className="w-4 h-4 rounded-full bg-electric-blue border-4 border-surface-container-lowest shadow-sm"></div>
<div className="mt-4 text-center">
<p className="font-label-md text-label-md text-on-surface">Sep 12</p>
<p className="font-label-sm text-label-sm text-secondary">Nat Mur 30C</p>
</div>
</div>

<div className="flex flex-col items-center group cursor-pointer">
<div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-deep-navy text-on-primary text-[10px] py-1 px-3 rounded shadow-lg whitespace-nowrap">Follow-up 1</div>
<div className="w-4 h-4 rounded-full bg-electric-blue border-4 border-surface-container-lowest shadow-sm"></div>
<div className="mt-4 text-center">
<p className="font-label-md text-label-md text-on-surface">Oct 24</p>
<p className="font-label-sm text-label-sm text-secondary">Hold</p>
</div>
</div>

<div className="flex flex-col items-center group cursor-pointer">
<div className="mb-4 opacity-100 absolute -top-14 bg-white border border-lavender-mist text-deep-navy font-label-sm py-1.5 px-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.05)] whitespace-nowrap flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span> Improving
                                </div>
<div className="w-6 h-6 rounded-full bg-surface-container-lowest border-4 border-electric-blue shadow-[0_0_0_4px_rgba(0,123,255,0.1)] flex items-center justify-center">
<div className="w-2 h-2 bg-electric-blue rounded-full"></div>
</div>
<div className="mt-4 text-center">
<p className="font-label-md text-label-md text-deep-navy font-bold">Nov 15</p>
<p className="font-label-sm text-label-sm text-secondary">Nat Mur 200C</p>
</div>
</div>

<div className="flex flex-col items-center group cursor-pointer opacity-50">
<div className="w-4 h-4 rounded-full bg-surface-container-low border-[2px] border-outline-variant"></div>
<div className="mt-4 text-center">
<p className="font-label-md text-label-md text-on-surface">Dec 20</p>
<p className="font-label-sm text-label-sm text-secondary">Scheduled</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
</div>



        </React.Fragment>
    );
}
