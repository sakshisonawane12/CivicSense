const pool = require('../config/db');

const BADGES = {
  FIRST_REPORT: { id: 'first_report', name: 'First Reporter', emoji: '🌟', description: 'Submitted your first complaint', points: 10 },
  ACTIVE_CITIZEN: { id: 'active_citizen', name: 'Active Citizen', emoji: '🏅', description: 'Submitted 5 complaints', points: 25 },
  HOTSPOT_HERO: { id: 'hotspot_hero', name: 'Hotspot Hero', emoji: '🔥', description: 'Submitted 10 complaints', points: 50 },
  COMMUNITY_CHAMPION: { id: 'community_champion', name: 'Community Champion', emoji: '🏆', description: 'Submitted 25 complaints', points: 100 },
  RESOLUTION_STAR: { id: 'resolution_star', name: 'Resolution Star', emoji: '⭐', description: 'Had 3 complaints resolved', points: 30 },
  SAFETY_GUARDIAN: { id: 'safety_guardian', name: 'Safety Guardian', emoji: '🛡️', description: 'Reported a Safety issue', points: 15 },
  ECO_WARRIOR: { id: 'eco_warrior', name: 'Eco Warrior', emoji: '♻️', description: 'Reported a Sanitation issue', points: 15 },
  INFRASTRUCTURE_WATCH: { id: 'infrastructure_watch', name: 'Infrastructure Watch', emoji: '🏗️', description: 'Reported an Infrastructure issue', points: 15 },
};

async function checkAndAwardBadges(userId, pool) {
  const result = await pool.query(
    'SELECT points, badges, complaints_count, resolved_count FROM users WHERE id = $1',
    [userId]
  );
  if (!result.rows.length) return;

  const user = result.rows[0];
  const currentBadges = user.badges || [];
  const newBadges = [...currentBadges];
  let bonusPoints = 0;

  const complaintsResult = await pool.query(
    'SELECT category FROM complaints WHERE user_id = $1',
    [userId]
  );
  const categories = complaintsResult.rows.map(r => r.category);

  const badgeChecks = [
    { badge: BADGES.FIRST_REPORT, condition: user.complaints_count >= 1 },
    { badge: BADGES.ACTIVE_CITIZEN, condition: user.complaints_count >= 5 },
    { badge: BADGES.HOTSPOT_HERO, condition: user.complaints_count >= 10 },
    { badge: BADGES.COMMUNITY_CHAMPION, condition: user.complaints_count >= 25 },
    { badge: BADGES.RESOLUTION_STAR, condition: user.resolved_count >= 3 },
    { badge: BADGES.SAFETY_GUARDIAN, condition: categories.includes('Safety') },
    { badge: BADGES.ECO_WARRIOR, condition: categories.includes('Sanitation') },
    { badge: BADGES.INFRASTRUCTURE_WATCH, condition: categories.includes('Infrastructure') },
  ];

  for (const { badge, condition } of badgeChecks) {
    if (condition && !newBadges.includes(badge.id)) {
      newBadges.push(badge.id);
      bonusPoints += badge.points;
    }
  }

  if (newBadges.length !== currentBadges.length || bonusPoints > 0) {
    await pool.query(
      'UPDATE users SET badges = $1, points = points + $2 WHERE id = $3',
      [newBadges, bonusPoints, userId]
    );
  }

  return newBadges.filter(b => !currentBadges.includes(b));
}

exports.awardComplaintPoints = async (userId) => {
  if (!userId) return;
  try {
    await pool.query(
      'UPDATE users SET points = points + 10, complaints_count = complaints_count + 1 WHERE id = $1',
      [userId]
    );
    await checkAndAwardBadges(userId, pool);
  } catch (error) {
    console.error('Award points error:', error);
  }
};

exports.awardResolutionPoints = async (userId) => {
  if (!userId) return;
  try {
    await pool.query(
      'UPDATE users SET points = points + 20, resolved_count = resolved_count + 1 WHERE id = $1',
      [userId]
    );
    await checkAndAwardBadges(userId, pool);
  } catch (error) {
    console.error('Award resolution points error:', error);
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, points, badges, complaints_count, resolved_count 
       FROM users WHERE role = 'citizen' 
       ORDER BY points DESC LIMIT 10`
    );
    res.json({ success: true, leaderboard: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, points, badges, complaints_count, resolved_count FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];

    const badgeDetails = (user.badges || []).map(id =>
      Object.values(BADGES).find(b => b.id === id)
    ).filter(Boolean);

    const allBadges = Object.values(BADGES).map(b => ({
      ...b,
      earned: (user.badges || []).includes(b.id)
    }));

    res.json({
      success: true,
      stats: {
        points: user.points,
        complaints_count: user.complaints_count,
        resolved_count: user.resolved_count,
        badges: badgeDetails,
        allBadges,
        rank: await getUserRank(user.id, user.points)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

async function getUserRank(userId, points) {
  const result = await pool.query(
    "SELECT COUNT(*) as rank FROM users WHERE role = 'citizen' AND points > $1",
    [points]
  );
  return parseInt(result.rows[0].rank) + 1;
}

exports.BADGES = BADGES;
