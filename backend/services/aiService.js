const { GoogleGenerativeAI } = require("@google/generative-ai");
const Complaint = require('../models/Complaint');
const Hotspot = require('../models/Hotspot');
const RiskForecast = require('../models/RiskForecast');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL; // e.g. http://localhost:8001

async function tryMlService(path, payload) {
  if (!ML_SERVICE_URL) return null;
  try {
    const res = await axios.post(`${ML_SERVICE_URL}${path}`, payload, { timeout: 1200 });
    return res.data;
  } catch {
    return null;
  }
}

const URGENCY_KEYWORDS = [
  "accident", "fire", "blocked", "emergency", "urgent",
  "danger", "critical", "immediate", "help", "death", "injury",
];

async function classifyComplaint(text) {
  const ml = await tryMlService('/predict/category', { text });
  if (ml?.category) return ml.category;

  try {
    const prompt = `Classify this complaint into exactly one category: Sanitation, Infrastructure, or Safety. Respond with only the category name.\n\nComplaint: ${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();

    if (responseText.includes("Sanitation")) return "Sanitation";
    if (responseText.includes("Infrastructure")) return "Infrastructure";
    if (responseText.includes("Safety")) return "Safety";
    return "Infrastructure";
  } catch (error) {
    console.error("Classification error:", error);
    return "Infrastructure";
  }
}

async function analyzeSentiment(text) {
  try {
    const lowerText = text.toLowerCase();
    const foundUrgent = URGENCY_KEYWORDS.filter((kw) => lowerText.includes(kw));
    return {
      sentiment: foundUrgent.length > 0 ? -1 : 0,
      priority: foundUrgent.length > 0 ? "High" : "Medium",
      urgency_words: foundUrgent,
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return { sentiment: 0, priority: "Medium", urgency_words: [] };
  }
}

async function translateText(text, targetLang = "en") {
  if (targetLang === "en") return text;
  try {
    const prompt = `Translate this text to English. Respond with only the translation:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

async function detectDuplicates(newComplaint) {
  try {
    const query = {
      location: newComplaint.location,
      status: { $ne: 'Resolved' },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    };
    if (newComplaint.category) {
      query.category = newComplaint.category;
    }
    const result = await Complaint.find(query);
    return result;
  } catch (error) {
    console.error("Duplicate detection error:", error);
    return null;
  }
}

function calculateSimilarity(str1, str2) {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  return intersection.size / Math.max(set1.size, set2.size);
}

/**
 * TruthScore: compute an authenticity score (0–1) based on simple,
 * explainable signals we have locally. This can later be upgraded to
 * a learned model without changing the API.
 */
async function computeTruthScore({ text, citizen_phone, hasMedia, location }) {
  const evidence_flags = [];

  // 1. Text quality / length
  if (text && text.length > 40) {
    evidence_flags.push('detailed_text');
  }

  // 2. Media presence
  if (hasMedia) {
    evidence_flags.push('has_supporting_media');
  }

  // 3. Duplicate / cluster check in same area
  let clusterSupport = 0;
  let loccatCount = 0;
  try {
    // count complaints from same location in last 7 days (cluster corroboration)
    const similar = await detectDuplicates({ location });
    if (similar && similar.length > 0) {
      loccatCount = similar.length;
      clusterSupport = Math.min(similar.length / 5, 1); // capped
      evidence_flags.push('clustered_with_similar_cases');
    }
  } catch {
    // ignore for robustness
  }

  // 4. Reporter frequency (too many complaints in short time looks spammy)
  let reporterPenalty = 0;
  let reporterCount = 0;
  try {
    const since = new Date();
    since.setDate(since.getDate() - 2);
    reporterCount = await Complaint.countDocuments({
      citizen_phone,
      createdAt: { $gte: since },
    });
    if (reporterCount > 5) {
      reporterPenalty = 0.3;
      evidence_flags.push('high_frequency_reporter');
    }
  } catch {
    // ignore
  }

  // Base prior
  let score = 0.6;
  if (evidence_flags.includes('detailed_text')) score += 0.15;
  if (evidence_flags.includes('has_supporting_media')) score += 0.15;
  score += 0.2 * clusterSupport;
  score -= reporterPenalty;

  score = Math.max(0, Math.min(1, score));
  const is_suspected_spam = score < 0.35;

  // If we have a trained ML truth model, let it override the heuristic.
  const hour = new Date().getHours();
  const dow = new Date().getDay();
  const ml = await tryMlService('/predict/truth', {
    text_len: (text || '').length,
    has_media: hasMedia ? 1 : 0,
    hour,
    dow,
    phone_2d_count: reporterCount,
    loccat_count: loccatCount,
  });
  if (typeof ml?.truth_score === 'number') {
    const mlScore = Math.max(0, Math.min(1, ml.truth_score));
    // If ML returns a degenerate 0/1 due to poor training data, fall back to heuristic.
    if (mlScore > 0.01 && mlScore < 0.99) {
      return { truth_score: mlScore, evidence_flags, is_suspected_spam: mlScore < 0.35 };
    }
  }

  return { truth_score: score, evidence_flags, is_suspected_spam };
}

/**
 * Outcome Optimizer: choose recommended department / priority / SLA.
 * For now this is a rules+analytics hybrid; later this can be replaced
 * by a learned model (bandits / RL) while keeping the same interface.
 */
async function recommendAction({ category, sentimentPriority, location, text = '', hasMedia = false }) {
  const deptMap = {
    Sanitation: 'Sanitation Department',
    Infrastructure: 'Public Works Department',
    Safety: 'Police Department',
  };

  const recommended_department = deptMap[category] || 'Public Works Department';

  // Prioritize Safety + urgent words higher than others
  let recommended_priority = sentimentPriority || 'Medium';
  if (category === 'Safety' && recommended_priority !== 'High') {
    recommended_priority = 'High';
  }

  // Simple SLA heuristic in hours
  let baseSla = 48;
  if (category === 'Safety') baseSla = 4;
  else if (category === 'Sanitation') baseSla = 24;

  if (recommended_priority === 'High') baseSla = Math.max(2, baseSla / 3);
  if (recommended_priority === 'Low') baseSla = baseSla * 1.5;

  // If we have a trained ML SLA model, use it (optimized, data-driven)
  // We approximate cat_id/loc_id using stable maps derived at runtime.
  // If ML service is present but SLA model missing, service returns default.
  let mlSla = null;
  try {
    const catIdMap = { Sanitation: 0, Infrastructure: 1, Safety: 2 };
    const cat_id = catIdMap[category] ?? 1;
    const rawLocId = Math.abs(
      (location || '')
        .split('')
        .reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0),
    );
    // ML service expects loc_id <= 200000
    const loc_id = rawLocId % 200000;
    const now = new Date();
    const ml = await tryMlService('/predict/sla', {
      cat_id,
      loc_id,
      hour: now.getHours(),
      dow: now.getDay(),
      text_len: Math.min(5000, (text || '').length),
      has_media: hasMedia ? 1 : 0,
    });
    if (typeof ml?.sla_hours === 'number') {
      mlSla = ml.sla_hours;
    }
  } catch {
    // ignore
  }

  // Try to adjust using past resolution times per category
  let historicalNote = '';
  try {
    const agg = await Complaint.aggregate([
      { $match: { category, status: 'Resolved' } },
      {
        $project: {
          category: 1,
          resolution_hours: {
            $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 1000 * 60 * 60],
          },
        },
      },
      {
        $group: {
          _id: '$category',
          avg_resolution_hours: { $avg: '$resolution_hours' },
        },
      },
    ]);

    if (agg && agg.length > 0) {
      const avg = agg[0].avg_resolution_hours;
      // Pull SLA a bit below average to push system to improve
      baseSla = Math.max(1, Math.min(baseSla, avg * 0.8));
      historicalNote = `Historical avg resolution ~${avg.toFixed(
        1,
      )}h, targeting faster closure.`;
    }
  } catch {
    // fall back to heuristic SLA
  }

  const reasonParts = [
    `Category mapped to ${recommended_department}`,
    `Priority set to ${recommended_priority}`,
  ];
  if (location) reasonParts.push(`Location ${location} has existing complaint load considered.`);
  if (historicalNote) reasonParts.push(historicalNote);

  const recommended_sla_hours = Math.round(
    typeof mlSla === 'number' ? Math.max(1, Math.min(24 * 30, mlSla)) : baseSla,
  );
  const recommendation_reason = reasonParts.join(' ');

  return {
    recommended_department,
    recommended_priority,
    recommended_sla_hours,
    recommendation_reason,
  };
}

/**
 * Digital Twin / Early Warning:
 * Generate near-term risk forecasts per (location, category) using
 * existing Hotspot / Complaint data. This is a first version that
 * can later be upgraded to a true ML spatio-temporal model.
 */
async function generateRiskForecasts({ horizon_hours = 24 } = {}) {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const aggregates = await Complaint.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { location: '$location', category: '$category' },
        count: { $sum: 1 },
        last_created: { $max: '$createdAt' },
      },
    },
    { $match: { count: { $gte: 2 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const forecasts = [];

  for (const row of aggregates) {
    const location = row._id.location;
    const category = row._id.category;
    const count = row.count;

    // Basic risk: more recent + more volume = higher risk
    const hoursSinceLast =
      (Date.now() - new Date(row.last_created).getTime()) / (1000 * 60 * 60);
    const recencyFactor = Math.max(0, 1 - hoursSinceLast / 72); // fade over 3 days
    const volumeFactor = Math.min(count / 5, 1);
    const safetyBoost = category === 'Safety' ? 0.15 : 0;

    let risk = 0.3 + 0.4 * volumeFactor + 0.3 * recencyFactor + safetyBoost;
    risk = Math.max(0, Math.min(1, risk));

    const reason = `Recent ${category.toLowerCase()} complaints (${count}) with last report ${hoursSinceLast.toFixed(
      1,
    )}h ago.`;

    forecasts.push({
      location,
      category,
      risk_score: risk,
      horizon_hours,
      reason,
    });
  }

  // Persist latest snapshot (optional, but helpful for analytics)
  try {
    await RiskForecast.deleteMany({}); // keep only the latest run for now
    if (forecasts.length) {
      await RiskForecast.insertMany(forecasts);
    }
  } catch (err) {
    console.error('Risk forecast persistence error:', err);
  }

  return forecasts;
}

module.exports = {
  classifyComplaint,
  analyzeSentiment,
  translateText,
  detectDuplicates,
  computeTruthScore,
  recommendAction,
  generateRiskForecasts,
};
