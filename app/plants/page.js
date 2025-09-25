'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';

export default function PlantsPage() {
  const { isSidebarOpen } = useSidebar();
  const [plantGroups, setPlantGroups] = useState([]);
  const [filteredPlantGroups, setFilteredPlantGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/biodiversity.json');
        const data = await response.json();
        
        // Get plant species data from the correct key in the JSON
        const plantsData = data["Plant Species"] || [];
        setPlantGroups(plantsData);
        setFilteredPlantGroups(plantsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plant data:', error);
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  const handleSearch = (query) => {
    if (!query) {
      setFilteredPlantGroups(plantGroups);
      return;
    }
    
    const filtered = plantGroups.filter(plant => 
      plant["Plant Group"]?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredPlantGroups(filtered);
  };
  
  return (
    <div className="container">
      <Sidebar />
      <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <Header title="Plants Catalog" showSearch={true} onSearch={handleSearch} />
        
        {loading ? (
          <div className="loading">Loading plant data...</div>
        ) : (
          <div className="content-area">
            {filteredPlantGroups.length === 0 ? (
              <div className="no-results">No plants found matching your search.</div>
            ) : (
              <div className="card-grid">
                {filteredPlantGroups.map((plant, index) => (
                  <div key={index} className="info-card">
                    <h3>{plant["Plant Group"]}</h3>
                    {plant.Families && <p>Families: {plant.Families}</p>}
                    {plant.Genera && <p>Genera: {plant.Genera}</p>}
                    {plant.Species && <p>Species: {plant.Species}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}