const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'admin', 'officer', 'department'], default: 'citizen' },
  department_name: { type: String },
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  complaints_count: { type: Number, default: 0 },
  resolved_count: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);