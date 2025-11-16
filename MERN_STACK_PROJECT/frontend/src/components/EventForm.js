import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import axios from 'axios';

const EventForm = ({ onEventCreated, editingEvent = null, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: editingEvent?.title || '',
    description: editingEvent?.description || '',
    category: editingEvent?.category || 'Conference',
    dateTime: editingEvent?.dateTime ? new Date(editingEvent.dateTime).toISOString().slice(0, 16) : '',
    duration: editingEvent?.duration || 2,
    venue: editingEvent?.location?.venue || '',
    address: editingEvent?.location?.address || '',
    city: editingEvent?.location?.city || '',
    state: editingEvent?.location?.state || '',
    zipCode: editingEvent?.location?.zipCode || '',
    capacity: editingEvent?.capacity || 50,
    price: editingEvent?.price || 0,
    requirements: editingEvent?.requirements || '',
    tags: editingEvent?.tags?.join(', ') || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Conference', 'Workshop', 'Seminar', 'Networking', 
    'Social', 'Sports', 'Cultural', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dateTime) newErrors.dateTime = 'Date and time is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (formData.duration < 0.5) newErrors.duration = 'Duration must be at least 30 minutes';
    
    // Check if date is in the future
    const eventDate = new Date(formData.dateTime);
    if (eventDate <= new Date()) {
      newErrors.dateTime = 'Event date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        dateTime: formData.dateTime,
        duration: parseFloat(formData.duration),
        location: {
          venue: formData.venue,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price) || 0,
        requirements: formData.requirements,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      let response;
      if (editingEvent) {
        response = await axios.put(
          `http://localhost:5001/api/events/${editingEvent._id}`,
          eventData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:5001/api/events',
          eventData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (response.data.success) {
        showToast.success(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
        onEventCreated();
        
        // Reset form if creating new event
        if (!editingEvent) {
          setFormData({
            title: '', description: '', category: 'Conference', dateTime: '',
            duration: 2, venue: '', address: '', city: '', state: '',
            zipCode: '', capacity: 50, price: 0, requirements: '', tags: ''
          });
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        showToast.error(error.response?.data?.message || 'Failed to save event');
      }
    }
    
    setLoading(false);
  };

  // Check if user can create events
  if (!currentUser || (currentUser.role !== 'organizer' && currentUser.role !== 'admin')) {
    return (
      <div className="alert alert-warning">
        <h4>Access Denied</h4>
        <p>You must be an organizer or admin to create events.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className={`fas fa-${editingEvent ? 'edit' : 'plus'} me-2`}></i>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label htmlFor="title" className="form-label">Event Title *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength="100"
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label htmlFor="category" className="form-label">Category *</label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength="1000"
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="dateTime" className="form-label">Date & Time *</label>
                    <input
                      type="datetime-local"
                      className={`form-control ${errors.dateTime ? 'is-invalid' : ''}`}
                      id="dateTime"
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleChange}
                    />
                    {errors.dateTime && <div className="invalid-feedback">{errors.dateTime}</div>}
                  </div>
                  
                  <div className="col-md-3 mb-3">
                    <label htmlFor="duration" className="form-label">Duration (hours) *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="0.5"
                      max="24"
                      step="0.5"
                    />
                    {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                  </div>
                  
                  <div className="col-md-3 mb-3">
                    <label htmlFor="capacity" className="form-label">Capacity *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="1"
                      max="10000"
                    />
                    {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
                  </div>
                </div>

                <h5 className="mt-4 mb-3 text-primary border-bottom pb-2">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Location Details
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="venue" className="form-label">Venue *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.venue ? 'is-invalid' : ''}`}
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                    />
                    {errors.venue && <div className="invalid-feedback">{errors.venue}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="address" className="form-label">Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="city" className="form-label">City *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label htmlFor="zipCode" className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="e.g., tech, networking, innovation"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="requirements" className="form-label">Requirements</label>
                  <textarea
                    className="form-control"
                    id="requirements"
                    name="requirements"
                    rows="2"
                    value={formData.requirements}
                    onChange={handleChange}
                    maxLength="500"
                    placeholder="Any special requirements or instructions for attendees"
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className={`btn btn-${editingEvent ? 'warning' : 'success'}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className={`fas fa-${editingEvent ? 'save' : 'plus'} me-2`}></i>
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </>
                    )}
                  </button>
                  
                  {onCancel && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
