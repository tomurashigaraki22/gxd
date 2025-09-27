'use client';

import { useEffect, useRef } from 'react';

export default function NigeriaMap({ parks, selectedPark, onParkSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Only initialize map on client side
    if (typeof window !== 'undefined') {
      initializeMap();
    }

    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Update markers when parks change
    if (mapInstanceRef.current && parks) {
      updateMarkers();
    }
  }, [parks, selectedPark]);

  const initializeMap = async () => {
    try {
      // Dynamically import Leaflet
      const L = (await import('leaflet')).default;
      
      // Fix for default markers in Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Initialize map centered on Nigeria
      const map = L.map(mapRef.current).setView([9.0820, 8.6753], 6);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add Nigeria boundary (approximate)
      const nigeriaBounds = [
        [4.0, 2.5],   // Southwest
        [14.0, 15.0]  // Northeast
      ];
      
      L.rectangle(nigeriaBounds, {
        color: '#2E8B57',
        weight: 2,
        fillOpacity: 0.1
      }).addTo(map);

      mapInstanceRef.current = map;
      
      // Add initial markers
      if (parks) {
        updateMarkers();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const updateMarkers = async () => {
    if (!mapInstanceRef.current) return;

    try {
      const L = (await import('leaflet')).default;
      
      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add new markers
      parks.forEach((park) => {
        if (park.coordinates) {
          const isSelected = selectedPark && selectedPark["Name of Park"] === park["Name of Park"];
          
          // Create custom icon for selected park
          const icon = isSelected ? 
            L.divIcon({
              html: '<div style="background-color: #ff4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              className: 'custom-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            }) :
            L.divIcon({
              html: '<div style="background-color: #2E8B57; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>',
              className: 'custom-marker',
              iconSize: [15, 15],
              iconAnchor: [7.5, 7.5]
            });

          const marker = L.marker([park.coordinates.lat, park.coordinates.lng], { icon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #2E8B57;">${park["Name of Park"]}</h3>
                ${park.Location ? `<p><strong>Location:</strong> ${park.Location}</p>` : ''}
                ${park["Area (ha)"] ? `<p><strong>Area:</strong> ${park["Area (ha)"]} hectares</p>` : ''}
                ${park.Established ? `<p><strong>Established:</strong> ${park.Established}</p>` : ''}
              </div>
            `)
            .on('click', () => {
              onParkSelect(park);
            });

          markersRef.current.push(marker);

          // Open popup for selected park
          if (isSelected) {
            marker.openPopup();
          }
        }
      });
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  };

  return (
    <div className="nigeria-map-container">
      <div 
        ref={mapRef} 
        className="nigeria-map"
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      />
    </div>
  );
}