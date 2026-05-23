const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const { authenticateToken } = require('../middleware/auth');

// ─────────────────────────────────────────────
//  Resilient mock data — used when DB is offline
// ─────────────────────────────────────────────
let mockBooks = [
  {
    _id: 'mock-book-1',
    title: 'Organon of Medicine',
    filename: 'organon.pdf',
    path: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
    cloudinary_id: null,
    mimetype: 'application/pdf',
    size: 2048576,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'mock-book-2',
    title: 'Pocket Manual of Homoeopathic Materia Medica',
    filename: 'boericke.pdf',
    path: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
    cloudinary_id: null,
    mimetype: 'application/pdf',
    size: 4096000,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// ─────────────────────────────────────────────
//  Cloudinary multer storage — persistent cloud
// ─────────────────────────────────────────────
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

let upload;

if (isCloudinaryConfigured) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
      folder: 'homeopathway/books',
      resource_type: 'raw',          // raw = non-image files (PDFs, docs, etc.)
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
      format: undefined,             // keep original extension
    }),
  });
  upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  });
} else {
  // Fallback: memory storage (no actual file saving — mock mode)
  upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
}

// ─────────────────────────────────────────────
//  GET /api/books — list / search
// ─────────────────────────────────────────────
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search = '' } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...mockBooks];
      if (search) filtered = filtered.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));
      return res.json(filtered);
    }

    const query = { doctorId: req.user.id };
    if (search) query.title = { $regex: search, $options: 'i' };

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────
//  POST /api/books/upload — upload file
// ─────────────────────────────────────────────
router.post('/upload', authenticateToken, upload.single('bookFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title } = req.body;

    // Determine the public URL for this file
    let fileUrl;
    let cloudinaryId = null;

    if (isCloudinaryConfigured && req.file.path) {
      // Cloudinary upload succeeded — req.file.path is the secure Cloudinary URL
      fileUrl = req.file.path;
      cloudinaryId = req.file.filename; // multer-storage-cloudinary sets this
    } else {
      // Fallback mock response
      fileUrl = '#';
    }

    // DB offline fallback
    if (mongoose.connection.readyState !== 1) {
      const newBook = {
        _id: `mock-book-${Date.now()}`,
        title: title || req.file.originalname,
        filename: req.file.originalname,
        path: fileUrl,
        cloudinary_id: cloudinaryId,
        mimetype: req.file.mimetype || 'application/octet-stream',
        size: req.file.size || 0,
        createdAt: new Date().toISOString(),
      };
      mockBooks.unshift(newBook);
      return res.status(201).json(newBook);
    }

    const book = await Book.create({
      title: title || req.file.originalname,
      filename: req.file.originalname,
      path: fileUrl,
      cloudinary_id: cloudinaryId,
      mimetype: req.file.mimetype || 'application/octet-stream',
      size: req.file.size || 0,
      doctorId: req.user.id,
    });

    res.status(201).json(book);
  } catch (err) {
    console.error('Book upload error:', err);
    res.status(400).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/books/:id — rename
// ─────────────────────────────────────────────
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

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

// ─────────────────────────────────────────────
//  DELETE /api/books/:id — delete book + cloud file
// ─────────────────────────────────────────────
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockBooks.findIndex(b => b._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Book not found' });
      mockBooks.splice(idx, 1);
      return res.json({ message: 'Book deleted successfully' });
    }

    const book = await Book.findOneAndDelete({ _id: req.params.id, doctorId: req.user.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Delete from Cloudinary if we have the public_id
    if (book.cloudinary_id && isCloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(book.cloudinary_id, { resource_type: 'raw' });
      } catch (cloudErr) {
        console.warn('Cloudinary delete warning:', cloudErr.message);
      }
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
