'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';

export default function AlertsPage() {
  const { isSidebarOpen } = useSidebar();
  const [threatenedSpecies, setThreatenedSpecies] = useState([]);
  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plants'); // 'plants' or 'animals'
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/biodiversity.json');
        const data = await response.json();
        
        // Get threatened species data from the correct keys in the JSON
        const threatenedPlants = data["Threatened Plants"] || [];
        const threatenedAnimals = data["Threatened Animals"] || [];
        
        // Combine and mark the type
        const combinedData = [
          ...threatenedPlants.map(plant => ({ ...plant, type: 'plant' })),
          ...threatenedAnimals.map(animal => ({ ...animal, type: 'animal' }))
        ];
        
        setThreatenedSpecies(combinedData);
        // Initially show plants
        setFilteredSpecies(combinedData.filter(species => species.type === 'plant'));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching threatened species data:', error);
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  useEffect(() => {
    // Filter by active tab
    const filtered = threatenedSpecies.filter(species => species.type === activeTab);
    setFilteredSpecies(filtered);
  }, [activeTab, threatenedSpecies]);
  
  const handleSearch = (query) => {
    if (!query) {
      // If no query, show based on active tab
      setFilteredSpecies(threatenedSpecies.filter(species => species.type === activeTab));
      return;
    }
    
    const filtered = threatenedSpecies.filter(species => 
      species.type === activeTab && (
        species.Species?.toLowerCase().includes(query.toLowerCase()) ||
        species.Status?.toLowerCase().includes(query.toLowerCase()) ||
        species["Main Uses"]?.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setFilteredSpecies(filtered);
  };
  
  return (
    <div className="container">
      <Sidebar />
      <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <Header title="Threatened Species Alerts" showSearch={true} onSearch={handleSearch} />
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'plants' ? 'active' : ''}`}
            onClick={() => setActiveTab('plants')}
          >
            Threatened Plants
          </button>
          <button 
            className={`tab ${activeTab === 'animal' ? 'active' : ''}`}
            onClick={() => setActiveTab('animal')}
          >
            Threatened Animals
          </button>
        </div>
        
        {loading ? (
          <div className="loading">Loading threatened species data...</div>
        ) : (
          <div className="content-area">
            <div className="card-grid">
              {filteredSpecies.length === 0 ? (
                <div className="no-results">No threatened species found matching your search.</div>
              ) : (
                filteredSpecies.map((species, index) => (
                  <div key={index} className="info-card">
                    <h3>{species.Species || 'Unknown Species'}</h3>
                    {species.Status && <p className="status">Status: {species.Status}</p>}
                    {species["Main Uses"] && <p>Main Uses: {species["Main Uses"]}</p>}
                    <button className="action-btn">Conservation Actions</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}