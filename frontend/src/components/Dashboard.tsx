import { useState, useEffect } from "react";
import { complaintService } from "../services/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isDepartment = user?.role === 'department';
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [hotspots, setHotspots] = useState([]);
  const [filter, setFilter] = useState({ department: "", priority: "", status: "" });

  // Simulated AI logs for the demo
  const [aiLogs, setAiLogs] = useState([
    { id: 1, time: '2 mins ago', msg: 'Detected anomaly in waste levels (Kothrud). Auto-dispatched Sanitation Truck #4.', status: 'Active' },
    { id: 2, time: '14 mins ago', msg: 'Rain forecast triggers preventative drain clearing protocol in Shivaji Nagar.', status: 'Resolved' },
    { id: 3, time: '1 hr ago', msg: 'High crowd density recognized at FC Road. Additional bins prepositioned.', status: 'Resolved' },
  ]);

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

  const priorityColor = (p: string) => p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981";

  return (
    <div className="cs-main" style={{ paddingBottom: '5rem' }}>
      <section className="cs-section" style={{ borderTop: 'none', paddingTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div className="cs-eyebrow">Self-Healing City Operations</div>
            <h1 className="cs-h1" style={{ margin: 0, fontSize: '2.2rem' }}>AI Command Center</h1>
          </div>
          <div className="cs-live-badge" style={{ background: 'var(--teal-light)', padding: '6px 12px', borderRadius: '20px', border: '1px solid #ccfbf1' }}>
            <span className="cs-live-dot" /> SYSTEM OPTIMAL
          </div>
        </div>

        {stats && (
          <div className="cs-stats-strip" style={{ marginBottom: '3rem' }}>
            {[
              { val: '98.4%', label: 'AI Resolution Accuracy', c: 'var(--indigo)' },
              { val: stats.high_priority || 0, label: 'Critical Anomalies', c: 'var(--coral)' },
              { val: stats.pending || 0, label: 'Processing Decisions', c: 'var(--amber)' },
              { val: stats.resolved || 0, label: 'Auto-Resolved', c: 'var(--teal)' },
            ].map((s, i) => (
              <div key={i} className="cs-stat" style={{ padding: '1.75rem 1.5rem' }}>
                <div className="cs-stat-label">{s.label}</div>
                <div className="cs-stat-val" style={{ color: s.c, marginTop: '8px' }}>{s.val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Main Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2.5rem' }}>

          {/* Left Column: Complaint Stream */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="cs-panel-title" style={{ fontSize: '0.85rem' }}>Incident Stream</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select className="cs-input" value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })} style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  <option value="">Priority Level</option>
                  <option value="High">Critical</option>
                  <option value="Medium">Warning</option>
                  <option value="Low">Minor</option>
                </select>
                <select className="cs-input" value={filter.department} onChange={e => setFilter({ ...filter, department: e.target.value })} style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  <option value="">All Systems</option>
                  <option value="Sanitation Department">Sanitation</option>
                  <option value="Public Works Department">Infrastructure</option>
                  <option value="Police Department">Safety</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '700px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {complaints.length === 0 ? (
                <div className="cs-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--ink3)' }}>Zero active incidents. City is operating nominally.</div>
              ) : (
                complaints.map((c: any) => (
                  <div key={c._id} className="cs-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: priorityColor(c.priority) }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ color: priorityColor(c.priority), fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.priority} ALERT</span>
                        <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>{c.category}</h3>
                      </div>
                      <span style={{ color: 'var(--ink3)', fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 600 }}>ID:{c._id?.slice(-8)}</span>
                    </div>

                    <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--ink2)', lineHeight: 1.6 }}>{c.complaint_text}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border2)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--ink3)', fontWeight: 600 }}>
                        <span>📍 {c.location}</span>
                        <span>🏢 {c.department}</span>
                      </div>

                      {isDepartment ? (
                        <select
                          value={c.status}
                          onChange={e => updateStatus(c._id, e.target.value)}
                          className="cs-input"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          <option value="Pending">Pending Triage</option>
                          <option value="In Progress">Auto-Dispatch Executing</option>
                          <option value="Resolved">Operation Complete</option>
                        </select>
                      ) : (
                        <span style={{
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
                          background: c.status === 'Resolved' ? 'var(--teal-light)' : c.status === 'In Progress' ? 'var(--indigo-light)' : 'var(--amber-light)',
                          color: c.status === 'Resolved' ? 'var(--teal)' : c.status === 'In Progress' ? 'var(--indigo)' : 'var(--amber)',
                        }}>
                          {c.status === 'Resolved' ? 'System Clean' : c.status === 'In Progress' ? 'Auto-Dispatch Executing' : 'Pending Triage'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: AI Decision Engine & Analytics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Autonomous Actions Log */}
            <div className="cs-card" style={{ padding: '1.5rem' }}>
              <div className="cs-panel-title" style={{ marginBottom: '1.25rem' }}>AI Decision Engine</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {aiLogs.map((log) => (
                  <div key={log.id} style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                      <span style={{ color: 'var(--indigo)', fontWeight: 700, letterSpacing: '0.05em' }}>⚡ AUTONOMOUS ACTION</span>
                      <span style={{ color: 'var(--ink3)' }}>{log.time}</span>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--ink2)' }}>{log.msg}</p>
                    <span style={{ display: 'inline-block', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', background: log.status === 'Active' ? 'var(--indigo-light)' : 'var(--teal-light)', color: log.status === 'Active' ? 'var(--indigo2)' : 'var(--teal)', fontWeight: 700 }}>
                      {log.status === 'Active' ? 'Deployment Active' : 'Task Verified'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Hotspots */}
            <div className="cs-card" style={{ padding: '1.5rem' }}>
              <div className="cs-panel-title" style={{ marginBottom: '1.25rem' }}>Severity Heatmap List</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {hotspots.map((h: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--coral-light)', borderRadius: '12px', border: '1px solid rgba(232,71,42,0.15)' }}>
                    <div>
                      <p style={{ fontWeight: 700, margin: '0 0 0.25rem', fontSize: '0.85rem', color: 'var(--ink)' }}>{h.location}</p>
                      <p style={{ color: 'var(--coral)', fontSize: '0.75rem', margin: 0, fontWeight: 600 }}>{h.category} Cluster</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', color: 'var(--coral)', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--serif)' }}>{h.complaint_count}</span>
                      <span style={{ color: 'var(--coral)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Reports</span>
                    </div>
                  </div>
                ))}
                {hotspots.length === 0 && <div style={{ color: 'var(--ink3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No critical clusters detected.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
