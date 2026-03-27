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

  // TruthScore (evidence-based authenticity)
  truth_score: { type: Number, min: 0, max: 1, default: 0.5 },
  evidence_flags: [{ type: String }],
  is_suspected_spam: { type: Boolean, default: false },

  // Outcome Optimizer (recommended next action)
  recommended_department: { type: String },
  recommended_priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  recommended_sla_hours: { type: Number }, // suggested resolution time target
  recommendation_reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);