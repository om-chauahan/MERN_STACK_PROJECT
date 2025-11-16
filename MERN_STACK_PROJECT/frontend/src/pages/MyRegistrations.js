import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { EventListSkeleton } from '../components/SkeletonLoaders';
import { NoRegistrations } from '../components/EmptyState';
import axios from 'axios';

const MyRegistrations = () => {
  const { currentUser } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching my registrations for user:', currentUser?.id);
      
      const response = await axios.get('http://localhost:5001/api/events/my/registered', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setRegisteredEvents(response.data.data);
        console.log('My registrations fetched:', response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching my registrations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyRegistrations();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUnregister = async (eventId) => {
    if (!window.confirm('Are you sure you want to unregister from this event?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5001/api/events/${eventId}/register`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        showToast.success('Successfully unregistered from the event!');
        fetchMyRegistrations();
      }
    } catch (error) {
      console.error('Unregistration error:', error);
      showToast.error('Failed to unregister from event');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <i className="fas fa-user-check me-2"></i>
            My Registrations
          </h2>
        </div>
        <EventListSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-user-check me-2"></i>
          My Registrations
        </h2>
        <span className="badge bg-info fs-6">
          {registeredEvents.length} event{registeredEvents.length !== 1 ? 's' : ''} registered
        </span>
      </div>

      {registeredEvents.length === 0 ? (
        <NoRegistrations />
      ) : (
        <div className="row">
          {registeredEvents.map(event => {
            const eventDate = new Date(event.dateTime);
            const now = new Date();
            const isUpcoming = eventDate > now;
            
            return (
              <div key={event._id} className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{event.title}</h5>
                      <span className={`badge ${isUpcoming ? 'bg-success' : 'bg-secondary'}`}>
                        {isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    
                    <p className="card-text text-muted">{event.description}</p>
                    
                    <div className="mb-3">
                      <small className="text-muted">
                        <div className="mb-1">
                          <i className="fas fa-calendar text-primary me-1"></i>
                          {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div className="mb-1">
                          <i className="fas fa-map-marker-alt text-danger me-1"></i>
                          {event.location.venue}, {event.location.city}
                        </div>
                        <div className="mb-1">
                          <i className="fas fa-tag text-success me-1"></i>
                          {event.category}
                        </div>
                      </small>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="fas fa-users me-1"></i>
                        {event.attendees.length}/{event.capacity} registered
                      </small>
                      
                      {isUpcoming && (
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleUnregister(event._id)}
                        >
                          <i className="fas fa-times me-1"></i>
                          Unregister
                        </button>
                      )}
                    </div>
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

export default MyRegistrations;
