import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dateTime: '',
    duration: '',
    location: {
      venue: '',
      address: '',
      city: ''
    },
    capacity: '',
    price: '',
    requirements: ''
  });

  useEffect(() => {
    fetchEventData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchEventData = async () => {
    try {
      console.log('Fetching event data for editing, ID:', id);
      const response = await axios.get(`http://localhost:5001/api/events/${id}`);
      
      if (response.data.success) {
        const event = response.data.data;
        
        // Check if user can edit this event
        const currentUserId = currentUser.id || currentUser._id;
        const eventOrganizerId = event.organizer?._id || event.organizer;
        
        console.log('Edit permission check:', {
          currentUserId,
          eventOrganizerId,
          currentUserRole: currentUser.role,
          eventOrganizer: event.organizer
        });
        
        const isOwner = eventOrganizerId === currentUserId;
        
        if (currentUser.role !== 'admin' && !isOwner) {
          alert('❌ You can only edit your own events');
          navigate('/events');
          return;
        }

        // Convert date to input format
        const eventDate = new Date(event.dateTime);
        const formattedDate = eventDate.toISOString().slice(0, 16);

        setFormData({
          title: event.title,
          description: event.description,
          category: event.category,
          dateTime: formattedDate,
          duration: event.duration,
          location: {
            venue: event.location.venue,
            address: event.location.address,
            city: event.location.city
          },
          capacity: event.capacity,
          price: event.price || '',
          requirements: event.requirements || ''
        });
        
        console.log('Event data loaded for editing:', event);
      }
    } catch (error) {
      console.error('Error fetching event for edit:', error);
      alert('❌ Failed to load event data');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log('Submitting event update:', formData);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:5001/api/events/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Event updated successfully:', response.data);
        alert('✅ Event updated successfully!');
        navigate(`/events/${id}`);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        alert(`❌ Validation Error: ${errorMessages}`);
      } else {
        alert(`❌ ${error.response?.data?.message || 'Failed to update event'}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h3>
                  <i className="fas fa-edit me-2"></i>
                  Edit Event
                </h3>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate(`/events/${id}`)}
                >
                  <i className="fas fa-arrow-left me-1"></i>
                  Back to Event
                </button>
              </div>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label htmlFor="title" className="form-label">
                      <i className="fas fa-heading me-1"></i>Event Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      maxLength="100"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="category" className="form-label">
                      <i className="fas fa-tag me-1"></i>Category *
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Conference">Conference</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Networking">Networking</option>
                      <option value="Social">Social</option>
                      <option value="Sports">Sports</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    <i className="fas fa-align-left me-1"></i>Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    maxLength="1000"
                  />
                  <div className="form-text">
                    {formData.description.length}/1000 characters
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="dateTime" className="form-label">
                      <i className="fas fa-calendar me-1"></i>Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="dateTime"
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="duration" className="form-label">
                      <i className="fas fa-clock me-1"></i>Duration (hours) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="0.5"
                      max="24"
                      step="0.5"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-map-marker-alt me-1"></i>Location *
                  </label>
                  <div className="row">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Venue Name"
                        name="location.venue"
                        value={formData.location.venue}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="capacity" className="form-label">
                      <i className="fas fa-users me-1"></i>Capacity *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      max="10000"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label">
                      <i className="fas fa-dollar-sign me-1"></i>Price (optional)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="requirements" className="form-label">
                    <i className="fas fa-list me-1"></i>Requirements (optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="requirements"
                    name="requirements"
                    rows="3"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Any special requirements or things attendees should know..."
                  />
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating Event...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-1"></i>
                        Update Event
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(`/events/${id}`)}
                    disabled={submitting}
                  >
                    <i className="fas fa-times me-1"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
