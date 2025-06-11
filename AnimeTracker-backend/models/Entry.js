const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mal_id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  description: {
    type: String
  },
  total_chapters: {
    type: Number
  },
  chapters_read: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['reading', 'completed', 'dropped', 'plan to read'],
    default: 'reading'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

entrySchema.index({ user: 1, mal_id: 1 }, { unique: true });

module.exports = mongoose.model('Entry', entrySchema);
