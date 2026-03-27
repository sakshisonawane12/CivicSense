const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema({
  location: { type: String, required: true },
  category: { type: String, required: true },
  complaint_count: { type: Number, default: 1 },
  last_updated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Hotspot', hotspotSchema);