import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { EventListSkeleton } from './SkeletonLoaders';
import { NoEventsAvailable, LoadingError, NoSearchResults } from './EmptyState';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const filterEvents = useCallback(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(event =>
        (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.venue || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.city || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, categoryFilter]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, categoryFilter, filterEvents]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/events');
      if (response.data.success) {
        setEvents(response.data.data);
        setFilteredEvents(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
      setLoading(false);
    }
  };

  const [actionLoading, setActionLoading] = useState({});

  const handleRegister = async (eventId) => {
    if (!currentUser) {
      showToast.warning('Please login to register for events');
      return;
    }

    setActionLoading(prev => ({ ...prev, [eventId]: 'registering' }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/events/${eventId}/register`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Show success message with better styling
        const event = events.find(e => e._id === eventId);
        showToast.success(`Successfully registered for "${event?.title}"!`);
        fetchEvents(); // Refresh the events list
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        showToast.error(error.response.data.message);
      } else {
        showToast.error('Failed to register for event');
      }
    }
    
    setActionLoading(prev => ({ ...prev, [eventId]: null }));
  };

  const handleUnregister = async (eventId) => {
    setActionLoading(prev => ({ ...prev, [eventId]: 'unregistering' }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5001/api/events/${eventId}/register`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const event = events.find(e => e._id === eventId);
        showToast.success(`Successfully unregistered from "${event?.title}"!`);
        fetchEvents(); // Refresh the events list
      }
    } catch (error) {
      console.error('Unregistration error:', error);
      showToast.error('Failed to unregister from event');
    }
    
    setActionLoading(prev => ({ ...prev, [eventId]: null }));
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:5001/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          showToast.success(`Event "${eventTitle}" deleted successfully!`);
          fetchEvents(); // Refresh the events list
        }
      } catch (error) {
        console.error('Delete event error:', error);
        showToast.error(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  const getStatusBadge = (event) => {
    const eventDate = new Date(event.dateTime);
    const eventEnd = new Date(eventDate.getTime() + (event.duration * 60 * 60 * 1000));
    const now = new Date();
    
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
    
    return { currentStatus, statusBadge };
  };

  const isUserRegistered = (event) => {
    return event.attendees?.some(attendee => attendee.user === currentUser?.id);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <i className="fas fa-calendar-alt me-2"></i>
            Browse Events
          </h2>
        </div>
        <EventListSkeleton count={6} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <LoadingError onRetry={fetchEvents} />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-calendar-alt me-2"></i>
          Browse Events
        </h2>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-info fs-6">
            <i className="fas fa-list me-1"></i>
            {filteredEvents.length} of {events.length} events
          </span>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={fetchEvents}
            title="Refresh events"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search events by title, description, venue, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchTerm('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Networking">Networking</option>
            <option value="Training">Training</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-center">
          {(searchTerm || categoryFilter) && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
            >
              <i className="fas fa-filter-circle-xmark me-1"></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {events.length === 0 ? (
        <NoEventsAvailable />
      ) : filteredEvents.length === 0 ? (
        <NoSearchResults searchTerm={searchTerm || categoryFilter} />
      ) : (
        <div className="row">
          {filteredEvents.map(event => {
            const eventDate = new Date(event.dateTime);
            const { currentStatus, statusBadge } = getStatusBadge(event);
            const isRegistered = isUserRegistered(event);
            const availableSpots = event.capacity - event.attendees.length;

            return (
              <div key={event._id} className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title">{event.title}</h5>
                      <span className={`badge ${statusBadge}`}>{currentStatus}</span>
                    </div>
                    
                    <p className="card-text">{event.description}</p>
                    
                    <div className="mb-2">
                      <small className="text-muted">
                        <div className="mb-1">
                          <i className="fas fa-calendar text-primary me-1"></i> 
                          {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div className="mb-1">
                          <i className="fas fa-clock text-info me-1"></i> 
                          Duration: {event.duration} hours
                        </div>
                        <div className="mb-1">
                          <i className="fas fa-map-marker-alt text-danger me-1"></i> 
                          {event.location.venue}, {event.location.city}
                        </div>
                        <div className="mb-1">
                          <i className="fas fa-tag text-success me-1"></i> 
                          {event.category}
                        </div>
                        {event.price > 0 && (
                          <div className="mb-1">
                            <i className="fas fa-dollar-sign text-warning me-1"></i> 
                            ${event.price}
                          </div>
                        )}
                      </small>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark">
                          <i className="fas fa-users me-1"></i>
                          {event.attendees.length}/{event.capacity} registered
                        </span>
                        {isRegistered && (
                          <span className="badge bg-success">
                            <i className="fas fa-check me-1"></i>
                            You're registered
                          </span>
                        )}
                      </div>
                      <span className={`text-${availableSpots > 0 ? 'success' : 'danger'}`}>
                        <i className={`fas fa-${availableSpots > 0 ? 'check-circle' : 'times-circle'} me-1`}></i>
                        {availableSpots > 0 ? `${availableSpots} spots available` : 'Event Full'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    {currentUser ? (
                      <div>
                        {currentUser.role === 'attendee' ? (
                          isRegistered ? (
                            <button 
                              className="btn btn-outline-danger btn-sm w-100"
                              onClick={() => handleUnregister(event._id)}
                              disabled={actionLoading[event._id]}
                            >
                              {actionLoading[event._id] === 'unregistering' ? (
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
                              className="btn btn-primary btn-sm w-100"
                              onClick={() => handleRegister(event._id)}
                              disabled={actionLoading[event._id]}
                            >
                              {actionLoading[event._id] === 'registering' ? (
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
                            <button className="btn btn-secondary btn-sm w-100" disabled>
                              <i className="fas fa-ban me-1"></i>
                              {availableSpots === 0 ? 'Event Full' : 'Registration Closed'}
                            </button>
                          )
                        ) : (
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-outline-primary btn-sm flex-fill"
                              onClick={() => navigate(`/events/${event._id}`)}
                            >
                              <i className="fas fa-eye me-1"></i>
                              View Details
                            </button>
                            {(() => {
                              const currentUserId = currentUser.id || currentUser._id;
                              const eventOrganizerId = event.organizer?._id || event.organizer;
                              const isOwner = currentUser.role === 'admin' || eventOrganizerId === currentUserId;
                              return isOwner;
                            })() && (
                              <>
                                <button 
                                  className="btn btn-outline-warning btn-sm"
                                  onClick={() => navigate(`/edit-event/${event._id}`)}
                                >
                                  <i className="fas fa-edit me-1"></i>
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteEvent(event._id, event.title)}
                                >
                                  <i className="fas fa-trash me-1"></i>
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <small className="text-muted">Please login to register for events</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
