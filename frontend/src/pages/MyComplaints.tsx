import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/complaints';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { navigate('/login'); return; }
    setUser(JSON.parse(userData));
    axios.get(`${API_URL}/my-complaints`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        console.log('My complaints response:', r.data);
        setComplaints(r.data.complaints || []);
      })
      .catch(err => { console.error('Error:', err.response?.data); })
      .finally(() => setLoading(false));
  }, [navigate]);

  const statusStyle = (status: string): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      pending: { background: 'rgba(245,158,11,0.2)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' },
      'in-progress': { background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' },
      resolved: { background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' },
    };
    return map[status] || { background: 'rgba(107,114,128,0.2)', color: '#d1d5db', border: '1px solid rgba(107,114,128,0.3)' };
  };

  const priorityColor = (p: string) => p === 'High' ? '#f87171' : p === 'Medium' ? '#fbbf24' : '#34d399';

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
      Loading...
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', color: 'white', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>📋 My Complaints</h1>
          <p style={{ opacity: 0.6, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Welcome back, {user?.name}</p>
        </div>
        <button onClick={() => navigate('/submit')} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
          + New Complaint
        </button>
      </div>

      {complaints.length === 0 ? (
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
          <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>No complaints submitted yet</p>
          <button onClick={() => navigate('/submit')} style={{ padding: '0.875rem 2rem', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
            Submit Your First Complaint
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {complaints.map(c => (
            <div key={c.id} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Complaint ID</span>
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
      )}
    </div>
  );
}
