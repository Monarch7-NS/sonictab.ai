const mongoose = require('mongoose');

const TabSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  tuning: {
    type: String,
    default: 'Standard E'
  },
  bpm: {
    type: String,
    default: 'N/A'
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tab', TabSchema);
