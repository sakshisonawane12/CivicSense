const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getHotspots,
  getDashboardStats,
  trackComplaint,
  getUserComplaints
} = require('../controllers/complaintController');
const { verifyToken } = require('../controllers/authController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'civicsense_secret_key_2026';
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // Token invalid, continue without user
    }
  }
  next();
};

router.post('/', optionalAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), createComplaint);
router.get('/', getAllComplaints);
router.get('/track', trackComplaint);
router.get('/my-complaints', verifyToken, getUserComplaints);
router.patch('/:id/status', updateComplaintStatus);
router.get('/hotspots', getHotspots);
router.get('/stats', getDashboardStats);

module.exports = router;
