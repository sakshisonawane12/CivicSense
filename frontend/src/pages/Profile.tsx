import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rewards';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [rewardStats, setRewardStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData) { navigate('/login'); return; }
    setUser(JSON.parse(userData));

    if (token) {
      axios.get(`${API_URL}/my-stats`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setRewardStats(r.data.stats))
        .catch(() => {});
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (!user) return null;

  const getLevelInfo = (points: number) => {
    if (points >= 500) return { level: 'Legend', color: '#ffd700', emoji: '👑', next: null };
    if (points >= 200) return { level: 'Champion', color: '#a855f7', emoji: '🏆', next: 500 };
    if (points >= 100) return { level: 'Hero', color: '#3b82f6', emoji: '🦸', next: 200 };
    if (points >= 50) return { level: 'Active', color: '#10b981', emoji: '⚡', next: 100 };
    return { level: 'Newcomer', color: '#6b7280', emoji: '🌱', next: 50 };
  };

  const points = rewardStats?.points || 0;
  const levelInfo = getLevelInfo(points);
  const progress = levelInfo.next ? Math.min((points / levelInfo.next) * 100, 100) : 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      {/* Header Card */}
      <div style={{
        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
        borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 'bold', color: 'white'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{user.name}</h1>
              <p style={{ margin: '0.25rem 0', opacity: 0.7 }}>{user.email}</p>
              <span style={{
                background: user.role === 'department' ? '#3b82f6' : '#10b981',
                padding: '2px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'
              }}>
                {user.role === 'department' ? '🏢 Department' : '👤 Citizen'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', background: '#ef4444', color: 'white',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Rewards Section - Citizens Only */}
      {user.role === 'citizen' && rewardStats && (
        <>
          {/* Level & Points */}
          <div style={{
            background: `linear-gradient(135deg, ${levelInfo.color}22, ${levelInfo.color}44)`,
            border: `2px solid ${levelInfo.color}`,
            borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.875rem' }}>Current Level</p>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>{levelInfo.emoji} {levelInfo.level}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.875rem' }}>Total Points</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', color: levelInfo.color }}>{points}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.875rem' }}>Rank</p>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>#{rewardStats.rank}</h2>
              </div>
            </div>

            {levelInfo.next && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem', opacity: 0.8 }}>
                  <span>{points} pts</span>
                  <span>{levelInfo.next} pts to next level</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', height: '10px' }}>
                  <div style={{
                    background: levelInfo.color, borderRadius: '10px',
                    height: '100%', width: `${progress}%`, transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Complaints', value: rewardStats.complaints_count, emoji: '📝', color: '#667eea' },
              { label: 'Resolved', value: rewardStats.resolved_count, emoji: '✅', color: '#10b981' },
              { label: 'Badges', value: rewardStats.badges?.length || 0, emoji: '🏅', color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem',
                textAlign: 'center', border: `1px solid ${s.color}44`
              }}>
                <p style={{ fontSize: '2rem', margin: 0 }}>{s.emoji}</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: s.color, margin: '0.25rem 0' }}>{s.value}</p>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.875rem' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🏅 Badges</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {rewardStats.allBadges?.map((badge: any) => (
                <div key={badge.id} style={{
                  background: badge.earned ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '12px', padding: '1rem', textAlign: 'center',
                  border: badge.earned ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  opacity: badge.earned ? 1 : 0.4,
                  transition: 'all 0.3s'
                }}>
                  <p style={{ fontSize: '2rem', margin: 0 }}>{badge.emoji}</p>
                  <p style={{ fontWeight: 'bold', margin: '0.25rem 0', fontSize: '0.875rem' }}>{badge.name}</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>{badge.description}</p>
                  <p style={{ fontSize: '0.75rem', color: '#ffd700', margin: '0.25rem 0 0' }}>+{badge.points} pts</p>
                  {badge.earned && <p style={{ fontSize: '0.7rem', color: '#10b981', margin: 0 }}>✅ Earned</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <button onClick={() => navigate('/submit')} style={{
              padding: '1rem', background: '#667eea', color: 'white',
              border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
            }}>📝 Submit Complaint</button>
            <button onClick={() => navigate('/my-complaints')} style={{
              padding: '1rem', background: '#10b981', color: 'white',
              border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
            }}>📋 My Complaints</button>
            <button onClick={() => navigate('/leaderboard')} style={{
              padding: '1rem', background: '#f59e0b', color: 'white',
              border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
            }}>🏆 Leaderboard</button>
          </div>
        </>
      )}

      {/* Department Profile */}
      {user.role === 'department' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { icon: <User size={24} />, label: 'Name', value: user.name, color: '#667eea' },
            { icon: <Mail size={24} />, label: 'Email', value: user.email, color: '#10b981' },
            { icon: <Shield size={24} />, label: 'Role', value: 'Department Official', color: '#f59e0b' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem',
              display: 'flex', alignItems: 'center', gap: '1rem'
            }}>
              <div style={{ color: item.color }}>{item.icon}</div>
              <div>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.875rem' }}>{item.label}</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{item.value}</p>
              </div>
            </div>
          ))}
          <button onClick={() => navigate('/dashboard')} style={{
            padding: '1rem', background: '#667eea', color: 'white',
            border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
          }}>📊 Go to Dashboard</button>
        </div>
      )}
    </div>
  );
}
