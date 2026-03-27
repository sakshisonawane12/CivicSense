const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/rewards", require("./routes/rewardsRoutes"));

const { testGemini } = require('./controllers/testController');
app.get('/api/test-gemini', testGemini);

app.get("/", (req, res) => {
  res.json({ message: "civicsense2 API Running" });
});

app.get("/api/test", async (req, res) => {
  try {
    // TODO: Replace with MongoDB connection check
    res.json({ success: true, message: "Database connected" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
