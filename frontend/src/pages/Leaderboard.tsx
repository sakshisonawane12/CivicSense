import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Activity, Hexagon, ShieldCheck } from 'lucide-react';

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



  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.2rem', gap: '0.75rem', fontFamily: 'Outfit' }}>
      <Activity className="animate-spin" /> Compiling Trust Scores...
    </div>
  );

  return (
    <div className="cs-main" style={{ paddingBottom: '5rem' }}>
      <section className="cs-section" style={{ maxWidth: '800px', margin: '0 auto', borderTop: 'none', paddingTop: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Trophy size={36} color="var(--amber)" />
            <h1 className="cs-h1" style={{ fontSize: '2.5rem', margin: 0 }}>
              Citizen Trust Network
            </h1>
          </div>
          <p style={{ color: 'var(--ink2)', margin: 0, fontSize: '1.1rem', fontFamily: 'var(--sans)' }}>Top contributors to the Self-Healing City</p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="cs-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <Hexagon size={64} color="var(--amber)" style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--ink)' }}>Data stream empty</p>
            <p style={{ color: 'var(--ink3)', fontFamily: 'var(--sans)' }}>Initiate a scan report to establish the first trust baseline.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leaderboard.map((citizen, index) => (
              <div key={citizen._id} className="cs-card" style={{
                borderRadius: '20px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
                border: index === 0 ? '2px solid var(--amber)' : '1px solid var(--border)',
                background: index === 0 ? 'var(--cream)' : '#fff',
                position: 'relative', overflow: 'hidden'
              }}>
                {/* Rank */}
                <div style={{ fontSize: index < 3 ? '2.5rem' : '1.5rem', fontWeight: 800, minWidth: '60px', textAlign: 'center', fontFamily: 'var(--serif)', color: 'var(--ink)' }}>
                  {getRankEmoji(index)}
                </div>

                {/* Avatar */}
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, flexShrink: 0, border: '1px solid var(--border)', fontFamily: 'var(--serif)', color: 'var(--ink)' }}>
                  {citizen.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0, fontFamily: 'var(--sans)', color: 'var(--ink)' }}>{citizen.name}</p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--ink2)', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Activity size={14} /> {citizen.complaints_count} reports</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--teal)' }}><ShieldCheck size={14} /> {citizen.resolved_count} verified</span>
                  </div>
                  {/* Badges */}
                  {citizen.badges?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      {citizen.badges.slice(0, 4).map((badge: string) => (
                        <span key={badge} style={{ background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--ink2)' }}>
                          {getBadgeEmoji(badge)} {getBadgeName(badge)}
                        </span>
                      ))}
                      {citizen.badges.length > 4 && (
                        <span style={{ background: 'var(--cream2)', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink3)' }}>
                          +{citizen.badges.length - 4} logic trees
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Points */}
                <div style={{ textAlign: 'right', flexShrink: 0, background: 'var(--cream2)', padding: '1rem', borderRadius: '16px', minWidth: '120px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, fontFamily: 'var(--sans)', lineHeight: 1, color: 'var(--ink)' }}>{citizen.points}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ink3)', margin: '0.25rem 0 0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Trust Score</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Points Guide */}
        <div className="cs-card" style={{ padding: '2rem', marginTop: '3rem' }}>
          <h3 className="cs-panel-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--teal)" /> Algorithm Calibration Guide
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', fontFamily: 'var(--sans)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--cream)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--ink2)', fontWeight: 600 }}>Initiate Report Matrix</span><span style={{ fontWeight: 800, color: 'var(--amber)' }}>+10 pts</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--cream)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--ink2)', fontWeight: 600 }}>Anomaly Resolved</span><span style={{ fontWeight: 800, color: 'var(--amber)' }}>+20 pts</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--cream)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--ink2)', fontWeight: 600 }}>First Node Activation</span><span style={{ fontWeight: 800, color: 'var(--amber)' }}>+10 pts bonus</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--cream)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--ink2)', fontWeight: 600 }}>5 Nodes Logged</span><span style={{ fontWeight: 800, color: 'var(--amber)' }}>+25 pts bonus</span>
            </div>
          </div>
        </div>
      </section>
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
