'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';

export default function ParksPage() {
  const { isSidebarOpen } = useSidebar();
  const [parks, setParks] = useState([]);
  const [filteredParks, setFilteredParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/biodiversity.json');
        const data = await response.json();
        
        // Get national parks data from the correct key in the JSON
        const parksData = data["National Parks"] || [];
        setParks(parksData);
        setFilteredParks(parksData);
        if (parksData.length > 0) {
          setSelectedPark(parksData[0]);
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
              <div className="map-placeholder">
                <h3>Nigeria National Parks Map</h3>
                <div className="map-markers">
                  {filteredParks.map((park, index) => (
                    <div 
                      key={index} 
                      className={`map-marker ${selectedPark === park ? 'active' : ''}`}
                      onClick={() => setSelectedPark(park)}
                      style={{ 
                        top: `${Math.random() * 70 + 10}%`, 
                        left: `${Math.random() * 70 + 10}%` 
                      }}
                    >
                      📍
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {selectedPark && (
              <div className="park-details">
                <div className="info-card">
                  <h2>{selectedPark["Name of Park"] || 'Unknown Park'}</h2>
                  {selectedPark.Location && <p>Location: {selectedPark.Location}</p>}
                  {selectedPark["Area (ha)"] && <p>Area: {selectedPark["Area (ha)"]} hectares</p>}
                  {selectedPark.Established && <p>Established: {selectedPark.Established}</p>}
                  {selectedPark["Vegetation Type"] && <p>Vegetation: {selectedPark["Vegetation Type"]}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}