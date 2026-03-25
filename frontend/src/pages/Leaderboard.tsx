import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rewards';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/leaderboard`)
      .then(r => {
        console.log('Leaderboard data:', r.data);
        setLeaderboard(r.data.leaderboard || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const getRankStyle = (index: number) => {
    if (index === 0) return { background: 'linear-gradient(135deg, #ffd700, #ffb300)', color: '#333' };
    if (index === 1) return { background: 'linear-gradient(135deg, #c0c0c0, #9e9e9e)', color: '#333' };
    if (index === 2) return { background: 'linear-gradient(135deg, #cd7f32, #a0522d)', color: 'white' };
    return { background: 'rgba(255,255,255,0.1)', color: 'white' };
  };

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '4rem' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆 Leaderboard</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
        Top civic contributors in Pune
      </p>

      {leaderboard.length === 0 ? (
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '3rem' }}>
          <p style={{ fontSize: '3rem' }}>🏅</p>
          <p>No citizens yet. Be the first to submit a complaint!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leaderboard.map((citizen, index) => (
            <div key={citizen.id} style={{
              ...getRankStyle(index),
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: index < 3 ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
              transform: index === 0 ? 'scale(1.02)' : 'scale(1)',
            }}>
              {/* Rank */}
              <div style={{ fontSize: index < 3 ? '2rem' : '1.5rem', fontWeight: 'bold', minWidth: '50px', textAlign: 'center' }}>
                {getRankEmoji(index)}
              </div>

              {/* Avatar */}
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0
              }}>
                {citizen.name?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>{citizen.name}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.875rem', opacity: 0.8 }}>
                  <span>📝 {citizen.complaints_count} complaints</span>
                  <span>✅ {citizen.resolved_count} resolved</span>
                </div>
                {/* Badges */}
                {citizen.badges?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {citizen.badges.slice(0, 4).map((badge: string) => (
                      <span key={badge} style={{
                        background: 'rgba(255,255,255,0.2)', borderRadius: '20px',
                        padding: '2px 8px', fontSize: '0.75rem'
                      }}>
                        {getBadgeEmoji(badge)} {getBadgeName(badge)}
                      </span>
                    ))}
                    {citizen.badges.length > 4 && (
                      <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '2px 8px', fontSize: '0.75rem' }}>
                        +{citizen.badges.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Points */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{citizen.points}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Points Guide */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>💡 How to Earn Points</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
          <span>📝 Submit complaint → +10 pts</span>
          <span>✅ Complaint resolved → +20 pts</span>
          <span>🌟 First complaint → +10 pts bonus</span>
          <span>🏅 5 complaints → +25 pts bonus</span>
          <span>🔥 10 complaints → +50 pts bonus</span>
          <span>⭐ 3 resolved → +30 pts bonus</span>
        </div>
      </div>
    </div>
  );
}

function getBadgeEmoji(badgeId: string): string {
  const map: Record<string, string> = {
    first_report: '🌟', active_citizen: '🏅', hotspot_hero: '🔥',
    community_champion: '🏆', resolution_star: '⭐', safety_guardian: '🛡️',
    eco_warrior: '♻️', infrastructure_watch: '🏗️'
  };
  return map[badgeId] || '🎖️';
}

function getBadgeName(badgeId: string): string {
  const map: Record<string, string> = {
    first_report: 'First Reporter', active_citizen: 'Active Citizen', hotspot_hero: 'Hotspot Hero',
    community_champion: 'Champion', resolution_star: 'Resolution Star', safety_guardian: 'Safety Guardian',
    eco_warrior: 'Eco Warrior', infrastructure_watch: 'Infra Watch'
  };
  return map[badgeId] || badgeId;
}
