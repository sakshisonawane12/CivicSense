import { useState } from 'react';
import axios from 'axios';

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
      setError(err.response?.data?.error || 'Failed to track complaint');
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = (status: string): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      pending: { background: 'rgba(245,158,11,0.2)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' },
      'in-progress': { background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' },
      resolved: { background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' },
    };
    return map[status] || { background: 'rgba(107,114,128,0.2)', color: '#d1d5db', border: '1px solid rgba(107,114,128,0.3)' };
  };

  const priorityColor = (p: string) => p === 'High' ? '#f87171' : p === 'Medium' ? '#fbbf24' : '#34d399';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', fontFamily: 'Inter,sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>🔍 Track Complaint</h1>
      <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Enter your complaint ID or phone number to track status</p>

      <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
        {/* Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.25rem' }}>
          {(['id', 'phone'] as const).map(type => (
            <button key={type} onClick={() => setSearchType(type)} style={{ flex: 1, padding: '0.625rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', background: searchType === type ? 'linear-gradient(135deg,#a78bfa,#7c3aed)' : 'transparent', color: searchType === type ? 'white' : 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}>
              {type === 'id' ? '🔢 Track by ID' : '📱 Track by Phone'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type={searchType === 'id' ? 'number' : 'tel'}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder={searchType === 'id' ? 'Enter Complaint ID (e.g. 5)' : 'Enter Phone Number'}
            required
            style={{ flex: 1, padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white', fontSize: '1rem', fontFamily: 'Inter,sans-serif', outline: 'none' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '0.875rem 1.75rem', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap' }}>
            {loading ? 'Searching...' : 'Track →'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {complaints.length > 0 && (
        <div>
          <p style={{ opacity: 0.6, marginBottom: '1rem', fontSize: '0.9rem' }}>Found {complaints.length} complaint(s)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map(c => (
              <div key={c.id} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Complaint ID</span>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa', margin: 0 }}>#{c.id}</p>
                  </div>
                  <span style={{ ...statusStyle(c.status), padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {c.status?.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Category', value: c.category },
                    { label: 'Priority', value: c.priority, color: priorityColor(c.priority) },
                    { label: 'Department', value: c.department },
                    { label: 'Location', value: c.location },
                  ].map((item, i) => (
                    <div key={i}>
                      <p style={{ fontSize: '0.75rem', opacity: 0.5, margin: '0 0 0.2rem' }}>{item.label}</p>
                      <p style={{ fontWeight: 600, margin: 0, color: item.color || 'white', fontSize: '0.9rem' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.875rem', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', opacity: 0.5, margin: '0 0 0.25rem' }}>Complaint</p>
                  <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.9rem', opacity: 0.85 }}>{c.complaint_text}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.45 }}>
                  <span>Submitted: {new Date(c.created_at).toLocaleString()}</span>
                  <span>Updated: {new Date(c.updated_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
