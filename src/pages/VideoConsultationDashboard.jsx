
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function VideoConsultationDashboard() {
    return (
        <React.Fragment>
            

<nav className="hidden md:flex flex-col h-full py-8 overflow-y-auto bg-cream-white/60 dark:bg-matte-black/60 backdrop-blur-2xl text-deep-navy dark:text-lavender-mist font-label-md text-label-md docked left-0 h-screen w-64 fixed border-r border-lavender-mist dark:border-white/5 shadow-sm z-40">
<div className="px-8 mb-10 flex flex-col items-start gap-4">
<img alt="Clinic Logo" className="h-12 w-auto object-contain rounded-lg drop-shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9jyOAvhKaFfeL86onGLcKZgdLwdQYvrxjgoujcav08xqrhcKoLbvj1H_IZCUKDjJzX5CnzNYzcjR4ESzWKuG_Z3IRY9_xp7AQc-02x-AFnibxb25-K1dzMQWukYm7WAC5-a0G8Lmenytt9RNEEn3P1MkWzrnak8HseM6gz7nnRbL78wtZacGLd0JH1NYC0S-ZmmZcspkPVldwp2tOpfQbw-CEaH5YxbSNDd49RfLQ3dDUHkA4wjv6-oT_4VrdRIDlEVQ7Mo-blpkq2g" />
<div>
<h1 className="font-headline-md text-headline-md text-deep-navy dark:text-on-primary tracking-tight">Homeopathway</h1>
<p className="text-secondary text-sm mt-1">Premium Care</p>
</div>
<button className="mt-6 w-full py-3 px-4 bg-cta-pink hover:bg-cta-pink/90 text-white rounded-full transition-all shadow-[0_0_15px_rgba(255,45,120,0.3)] hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] font-label-md flex justify-center items-center gap-2">
<span className="material-symbols-outlined text-sm">add</span> New Appointment
            </button>
</div>
<div className="flex-1 px-4 space-y-2">

<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="/dashboard-appointments">
<span className="material-symbols-outlined text-[20px]">dashboard</span>
                Dashboard</Link>
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="/appointments">
<span className="material-symbols-outlined text-[20px]">event</span>
                Appointments</Link>
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="/dashboard-appointments">
<span className="material-symbols-outlined text-[20px]">person</span>
                Patients
            </Link>

<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-deep-navy font-bold border-r-2 border-cta-pink bg-lavender-mist/30 transition-all duration-300 opacity-90" to="#">
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings":"&quot"}}>videocam</span>
                Video Consultations</Link>

<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="/prescriptions">
<span className="material-symbols-outlined text-[20px]">description</span>
                Prescriptions</Link>
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="/medical-records">
<span className="material-symbols-outlined text-[20px]">folder_shared</span>
                Medical Records</Link>
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="/follow-ups">
<span className="material-symbols-outlined text-[20px]">history</span>
                Follow-Ups</Link>
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="/reports">
<span className="material-symbols-outlined text-[20px]">assessment</span>
                Reports</Link>
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="/calendar">
<span className="material-symbols-outlined text-[20px]">calendar_today</span>
                Calendar</Link>
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 hover:translate-x-1 transition-all duration-300" to="#">
<span className="material-symbols-outlined text-[20px]">settings</span>
                Settings
            </Link>
</div>
<div className="px-4 mt-auto pt-8 space-y-2 border-t border-lavender-mist/50 mx-4">
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 transition-colors" to="#">
<span className="material-symbols-outlined text-[20px]">help</span>
                Help
            </Link>
<Link className="flex items-center gap-4 px-4 py-3 rounded-lg text-secondary hover:text-deep-navy hover:bg-lavender-mist/10 transition-colors" to="/video-consultation">
<span className="material-symbols-outlined text-[20px]">logout</span>
                Logout
            </Link>
</div>
</nav>

<main className="ml-64 flex-1 flex flex-col h-screen bg-surface-container-low relative">

<div className="flex-1 flex p-6 gap-6 overflow-hidden">

<div className="flex-1 relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,26,61,0.15)] bg-matte-black group">

<div className="absolute inset-0 w-full h-full bg-cover bg-center" data-alt="A high-quality, cinematic portrait of a mature woman in her late 60s, acting as a patient in a video call. She is seated in a well-lit, serene home environment with soft, natural lighting. The color palette features elegant neutrals and soft blues, aligning with a premium healthcare aesthetic. The mood is calm, professional, and sophisticated." style={{"backgroundImage":"url(&quot","https":"//lh3.googleusercontent.com/aida-public/AB6AXuBH7spNlXZEIgRI9S7-YFKPJXL9h5SeaR2tArZqbuTngsXKfq20px-wBnuIu45JqyfFw8G_PUFYWlHRGsauf7aM_gaB1tWzCRnEIOE_sXzGOSXfJ1Eb_-elr1hGoY_toVYRv0biUCokt1-_gTibXs-rF4CBQUkHdNKsUXWjv3Z15qYv3RC0XFE5udTZXr0KoLjlzD1rnWBiBoIA2ac3coCJNNEOT5DJDDv1sZgYA9yI3mxNUhff6bzY9dILpiSADCBXI0AoFCzJFQc&quot"}}>
</div>

<div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-transparent to-deep-navy/20 pointer-events-none"></div>

<div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
<div className="dark-glass px-4 py-2 rounded-full flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
<span className="text-white font-label-sm tracking-widest">LIVE</span>
<div className="w-[1px] h-4 bg-white/20 mx-1"></div>
<span className="text-white/80 font-label-sm">14:23</span>
</div>
<div className="dark-glass px-3 py-2 rounded-full flex items-center gap-2">
<span className="material-symbols-outlined text-white/80 text-sm">signal_cellular_alt</span>
<span className="text-white/80 font-label-sm">HD</span>
</div>
</div>

<div className="absolute bottom-32 right-6 w-48 h-32 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-deep-navy z-10">
<div className="w-full h-full bg-cover bg-center" data-alt="A cinematic portrait of a professional male homeopathic doctor looking directly at the camera, mimicking a webcam feed. He is in a bright, modern clinic with minimalist decor and subtle lavender tones in the background. The lighting is soft and flattering." style={{"backgroundImage":"url(&quot","https":"//lh3.googleusercontent.com/aida-public/AB6AXuB1Ig_CHmrr84yTbvtpCMkPGWBcRP9KQbbevZ-gPbFKf-YC5TI2Iuzt_nZZ32Xf7ypy-UG_lRE3iGWMmpg1xuA38qqQ5PZpqWvJDmYTsfzO5ZRI1F3ewzSVYrhXyLbgiTWfUPkCaPdmfXojCSinMUHwC2W7CuOR9-XADvQjCSs_fMUhWlfoaU6TLRM7SFMc5VS60oJs0WvCRRsC7MNYSjpC-045wm3wsmzkcGTKr_5YAgmuO4L1TdmrmPHD-GmU0UGV_YteR9Cv60A&quot"}}>
</div>
</div>

<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 dark-glass rounded-full z-20 shadow-2xl transition-transform duration-300 group-hover:translate-y-0">
<button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-md">
<span className="material-symbols-outlined">mic</span>
</button>
<button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-md">
<span className="material-symbols-outlined">videocam</span>
</button>
<button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-md">
<span className="material-symbols-outlined">screen_share</span>
</button>
<div className="w-[1px] h-8 bg-white/20 mx-2"></div>
<button className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]">
<span className="material-symbols-outlined">call_end</span>
</button>
</div>
</div>

<div className="w-[400px] flex flex-col gap-6 overflow-y-auto pr-2 pb-6">

<div className="glass-panel p-6 rounded-[2rem] flex flex-col gap-4">
<div className="flex items-start justify-between">
<div className="flex items-center gap-4">
<div className="w-14 h-14 rounded-full bg-lavender-mist flex items-center justify-center text-deep-navy font-headline-md">
                                EV
                            </div>
<div>
<h2 className="font-headline-md text-deep-navy">Eleanor Vance</h2>
<p className="text-secondary font-label-sm">Female, 68 yrs • ID: P-4921</p>
</div>
</div>
<button className="text-secondary hover:text-deep-navy">
<span className="material-symbols-outlined">more_horiz</span>
</button>
</div>
<div className="pt-4 border-t border-deep-navy/5 flex flex-col gap-3">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-surface-tint text-sm">monitor_heart</span>
<span className="font-label-md text-on-surface-variant">Primary: Chronic Migraine</span>
</div>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-surface-tint text-sm">history</span>
<span className="font-label-md text-on-surface-variant">Last visit: 12 Oct 2023</span>
</div>
</div>
</div>

<div className="glass-panel p-6 rounded-[2rem] flex-1 flex flex-col">
<div className="flex justify-between items-center mb-4">
<h3 className="font-headline-md text-lg text-deep-navy flex items-center gap-2">
<span className="material-symbols-outlined text-electric-blue">edit_note</span>
                            Live Clinical Notes
                        </h3>
<button className="text-xs font-label-sm text-electric-blue hover:text-deep-navy transition-colors">Expand</button>
</div>
<textarea className="flex-1 w-full bg-white/50 border border-lavender-mist rounded-xl p-4 font-body-md text-deep-navy placeholder:text-secondary focus:ring-2 focus:ring-electric-blue/50 focus:border-electric-blue/50 transition-all resize-none" placeholder="Document patient observations, symptoms, and responses here..."></textarea>
<div className="mt-4 flex justify-end">
<button className="px-4 py-2 bg-deep-navy text-white rounded-full font-label-sm hover:bg-opacity-90 transition-all">Save Draft</button>
</div>
</div>

<div className="glass-panel p-6 rounded-[2rem] flex flex-col gap-4">
<h3 className="font-headline-md text-lg text-deep-navy flex items-center gap-2">
<span className="material-symbols-outlined text-cta-pink">prescriptions</span>
                        Draft Remedy
                    </h3>
<div className="relative">
<input className="w-full bg-white/50 border border-lavender-mist rounded-full py-3 pl-10 pr-4 font-body-md text-deep-navy focus:ring-2 focus:ring-electric-blue/50 transition-all" placeholder="Search remedies..." type="text" />
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-sm">search</span>
</div>
<div className="flex flex-wrap gap-2 mt-2">
<span className="px-3 py-1 bg-lavender-mist text-deep-navy rounded-full font-label-sm flex items-center gap-1 cursor-pointer hover:bg-opacity-80">
                            Belladonna 30C <span className="material-symbols-outlined text-[14px]">close</span>
</span>
</div>
</div>
</div>
</div>
</main>



        </React.Fragment>
    );
}
