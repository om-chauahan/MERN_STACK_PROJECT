import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import axios from 'axios';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    organization: '',
    website: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        organization: currentUser.organization || '',
        website: currentUser.website || ''
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5001/api/auth/profile',
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        updateUser(response.data.user);
        showToast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showToast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view your profile.
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
        <div className="col-lg-4">
          {/* Profile Card */}
          <div className="card mb-4">
            <div className="card-body text-center">
              <div className="avatar-circle-lg mx-auto mb-3 d-flex align-items-center justify-content-center">
                {getInitials(currentUser.name)}
              </div>
              <h4>{currentUser.name}</h4>
              <p className="text-muted">{currentUser.email}</p>
              <span className={`badge ${getRoleBadgeClass(currentUser.role)} mb-3`}>
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </span>
              
              {formData.organization && (
                <div className="mb-2">
                  <i className="fas fa-building me-2"></i>
                  {formData.organization}
                </div>
              )}
              
              {formData.website && (
                <div className="mb-2">
                  <i className="fas fa-globe me-2"></i>
                  <a href={formData.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </div>
              )}
              
              <div className="text-muted small">
                Member since {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {/* Profile Form */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-user-edit me-2"></i>
                Edit Profile
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled // Email usually shouldn't be editable
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="organization" className="form-label">Organization</label>
                    <input
                      type="text"
                      className="form-control"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Company or Organization"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="website" className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-control"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea
                    className="form-control"
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself..."
                    maxLength="500"
                  ></textarea>
                  <div className="form-text">
                    {formData.bio.length}/500 characters
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;