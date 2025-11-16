import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { EventListSkeleton } from '../components/SkeletonLoaders';
import { NoEventsCreated } from '../components/EmptyState';
import axios from 'axios';

const MyEvents = () => {
  const { currentUser } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching my events for user:', currentUser?.id);
      
      const response = await axios.get('http://localhost:5001/api/events/my/created', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setMyEvents(response.data.data);
        console.log('My events fetched:', response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching my events:', error);
      if (error.response?.status === 403) {
        showToast.error('Access denied. Only organizers and admins can view created events.');
      } else {
        showToast.error('Failed to load events');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyEvents();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5001/api/events/${eventId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        showToast.success('Event deleted successfully!');
        fetchMyEvents();
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <i className="fas fa-calendar-alt me-2"></i>
            My Events
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
          <i className="fas fa-calendar-alt me-2"></i>
          My Events
        </h2>
        <div className="d-flex gap-2">
          <span className="badge bg-info fs-6">
            {myEvents.length} event{myEvents.length !== 1 ? 's' : ''} created
          </span>
          <a href="/create-event" className="btn btn-success btn-sm">
            <i className="fas fa-plus me-1"></i>
            Create New Event
          </a>
        </div>
      </div>

      {myEvents.length === 0 ? (
        <NoEventsCreated />
      ) : (
        <div className="row">
          {myEvents.map(event => {
            const eventDate = new Date(event.dateTime);
            const now = new Date();
            let statusBadge = 'bg-primary';
            let statusText = 'upcoming';
            
            if (event.status === 'cancelled') {
              statusBadge = 'bg-danger';
              statusText = 'cancelled';
            } else if (now > eventDate) {
              statusBadge = 'bg-secondary';
              statusText = 'completed';
            } else if (Math.abs(now - eventDate) < 24 * 60 * 60 * 1000) {
              statusBadge = 'bg-warning';
              statusText = 'soon';
            }

            return (
              <div key={event._id} className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{event.title}</h5>
                      <span className={`badge ${statusBadge}`}>{statusText}</span>
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
                          <i className="fas fa-users text-success me-1"></i>
                          {event.attendees.length}/{event.capacity} registered
                        </div>
                      </small>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <a 
                        href={`/events/${event._id}`}
                        className="btn btn-outline-primary btn-sm flex-fill"
                      >
                        <i className="fas fa-eye me-1"></i>
                        View Details
                      </a>
                      <a 
                        href={`/edit-event/${event._id}`}
                        className="btn btn-outline-warning btn-sm"
                      >
                        <i className="fas fa-edit me-1"></i>
                        Edit
                      </a>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(event._id)}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Delete
                      </button>
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

export default MyEvents;
