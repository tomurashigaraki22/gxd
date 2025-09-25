'use client';

import { useSidebar } from '../context/SidebarContext';

export default function Header({ title, showSearch, onSearch }) {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  
  return (
    <header className="header">
      <div className="header-left">
        <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <h1>{title}</h1>
      </div>
      
      {showSearch && (
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search..." 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}
    </header>
  );
}