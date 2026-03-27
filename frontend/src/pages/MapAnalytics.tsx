import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import HeatmapLayer from '../components/HeatmapLayer';
import { Brain, Eye, ShieldAlert, FastForward, Activity } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const API_URL = 'http://localhost:5000/api/complaints';

const PUNE_LOCATIONS: Record<string, [number, number]> = {
  'Shivaji Nagar': [18.5308, 73.8474],
  'Kothrud': [18.5074, 73.8077],
  'Deccan': [18.5162, 73.8467],
  'FC Road': [18.5236, 73.8478],
  'MG Road': [18.5195, 73.8553],
  'Hadapsar': [18.5089, 73.9260],
  'Wakad': [18.5985, 73.7611],
  'Hinjewadi': [18.5912, 73.7389],
  'Baner': [18.5590, 73.7868],
  'Aundh': [18.5590, 73.8078],
};

const CATEGORY_COLORS: Record<string, string> = {
  Sanitation: '#f59e0b',
  Infrastructure: '#3b82f6',
  Safety: '#ef4444',
};

// Mock future predictions for "Predict Future" mode
const FUTURE_PREDICTIONS = [
  { area: 'Shivaji Nagar', risk: 78, type: 'Waste Overflow', reason: 'High foot traffic + 2 missed pickups', coords: [18.5308, 73.8474] },
  { area: 'Hadapsar', risk: 92, type: 'Waterlogging Risk', reason: 'Heavy rain forecast + blocked main drain', coords: [18.5089, 73.9260] },
  { area: 'FC Road', risk: 65, type: 'Pothole Expansion', reason: 'Heavy traffic + existing minor road damage', coords: [18.5236, 73.8478] },
];

export default function MapAnalytics() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'heatmap' | 'circles' | 'markers'>('heatmap');

  // Predict Future State
  const [simulateFuture, setSimulateFuture] = useState(false);

  const puneCenter: [number, number] = [18.5204, 73.8567];

  useEffect(() => {
    axios.get(API_URL).then(r => setComplaints(r.data.complaints || []));
    axios.get(`${API_URL}/stats`).then(r => setStats(r.data.stats || {}));
  }, []);

  const getCoords = (location: string): [number, number] | null => {
    for (const [key, coords] of Object.entries(PUNE_LOCATIONS)) {
      if (location?.includes(key)) return coords;
    }
    return null;
  };

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.category === filter);

  // Real heatmap points
  const realHeatmapPoints: [number, number, number][] = filteredComplaints
    .map(c => {
      const coords = getCoords(c.location);
      if (!coords) return null;
      const intensity = c.priority === 'High' ? 1.0 : c.priority === 'Medium' ? 0.6 : 0.3;
      const jitter = () => (Math.random() - 0.5) * 0.008;
      return [coords[0] + jitter(), coords[1] + jitter(), intensity] as [number, number, number];
    })
    .filter(Boolean) as [number, number, number][];

  // Future simulated heatmap points
  const futureHeatmapPoints: [number, number, number][] = FUTURE_PREDICTIONS.map(p =>
    [p.coords[0], p.coords[1], p.risk / 100 * 1.5]
  );

  const heatmapPointsToRender = simulateFuture ? futureHeatmapPoints : realHeatmapPoints;

  // Circle groups
  const locationGroups: Record<string, { count: number; category: string; coords: [number, number] }> = {};
  filteredComplaints.forEach(c => {
    const coords = getCoords(c.location);
    if (coords) {
      if (!locationGroups[c.location]) {
        locationGroups[c.location] = { count: 0, category: c.category, coords };
      }
      locationGroups[c.location].count++;
    }
  });

  return (
    <div className="cs-main" style={{ paddingBottom: '5rem' }}>
      <section className="cs-section" style={{ borderTop: 'none', paddingTop: '3rem' }}>
        {/* Header Panel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div className="cs-eyebrow">Geo-Intelligence Grid</div>
            <h1 className="cs-h1" style={{ margin: 0, fontSize: '2.2rem' }}>Live Spatial Analysis</h1>
          </div>

          {/* Predict Future Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink3)' }}>Predictive Simulation</span>
            <button
              onClick={() => setSimulateFuture(!simulateFuture)}
              style={{
                width: '48px', height: '24px', borderRadius: '12px', padding: '2px',
                background: simulateFuture ? 'var(--indigo)' : '#e2e8f0',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transform: simulateFuture ? 'translateX(24px)' : 'translateX(0)',
                transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 3fr', gap: '2.5rem' }}>
          {/* Sidebar Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {simulateFuture ? (
              <div className="cs-card" style={{ padding: '1.5rem', background: 'var(--indigo-light)', borderColor: 'rgba(79, 70, 229, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--indigo)' }}>
                  <Brain size={20} />
                  <h3 className="cs-panel-title" style={{ margin: 0, color: 'var(--indigo)' }}>AI Predictions (+2 HRS)</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {FUTURE_PREDICTIONS.map((p, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: p.risk > 80 ? '#b91c1c' : '#b45309' }}>{p.type}</span>
                        <span style={{ fontSize: '0.8rem', background: p.risk > 80 ? '#fef2f2' : '#fffbeb', color: p.risk > 80 ? '#ef4444' : '#f59e0b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{p.risk}% Risk</span>
                      </div>
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>📍 {p.area}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{p.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="cs-card" style={{ padding: '1.5rem' }}>
                <h3 className="cs-panel-title" style={{ margin: '0 0 1rem' }}>Display Filters</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['all', 'Sanitation', 'Infrastructure', 'Safety'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer',
                      fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--sans)',
                      background: filter === f ? 'var(--cream2)' : '#ffffff',
                      borderColor: filter === f ? 'var(--border)' : 'transparent',
                      color: filter === f ? 'var(--ink)' : 'var(--ink3)',
                      textAlign: 'left', transition: 'all 0.2s'
                    }}>
                      {f === 'all' ? '🌐 All Systems' : f === 'Sanitation' ? '🗑️ Sanitation Grid' : f === 'Infrastructure' ? '🏗️ Infrastructure' : '🚨 Safety Net'}
                    </button>
                  ))}
                </div>

                <h3 className="cs-panel-title" style={{ margin: '2rem 0 1rem' }}>Data Visualization</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(['heatmap', 'circles', 'markers'] as const).map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode)} style={{
                      padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer',
                      fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--sans)',
                      background: viewMode === mode ? 'var(--teal-light)' : '#ffffff',
                      borderColor: viewMode === mode ? 'rgba(13,148,136,0.2)' : 'transparent',
                      color: viewMode === mode ? 'var(--teal)' : 'var(--ink3)',
                      textAlign: 'left', transition: 'all 0.2s'
                    }}>
                      {mode === 'heatmap' ? '🔥 Intensity Heatmap' : mode === 'circles' ? '⭕ Cluster Radius' : '📍 Exact Coordinates'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Summary */}
            {!simulateFuture && (
              <div className="cs-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--ink3)', fontSize: '0.85rem', fontWeight: 600 }}>Total Nodes</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)' }}>{stats.total || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--ink3)', fontSize: '0.85rem', fontWeight: 600 }}>Critical Arrays</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--coral)' }}>{stats.high_priority || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--ink3)', fontSize: '0.85rem', fontWeight: 600 }}>Active Healing</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--indigo)' }}>{stats.pending || 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="cs-card" style={{ overflow: 'hidden', height: '700px', position: 'relative', border: simulateFuture ? '1px solid var(--indigo)' : '1px solid var(--border2)', padding: 0 }}>
            {/* Simulation Overlay */}
            {simulateFuture && (
              <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, background: '#ffffff', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--indigo)', animation: 'blink 2s infinite' }} />
                <span style={{ color: 'var(--indigo)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>PREDICTIVE SIMULATION</span>
              </div>
            )}

            <MapContainer center={puneCenter} zoom={12} style={{ height: '100%', width: '100%', backgroundColor: '#f8fafc' }}>
              {/* Using cartodb/positron for extremely clean white light mode */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />

              {/* Real OR Simulated Heatmap */}
              {(viewMode === 'heatmap' || simulateFuture) && heatmapPointsToRender.length > 0 && (
                <HeatmapLayer points={heatmapPointsToRender} />
              )}

              {/* Simulated Markers */}
              {simulateFuture && FUTURE_PREDICTIONS.map(p => (
                <Marker key={p.area} position={p.coords as [number, number]}>
                  <Popup>
                    <div style={{ minWidth: '200px', fontFamily: 'Inter' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#c084fc' }}>
                        <Brain size={16} /> <strong>AI Prediction</strong>
                      </div>
                      <strong style={{ fontSize: '1.1rem' }}>{p.area}</strong><br />
                      <span style={{ color: p.risk > 80 ? 'red' : 'orange', fontWeight: 'bold' }}>
                        {p.risk}% Risk: {p.type}
                      </span><br />
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>{p.reason}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Circles (Only in Real-time Mode) */}
              {!simulateFuture && viewMode === 'circles' && Object.entries(locationGroups).map(([location, data]) => (
                <Circle key={location} center={data.coords} radius={data.count * 300}
                  pathOptions={{ color: CATEGORY_COLORS[data.category] || '#3b82f6', fillColor: CATEGORY_COLORS[data.category] || '#3b82f6', fillOpacity: 0.3, weight: 2 }}>
                  <Popup>
                    <div style={{ fontFamily: 'Inter' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{location}</strong><br />
                      Category: {data.category}<br />
                      Complaints: <strong>{data.count}</strong>
                    </div>
                  </Popup>
                </Circle>
              ))}

              {/* Markers (Only in Real-time Mode) */}
              {!simulateFuture && viewMode === 'markers' && filteredComplaints.map(c => {
                const coords = getCoords(c.location);
                if (!coords) return null;
                const jitter = () => (Math.random() - 0.5) * 0.005;
                return (
                  <Marker key={c._id} position={[coords[0] + jitter(), coords[1] + jitter()]}>
                    <Popup>
                      <div style={{ minWidth: '220px', fontFamily: 'Inter' }}>
                        <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>{c.category}</strong>
                        <span style={{ color: c.priority === 'High' ? 'red' : c.priority === 'Medium' ? 'orange' : 'green', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          ● {c.priority} Priority
                        </span><br />
                        <p style={{ margin: '8px 0', fontSize: '0.9rem', lineHeight: 1.4 }}>{c.complaint_text?.substring(0, 100)}...</p>
                        <span style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>📍 {c.location}</span>
                        <span style={{
                          background: c.status === 'Resolved' ? '#dcfce7' : c.status === 'In Progress' ? '#dbeafe' : '#fef9c3',
                          color: c.status === 'Resolved' ? '#166534' : c.status === 'In Progress' ? '#1e40af' : '#854d0e',
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold'
                        }}>{c.status}</span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
