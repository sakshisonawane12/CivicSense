import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import HeatmapLayer from '../components/HeatmapLayer';

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

export default function MapAnalytics() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'heatmap' | 'circles' | 'markers'>('heatmap');
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

  // Real heatmap points [lat, lng, intensity]
  const heatmapPoints: [number, number, number][] = filteredComplaints
    .map(c => {
      const coords = getCoords(c.location);
      if (!coords) return null;
      const intensity = c.priority === 'High' ? 1.0 : c.priority === 'Medium' ? 0.6 : 0.3;
      const jitter = () => (Math.random() - 0.5) * 0.008;
      return [coords[0] + jitter(), coords[1] + jitter(), intensity] as [number, number, number];
    })
    .filter(Boolean) as [number, number, number][];

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
    <div style={{ color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>
        🗺️ Complaint Analytics Map
      </h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', value: stats.total || 0, color: '#667eea' },
          { label: 'High Priority', value: stats.high_priority || 0, color: '#ef4444' },
          { label: 'Pending', value: stats.pending || 0, color: '#f59e0b' },
          { label: 'Resolved', value: stats.resolved || 0, color: '#10b981' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', borderTop: `4px solid ${s.color}` }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: s.color, margin: 0 }}>{s.value}</p>
            <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: 'white', fontWeight: 'bold' }}>Category:</span>
        {['all', 'Sanitation', 'Infrastructure', 'Safety'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            background: filter === f ? '#667eea' : 'white', color: filter === f ? 'white' : '#333',
          }}>
            {f === 'all' ? '🗺️ All' : f === 'Sanitation' ? '🗑️ Sanitation' : f === 'Infrastructure' ? '🏗️ Infrastructure' : '🚨 Safety'}
          </button>
        ))}

        <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '1rem' }}>View:</span>
        {(['heatmap', 'circles', 'markers'] as const).map(mode => (
          <button key={mode} onClick={() => setViewMode(mode)} style={{
            padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            background: viewMode === mode ? '#10b981' : 'white', color: viewMode === mode ? 'white' : '#333',
          }}>
            {mode === 'heatmap' ? '🔥 Heatmap' : mode === 'circles' ? '⭕ Circles' : '📍 Markers'}
          </button>
        ))}
      </div>

      {/* Map */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)', marginBottom: '1.5rem' }}>
        <MapContainer center={puneCenter} zoom={12} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Real Heatmap */}
          {viewMode === 'heatmap' && heatmapPoints.length > 0 && (
            <HeatmapLayer points={heatmapPoints} />
          )}

          {/* Circles */}
          {viewMode === 'circles' && Object.entries(locationGroups).map(([location, data]) => (
            <Circle key={location} center={data.coords} radius={data.count * 200}
              pathOptions={{ color: CATEGORY_COLORS[data.category] || '#667eea', fillColor: CATEGORY_COLORS[data.category] || '#667eea', fillOpacity: 0.4, weight: 2 }}>
              <Popup>
                <strong>{location}</strong><br />
                Category: {data.category}<br />
                Complaints: <strong>{data.count}</strong>
              </Popup>
            </Circle>
          ))}

          {/* Markers */}
          {viewMode === 'markers' && filteredComplaints.map(c => {
            const coords = getCoords(c.location);
            if (!coords) return null;
            const jitter = () => (Math.random() - 0.5) * 0.005;
            return (
              <Marker key={c.id} position={[coords[0] + jitter(), coords[1] + jitter()]}>
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <strong>#{c.id} - {c.category}</strong><br />
                    <span style={{ color: c.priority === 'High' ? 'red' : c.priority === 'Medium' ? 'orange' : 'green' }}>
                      ● {c.priority} Priority
                    </span><br />
                    {c.complaint_text?.substring(0, 80)}<br />
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>{c.location}</span><br />
                    <span style={{
                      background: c.status === 'resolved' ? '#dcfce7' : c.status === 'in-progress' ? '#dbeafe' : '#fef9c3',
                      padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem'
                    }}>{c.status}</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <strong>Legend:</strong>
        {viewMode === 'heatmap' ? (
          <>
            <span>🔵 Low complaints</span>
            <span>🟢 Medium complaints</span>
            <span>🟡 High complaints</span>
            <span>🔴 Critical hotspot</span>
          </>
        ) : (
          Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: color, display: 'inline-block' }} />
              {cat}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
