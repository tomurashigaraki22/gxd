'use client';

import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useSidebar } from '../context/SidebarContext';

export default function Home() {
  const { isSidebarOpen } = useSidebar();
  
  return (
    <div className="container">
      <Sidebar />
      <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <Header title="Nigeria Biodiversity Compendium" />
        
        <div className="home-content">
          <div className="welcome-section">
            <h2>Welcome to Nigeria's Biodiversity Portal</h2>
            <p>Explore the rich biodiversity of Nigeria through our comprehensive database of plants, animals, national parks, and conservation efforts.</p>
          </div>
          
          <div className="card-grid">
            <Link href="/plants">
              <div className="info-card">
                <h3>Plants</h3>
                <p>Explore Nigeria's diverse plant species, from rainforest trees to savanna grasses.</p>
              </div>
            </Link>
            
            <Link href="/animals">
              <div className="info-card">
                <h3>Animals</h3>
                <p>Discover Nigeria's wildlife, including mammals, birds, reptiles, and more.</p>
              </div>
            </Link>
            
            <Link href="/parks">
              <div className="info-card">
                <h3>National Parks</h3>
                <p>Visit Nigeria's protected areas and learn about conservation efforts.</p>
              </div>
            </Link>
            
            <Link href="/alerts">
              <div className="info-card">
                <h3>Threatened Species</h3>
                <p>Learn about endangered species and conservation initiatives in Nigeria.</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
