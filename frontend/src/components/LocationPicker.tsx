import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number, address: string) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      // Reverse geocode using Nominatim (free)
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(res => res.json())
        .then(data => {
          const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          onLocationSelect(lat, lng, address);
        })
        .catch(() => {
          onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        });
    }
  });

  return position ? <Marker position={position} /> : null;
}

interface LocationPickerProps {
  onLocationSelect: (address: string) => void;
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Pune center coordinates
  const puneCenter: [number, number] = [18.5204, 73.8567];

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedAddress(address);
    onLocationSelect(address);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          value={selectedAddress}
          onChange={(e) => {
            setSelectedAddress(e.target.value);
            onLocationSelect(e.target.value);
          }}
          placeholder="Click 'Pick on Map' or type location"
          style={{ flex: 1, padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem' }}
          required
        />
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          style={{
            padding: '1rem',
            background: showMap ? '#ef4444' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontWeight: 'bold'
          }}
        >
          {showMap ? '✕ Close Map' : '📍 Pick on Map'}
        </button>
      </div>

      {showMap && (
        <div style={{ marginTop: '0.5rem', borderRadius: '10px', overflow: 'hidden', border: '2px solid #667eea' }}>
          <p style={{ background: '#667eea', color: 'white', padding: '0.5rem 1rem', margin: 0, fontSize: '0.875rem' }}>
            📍 Click anywhere on the map to select location
          </p>
          <MapContainer
            center={puneCenter}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <LocationMarker onLocationSelect={handleLocationSelect} />
          </MapContainer>
          {selectedAddress && (
            <p style={{ background: '#f0fdf4', color: '#166534', padding: '0.5rem 1rem', margin: 0, fontSize: '0.875rem' }}>
              ✅ Selected: {selectedAddress}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
