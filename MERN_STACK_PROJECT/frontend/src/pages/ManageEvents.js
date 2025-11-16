import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import { EventListSkeleton } from '../components/SkeletonLoaders';
import { NoAdminEvents } from '../components/EmptyState';
import axios from 'axios';

const ManageEvents = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/events');
      
      if (response.data.success) {
        setEvents(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAllEvents();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleView = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

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
        fetchAllEvents();
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast.error('Failed to delete event');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You must be an admin to manage all events.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <i className="fas fa-cogs me-2"></i>
            Manage All Events
          </h2>
        </div>
        <EventListSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-cogs me-2"></i>
          Manage All Events
        </h2>
        <div className="d-flex gap-2">
          <span className="badge bg-info fs-6">
            {events.length} total events
          </span>
          <a href="/create-event" className="btn btn-success btn-sm">
            <i className="fas fa-plus me-1"></i>
            Create New Event
          </a>
        </div>
      </div>

      {events.length === 0 ? (
        <NoAdminEvents />
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Event Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => {
                    const eventDate = new Date(event.dateTime);
                    
                    return (
                      <tr key={event._id}>
                        <td>
                          <strong>{event.title}</strong>
                          <br />
                          <small className="text-muted">{event.description.substring(0, 50)}...</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{event.category}</span>
                        </td>
                        <td>
                          <small>
                            {eventDate.toLocaleDateString()}
                            <br />
                            {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </small>
                        </td>
                        <td>
                          <small>
                            {event.location.venue}
                            <br />
                            <span className="text-muted">{event.location.city}</span>
                          </small>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${event.attendees.length >= event.capacity ? 'bg-danger' : 'bg-info'}`}>
                            {event.attendees.length}/{event.capacity}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${event.status === 'published' ? 'success' : event.status === 'cancelled' ? 'danger' : 'warning'}`}>
                            {event.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              title="View Details"
                              onClick={() => handleView(event._id)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="btn btn-outline-warning"
                              title="Edit Event"
                              onClick={() => handleEdit(event._id)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger"
                              title="Delete Event"
                              onClick={() => handleDelete(event._id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
