const {
  classifyComplaint,
  analyzeSentiment,
  translateText,
  detectDuplicates,
  computeTruthScore,
  recommendAction,
  generateRiskForecasts,
} = require('../services/aiService');
const { awardComplaintPoints, awardResolutionPoints } = require('./rewardsController');
const Complaint = require('../models/Complaint');
const Hotspot = require('../models/Hotspot');

const DEPARTMENT_MAP = {
  'Sanitation': 'Sanitation Department',
  'Infrastructure': 'Public Works Department',
  'Safety': 'Police Department'
};

exports.createComplaint = async (req, res) => {
  try {
    const { citizen_name, citizen_phone, complaint_text, location, language = 'en' } = req.body;
    const userId = req.user?.id || null;
    const imageFile = req.files?.image?.[0];
    const audioFile = req.files?.audio?.[0];
    let translatedText = complaint_text;
    if (language !== 'en') {
      translatedText = await translateText(complaint_text, 'en');
    }
    const category = await classifyComplaint(translatedText);
    const sentiment = await analyzeSentiment(translatedText);
    const department = DEPARTMENT_MAP[category] || 'Public Works Department';

    // TruthScore (authenticity) based on evidence and patterns
    const truth = await computeTruthScore({
      text: translatedText,
      citizen_phone,
      hasMedia: !!(imageFile || audioFile),
      location,
    });

    // Outcome Optimizer: recommended department / priority / SLA
    const recommendation = await recommendAction({
      category,
      sentimentPriority: sentiment.priority,
      location,
      text: translatedText,
      hasMedia: !!(imageFile || audioFile),
    });

    const complaint = await Complaint.create({
      citizen_name,
      citizen_phone,
      complaint_text: translatedText,
      location,
      category,
      status: 'Pending',
      user_id: userId,
      image_url: imageFile ? imageFile.path : undefined,
      audio_url: audioFile ? audioFile.path : undefined,
      truth_score: truth.truth_score,
      evidence_flags: truth.evidence_flags,
      is_suspected_spam: truth.is_suspected_spam,
      recommended_department: recommendation.recommended_department,
      recommended_priority: recommendation.recommended_priority,
      recommended_sla_hours: recommendation.recommended_sla_hours,
      recommendation_reason: recommendation.recommendation_reason,
    });
    await updateHotspots(location, category);
    await awardComplaintPoints(userId);
    res.status(201).json({
      success: true,
      complaint,
      ai_meta: {
        truth_score: truth.truth_score,
        evidence_flags: truth.evidence_flags,
        is_suspected_spam: truth.is_suspected_spam,
        recommended_department: recommendation.recommended_department,
        recommended_priority: recommendation.recommended_priority,
        recommended_sla_hours: recommendation.recommended_sla_hours,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Digital Twin / Early Warning – near-term risk forecasts per location
exports.getFutureHotspots = async (req, res) => {
  try {
    const horizon = req.query.horizon_hours
      ? parseInt(req.query.horizon_hours, 10)
      : 24;
    const forecasts = await generateRiskForecasts({ horizon_hours: horizon });
    res.json({ success: true, forecasts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { status, priority, department } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (department) filter.category = department;
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    if (status === 'Resolved' && complaint.user_id) {
      await awardResolutionPoints(complaint.user_id);
    }
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getHotspots = async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const hotspots = await Complaint.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { location: "$location", category: "$category" }, complaint_count: { $sum: 1 } } },
      { $match: { complaint_count: { $gte: 3 } } },
      { $sort: { complaint_count: -1 } },
      { $limit: 10 },
      { $project: { location: "$_id.location", category: "$_id.category", complaint_count: 1, _id: 0 } }
    ]);
    res.json({ success: true, hotspots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const high_priority = await Complaint.countDocuments({ priority: 'High' });
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const categoryBreakdown = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } }
    ]);
    res.json({
      success: true,
      stats: { total, high_priority, pending, resolved },
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.trackComplaint = async (req, res) => {
  try {
    const { id, phone } = req.query;
    if (!id && !phone) {
      return res.status(400).json({ success: false, error: 'Provide complaint ID or phone number' });
    }
    let complaints;
    if (id) {
      const complaint = await Complaint.findById(id);
      if (!complaint) {
        return res.status(404).json({ success: false, error: 'No complaints found' });
      }
      complaints = [complaint];
    } else {
      complaints = await Complaint.find({ citizen_phone: phone }).sort({ createdAt: -1 });
      if (!complaints.length) {
        return res.status(404).json({ success: false, error: 'No complaints found' });
      }
    }
    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaints = await Complaint.find({ user_id: userId }).sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyComplaintsByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    const complaints = await Complaint.find({ citizen_phone: phone }).sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

async function updateHotspots(location, category) {
  try {
    const existing = await Hotspot.findOne({ location, category });
    if (existing) {
      existing.complaint_count += 1;
      existing.last_updated = new Date();
      await existing.save();
    } else {
      await Hotspot.create({ location, category, complaint_count: 1 });
    }
  } catch (error) {
    console.error('Hotspot update error:', error);
  }
}

module.exports = exports;
