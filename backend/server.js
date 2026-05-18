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

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);

// Configure dynamic CORS allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server or postman/curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Access blocked by CORS policy'));
    }
  },
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// 1. HTTP Security Hardening (Helmet)
app.use(helmet());

// 2. Rate Limiting Configurations
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 auth requests per 15 minutes
  message: { message: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 3. Parser & Standard Middlewares
app.use(cors(corsOptions));
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
