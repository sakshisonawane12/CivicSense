const User = require('../models/User');
const Complaint = require('../models/Complaint');

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

async function checkAndAwardBadges(userId) {
  const user = await User.findById(userId);
  if (!user) return;
  const currentBadges = user.badges || [];
  const newBadges = [...currentBadges];
  let bonusPoints = 0;
  const complaints = await Complaint.find({ user_id: userId });
  const categories = complaints.map(c => c.category);
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
    await User.findByIdAndUpdate(userId, { badges: newBadges, $inc: { points: bonusPoints } });
  }
  return newBadges.filter(b => !currentBadges.includes(b));
}

exports.awardComplaintPoints = async (userId) => {
  if (!userId) return;
  try {
    await User.findByIdAndUpdate(userId, { $inc: { points: 10, complaints_count: 1 } });
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error('Award points error:', error);
  }
};

exports.awardResolutionPoints = async (userId) => {
  if (!userId) return;
  try {
    await User.findByIdAndUpdate(userId, { $inc: { points: 20, resolved_count: 1 } });
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error('Award resolution points error:', error);
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'citizen' })
      .sort({ points: -1, resolved_count: -1, complaints_count: -1 })
      .limit(10);
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const badgeDetails = (user.badges || []).map(id =>
      Object.values(BADGES).find(b => b.id === id)
    ).filter(Boolean);
    const allBadges = Object.values(BADGES).map(b => ({
      ...b,
      earned: (user.badges || []).includes(b.id)
    }));
    const rank = await getUserRank(user._id, user.points);
    res.json({
      success: true,
      stats: {
        points: user.points,
        complaints_count: user.complaints_count,
        resolved_count: user.resolved_count,
        badges: badgeDetails,
        allBadges,
        rank
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

async function getUserRank(userId, points) {
  const rank = await User.countDocuments({ role: 'citizen', points: { $gt: points } });
  return rank + 1;
}

exports.BADGES = BADGES;
