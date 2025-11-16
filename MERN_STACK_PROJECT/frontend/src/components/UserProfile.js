import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfile = ({ onLogout }) => {
  const { currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role badge color
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-danger';
      case 'organizer':
        return 'bg-warning text-dark';
      case 'attendee':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentUser) return null;

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn p-0 border-0 bg-transparent d-flex align-items-center"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
      >
        {/* Avatar */}
        <div className="user-avatar me-2">
          <div className="avatar-circle d-flex align-items-center justify-content-center">
            {getInitials(currentUser.name)}
          </div>
        </div>
        
        {/* User Info */}
        <div className="user-info text-start me-2 d-none d-md-block">
          <div className="d-flex align-items-center">
            <span className="user-name me-2">{currentUser.name}</span>
            <span className={`badge ${getRoleBadgeClass(currentUser.role)} badge-sm`}>
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <i className={`bi bi-chevron-${isDropdownOpen ? 'up' : 'down'} text-muted`}></i>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="dropdown-menu dropdown-menu-end show user-dropdown-menu"
            style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1000 }}
          >
            {/* User Info Header */}
            <div className="dropdown-header">
              <div className="d-flex align-items-center">
                <div className="user-avatar-sm me-2">
                  <div className="avatar-circle-sm d-flex align-items-center justify-content-center">
                    {getInitials(currentUser.name)}
                  </div>
                </div>
                <div>
                  <div className="fw-bold">{currentUser.name}</div>
                  <small className="text-muted">{currentUser.email}</small>
                  <div>
                    <span className={`badge ${getRoleBadgeClass(currentUser.role)} badge-sm`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            {/* Menu Items */}
            <Link 
              className="dropdown-item d-flex align-items-center" 
              to="/profile"
              onClick={() => setIsDropdownOpen(false)}
            >
              <i className="bi bi-person me-2"></i>
              Profile
            </Link>

            {(currentUser.role === 'admin' || currentUser.role === 'organizer') && (
              <Link 
                className="dropdown-item d-flex align-items-center" 
                to="/dashboard"
                onClick={() => setIsDropdownOpen(false)}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </Link>
            )}

            <Link 
              className="dropdown-item d-flex align-items-center" 
              to="/settings"
              onClick={() => setIsDropdownOpen(false)}
            >
              <i className="bi bi-gear me-2"></i>
              Settings
            </Link>

            <div className="dropdown-divider"></div>

            <button 
              className="dropdown-item d-flex align-items-center text-danger"
              onClick={() => {
                setIsDropdownOpen(false);
                onLogout();
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
