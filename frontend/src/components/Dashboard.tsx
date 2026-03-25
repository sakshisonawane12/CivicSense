import { useState, useEffect } from "react";
import { complaintService } from "../services/api";
import { AlertCircle, TrendingUp, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isDepartment = user?.role === 'department';
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [hotspots, setHotspots] = useState([]);
  const [filter, setFilter] = useState({ department: "", priority: "", status: "" });

  useEffect(() => { loadData(); }, [filter]);

  const loadData = async () => {
    try {
      const [c, s, h] = await Promise.all([
        complaintService.getAllComplaints(filter),
        complaintService.getStats(),
        complaintService.getHotspots(),
      ]);
      setComplaints(c.complaints);
      setStats(s.stats);
      setHotspots(h.hotspots);
    } catch (error) { console.error(error); }
  };

  const updateStatus = async (id: any, status: string) => {
    try { await complaintService.updateStatus(id, status); loadData(); }
    catch { alert("Error updating status"); }
  };

  const priorityColor = (p: string) => p === "High" ? "#f87171" : p === "Medium" ? "#fbbf24" : "#34d399";
  const priorityBg = (p: string) => p === "High" ? "rgba(239,68,68,0.15)" : p === "Medium" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)";

  const selectStyle: React.CSSProperties = {
    padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', color: 'white', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif', outline: 'none'
  };

  return (
    <div style={{ color: 'white', fontFamily: 'Inter,sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>📊 Dashboard</h1>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { icon: <AlertCircle size={28} color="#60a5fa" />, value: stats.total, label: 'Total Complaints', color: '#60a5fa' },
            { icon: <TrendingUp size={28} color="#f87171" />, value: stats.high_priority, label: 'High Priority', color: '#f87171' },
            { icon: <Clock size={28} color="#fbbf24" />, value: stats.pending, label: 'Pending', color: '#fbbf24' },
            { icon: <CheckCircle2 size={28} color="#34d399" />, value: stats.resolved, label: 'Resolved', color: '#34d399' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: `1px solid ${s.color}33`, borderTop: `3px solid ${s.color}` }}>
              {s.icon}
              <div>
                <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: s.color }}>{s.value}</p>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select style={selectStyle} value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })}>
          <option value="" style={{ background: '#1e1b4b' }}>All Priorities</option>
          <option value="High" style={{ background: '#1e1b4b' }}>🔴 High</option>
          <option value="Medium" style={{ background: '#1e1b4b' }}>🟡 Medium</option>
          <option value="Low" style={{ background: '#1e1b4b' }}>🟢 Low</option>
        </select>
        <select style={selectStyle} value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
          <option value="" style={{ background: '#1e1b4b' }}>All Status</option>
          <option value="pending" style={{ background: '#1e1b4b' }}>⏳ Pending</option>
          <option value="in_progress" style={{ background: '#1e1b4b' }}>🔄 In Progress</option>
          <option value="resolved" style={{ background: '#1e1b4b' }}>✅ Resolved</option>
        </select>
        <select style={selectStyle} value={filter.department} onChange={e => setFilter({ ...filter, department: e.target.value })}>
          <option value="" style={{ background: '#1e1b4b' }}>All Departments</option>
          <option value="Sanitation Department" style={{ background: '#1e1b4b' }}>🗑️ Sanitation</option>
          <option value="Public Works Department" style={{ background: '#1e1b4b' }}>🏗️ Infrastructure</option>
          <option value="Police Department" style={{ background: '#1e1b4b' }}>🚨 Safety</option>
        </select>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Complaints */}
        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', opacity: 0.9 }}>Recent Complaints ({complaints.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxHeight: '600px', overflowY: 'auto' }}>
            {complaints.map((c: any) => (
              <div key={c.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '1.25rem', borderLeft: `4px solid ${priorityColor(c.priority)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ background: priorityBg(c.priority), color: priorityColor(c.priority), padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                      {c.priority}
                    </span>
                    <span style={{ color: '#a78bfa', fontWeight: 600, fontSize: '0.85rem' }}>{c.category}</span>
                  </div>
                  <span style={{ opacity: 0.4, fontSize: '0.78rem' }}>#{c.id}</span>
                </div>
                <p style={{ margin: '0 0 0.75rem', lineHeight: 1.5, fontSize: '0.9rem', opacity: 0.85 }}>{c.complaint_text}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.75rem' }}>
                  <span>📍 {c.location}</span>
                  <span>👤 {c.citizen_name}</span>
                  <span>🏢 {c.department}</span>
                </div>
                {isDepartment ? (
                  <select
                    value={c.status}
                    onChange={e => updateStatus(c.id, e.target.value)}
                    style={{ padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif', outline: 'none' }}
                  >
                    <option value="pending" style={{ background: '#1e1b4b' }}>⏳ Pending</option>
                    <option value="in_progress" style={{ background: '#1e1b4b' }}>🔄 In Progress</option>
                    <option value="resolved" style={{ background: '#1e1b4b' }}>✅ Resolved</option>
                  </select>
                ) : (
                  <span style={{
                    padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                    background: c.status === 'resolved' ? 'rgba(16,185,129,0.2)' : c.status === 'in_progress' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)',
                    color: c.status === 'resolved' ? '#6ee7b7' : c.status === 'in_progress' ? '#93c5fd' : '#fcd34d',
                  }}>
                    {c.status === 'resolved' ? '✅ Resolved' : c.status === 'in_progress' ? '🔄 In Progress' : '⏳ Pending'}
                  </span>
                )}
              </div>
            ))}
            {complaints.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.4 }}>No complaints found</div>
            )}
          </div>
        </div>

        {/* Hotspots */}
        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', opacity: 0.9 }}>🔥 Hotspot Areas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {hotspots.map((h: any, i: number) => (
              <div key={i} style={{ background: 'rgba(245,158,11,0.1)', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
                <p style={{ fontWeight: 700, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>📍 {h.location}</p>
                <p style={{ opacity: 0.6, fontSize: '0.8rem', margin: '0 0 0.25rem' }}>{h.category}</p>
                <p style={{ color: '#fbbf24', fontWeight: 700, margin: 0, fontSize: '0.85rem' }}>{h.complaint_count} complaints</p>
              </div>
            ))}
            {hotspots.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.4, fontSize: '0.9rem' }}>No hotspots yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
