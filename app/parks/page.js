'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';

// Dynamically import the map component to avoid SSR issues
const NigeriaMap = dynamic(() => import('../../components/NigeriaMap'), {
  ssr: false,
  loading: () => <div className="map-loading">Loading map...</div>
});

export default function ParksPage() {
  const { isSidebarOpen } = useSidebar();
  const [parks, setParks] = useState([]);
  const [filteredParks, setFilteredParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Nigeria national parks with their actual coordinates (matching exact names from data)
  const parkCoordinates = {
    "Kamuku": { lat: 10.7, lng: 6.2 },        // Kaduna
    "Kainji": { lat: 10.4, lng: 4.6 },        // Niger
    "Old Oyo": { lat: 8.5, lng: 3.8 },        // Oyo
    "Okomu": { lat: 6.3, lng: 5.6 },          // Edo
    "Cross River": { lat: 5.7, lng: 8.7 },    // Cross River
    "Gashaka Gumti": { lat: 7.3, lng: 11.5 }, // Taraba
    "Chad Basin": { lat: 12.5, lng: 14.2 }    // Borno
  };
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/biodiversity.json');
        const data = await response.json();
        
        // Get national parks data from the correct key in the JSON
        const parksData = data["National Parks"] || [];
        
        // Add coordinates to parks data
        const parksWithCoords = parksData.map(park => ({
          ...park,
          coordinates: parkCoordinates[park["Name of Park"]] || { lat: 9.0, lng: 8.0 }
        }));
        
        setParks(parksWithCoords);
        setFilteredParks(parksWithCoords);
        if (parksWithCoords.length > 0) {
          setSelectedPark(parksWithCoords[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching park data:', error);
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  const handleSearch = (query) => {
    if (!query) {
      setFilteredParks(parks);
      return;
    }
    
    const filtered = parks.filter(park => 
      park["Name of Park"]?.toLowerCase().includes(query.toLowerCase()) ||
      park.Location?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredParks(filtered);
    if (filtered.length > 0 && !filtered.includes(selectedPark)) {
      setSelectedPark(filtered[0]);
    }
  };

  const handleParkSelect = (park) => {
    setSelectedPark(park);
  };
  
  return (
    <div className="container">
      <Sidebar />
      <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <Header title="National Parks & Game Reserves" showSearch={true} onSearch={handleSearch} />
        
        {loading ? (
          <div className="loading">Loading park data...</div>
        ) : (
          <div className="parks-container">
            <div className="parks-map">
              <NigeriaMap 
                parks={filteredParks}
                selectedPark={selectedPark}
                onParkSelect={handleParkSelect}
              />
            </div>
            
            {selectedPark && (
              <div className="park-details">
                <div className="info-card">
                  <h2>{selectedPark["Name of Park"] || 'Unknown Park'}</h2>
                  {selectedPark.Location && <p><strong>Location:</strong> {selectedPark.Location}</p>}
                  {selectedPark["Area (ha)"] && <p><strong>Area:</strong> {selectedPark["Area (ha)"]} hectares</p>}
                  {selectedPark.Established && <p><strong>Established:</strong> {selectedPark.Established}</p>}
                  {selectedPark["Vegetation Type"] && <p><strong>Vegetation:</strong> {selectedPark["Vegetation Type"]}</p>}
                  {selectedPark.coordinates && (
                    <p><strong>Coordinates:</strong> {selectedPark.coordinates.lat.toFixed(2)}°N, {selectedPark.coordinates.lng.toFixed(2)}°E</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}