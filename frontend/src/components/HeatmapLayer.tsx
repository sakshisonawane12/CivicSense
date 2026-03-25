import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heat = (L as any).heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.2: '#00f',   // blue - low
        0.4: '#0ff',   // cyan
        0.6: '#0f0',   // green
        0.8: '#ff0',   // yellow
        1.0: '#f00',   // red - high
      },
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}
