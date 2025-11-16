import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEventDetails = async () => {
    try {
      console.log('Fetching event details for ID:', id);
      const response = await axios.get(`http://localhost:5001/api/events/${id}`);
      
      if (response.data.success) {
        setEvent(response.data.data);
        console.log('Event details fetched:', response.data.data);
      } else {
        setError('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError(error.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegister = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/events/${id}/register`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('✅ Successfully registered for event!');
        fetchEventDetails(); // Refresh event data
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(`❌ ${error.response?.data?.message || 'Failed to register'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5001/api/events/${id}/register`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('✅ Successfully unregistered from event!');
        fetchEventDetails(); // Refresh event data
      }
    } catch (error) {
      console.error('Unregistration error:', error);
      alert(`❌ ${error.response?.data?.message || 'Failed to unregister'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('✅ Event deleted successfully!');
        navigate('/events');
      } catch (error) {
        console.error('Delete error:', error);
        alert(`❌ ${error.response?.data?.message || 'Failed to delete event'}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/events')}>
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4>Event Not Found</h4>
          <p>The event you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/events')}>
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.dateTime);
  const now = new Date();
  const eventEnd = new Date(eventDate.getTime() + (event.duration * 60 * 60 * 1000));
  
  let currentStatus = 'upcoming';
  let statusBadge = 'bg-primary';
  
  if (event.status === 'cancelled') {
    currentStatus = 'cancelled';
    statusBadge = 'bg-danger';
  } else if (now >= eventDate && now <= eventEnd) {
    currentStatus = 'live';
    statusBadge = 'bg-success';
  } else if (now > eventEnd) {
    currentStatus = 'completed';
    statusBadge = 'bg-secondary';
  }

  const isUserRegistered = event.attendees?.some(attendee => 
    attendee.user === currentUser?.id || attendee.user?._id === currentUser?.id ||
    attendee.user === currentUser?._id || attendee.user?._id === currentUser?._id
  );
  const availableSpots = event.capacity - event.attendees.length;
  
  const currentUserId = currentUser?.id || currentUser?._id;
  const eventOrganizerId = event.organizer?._id || event.organizer;
  const isOwner = eventOrganizerId === currentUserId;
  const canEdit = currentUser && (currentUser.role === 'admin' || isOwner);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h1 className="h3 mb-1">{event.title}</h1>
                  <span className={`badge ${statusBadge}`}>{currentStatus}</span>
                </div>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/events')}
                >
                  <i className="fas fa-arrow-left me-1"></i>
                  Back to Events
                </button>
              </div>
            </div>
            
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6><i className="fas fa-calendar text-primary me-2"></i>Date & Time</h6>
                  <p>{eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="col-md-6">
                  <h6><i className="fas fa-clock text-info me-2"></i>Duration</h6>
                  <p>{event.duration} hours</p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h6><i className="fas fa-map-marker-alt text-danger me-2"></i>Location</h6>
                  <p>
                    {event.location.venue}<br/>
                    {event.location.address}<br/>
                    {event.location.city}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6><i className="fas fa-tag text-success me-2"></i>Category</h6>
                  <p>{event.category}</p>
                </div>
              </div>

              <div className="mb-4">
                <h6><i className="fas fa-info-circle text-secondary me-2"></i>Description</h6>
                <p className="text-muted">{event.description}</p>
              </div>

              {event.requirements && (
                <div className="mb-4">
                  <h6><i className="fas fa-list text-warning me-2"></i>Requirements</h6>
                  <p className="text-muted">{event.requirements}</p>
                </div>
              )}

              <div className="row mb-4">
                <div className="col-md-6">
                  <h6><i className="fas fa-user text-primary me-2"></i>Organizer</h6>
                  <p>{event.organizer?.name || 'Unknown Organizer'}</p>
                </div>
                <div className="col-md-6">
                  <h6><i className="fas fa-users text-success me-2"></i>Registration</h6>
                  <p>
                    {event.attendees.length} / {event.capacity} registered
                    <br/>
                    <small className="text-muted">
                      {availableSpots > 0 ? `${availableSpots} spots available` : 'Event is full'}
                    </small>
                  </p>
                </div>
              </div>

              {event.price > 0 && (
                <div className="mb-4">
                  <h6><i className="fas fa-dollar-sign text-warning me-2"></i>Price</h6>
                  <p className="h5 text-success">${event.price}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6>Event Actions</h6>
            </div>
            <div className="card-body">
              {currentUser ? (
                <div className="d-grid gap-2">
                  {currentUser.role === 'attendee' ? (
                    isUserRegistered ? (
                      <button 
                        className="btn btn-outline-danger"
                        onClick={handleUnregister}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Unregistering...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times me-1"></i>
                            Unregister
                          </>
                        )}
                      </button>
                    ) : availableSpots > 0 && currentStatus === 'upcoming' ? (
                      <button 
                        className="btn btn-primary"
                        onClick={handleRegister}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Registering...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus me-1"></i>
                            Register for Event
                          </>
                        )}
                      </button>
                    ) : (
                      <button className="btn btn-secondary" disabled>
                        <i className="fas fa-ban me-1"></i>
                        {availableSpots === 0 ? 'Event Full' : 'Registration Closed'}
                      </button>
                    )
                  ) : (
                    <p className="text-muted">
                      <i className="fas fa-info-circle me-2"></i>
                      {currentUser.role === 'organizer' ? 'Organizers cannot register for events' : 'Admins can manage all events'}
                    </p>
                  )}

                  {canEdit && (
                    <>
                      <button 
                        className="btn btn-outline-warning"
                        onClick={handleEdit}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Edit Event
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={handleDelete}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Delete Event
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted mb-3">Please login to register for this event</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>

          {event.attendees.length > 0 && (
            <div className="card mt-3">
              <div className="card-header">
                <h6>Registered Attendees</h6>
              </div>
              <div className="card-body">
                {event.attendees.slice(0, 5).map((attendee, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <i className="fas fa-user-circle text-primary me-2"></i>
                    <span>{attendee.user?.name || 'Anonymous'}</span>
                  </div>
                ))}
                {event.attendees.length > 5 && (
                  <small className="text-muted">
                    +{event.attendees.length - 5} more attendees
                  </small>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
