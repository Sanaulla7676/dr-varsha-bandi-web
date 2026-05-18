import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JitsiMeeting } from '@jitsi/react-sdk';
import Layout from '../components/Layout';
import { useAuthStore } from '../store';

export default function VideoConsultation() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room') || `hp-room-${Date.now()}`;
  const patientParam = searchParams.get('patient');
  const { doctor } = useAuthStore();

  const [inCall, setInCall] = useState(false);
  const [notes, setNotes] = useState('');

  const joinCall = () => {
    setInCall(true);
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
            <div className="flex flex-col items-center gap-2 mb-6">
              <p className="text-sm text-muted-foreground">Room ID: <span className="text-foreground font-mono text-xs">{roomId}</span></p>
              <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs">
                <span className="text-muted-foreground truncate max-w-[250px]">{window.location.origin}/video-consultation?room={roomId}</span>
                <button onClick={() => { 
                  navigator.clipboard.writeText(`${window.location.origin}/video-consultation?room=${roomId}`); 
                  alert('Link copied! Share this with your patient.'); 
                }}
                className="text-primary hover:text-primary/80 flex items-center" title="Copy Link">
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground/80">Share this link with your patient to join the call</p>
            </div>

            <div className="flex gap-3 justify-center mt-8">
              <button onClick={joinCall}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-3 text-sm font-medium transition-colors shadow-[0_0_24px_rgba(var(--primary),0.3)]">
                <span className="material-symbols-outlined text-[18px]">call</span> Start Consultation
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Active Call */
        <div className="flex gap-4 h-[calc(100vh-9rem)]">
          {/* Left Panel - Clinic Tools */}
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
            <div className="flex-1 mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Quick Notes</p>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type clinical notes during call..."
                className="w-full h-full min-h-[200px] bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 resize-none" />
            </div>
          </div>

          {/* Main Video Area (Jitsi Embed) */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-border bg-black relative">
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={`homeopathway-${roomId}`}
              configOverwrite={{
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                disableModeratorIndicator: true,
                startScreenSharing: false,
                enableEmailInStats: false,
                prejoinPageEnabled: false, // Skip prejoin since we have our own lobby
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                SHOW_CHROME_EXTENSION_BANNER: false,
              }}
              userInfo={{
                displayName: doctor ? `Dr. ${doctor.lastName || doctor.name}` : 'Doctor'
              }}
              getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
              onReadyToClose={() => setInCall(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
