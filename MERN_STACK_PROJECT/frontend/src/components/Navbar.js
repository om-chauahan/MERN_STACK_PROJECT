import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name, email) => {
    const source = (name || email || '').trim();
    if (!source) return 'U';
    const parts = source
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (source.includes('@')) return source.split('@')[0].slice(0, 2).toUpperCase();
    return source.slice(0, 2).toUpperCase();
  };

  const roleBadge = (role) => {
    if (role === 'admin') return { cls: 'badge bg-danger text-white', label: 'admin' };
    if (role === 'organizer') return { cls: 'badge bg-warning text-dark', label: 'organizer' };
    return { cls: 'badge bg-info text-dark', label: 'attendee' };
  };

  // Get appropriate navbar classes based on theme
  const navbarClass = theme === 'dark' 
    ? 'navbar navbar-dark bg-primary' 
    : 'navbar navbar-light bg-light';

  const buttonClass = theme === 'dark' 
    ? 'btn btn-outline-light' 
    : 'btn btn-outline-primary';

  const brandButtonClass = theme === 'dark' 
    ? 'btn btn-light' 
    : 'btn btn-primary';

  const initials = currentUser ? getInitials(currentUser.name, currentUser.email) : '';
  const badge = currentUser ? roleBadge(currentUser.role) : null;

  return (
    <nav className={navbarClass} style={{ position: 'relative', zIndex: 1050, width: '100%' }}>
      <div className="container d-flex align-items-center justify-content-between">
        {/* Left: Brand + Static Nav */}
        <div className="d-flex align-items-center">
          <Link className="navbar-brand me-3" to="/about">
            Event Management System
          </Link>
          <ul className="navbar-nav flex-row">
            <li className="nav-item me-3">
              <Link className="nav-link p-0" to="/">Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link p-0" to="/events">Events</Link>
            </li>
            {currentUser && (
              <>
                {(currentUser.role === 'organizer' || currentUser.role === 'admin') && (
                  <li className="nav-item me-3">
                    <Link className="nav-link p-0" to="/dashboard">Dashboard</Link>
                  </li>
                )}
                {(currentUser.role === 'organizer' || currentUser.role === 'admin') && (
                  <li className="nav-item me-3">
                    <Link className="nav-link p-0" to="/create-event">Create Event</Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* Right: Theme + User Block or Auth Buttons */}
        <div className="d-flex align-items-center">
          <ThemeToggle className="me-3" />
          {currentUser ? (
            <div className="d-flex align-items-center">
              {/* Dropdown (avatar as toggler) */}
              <div className="dropdown me-2">
                <button
                  id="userMenuButton"
                  className="btn p-0 border-0 bg-transparent"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  title={currentUser.name || currentUser.email}
                >
                  <div
                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-semibold"
                    style={{ width: 32, height: 32, fontSize: '0.8rem' }}
                  >
                    {initials}
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
                  <li>
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">Settings</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>

              {/* Static user labels */}
              <span className="ms-1 me-2 text-nowrap">
                {(currentUser.name || currentUser.email || '').toLowerCase()}
              </span>
              <span className={`${badge.cls} text-capitalize`}>{badge.label}</span>
            </div>
          ) : (
            <>
              <Link className={`${buttonClass} me-2`} to="/login">Login</Link>
              <Link className={brandButtonClass} to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
