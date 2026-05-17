const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { authenticateToken, auditLog } = require('../middleware/auth');

// GET /api/patients - list with search + pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20, status } = req.query;
    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ patients, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patients/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/patients
router.post('/', authenticateToken, auditLog('Patient Created', 'Patient'), async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, doctorId: req.user.id });
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/patients/:id
router.put('/:id', authenticateToken, auditLog('Patient Updated', 'Patient'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/patients/:id (soft delete)
router.delete('/:id', authenticateToken, auditLog('Patient Deleted', 'Patient'), async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() });
    res.json({ message: 'Patient archived successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
