const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.testGemini = async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      success: true, 
      message: "Gemini API is working!", 
      response: text,
      model: "gemini-pro"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.toString()
    });
  }
};
