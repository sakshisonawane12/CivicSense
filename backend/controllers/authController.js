const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "civicsense2_secret_key_2026";

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashedPassword, role: role || "citizen" });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};
