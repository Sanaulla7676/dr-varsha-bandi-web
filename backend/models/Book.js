const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  filename: {
    type: String,
    required: true,
  },
  // path now stores the full Cloudinary URL (or local path as fallback)
  path: {
    type: String,
    required: true,
  },
  // cloudinary_id stores the public_id for deletion
  cloudinary_id: {
    type: String,
    default: null,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Book', bookSchema);
