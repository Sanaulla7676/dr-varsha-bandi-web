require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const visitRoutes = require('./routes/visits');
const appointmentRoutes = require('./routes/appointments');
const dashboardRoutes = require('./routes/dashboard');
const googleRoutes = require('./routes/google');

// Background Services
const { initializeWhatsApp } = require('./services/whatsapp');
const { initializeCronJobs } = require('./services/cronJobs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:5174'], methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/google', googleRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ========================================
// SOCKET.IO - WebRTC Video Signaling
// ========================================
const rooms = {};

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Doctor or patient joins a room
  socket.on('join-room', ({ roomId, userId, role }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push({ socketId: socket.id, userId, role });

    // Notify others in the room
    socket.to(roomId).emit('user-joined', { socketId: socket.id, userId, role });
    console.log(`${role} ${userId} joined room ${roomId}`);
  });

  // WebRTC Offer
  socket.on('offer', ({ roomId, offer, to }) => {
    socket.to(to).emit('offer', { offer, from: socket.id });
  });

  // WebRTC Answer
  socket.on('answer', ({ roomId, answer, to }) => {
    socket.to(to).emit('answer', { answer, from: socket.id });
  });

  // ICE Candidate exchange
  socket.on('ice-candidate', ({ candidate, to }) => {
    socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
  });

  // Chat message during consultation
  socket.on('chat-message', ({ roomId, message, sender }) => {
    io.to(roomId).emit('chat-message', { message, sender, time: new Date() });
  });

  // Disconnect
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(u => u.socketId !== socket.id);
      socket.to(roomId).emit('user-left', { socketId: socket.id });
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Homeopathway Backend running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket signaling server active`);
  
  // Initialize Background Services for Automated Follow-ups
  console.log(`\n🤖 Starting background services...`);
  initializeWhatsApp();
  initializeCronJobs();

  console.log(`\n📋 Test Credentials:`);
  console.log(`   Email: doctor@homeopathway.com`);
  console.log(`   Password: doctor123\n`);
});
