const express = require('express');
const router = express.Router();
const { getAuthUrl, getTokensFromCode } = require('../services/googleCalendar');
const Doctor = require('../models/Doctor');
const { authenticateToken } = require('../middleware/auth');

// GET /api/google/auth-url - Get the consent URL
router.get('/auth-url', authenticateToken, (req, res) => {
  try {
    const url = getAuthUrl(req.user.id);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/google/callback - Handle OAuth callback
router.get('/callback', async (req, res) => {
  const { code, state } = req.query; // state can carry doctor ID if needed, or use session
  try {
    const tokens = await getTokensFromCode(code);
    
    // In a real app, you'd match the 'state' to a doctor. 
    // For this demo, we'll update the main doctor (assuming one doctor for now or using a query param)
    // Ideally, the doctor initiates this from the dashboard and we store their ID in state.
    const doctorId = state; 
    if (doctorId) {
      await Doctor.findByIdAndUpdate(doctorId, { googleTokens: tokens });
      res.send('<html><body style="background:#0F1017;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;"><div><h1 style="color:#818CF8">Authentication Successful!</h1><p>You can now close this window and return to the dashboard.</p><script>setTimeout(() => window.close(), 3000)</script></div></body></html>');
    } else {
      res.status(400).send('Doctor ID missing in callback state');
    }
  } catch (err) {
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

module.exports = router;
