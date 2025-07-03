import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Upload, FileText, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          RAG Support Search
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Home size={18} />
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/search" 
              className={`nav-link ${isActive('/search') ? 'active' : ''}`}
            >
              <Search size={18} />
              Search
            </Link>
          </li>
          <li>
            <Link 
              to="/upload" 
              className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
            >
              <Upload size={18} />
              Upload
            </Link>
          </li>
          <li>
            <Link 
              to="/documents" 
              className={`nav-link ${isActive('/documents') ? 'active' : ''}`}
            >
              <FileText size={18} />
              Documents
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 