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
        .catch(() => { });
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
    <div className="cs-main" style={{ paddingBottom: '5rem' }}>
      <section className="cs-section" style={{ maxWidth: '800px', margin: '0 auto', borderTop: 'none', paddingTop: '3rem' }}>
        {/* Header Card */}
        <div className="cs-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--indigo-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 'bold', color: 'var(--indigo)'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="cs-h1" style={{ margin: 0, fontSize: '1.75rem', marginBottom: '0.25rem' }}>{user.name}</h1>
              <p style={{ margin: 0, color: 'var(--ink3)', fontFamily: 'var(--sans)' }}>{user.email}</p>
              <span style={{
                background: user.role === 'department' ? 'var(--indigo-light)' : 'var(--teal-light)',
                color: user.role === 'department' ? 'var(--indigo)' : 'var(--teal)',
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                display: 'inline-block', marginTop: '0.75rem'
              }}>
                {user.role === 'department' ? '🏢 Department Official' : '👤 Citizen'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem', background: 'var(--coral-light)', color: 'var(--coral)',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: 'opacity 0.2s'
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Rewards Section - Citizens Only */}
        {user.role === 'citizen' && rewardStats && (
          <>
            {/* Level & Points */}
            <div className="cs-card" style={{
              border: `2px solid ${levelInfo.color}`,
              background: `linear-gradient(to right, #ffffff, var(--cream))`,
              padding: '2.5rem', marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <p className="cs-eyebrow" style={{ color: 'var(--ink3)' }}>Current Level</p>
                  <h2 className="cs-h1" style={{ margin: 0, fontSize: '2.2rem' }}>{levelInfo.emoji} {levelInfo.level}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="cs-eyebrow" style={{ color: 'var(--ink3)' }}>Total Points</p>
                  <h2 className="cs-h1" style={{ margin: 0, fontSize: '2.5rem', color: levelInfo.color }}>{points}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="cs-eyebrow" style={{ color: 'var(--ink3)' }}>Rank</p>
                  <h2 className="cs-h1" style={{ margin: 0, fontSize: '2.2rem' }}>#{rewardStats.rank}</h2>
                </div>
              </div>

              {levelInfo.next && (
                <div>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--ink3)', fontWeight: 600 }}>
                    <span>{points} pts</span>
                    <span>{levelInfo.next} pts to next level</span>
                  </div>
                  <div style={{ background: 'var(--border2)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
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
                { label: 'Complaints', value: rewardStats.complaints_count, emoji: '📝', color: 'var(--indigo)' },
                { label: 'Resolved', value: rewardStats.resolved_count, emoji: '✅', color: 'var(--teal)' },
                { label: 'Badges', value: rewardStats.badges?.length || 0, emoji: '🏅', color: 'var(--amber)' },
              ].map((s, i) => (
                <div key={i} className="cs-card" style={{
                  padding: '1.5rem', textAlign: 'center', borderTop: `4px solid ${s.color}`
                }}>
                  <p style={{ fontSize: '2rem', margin: 0 }}>{s.emoji}</p>
                  <p className="cs-h1" style={{ fontSize: '2rem', color: s.color, margin: '0.5rem 0' }}>{s.value}</p>
                  <p style={{ margin: 0, color: 'var(--ink3)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="cs-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 className="cs-h1" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🏅 Earned Badges</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {rewardStats.allBadges?.map((badge: any) => (
                  <div key={badge.id} style={{
                    background: badge.earned ? 'var(--cream)' : 'var(--cream2)',
                    borderRadius: '12px', padding: '1.25rem', textAlign: 'center',
                    border: '1px solid var(--border)',
                    opacity: badge.earned ? 1 : 0.5,
                    transition: 'all 0.3s'
                  }}>
                    <p style={{ fontSize: '2rem', margin: 0 }}>{badge.emoji}</p>
                    <p style={{ fontWeight: 700, margin: '0.5rem 0 0.25rem', fontSize: '0.95rem', color: 'var(--ink)' }}>{badge.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ink3)', margin: 0 }}>{badge.description}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--amber)', margin: '0.5rem 0 0', fontWeight: 700 }}>+{badge.points} pts</p>
                    {badge.earned && <p style={{ fontSize: '0.75rem', color: 'var(--teal)', margin: '0.5rem 0 0', fontWeight: 600 }}>✅ Earned</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <button onClick={() => navigate('/submit')} style={{
                padding: '1rem', background: 'var(--indigo)', color: 'white',
                border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', transition: 'transform 0.2s'
              }}>📝 Submit Complaint</button>
              <button onClick={() => navigate('/my-complaints')} style={{
                padding: '1rem', background: 'var(--teal)', color: 'white',
                border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', transition: 'transform 0.2s'
              }}>📋 My Complaints</button>
              <button onClick={() => navigate('/leaderboard')} style={{
                padding: '1rem', background: 'var(--amber)', color: 'white',
                border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', transition: 'transform 0.2s'
              }}>🏆 Leaderboard</button>
            </div>
          </>
        )}

        {/* Department Profile */}
        {user.role === 'department' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { icon: <User size={24} />, label: 'Name', value: user.name, color: 'var(--indigo)' },
              { icon: <Mail size={24} />, label: 'Email', value: user.email, color: 'var(--teal)' },
              { icon: <Shield size={24} />, label: 'Role', value: 'Department Official', color: 'var(--amber)' },
            ].map((item, i) => (
              <div key={i} className="cs-card" style={{
                padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem'
              }}>
                <div style={{ color: item.color, background: `var(--cream)`, padding: '1rem', borderRadius: '12px' }}>{item.icon}</div>
                <div>
                  <p className="cs-eyebrow" style={{ margin: 0, color: 'var(--ink3)' }}>{item.label}</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>{item.value}</p>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/dashboard')} style={{
              padding: '1rem', background: 'var(--indigo)', color: 'white',
              border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '1.05rem', marginTop: '1rem', transition: 'transform 0.2s'
            }}>📊 Go to Dashboard</button>
          </div>
        )}
      </section>
    </div>
  );
}
