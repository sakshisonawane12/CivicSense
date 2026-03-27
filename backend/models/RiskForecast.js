const mongoose = require('mongoose');

const riskForecastSchema = new mongoose.Schema({
  location: { type: String, required: true },
  category: { type: String, required: true },
  risk_score: { type: Number, min: 0, max: 1, required: true }, // 0–1 for ML friendliness
  horizon_hours: { type: Number, default: 24 },
  reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RiskForecast', riskForecastSchema);

