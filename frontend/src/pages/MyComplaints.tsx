import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BrainCircuit, Activity, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/complaints';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [phoneMode, setPhoneMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      // Allow non-auth users to view complaints by phone (common if they submitted without logging in)
      setPhoneMode(true);
      setLoading(false);
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    // If user previously submitted complaints without logging in,
    // those complaints may not have user_id. In that case, fallback to phone lookup.
    axios.get(`${API_URL}/my-complaints`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        const mine = r.data.complaints || [];
        if (mine.length > 0) {
          setComplaints(mine);
          return;
        }

        const userPhone = parsedUser?.phone;
        if (userPhone) {
          try {
            const byPhone = await axios.get(`${API_URL}/track`, { params: { phone: userPhone } });
            setComplaints(byPhone.data.complaints || []);
          } catch {
            setComplaints([]);
          }
        } else {
          setComplaints([]);
        }
      })
      .catch(err => { console.error('Error:', err.response?.data); })
      .finally(() => setLoading(false));
  }, [navigate]);

  const statusStyle = (status: string): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      'Pending': { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
      'In Progress': { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' },
      'Resolved': { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' },
    };
    return map[status] || { background: '#f3f4f6', color: '#4b5563', border: '1px solid #e2e8f0' };
  };

  const priorityColor = (p: string) => p === 'High' ? '#dc2626' : p === 'Medium' ? '#d97706' : '#059669';
  const truthBadge = (score: number | undefined, suspected: boolean | undefined) => {
    const pct = Math.round(((score ?? 0.5) * 100));
    const isBad = suspected || pct < 35;
    return {
      label: `${pct}%`,
      style: {
        background: isBad ? 'var(--coral-light)' : 'var(--teal-light)',
        color: isBad ? 'var(--coral)' : 'var(--teal)',
        border: `1px solid ${isBad ? 'rgba(232, 71, 42, 0.2)' : 'rgba(13, 148, 136, 0.2)'}`,
      } as React.CSSProperties
    };
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: '1.2rem', gap: '0.75rem', fontFamily: 'Outfit' }}>
      <Activity className="animate-spin" /> Synchronizing with City Grid...
    </div>
  );

  const fetchByPhone = async () => {
    setError('');
    setComplaints([]);
    if (!phone || phone.trim().length < 10) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      const r = await axios.get(`${API_URL}/track`, { params: { phone } });
      setComplaints(r.data.complaints || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'No complaints found for this phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cs-main" style={{ paddingBottom: '5rem' }}>
      <section className="cs-section" style={{ maxWidth: '900px', margin: '0 auto', borderTop: 'none', paddingTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'var(--indigo-light)', padding: '0.5rem', borderRadius: '12px' }}>
                <BrainCircuit size={28} color="var(--indigo)" />
              </div>
              <h1 className="cs-h1" style={{ fontSize: '2.5rem', margin: 0 }}>
                My Incident Logs
              </h1>
            </div>
            <p style={{ color: 'var(--ink2)', margin: 0, fontSize: '1.05rem', fontFamily: 'var(--sans)' }}>
              {phoneMode ? 'View complaints by your phone number (no login needed).' : `Welcome back to the grid, ${user?.name}`}
            </p>
          </div>
          <button onClick={() => navigate('/submit')} style={{ padding: '0.875rem 2rem', background: 'var(--indigo)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)', transition: 'transform 0.2s' }}>
            <Activity size={18} /> REPORT ANOMALY
          </button>
        </div>

        {phoneMode && (
          <div className="cs-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter 10-digit phone number"
                className="cs-input"
                style={{ flex: 1, padding: '1rem 1.25rem', fontSize: '1.05rem' }}
              />
              <button
                onClick={fetchByPhone}
                style={{ padding: '0 1.5rem', height: '52px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--indigo)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', letterSpacing: '0.02em' }}
              >
                <Search size={18} /> Fetch
              </button>
            </div>
            {error && (
              <div style={{ marginTop: '0.9rem', background: 'var(--coral-light)', border: '1px solid rgba(232, 71, 42, 0.2)', color: 'var(--coral)', padding: '0.9rem', borderRadius: '12px', fontWeight: 700, fontFamily: 'var(--sans)' }}>
                {error}
              </div>
            )}
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="cs-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <BrainCircuit size={64} color="var(--indigo)" style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
            <p style={{ color: 'var(--ink2)', marginBottom: '1.5rem', fontSize: '1.1rem', fontFamily: 'var(--sans)' }}>No complaints submitted yet</p>
            <button onClick={() => navigate('/submit')} style={{ padding: '0.875rem 2rem', background: 'var(--indigo)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', letterSpacing: '0.02em', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)' }}>
              INITIATE FIRST SCAN
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {complaints.map(c => (
              <div key={c._id} className="cs-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden', borderLeft: `6px solid ${priorityColor(c.priority)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <span className="cs-eyebrow">Node Matrix ID</span>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '0.25rem 0 0', fontFamily: 'monospace' }}>{c._id}</p>
                  </div>
                  <span style={{ ...statusStyle(c.status), padding: '0.5rem 1.25rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {c.status === 'Resolved' ? 'System Clean' : c.status === 'In Progress' ? 'Auto-Dispatch Executing' : 'Pending Triage'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Sub-System', value: c.category },
                    { label: 'Risk Level', value: c.priority, color: priorityColor(c.priority) },
                    { label: 'Network', value: c.department },
                    { label: 'Geo-Location', value: c.location },
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'var(--cream)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--ink3)', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{item.label}</p>
                      <p style={{ fontWeight: 700, margin: 0, color: item.color || 'var(--ink)', fontSize: '1.05rem' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--indigo)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <Activity size={16} /> Source Context
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.6, fontSize: '1rem', color: 'var(--ink2)', fontWeight: 500 }}>{c.complaint_text}</p>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                    <BrainCircuit size={16} /> AI Insights
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
                    {(() => {
                      const t = truthBadge(c.truth_score, c.is_suspected_spam);
                      return (
                        <>
                          <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--ink3)', margin: '0 0 0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>TruthScore</p>
                            <span style={{ ...t.style, display: 'inline-block', padding: '0.35rem 0.7rem', borderRadius: '999px', fontWeight: 900, fontFamily: 'monospace' }}>
                              {t.label}
                            </span>
                          </div>
                          <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--ink3)', margin: '0 0 0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Rec. Priority</p>
                            <p style={{ margin: 0, fontWeight: 900, color: c.recommended_priority === 'High' ? 'var(--coral)' : c.recommended_priority === 'Low' ? 'var(--teal)' : 'var(--ink)', fontFamily: 'monospace' }}>
                              {c.recommended_priority ?? '—'}
                            </p>
                          </div>
                          <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--ink3)', margin: '0 0 0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Rec. SLA</p>
                            <p style={{ margin: 0, fontWeight: 900, color: 'var(--ink)', fontFamily: 'monospace' }}>
                              {c.recommended_sla_hours ?? '—'}h
                            </p>
                          </div>
                          <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--ink3)', margin: '0 0 0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Rec. Dept</p>
                            <p style={{ margin: 0, fontWeight: 900, color: 'var(--ink)', fontSize: '0.9rem' }}>
                              {c.recommended_department ?? '—'}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  {!!c.evidence_flags?.length && (
                    <div style={{ marginTop: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {c.evidence_flags.slice(0, 6).map((f: string) => (
                        <span key={f} style={{ background: 'var(--cream2)', border: '1px solid var(--border)', padding: '0.25rem 0.55rem', borderRadius: '999px', fontSize: '0.75rem', color: 'var(--ink2)', fontWeight: 700, fontFamily: 'monospace' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--ink3)', fontFamily: 'monospace', fontWeight: 600 }}>
                  <span>LOGGED: {new Date(c.createdAt).toLocaleString()}</span>
                  <span>SYNCED: {new Date(c.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
