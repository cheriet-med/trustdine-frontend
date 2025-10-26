'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

const Map = ({
  center = [51.505, -0.09],
  zoom = 13,
  height = '400px',
  markers = []
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !mapRef.current) return;

    // Initialize map only if not already initialized
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: true,
        preferCanvas: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        detectRetina: true,
      }).addTo(mapInstance.current);
    } else {
      // Update map view if center or zoom changes
      mapInstance.current.setView(center, zoom);
    }

    // Clear existing markers
    if (mapInstance.current) {
      mapInstance.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          mapInstance.current?.removeLayer(layer);
        }
      });

      // Add new markers
      markers.forEach(marker => {
        const m = L.marker(marker.position).addTo(mapInstance.current!);
        if (marker.popup) {
          m.bindPopup(marker.popup);
        }
      });
    }

    // Handle map resize
    const handleResize = () => {
      mapInstance.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMounted, center, zoom, markers]);

  if (!isMounted) {
    return (
      <div 
        style={{ height }}
        className="bg-gray-200 rounded-lg flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Initializing map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="rounded-lg z-0"
    />
  );
};

export default Map;