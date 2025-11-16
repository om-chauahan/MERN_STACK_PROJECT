import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch events
      const eventsResponse = await axios.get('http://localhost:5001/api/events');
      
      // Fetch user stats
      const userStatsResponse = await axios.get('http://localhost:5001/api/auth/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (eventsResponse.data.success) {
        setEvents(eventsResponse.data.data);
        
        // Calculate event stats
        const totalEvents = eventsResponse.data.data.length;
        const publishedEvents = eventsResponse.data.data.filter(e => e.status === 'published').length;
        const totalRegistrations = eventsResponse.data.data.reduce((sum, event) => sum + event.attendees.length, 0);
        
        // Get user stats from API
        const userStats = userStatsResponse.data.success ? userStatsResponse.data.data : {};
        
        setStats({
          totalEvents,
          publishedEvents,
          totalRegistrations,
          totalUsers: userStats.totalUsers || 0
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAdminData();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
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
        alert('Event deleted successfully!');
        fetchAdminData(); // Refresh the events list
      }
    } catch (error) {
      console.error('Delete event error:', error);
      alert(`Failed to delete event: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You must be an admin to access this panel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="fas fa-cogs me-2"></i>
        Admin Panel
      </h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-calendar-alt fa-2x mb-2"></i>
              <h4>{stats.totalEvents || 0}</h4>
              <p className="mb-0">Total Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-eye fa-2x mb-2"></i>
              <h4>{stats.publishedEvents || 0}</h4>
              <p className="mb-0">Published Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h4>{stats.totalRegistrations || 0}</h4>
              <p className="mb-0">Total Registrations</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-user-friends fa-2x mb-2"></i>
              <h4>{stats.totalUsers || 0}</h4>
              <p className="mb-0">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-2">
                  <a href="/create-event" className="btn btn-primary w-100">
                    <i className="fas fa-plus me-1"></i>
                    Create Event
                  </a>
                </div>
                <div className="col-md-6 mb-2">
                  <a href="/manage-events" className="btn btn-info w-100">
                    <i className="fas fa-cog me-1"></i>
                    Manage All Events
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-clock me-2"></i>
            Recent Events
          </h5>
        </div>
        <div className="card-body">
          {events.length === 0 ? (
            <p className="text-muted">No events available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Organizer</th>
                    <th>Date</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 10).map(event => (
                    <tr key={event._id}>
                      <td>{event.title}</td>
                      <td className="text-muted">Organizer</td>
                      <td>{new Date(event.dateTime).toLocaleDateString()}</td>
                      <td>
                        <span className="badge bg-info">
                          {event.attendees.length}/{event.capacity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${event.status === 'published' ? 'success' : 'warning'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleViewEvent(event._id)}
                            title="View Event"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn btn-outline-warning"
                            onClick={() => handleEditEvent(event._id)}
                            title="Edit Event"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteEvent(event._id, event.title)}
                            title="Delete Event"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
