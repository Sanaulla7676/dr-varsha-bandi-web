import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

export default function VideoConsultation() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room') || `hp-room-${Date.now()}`;
  const patientParam = searchParams.get('patient');

  const [inCall, setInCall] = useState(false);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [timer, setTimer] = useState(0);
  const [notes, setNotes] = useState('');
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [activePanel, setActivePanel] = useState('notes');
  const [stream, setStream] = useState(null);
  const localVideo = useRef(null);
  const timerRef = useRef(null);

  // Start camera preview
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (localVideo.current) localVideo.current.srcObject = s;
    } catch (err) {
      console.log('Camera not available:', err.message);
    }
  };

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
  };

  const joinCall = async () => {
    await startCamera();
    setInCall(true);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  const endCall = () => {
    stopCamera();
    setInCall(false);
    clearInterval(timerRef.current);
    setTimer(0);
  };

  const toggleCam = () => {
    if (stream) stream.getVideoTracks().forEach(t => { t.enabled = !camOn; });
    setCamOn(v => !v);
  };

  const toggleMic = () => {
    if (stream) stream.getAudioTracks().forEach(t => { t.enabled = !micOn; });
    setMicOn(v => !v);
  };

  useEffect(() => () => { stopCamera(); clearInterval(timerRef.current); }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChat(prev => [...prev, { text: chatInput, sender: 'Doctor', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  return (
    <Layout title="Video Consultation">
      {!inCall ? (
        /* Pre-call Lobby */
        <div className="max-w-2xl mx-auto text-center py-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-[40px]">video_call</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Start Video Consultation</h2>
            <p className="text-sm text-muted-foreground mb-2">Room ID: <span className="text-foreground font-mono text-xs">{roomId}</span></p>
            <p className="text-xs text-muted-foreground/80 mb-8">Share this room ID with your patient to join the call</p>

            {/* Camera Preview */}
            <div className="aspect-video bg-card border border-border rounded-2xl overflow-hidden mb-6 relative">
              <video ref={localVideo} autoPlay muted playsInline className="w-full h-full object-cover" />
              {!stream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                  <span className="material-symbols-outlined text-[48px] mb-2">videocam</span>
                  <p className="text-sm">Camera preview will appear here</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={startCamera} className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground border border-border rounded-xl hover:bg-secondary transition-colors">
                <span className="material-symbols-outlined text-[18px]">videocam</span>Test Camera
              </button>
              <button onClick={joinCall}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors shadow-[0_0_24px_rgba(var(--primary),0.3)]">
                <span className="material-symbols-outlined text-[18px]">call</span>Join Consultation
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Active Call */
        <div className="flex gap-4 h-[calc(100vh-9rem)]">
          {/* Left Panel */}
          <div className="w-64 flex-shrink-0 bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient Info</h3>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">P</div>
              <div>
                <p className="text-sm font-medium text-foreground">Patient</p>
                <p className="text-xs text-muted-foreground">ID: {patientParam || 'Walk-in'}</p>
              </div>
            </div>
            <Link to={`/case-study/${patientParam || 'unknown'}`} target="_blank"
              className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 p-3 bg-primary/10 rounded-xl border border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[16px]">article</span>Open Case Study
            </Link>
            {/* Quick Notes */}
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-2">Quick Notes</p>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type notes during call..."
                className="w-full h-40 bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 resize-none" />
            </div>
          </div>

          {/* Main Video Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Timer */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-mono text-foreground">{formatTime(timer)}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{roomId}</p>
            </div>

            {/* Video Grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {/* Remote (Patient) */}
              <div className="bg-card border border-border rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-muted-foreground/50">
                  <span className="material-symbols-outlined text-[48px] mb-2 block">person</span>
                  <p className="text-xs">Waiting for patient...</p>
                </div>
                <span className="absolute bottom-3 left-3 text-xs text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">Patient</span>
              </div>
              {/* Local (Doctor) */}
              <div className="bg-background border border-border rounded-2xl overflow-hidden relative">
                <video ref={localVideo} autoPlay muted playsInline className="w-full h-full object-cover" />
                {!camOn && (
                  <div className="absolute inset-0 bg-background flex items-center justify-center">
                    <span className="material-symbols-outlined text-muted-foreground/50 text-[48px]">videocam_off</span>
                  </div>
                )}
                <span className="absolute bottom-3 left-3 text-xs text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">You (Doctor)</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button onClick={toggleMic}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-secondary text-foreground hover:bg-secondary/80' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                <span className="material-symbols-outlined text-[22px]">{micOn ? 'mic' : 'mic_off'}</span>
              </button>
              <button onClick={endCall} className="w-14 h-14 rounded-full bg-destructive hover:bg-destructive/90 text-white flex items-center justify-center transition-colors shadow-[0_0_24px_rgba(var(--destructive),0.4)]">
                <span className="material-symbols-outlined text-[24px]">call_end</span>
              </button>
              <button onClick={toggleCam}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${camOn ? 'bg-secondary text-foreground hover:bg-secondary/80' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                <span className="material-symbols-outlined text-[22px]">{camOn ? 'videocam' : 'videocam_off'}</span>
              </button>
            </div>
          </div>

          {/* Right Panel – Chat */}
          <div className="w-64 flex-shrink-0 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-xs font-medium text-muted-foreground">Consultation Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chat.length === 0 && <p className="text-xs text-muted-foreground text-center mt-4">Chat will appear here</p>}
              {chat.map((msg, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <p className="text-[10px] text-muted-foreground">{msg.sender} · {msg.time}</p>
                  <div className="bg-primary/10 border border-primary/10 rounded-xl px-3 py-2">
                    <p className="text-xs text-foreground">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendChat} className="p-3 border-t border-border flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..."
                className="flex-1 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50" />
              <button type="submit" className="p-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors">
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
