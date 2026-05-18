const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const ACCESS_SECRET = process.env.JWT_SECRET || 'homeopathway-super-secret-jwt-key-2024';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'homeopathway-super-secret-refresh-key-2024';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Fallback mock user if no MongoDB
  console.log('Login attempt:', email, 'readyState:', require('mongoose').connection.readyState);
  if (require('mongoose').connection.readyState !== 1) {
    if (email === 'doctor@homeopathway.com' && password === 'doctor123') {
      console.log('Mock login successful');
      const token = jwt.sign({ id: '000000000000000000000000', name: 'Dr. Varsha Bandi', email }, ACCESS_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: '000000000000000000000000', name: 'Dr. Varsha Bandi', email }, REFRESH_SECRET, { expiresIn: '7d' });
      return res.json({ 
        success: true, 
        token, 
        refreshToken,
        doctor: { id: '000000000000000000000000', name: 'Dr. Varsha Bandi', email, clinicName: 'Homeopathway Clinic' } 
      });
    }
    console.log('Mock login failed: invalid credentials');
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(401).json({ success: false, message: 'No account found with this email' });

    const isMatch = await doctor.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password' });

    const token = jwt.sign({ id: doctor._id, name: doctor.name, email: doctor.email }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: doctor._id, name: doctor.name, email: doctor.email }, REFRESH_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      refreshToken,
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email, clinicName: doctor.clinicName, profilePhoto: doctor.profilePhoto }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    
    // Generate new Access and Refresh tokens
    const newToken = jwt.sign({ id: decoded.id, name: decoded.name, email: decoded.email }, ACCESS_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ id: decoded.id, name: decoded.name, email: decoded.email }, REFRESH_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

// POST /api/auth/register (First setup)
router.post('/register', async (req, res) => {
  const { name, email, password, clinicName } = req.body;
  try {
    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Account already exists' });
    const doctor = await Doctor.create({ name, email, password, clinicName });
    res.status(201).json({ success: true, message: 'Doctor account created', doctorId: doctor._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('-password');
    if (!doctor) return res.json({ id: 'mock-id', name: 'Dr. Varsha Bandi', email: req.user.email, clinicName: 'Homeopathway Clinic' });
    res.json(doctor);
  } catch (err) {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
});

module.exports = router;
