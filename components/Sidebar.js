'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  
  return (
    <>
      <button 
        className="sidebar-toggle-btn" 
        onClick={toggleSidebar} 
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>
      
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo">
          <Image src="/file.svg" alt="Logo" width={40} height={40} className="logo-icon" />
          {isSidebarOpen && (
            <div className="logo-text">
              <h2>Nigeria</h2>
              <h3>Biodiversity</h3>
              <h4>Compendium</h4>
            </div>
          )}
        </div>
        
        <nav>
          <Link href="/">
            <div className="nav-item">
              <span className="nav-icon">🏠</span>
              {isSidebarOpen && <span className="nav-text">Home</span>}
            </div>
          </Link>
          <Link href="/plants">
            <div className="nav-item">
              <span className="nav-icon">🌿</span>
              {isSidebarOpen && <span className="nav-text">Explore Plants</span>}
            </div>
          </Link>
          <Link href="/animals">
            <div className="nav-item">
              <span className="nav-icon">🦁</span>
              {isSidebarOpen && <span className="nav-text">Explore Animals</span>}
            </div>
          </Link>
          <Link href="/parks">
            <div className="nav-item">
              <span className="nav-icon">🏞️</span>
              {isSidebarOpen && <span className="nav-text">National Parks</span>}
            </div>
          </Link>
          <Link href="/alerts">
            <div className="nav-item">
              <span className="nav-icon">⚠️</span>
              {isSidebarOpen && <span className="nav-text">Threatened Species</span>}
            </div>
          </Link>
        </nav>
      </aside>
    </>
  );
}