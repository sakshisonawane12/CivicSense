import { useState } from 'react';
import axios from 'axios';
import { Activity, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/complaints';

export default function TrackComplaint() {
  const [searchType, setSearchType] = useState<'id' | 'phone'>('id');
  const [searchValue, setSearchValue] = useState('');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setComplaints([]);
    try {
      const params = searchType === 'id' ? { id: searchValue } : { phone: searchValue };
      const response = await axios.get(`${API_URL}/track`, { params });
      setComplaints(response.data.complaints);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Tracking matrix failed to locate node');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="cs-main" style={{ paddingBottom: '5rem' }}>
      <section className="cs-section" style={{ maxWidth: '800px', margin: '0 auto', borderTop: 'none', paddingTop: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ background: 'var(--indigo-light)', padding: '0.5rem', borderRadius: '12px' }}>
            <Activity size={24} color="var(--indigo)" />
          </div>
          <h1 className="cs-h1" style={{ margin: 0, fontSize: '2.2rem' }}>
            Track Incident
          </h1>
        </div>
        <p style={{ color: 'var(--ink2)', marginBottom: '2.5rem', fontSize: '1.05rem', fontFamily: 'var(--sans)' }}>
          Query the grid using your unique incident ID or mobile link.
        </p>

        <div className="cs-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--cream2)', borderRadius: '12px', padding: '0.35rem' }}>
            {(['id', 'phone'] as const).map(type => (
              <button key={type} onClick={() => setSearchType(type)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', fontFamily: 'var(--sans)', background: searchType === type ? '#ffffff' : 'transparent', color: searchType === type ? 'var(--ink)' : 'var(--ink3)', borderColor: searchType === type ? 'var(--border)' : 'transparent', transition: 'all 0.2s', boxShadow: searchType === type ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>
                {type === 'id' ? '🔢 Track by ID' : '📱 Track by Phone'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type={searchType === 'id' ? 'text' : 'tel'}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder={searchType === 'id' ? 'Enter Complaint ID' : 'Enter Phone Number'}
              required
              className="cs-input"
              style={{ flex: 1, padding: '1rem 1.25rem', fontSize: '1.05rem' }}
            />
            <button type="submit" disabled={loading} style={{ padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--indigo)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--sans)', letterSpacing: '0.02em', fontSize: '1.05rem', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)' }}>
              {loading ? <Activity className="animate-spin" size={20} /> : <Search size={20} />}
              {loading ? 'Scanning...' : 'Execute'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{ background: 'var(--coral-light)', border: '1px solid rgba(232, 71, 42, 0.2)', color: 'var(--coral)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600, fontFamily: 'var(--sans)' }}>
            {error}
          </div>
        )}

        {complaints.length > 0 && (
          <div>
            <p className="cs-eyebrow" style={{ marginBottom: '1.5rem' }}>Found {complaints.length} incident(s)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {complaints.map(c => (
                <div key={c._id} className="cs-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: priorityColor(c.priority) }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <span className="cs-eyebrow">Incident Reference ID</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: '0.25rem 0 0', fontFamily: 'monospace' }}>{c._id}</p>
                    </div>
                    <span style={{ ...statusStyle(c.status), padding: '0.5rem 1.25rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {c.status === 'Resolved' ? 'System Clean' : c.status === 'In Progress' ? 'Auto-Dispatch Executing' : 'Pending Triage'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                      { label: 'Sub-System Category', value: c.category },
                      { label: 'Threat Level', value: c.priority, color: priorityColor(c.priority) },
                      { label: 'Assigned Grid', value: c.department },
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
                      AI Insights
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
          </div>
        )}
      </section>
    </div>
  );
}
