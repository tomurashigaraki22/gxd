'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '../context/SidebarContext';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  
  const handleNavClick = () => {
    // Close sidebar on mobile when nav item is clicked
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };
  
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
          <Link href="/" onClick={handleNavClick}>
            <div className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
              <span className="nav-icon">🏠</span>
              {isSidebarOpen && <span className="nav-text">Home</span>}
            </div>
          </Link>
          <Link href="/plants" onClick={handleNavClick}>
            <div className={`nav-item ${pathname === '/plants' ? 'active' : ''}`}>
              <span className="nav-icon">🌿</span>
              {isSidebarOpen && <span className="nav-text">Explore Plants</span>}
            </div>
          </Link>
          <Link href="/animals" onClick={handleNavClick}>
            <div className={`nav-item ${pathname === '/animals' ? 'active' : ''}`}>
              <span className="nav-icon">🦁</span>
              {isSidebarOpen && <span className="nav-text">Explore Animals</span>}
            </div>
          </Link>
          <Link href="/parks" onClick={handleNavClick}>
            <div className={`nav-item ${pathname === '/parks' ? 'active' : ''}`}>
              <span className="nav-icon">🏞️</span>
              {isSidebarOpen && <span className="nav-text">National Parks</span>}
            </div>
          </Link>
          <Link href="/alerts" onClick={handleNavClick}>
            <div className={`nav-item ${pathname === '/alerts' ? 'active' : ''}`}>
              <span className="nav-icon">⚠️</span>
              {isSidebarOpen && <span className="nav-text">Threatened Species</span>}
            </div>
          </Link>
        </nav>
      </aside>
    </>
  );
}