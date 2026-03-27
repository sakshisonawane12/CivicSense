const { GoogleGenerativeAI } = require("@google/generative-ai");
const Complaint = require('../models/Complaint');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const URGENCY_KEYWORDS = [
  "accident", "fire", "blocked", "emergency", "urgent",
  "danger", "critical", "immediate", "help", "death", "injury",
];

async function classifyComplaint(text) {
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
    const result = await Complaint.find({
      location: newComplaint.location,
      category: newComplaint.category,
      status: { $ne: 'Resolved' },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
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

module.exports = {
  classifyComplaint,
  analyzeSentiment,
  translateText,
  detectDuplicates,
};
