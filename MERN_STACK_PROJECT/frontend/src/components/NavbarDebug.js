import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import UserProfile from './UserProfile';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Initialize Bootstrap components when component mounts
  useEffect(() => {
    // Ensure Bootstrap is loaded
    if (window.bootstrap) {
      console.log('Bootstrap is loaded successfully');
    } else {
      console.warn('Bootstrap is not loaded');
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get appropriate navbar classes based on theme
  const navbarClass = theme === 'dark' 
    ? 'navbar navbar-expand-lg navbar-dark bg-primary' 
    : 'navbar navbar-expand-lg navbar-light bg-light';

  const buttonClass = theme === 'dark' 
    ? 'btn btn-outline-light' 
    : 'btn btn-outline-primary';

  const brandButtonClass = theme === 'dark' 
    ? 'btn btn-light' 
    : 'btn btn-primary';

  return (
    <nav className={navbarClass} style={{
      position: 'relative', 
      zIndex: 1050, 
      width: '100%',
      display: 'block !important',
      visibility: 'visible !important'
    }}>
      <div className="container">
        <Link className="navbar-brand" to="/about" style={{
          display: 'block !important',
          visibility: 'visible !important'
        }}>
          Event Management System
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(0,0,0,0.1)',
            borderRadius: '4px',
            display: 'block !important',
            visibility: 'visible !important'
          }}
          onClick={() => console.log('Navbar toggle clicked')}
        >
          <span 
            className="navbar-toggler-icon"
            style={{
              backgroundImage: theme === 'dark' 
                ? "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.85%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")"
                : "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")",
              display: 'block !important'
            }}
          ></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">Events</Link>
            </li>
            {currentUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                {(currentUser.role === 'organizer' || currentUser.role === 'admin') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/create-event">Create Event</Link>
                  </li>
                )}
              </>
            )}
          </ul>
          
          <div className="navbar-nav">
            {currentUser ? (
              <div className="d-flex align-items-center">
                <ThemeToggle className="me-3" />
                <UserProfile onLogout={handleLogout} />
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <ThemeToggle className="me-3" />
                <Link className={`${buttonClass} me-2`} to="/login">
                  Login
                </Link>
                <Link className={brandButtonClass} to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;