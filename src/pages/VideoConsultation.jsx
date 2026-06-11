import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { io } from 'socket.io-client';
import Layout from '../components/Layout';
import { useAuthStore } from '../store';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function VideoConsultation() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room') || `hp-room-${Date.now()}`;
  const patientParam = searchParams.get('patient');
  const { doctor } = useAuthStore();

  const [inCall, setInCall] = useState(false);
  const [notes, setNotes] = useState(() => localStorage.getItem(`notes-${roomId}`) || '');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'chat'
  
  // Chat state
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(`chat-${roomId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [chatInput, setChatInput] = useState('');
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (inCall) {
      socketRef.current = io(SOCKET_URL);
      
      const displayName = doctor?.name || 'Doctor';

      socketRef.current.emit('join-room', { 
        roomId: `homeopathway-${roomId}`, 
        userId: displayName, 
        role: 'Doctor' 
      });

      socketRef.current.on('chat-message', (data) => {
        setMessages(prev => {
          const updated = [...prev, data];
          localStorage.setItem(`chat-${roomId}`, JSON.stringify(updated));
          return updated;
        });
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [inCall, roomId, doctor]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const joinCall = () => {
    setInCall(true);
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`notes-${roomId}`, notes);
    alert('Notes saved locally!');
  };

  const handleDownloadNotes = () => {
    const element = document.createElement("a");
    const file = new Blob([notes], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Consultation-Notes-${roomId}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const displayName = doctor?.name || 'Doctor';
    const msgData = {
      roomId: `homeopathway-${roomId}`,
      message: chatInput,
      sender: displayName
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit('chat-message', msgData);
    } else {
      // Offline fallback: echo message locally
      const localMsg = { message: chatInput, sender: displayName, time: new Date() };
      setMessages(prev => {
        const updated = [...prev, localMsg];
        localStorage.setItem(`chat-${roomId}`, JSON.stringify(updated));
        return updated;
      });
    }
    setChatInput('');
  };

  const handleSaveChat = () => {
    localStorage.setItem(`chat-${roomId}`, JSON.stringify(messages));
    alert('Chat history saved locally!');
  };

  const handleDownloadChat = () => {
    const formattedChat = messages.map(msg => `[${msg.sender || 'Unknown'}]: ${msg.message}`).join('\n');
    const element = document.createElement("a");
    const file = new Blob([formattedChat], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Consultation-Chat-${roomId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          <div className="w-80 flex-shrink-0 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm">
            
            {/* Tabs */}
            <div className="flex border-b border-border bg-secondary/30">
              <button 
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'notes' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:bg-secondary/50'}`}
              >
                <span className="material-symbols-outlined text-[16px] align-middle mr-1">edit_note</span>
                Quick Notes
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:bg-secondary/50'}`}
              >
                <span className="material-symbols-outlined text-[16px] align-middle mr-1">chat</span>
                Live Chat
              </button>
            </div>

            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {activeTab === 'notes' ? (
                /* Notes Tab */
                <div className="flex flex-col h-full gap-3">
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl mb-2 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">P</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Patient</p>
                      <p className="text-xs text-muted-foreground">ID: {patientParam || 'Walk-in'}</p>
                    </div>
                  </div>
                  <Link to={`/case-study/${patientParam || 'unknown'}`} target="_blank"
                    className="flex justify-center items-center gap-2 text-xs text-primary hover:text-primary/80 p-2.5 bg-primary/10 rounded-xl border border-primary/20 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">article</span>Open Case Study
                  </Link>
                  <div className="flex-1 flex flex-col mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Draft Notes</p>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type clinical notes during call..."
                      className="flex-1 w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none transition-all" />
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleSaveNotes} className="flex-1 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors border border-primary/20 flex justify-center items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">save</span> Save
                      </button>
                      <button onClick={handleDownloadNotes} className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-xs font-medium transition-colors border border-border flex justify-center items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">download</span> Download
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Tab */
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2 scrollbar-thin">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                        <p className="text-xs text-muted-foreground">No messages yet.<br/>Send a message to start chatting.</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const displayName = doctor?.name || 'Doctor';
                        const isMe = msg.sender === displayName;
                        return (
                          <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-muted-foreground mb-1 ml-1">{msg.sender}</span>
                            <div className={`px-3 py-2 rounded-xl text-xs max-w-[90%] break-words ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm' : 'bg-secondary text-foreground rounded-tl-sm shadow-sm border border-border/50'}`}>
                              {msg.message}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  {messages.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      <button type="button" onClick={handleSaveChat} className="flex-1 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors border border-primary/20 flex justify-center items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">save</span> Save Chat
                      </button>
                      <button type="button" onClick={handleDownloadChat} className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-xs font-medium transition-colors border border-border flex justify-center items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">download</span> Download Chat
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    <button type="submit" disabled={!chatInput.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl p-2.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all">
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Main Video Area (Jitsi Embed) */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-border bg-black relative shadow-sm">
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={`homeopathway-${roomId}`}
              configOverwrite={{
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                disableModeratorIndicator: true,
                startScreenSharing: false,
                enableEmailInStats: false,
                prejoinPageEnabled: false,
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                SHOW_CHROME_EXTENSION_BANNER: false,
              }}
              userInfo={{
                displayName: doctor?.name || 'Doctor'
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
