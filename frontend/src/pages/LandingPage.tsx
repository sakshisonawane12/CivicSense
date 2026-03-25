import { useNavigate } from 'react-router-dom';
import { Users, Building2, Shield, TrendingUp, Zap } from 'lucide-react';

const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', color: 'white', fontFamily: "'Inter', sans-serif" } as React.CSSProperties,
  container: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' } as React.CSSProperties,
  badge: { display: 'inline-block', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '50px', padding: '0.4rem 1.25rem', fontSize: '0.85rem', color: '#a78bfa', marginBottom: '1.5rem' } as React.CSSProperties,
  title: { fontSize: 'clamp(3rem,8vw,5.5rem)', fontWeight: 900, margin: '0 0 1rem', background: 'linear-gradient(135deg,#fff 0%,#a78bfa 50%,#60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-2px', lineHeight: 1.1 } as React.CSSProperties,
  subtitle: { fontSize: '1.2rem', opacity: 0.7, marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.7 } as React.CSSProperties,
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem', marginBottom: '3rem' } as React.CSSProperties,
  card: { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s' } as React.CSSProperties,
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1rem' } as React.CSSProperties,
  featureCard: { background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' } as React.CSSProperties,
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Hero */}
        <div style={{ textAlign: 'center', paddingBottom: '3rem' }}>
          <div style={S.badge}>🚀 AI-Powered Civic Platform for Pune</div>
          <h1 style={S.title}>CivicSense</h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.8, marginBottom: '0.5rem' }}>AI-Driven Issue Redressal & Prioritization</p>
          <p style={S.subtitle}>Transforming citizen grievances into actionable insights with intelligent triage, automated routing, and predictive analytics</p>
        </div>

        {/* Portal Cards */}
        <div style={S.grid2}>
          <div style={S.card}
            onClick={() => navigate('/login?role=citizen')}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(96,165,250,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Users size={32} color="white" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Citizen Portal</h2>
            <p style={{ opacity: 0.65, marginBottom: '1.25rem', lineHeight: 1.6 }}>Submit complaints, track status, and view your complaint history</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Submit complaints with AI classification', 'Track complaint status in real-time', 'Earn points & badges for contributions', 'Upload images and voice recordings'].map(item => (
                <li key={item} style={{ opacity: 0.75, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#60a5fa' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <button style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              Login as Citizen →
            </button>
          </div>

          <div style={S.card}
            onClick={() => navigate('/login?role=department')}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(167,139,250,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Building2 size={32} color="white" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Department Portal</h2>
            <p style={{ opacity: 0.65, marginBottom: '1.25rem', lineHeight: 1.6 }}>Manage complaints, update status, and view analytics</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['View all assigned complaints', 'Update complaint status', 'Access hotspot analytics', 'Priority-based filtering'].map(item => (
                <li key={item} style={{ opacity: 0.75, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#a78bfa' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <button style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              Login as Department →
            </button>
          </div>
        </div>

        {/* Features */}
        <div style={S.grid3}>
          {[
            { icon: <Shield size={28} color="#60a5fa" />, title: 'AI Classification', desc: 'Gemini AI auto-classifies into Sanitation, Infrastructure & Safety' },
            { icon: <TrendingUp size={28} color="#a78bfa" />, title: 'Predictive Analytics', desc: 'Identify hotspot areas and predict recurring civic issues' },
            { icon: <Zap size={28} color="#34d399" />, title: 'Multi-Channel', desc: 'Text, voice, and image submissions with multi-lingual support' },
          ].map((f, i) => (
            <div key={i} style={S.featureCard}>
              <div style={{ marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{f.title}</h3>
              <p style={{ opacity: 0.6, fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.5, fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Inter,sans-serif' }}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
