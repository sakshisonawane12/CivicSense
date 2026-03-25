const pool = require('../config/db');
const { classifyComplaint, analyzeSentiment, translateText, detectDuplicates } = require('../services/aiService');
const { awardComplaintPoints, awardResolutionPoints } = require('./rewardsController');

const DEPARTMENT_MAP = {
  'Sanitation': 'Sanitation Department',
  'Infrastructure': 'Public Works Department',
  'Safety': 'Police Department'
};

exports.createComplaint = async (req, res) => {
  try {
    const { citizen_name, citizen_phone, complaint_text, location, language = 'en' } = req.body;
    const userId = req.user?.id || null;
    
    console.log('Received complaint:', { citizen_name, citizen_phone, complaint_text, location, language });

    let translatedText = complaint_text;
    if (language !== 'en') {
      translatedText = await translateText(complaint_text, 'en');
    }

    console.log('Classifying complaint...');
    const category = await classifyComplaint(translatedText);
    console.log('Category:', category);

    console.log('Analyzing sentiment...');
    const sentiment = await analyzeSentiment(translatedText);
    console.log('Sentiment:', sentiment);

    const department = DEPARTMENT_MAP[category] || 'Public Works Department';

    const newComplaint = {
      complaint_text: translatedText,
      category,
      location
    };

    console.log('Checking duplicates...');
    const duplicateId = await detectDuplicates(pool, newComplaint);

    console.log('Inserting into database...');
    const result = await pool.query(
      `INSERT INTO complaints 
       (citizen_name, citizen_phone, complaint_text, category, priority, sentiment_score, 
        urgency_keywords, department, location, language, duplicate_group_id, image_url, audio_url, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING *`,
      [
        citizen_name, citizen_phone, translatedText, category, sentiment.priority,
        sentiment.sentiment, sentiment.urgency_words, department, location, language,
        duplicateId, req.files?.image?.[0]?.filename || null, req.files?.audio?.[0]?.filename || null, userId
      ]
    );

    await updateHotspots(location, category);
    if (userId) await awardComplaintPoints(userId);

    console.log('Complaint created successfully');
    res.status(201).json({
      success: true,
      complaint: result.rows[0],
      isDuplicate: !!duplicateId
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { department, priority, status } = req.query;
    let query = 'SELECT * FROM complaints WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (department) {
      query += ` AND department = $${paramCount}`;
      params.push(department);
      paramCount++;
    }
    if (priority) {
      query += ` AND priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }
    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, complaints: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE complaints SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (status === 'resolved' && result.rows[0]?.user_id) {
      await awardResolutionPoints(result.rows[0].user_id);
    }

    res.json({ success: true, complaint: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getHotspots = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT location, category, COUNT(*) as complaint_count 
       FROM complaints 
       WHERE created_at > NOW() - INTERVAL '30 days' 
       GROUP BY location, category 
       HAVING COUNT(*) >= 3 
       ORDER BY complaint_count DESC 
       LIMIT 10`
    );
    res.json({ success: true, hotspots: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE priority = 'High') as high_priority,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved
      FROM complaints
    `);

    const categoryStats = await pool.query(`
      SELECT category, COUNT(*) as count 
      FROM complaints 
      GROUP BY category
    `);

    res.json({
      success: true,
      stats: stats.rows[0],
      categoryBreakdown: categoryStats.rows
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

    let query, params;
    if (id) {
      query = 'SELECT * FROM complaints WHERE id = $1';
      params = [id];
    } else {
      query = 'SELECT * FROM complaints WHERE citizen_phone = $1 ORDER BY created_at DESC';
      params = [phone];
    }

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No complaints found' });
    }

    res.json({ success: true, complaints: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, complaints: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyComplaintsByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    const result = await pool.query(
      'SELECT * FROM complaints WHERE citizen_phone = $1 ORDER BY created_at DESC',
      [phone]
    );
    res.json({ success: true, complaints: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

async function updateHotspots(location, category) {
  try {
    const existing = await pool.query(
      'SELECT * FROM hotspots WHERE location = $1 AND category = $2',
      [location, category]
    );
    
    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE hotspots SET complaint_count = complaint_count + 1, last_updated = CURRENT_TIMESTAMP WHERE location = $1 AND category = $2',
        [location, category]
      );
    } else {
      await pool.query(
        'INSERT INTO hotspots (location, category, complaint_count) VALUES ($1, $2, 1)',
        [location, category]
      );
    }
  } catch (error) {
    console.error('Hotspot update error:', error);
  }
}

module.exports = exports;
