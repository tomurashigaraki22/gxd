'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';

export default function AnimalsPage() {
  const { isSidebarOpen } = useSidebar();
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/biodiversity.json');
        const data = await response.json();
        
        // Get threatened animals data from the correct key in the JSON
        const animalsData = data["Threatened Animals"] || [];
        setAnimals(animalsData);
        setFilteredAnimals(animalsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching animal data:', error);
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  const handleSearch = (query) => {
    if (!query) {
      setFilteredAnimals(animals);
      return;
    }
    
    const filtered = animals.filter(animal => 
      animal.Species?.toLowerCase().includes(query.toLowerCase()) ||
      animal.Status?.toLowerCase().includes(query.toLowerCase()) ||
      animal["Main Uses"]?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredAnimals(filtered);
  };
  
  return (
    <div className="container">
      <Sidebar />
      <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <Header title="Explore Animals" showSearch={true} onSearch={handleSearch} />
        
        {loading ? (
          <div className="loading">Loading animal data...</div>
        ) : (
          <div className="content-area">
            <h2 className="section-title">Threatened Animal Species in Nigeria</h2>
            
            <div className="card-grid">
              {filteredAnimals.length === 0 ? (
                <div className="no-results">No animals found matching your search.</div>
              ) : (
                filteredAnimals.map((animal, index) => (
                  <div key={index} className="info-card">
                    <h3>{animal.Species || 'Unknown Species'}</h3>
                    {animal.Status && <p className="status">Status: {animal.Status}</p>}
                    {animal["Main Uses"] && <p>Main Uses: {animal["Main Uses"]}</p>}
                    <button className="action-btn">Conservation Details</button>
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