import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { showToast } from '../utils/toast';
import axios from 'axios';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Notification preferences removed as requested

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete('http://localhost:5001/api/auth/delete-account', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          showToast.success('Account deleted successfully');
          logout();
        } catch (error) {
          showToast.error('Failed to delete account');
        }
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to access settings.
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mt-4"
    >
      <div className="row">
        <div className="col-lg-3">
          {/* Settings Navigation (no card wrapper) */}
          <div className="mb-4">
            <div className="list-group">
              <button className="list-group-item list-group-item-action active">
                <i className="fas fa-cog me-2"></i>
                General
              </button>
              <button className="list-group-item list-group-item-action">
                <i className="fas fa-lock me-2"></i>
                Security
              </button>
              <button className="list-group-item list-group-item-action">
                <i className="fas fa-palette me-2"></i>
                Appearance
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          {/* General Settings */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                General Settings
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Account Information</h6>
                  <p className="text-muted">Manage your account details</p>
                  <div className="mb-3">
                    <strong>Name:</strong> {currentUser.name}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {currentUser.email}
                  </div>
                  <div className="mb-3">
                    <strong>Role:</strong> 
                    <span className={`badge ms-2 ${
                      currentUser.role === 'admin' ? 'bg-danger' :
                      currentUser.role === 'organizer' ? 'bg-warning text-dark' : 'bg-info'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6>Quick Actions</h6>
                  <p className="text-muted">Common account actions</p>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => window.location.href = '/profile'}
                    >
                      <i className="fas fa-user-edit me-2"></i>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-palette me-2"></i>
                Appearance
              </h5>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h6>Theme</h6>
                  <p className="text-muted mb-0">Choose your preferred theme</p>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="themeSwitch"
                      checked={theme === 'dark'}
                      onChange={toggleTheme}
                    />
                    <label className="form-check-label" htmlFor="themeSwitch">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings removed as requested */}

          {/* Danger Zone */}
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Danger Zone
              </h5>
            </div>
            <div className="card-body">
              <h6>Delete Account</h6>
              <p className="text-muted">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                className="btn btn-outline-danger"
                onClick={handleDeleteAccount}
              >
                <i className="fas fa-trash-alt me-2"></i>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;