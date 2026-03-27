import { useNavigate } from 'react-router-dom';
import { Users, Building2, Shield, TrendingUp, Zap } from 'lucide-react';

const S = {
  page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
  container: { maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '4rem 2rem', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' } as React.CSSProperties,
  left: { flex: '1 1 400px' } as React.CSSProperties,
  right: { flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' } as React.CSSProperties,
  badge: { display: 'inline-block', background: 'var(--indigo-light)', border: '1px solid rgba(55,48,163,0.15)', borderRadius: '50px', padding: '0.5rem 1.25rem', fontSize: '0.85rem', color: 'var(--indigo)', marginBottom: '1.5rem', fontWeight: 700, fontFamily: 'var(--sans)', letterSpacing: '0.05em', textTransform: 'uppercase' } as React.CSSProperties,
  title: { fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 800, margin: '0 0 1rem', color: 'var(--ink)', letterSpacing: '-1.5px', lineHeight: 1.1 } as React.CSSProperties,
  subtitle: { fontSize: '1.1rem', color: 'var(--ink3)', marginBottom: '3rem', lineHeight: 1.7, fontFamily: 'var(--sans)' } as React.CSSProperties,
  card: { background: '#fff', borderRadius: '24px', padding: '2rem 2.5rem', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' } as React.CSSProperties,
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Left Side: Hero & Features */}
        <div style={S.left}>
          <div style={S.badge}>AI-Powered Civic Platform for Pune</div>
          <h1 style={S.title}>CivicSense</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--ink)', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'var(--sans)' }}>Smart Issue Redressal & Prioritization</p>
          <p style={S.subtitle}>Transforming citizen grievances into actionable insights with intelligent triage, automated routing, and predictive analytics.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: <Shield size={24} color="var(--indigo)" />, title: 'AI Classification', desc: 'Our AI auto-classifies into Sanitation, Infrastructure & Safety' },
              { icon: <TrendingUp size={24} color="var(--teal)" />, title: 'Predictive Analytics', desc: 'Identify hotspot areas and predict recurring civic issues' },
              { icon: <Zap size={24} color="var(--amber)" />, title: 'Multi-Channel', desc: 'Text, voice, and image submissions with multi-lingual support' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#fff', padding: '0.875rem', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '0.25rem', fontFamily: 'var(--sans)' }}>{f.title}</h3>
                  <p style={{ color: 'var(--ink3)', fontSize: '0.9rem', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Portal Cards */}
        <div style={S.right}>
          <div style={S.card}
            onClick={() => navigate('/login?role=citizen')}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--indigo)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 24px rgba(55,48,163,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--indigo-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={28} color="var(--indigo)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--serif)', margin: '0 0 0.25rem', color: 'var(--ink)' }}>Citizen Portal</h2>
                <p style={{ color: 'var(--ink3)', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Report issues & track status</p>
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {['Submit complaints with AI classification', 'Track complaint status in real-time', 'Earn points & badges for contributions'].map(item => (
                <li key={item} style={{ color: 'var(--ink2)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 'bold' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <button style={{ width: '100%', padding: '0.875rem', background: 'var(--indigo)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'background 0.2s' }}>
              Open Citizen Portal →
            </button>
          </div>

          <div style={S.card}
            onClick={() => navigate('/login?role=department')}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 24px rgba(13,148,136,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--teal-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={28} color="var(--teal)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--serif)', margin: '0 0 0.25rem', color: 'var(--ink)' }}>Department Portal</h2>
                <p style={{ color: 'var(--ink3)', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Manage & resolve complaints</p>
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {['View all assigned complaints', 'Update complaint status', 'Access hotspot analytics'].map(item => (
                <li key={item} style={{ color: 'var(--ink2)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 'bold' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <button style={{ width: '100%', padding: '0.875rem', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'background 0.2s' }}>
              Open Department Portal →
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--ink3)', fontSize: '0.9rem', fontWeight: 500 }}>
            Don't have an account?{' '}
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--indigo)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--sans)', fontWeight: 700 }}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
