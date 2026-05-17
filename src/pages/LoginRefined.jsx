
import React from 'react';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginRefined() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                navigate('/video-consultation');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to connect to backend.');
        }
    };

    return (
        <React.Fragment>
            
<main className="flex w-full min-h-screen">

<section className="w-full lg:w-1/2 relative flex flex-col justify-center items-center px-container-padding-mobile lg:px-container-padding-desktop py-section-gap overflow-hidden bg-gradient-to-br from-cream-white to-lavender-mist/50"><div className="absolute top-8 left-8 z-20"><img src="{{DATA:IMAGE:IMAGE_4}}" alt="Homeopathway Logo" className="w-[140px] h-auto object-contain" /></div>

<div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(216,226,255,0.4)_0%,transparent_50%)]"></div>
<div className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,26,61,0.03)] flex flex-col items-center">

<div className="mb-10 text-center flex flex-col items-center">

<p className="font-['Manrope'] text-lg font-bold text-primary tracking-widest mt-4 uppercase bg-electric-blue/10 px-4 py-1.5 rounded-full inline-block backdrop-blur-sm border border-electric-blue/20 shadow-sm" data-stitch-orig-opacity="0">Welcome Dr. Varsha Bandi</p>
</div>

<form className="w-full space-y-6" onSubmit={handleLogin}>
<div className="space-y-5">
<div className="relative group">
<span className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/70 group-focus-within:text-electric-blue transition-colors duration-500">
<span className="material-symbols-outlined">call</span>
</span>
<input value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full bg-white/80 border border-outline-variant/30 focus:border-electric-blue/40 rounded-full py-4 pl-14 pr-6 font-body-md text-on-surface placeholder:text-secondary/50 outline-none transition-all duration-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] focus:shadow-[0_0_20px_rgba(0,123,255,0.15)] focus:bg-white" placeholder="User ID" type="text" />
</div>
<div className="relative group">
<span className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/70 group-focus-within:text-electric-blue transition-colors duration-500">
<span className="material-symbols-outlined">lock</span>
</span>
<input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/80 border border-outline-variant/30 focus:border-electric-blue/40 rounded-full py-4 pl-14 pr-6 font-body-md text-on-surface placeholder:text-secondary/50 outline-none transition-all duration-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] focus:shadow-[0_0_20px_rgba(0,123,255,0.15)] focus:bg-white" placeholder="Password" type="password" />
</div>
</div>

{error && <p className="text-error text-center font-label-md mt-2">{error}</p>}

<div className="flex justify-between items-center px-2 pt-2">
<Link className="font-label-md text-secondary/80 hover:text-electric-blue transition-colors duration-300" to="/video-consultation">Signup</Link>
<Link className="font-label-md text-secondary/80 hover:text-electric-blue transition-colors duration-300" to="/video-consultation">Reset Password</Link>
</div>

<div className="pt-8 w-full flex justify-center">
<button className="bg-gradient-to-r from-cta-pink to-[#ff5c93] hover:from-[#ff1a6a] hover:to-[#ff4582] text-white rounded-full py-4 px-12 font-label-md w-full shadow-[0_8px_25px_rgba(255,45,120,0.3)] hover:shadow-[0_15px_35px_rgba(255,45,120,0.4)] transition-all duration-500 transform hover:-translate-y-1 active:translate-y-0 active:shadow-md" type="submit">
                            Login
                        </button>
</div>
</form>
</div>
</section>

<section className="hidden lg:block lg:w-1/2 relative bg-matte-black overflow-hidden">
<img alt="Stethoscope with blue glowing medical heart" className="absolute inset-0 w-full h-full object-cover scale-105" src="https://lh3.googleusercontent.com/aida/ADBb0uiJ17MBtGXq4Gwxzn9RuWG3y_-0PU7TCsMK-Scg2XKBeB6cETAiHsYELY6VLQtnGd5aqJrFfHYOjenKQ8dLC5pihlM6Z7K8oGXC_7XOkMlH_hq0eSdt6crndVxr1u-pjpYrDoExiWUkoWFagAAnguDRZuYpZHJYPrqduWJKozexkkvUcEyL9Fa8uNfI6bU517pkGGvD6C1r8i7GQoILINJSeXs5idYesBd17WgkV9VOglO1b0AdE1UP2w" />

<div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-transparent to-[#000814]/40 pointer-events-none"></div>
<div className="absolute inset-0 bg-gradient-to-l from-transparent via-deep-navy/10 to-matte-black/60 pointer-events-none mix-blend-multiply"></div>

<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,123,255,0.2)_0%,transparent_60%)] pointer-events-none mix-blend-screen opacity-80"></div>

<div className="absolute inset-0 pointer-events-none overflow-hidden">
<div className="particle absolute top-1/4 left-1/4 w-3 h-3 bg-electric-blue rounded-full blur-[4px]"></div>
<div className="particle absolute top-1/2 right-1/4 w-4 h-4 bg-tertiary-fixed-dim rounded-full blur-[6px]"></div>
<div className="particle absolute bottom-1/4 left-1/3 w-2 h-2 bg-electric-blue rounded-full blur-[3px]"></div>
<div className="particle absolute top-1/3 right-1/3 w-5 h-5 bg-tertiary-fixed rounded-full blur-[8px] opacity-20"></div>
</div>
</section>
</main>



        </React.Fragment>
    );
}
