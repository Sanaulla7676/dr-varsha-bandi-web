const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const Patient = require('../models/Patient');
const { authenticateToken, auditLog } = require('../middleware/auth');

// GET /api/visits?patientId=xxx - get all visits for a patient
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.query;
    const query = { doctorId: req.user.id };
    if (patientId) query.patientId = patientId;

    const visits = await Visit.find(query).populate('patientId', 'firstName lastName patientId').sort({ visitDate: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/visits/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id).populate('patientId');
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    res.json(visit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/visits - create new visit/case study
router.post('/', authenticateToken, async (req, res) => {
  try {
    const visit = await Visit.create({ ...req.body, doctorId: req.user.id });
    // Update patient's lastVisitDate
    await Patient.findByIdAndUpdate(req.body.patientId, { lastVisitDate: new Date() });
    res.status(201).json(visit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/visits/:id - auto-save case study
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastSavedAt: new Date() },
      { new: true }
    );
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    res.json(visit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/visits/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Visit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Visit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
