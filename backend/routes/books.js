const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const { authenticateToken } = require('../middleware/auth');

// Resilient mock data storage if MongoDB is not running locally
let mockBooks = [
  {
    _id: "mock-book-1",
    title: "Organon of Medicine",
    filename: "organon.pdf",
    path: "/uploads/books/organon.pdf",
    mimetype: "application/pdf",
    size: 2048576,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
  },
  {
    _id: "mock-book-2",
    title: "Pocket Manual of Homoeopathic Materia Medica",
    filename: "boericke.pdf",
    path: "/uploads/books/boericke.pdf",
    mimetype: "application/pdf",
    size: 4096000,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  }
];

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/books');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET /api/books
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search = '' } = req.query;

    // Resilient fallback: If database is disconnected, use mock list
    if (mongoose.connection.readyState !== 1) {
      let filtered = [...mockBooks];
      if (search) {
        filtered = filtered.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));
      }
      return res.json(filtered);
    }

    const query = { doctorId: req.user.id };
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books/upload
router.post('/upload', authenticateToken, upload.single('bookFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title } = req.body;

    // Resilient fallback: If database is disconnected, push to mock list
    if (mongoose.connection.readyState !== 1) {
      const newBook = {
        _id: `mock-book-${Date.now()}`,
        title: title || req.file.originalname,
        filename: req.file.filename,
        path: `/uploads/books/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
        createdAt: new Date().toISOString()
      };
      mockBooks.unshift(newBook);
      return res.status(201).json(newBook);
    }
    
    const book = await Book.create({
      title: title || req.file.originalname,
      filename: req.file.filename,
      path: `/uploads/books/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      doctorId: req.user.id
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/books/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    // Resilient fallback: If database is disconnected, update mock list
    if (mongoose.connection.readyState !== 1) {
      const idx = mockBooks.findIndex(b => b._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Book not found' });
      mockBooks[idx].title = title;
      return res.json(mockBooks[idx]);
    }

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user.id },
      { title },
      { new: true }
    );
    
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/books/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Resilient fallback: If database is disconnected, delete from mock list
    if (mongoose.connection.readyState !== 1) {
      const idx = mockBooks.findIndex(b => b._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Book not found' });
      
      const book = mockBooks[idx];
      const filePath = path.join(__dirname, '..', book.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      mockBooks.splice(idx, 1);
      return res.json({ message: 'Book deleted successfully' });
    }

    const book = await Book.findOneAndDelete({ _id: req.params.id, doctorId: req.user.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    // Attempt to delete file
    const filePath = path.join(__dirname, '..', book.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
