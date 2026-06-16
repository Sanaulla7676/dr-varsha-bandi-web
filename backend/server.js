require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const visitRoutes = require('./routes/visits');
const appointmentRoutes = require('./routes/appointments');
const dashboardRoutes = require('./routes/dashboard');
const googleRoutes = require('./routes/google');
const bookRoutes = require('./routes/books');
const publicRoutes = require('./routes/public');

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
    // Allow all origins for the public API to avoid CORS blocks in different environments
    // or you can restrict it to the specific allowedOrigins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      // For public website traffic, we are more permissive
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Static files for book uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Serve the public website (Dr. Varsha Bandi landing page) ───
// Accessible at: http://localhost:5000/site/
app.use('/site', express.static(path.join(__dirname, '..', 'public-site')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/public', publicRoutes);

// Health check
// Health check with DB status
app.get('/api/health', (req, res) => {
  const dbStatus = require('mongoose').connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'ok', 
    database: dbStatus,
    time: new Date() 
  });
});

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

  // Patient requests video consultation
  socket.on('patient-request-consultation', (data) => {
    const notification = {
      id: `req-${Date.now()}`,
      type: 'appointment',
      title: 'Video Consultation Requested',
      message: `${data.name || 'A patient'} is requesting a video consultation right now.`,
      time: 'Just now',
      read: false,
      priority: 'high',
      actionText: 'Open Consultations',
      actionLink: '/appointments'
    };
    // Broadcast to all connected clients (mainly the doctor's dashboard)
    io.emit('new-notification', notification);
    console.log(`Notification sent: Consultation request from ${data.name || 'patient'}`);
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

// Triggering production build...
