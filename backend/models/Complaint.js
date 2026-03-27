const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  citizen_name: { type: String, required: true },
  citizen_phone: { type: String, required: true },
  complaint_text: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  image_url: { type: String },
  audio_url: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);