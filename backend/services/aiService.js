const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const URGENCY_KEYWORDS = [
  "accident",
  "fire",
  "blocked",
  "emergency",
  "urgent",
  "danger",
  "critical",
  "immediate",
  "help",
  "death",
  "injury",
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
    const prompt = `Analyze this complaint for sentiment and urgency. Respond with JSON only:\n{"sentiment": <number between -1 and 1>, "priority": "<High/Medium/Low>", "urgency_words": ["word1", "word2"]}\n\nComplaint: ${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid response");
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    const lowerText = text.toLowerCase();
    const foundUrgent = URGENCY_KEYWORDS.filter((kw) => lowerText.includes(kw));
    return {
      sentiment: 0,
      priority: foundUrgent.length > 0 ? "High" : "Medium",
      urgency_words: foundUrgent,
    };
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

async function detectDuplicates(pool, newComplaint) {
  try {
    const result = await pool.query(
      `SELECT id, complaint_text, location FROM complaints 
       WHERE category = $1 AND location = $2 AND status != 'resolved' 
       AND created_at > NOW() - INTERVAL '7 days'`,
      [newComplaint.category, newComplaint.location],
    );

    for (let existing of result.rows) {
      const similarity = calculateSimilarity(
        newComplaint.complaint_text,
        existing.complaint_text,
      );
      if (similarity > 0.7) {
        return existing.id;
      }
    }
  } catch (error) {
    console.error("Duplicate detection error:", error);
  }
  return null;
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
