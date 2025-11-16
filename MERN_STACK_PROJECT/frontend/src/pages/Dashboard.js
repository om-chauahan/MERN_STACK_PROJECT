import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch event statistics
      const statsResponse = await axios.get(
        `http://localhost:5001/api/events/stats/${currentUser.id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Fetch all events to filter user's events and registrations
      const eventsResponse = await axios.get('http://localhost:5001/api/events');
      
      if (eventsResponse.data.success) {
        const allEvents = eventsResponse.data.data;
        
        // Filter events created by current user (for organizers/admins)
        if (currentUser.role === 'organizer' || currentUser.role === 'admin') {
          const userEvents = allEvents.filter(event => event.organizer === currentUser.id);
          setMyEvents(userEvents.slice(0, 5)); // Show latest 5
        }
        
        // Filter events user is registered for (for all users)
        const userRegistrations = allEvents.filter(event => 
          event.attendees?.some(attendee => attendee.user === currentUser.id)
        );
        setRegisteredEvents(userRegistrations.slice(0, 5)); // Show latest 5
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'organizer': return 'Event Organizer';
      case 'attendee': return 'Event Attendee';
      default: return role;
    }
  };

  const getQuickActions = () => {
    switch (currentUser?.role) {
      case 'admin':
        return (
          <>
            <button 
              className="btn btn-primary mb-2 w-100"
              onClick={() => navigate('/create-event')}
            >
              Create Event
            </button>
            <button 
              className="btn btn-outline-primary mb-2 w-100"
              onClick={() => navigate('/events')}
            >
              Browse Events
            </button>
            <button 
              className="btn btn-outline-warning mb-2 w-100"
              onClick={() => navigate('/manage-events')}
            >
              Manage All Events
            </button>
            <button 
              className="btn btn-outline-info w-100"
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </button>
          </>
        );
      case 'organizer':
        return (
          <>
            <button 
              className="btn btn-primary mb-2 w-100"
              onClick={() => navigate('/create-event')}
            >
              Create Event
            </button>
            <button 
              className="btn btn-outline-primary mb-2 w-100"
              onClick={() => navigate('/events')}
            >
              Browse Events
            </button>
            <button 
              className="btn btn-outline-warning w-100"
              onClick={() => navigate('/my-events')}
            >
              My Events
            </button>
          </>
        );
      case 'attendee':
        return (
          <>
            <button 
              className="btn btn-primary mb-2 w-100"
              onClick={() => navigate('/events')}
            >
              Browse Events
            </button>
            <button 
              className="btn btn-outline-primary w-100"
              onClick={() => navigate('/my-registrations')}
            >
              My Registrations
            </button>
          </>
        );
      default:
        return <p className="text-muted">No actions available</p>;
    }
  };

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-header">
            <h3>Welcome to your Dashboard, {currentUser?.name}!</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h5>User Information</h5>
                <p><strong>Name:</strong> {currentUser?.name}</p>
                <p><strong>Email:</strong> {currentUser?.email}</p>
                <p><strong>Role:</strong> {getRoleDisplayName(currentUser?.role)}</p>
                <p><strong>Email Verified:</strong> 
                  <span className={`badge ${currentUser?.isEmailVerified ? 'bg-success' : 'bg-warning'} ms-2`}>
                    {currentUser?.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <h5>Quick Actions</h5>
                <div className="d-grid gap-2">
                  {getQuickActions()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Statistics */}
        {stats && Object.keys(stats).length > 0 && (
          <div className="card mb-4">
            <div className="card-header">
              <h5>Event Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <h4 className="text-primary">{stats.upcoming || 0}</h4>
                    <small className="text-muted">Upcoming Events</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <h4 className="text-success">{stats.live || 0}</h4>
                    <small className="text-muted">Live Events</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <h4 className="text-secondary">{stats.completed || 0}</h4>
                    <small className="text-muted">Completed Events</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <h4 className="text-info">{stats.total || 0}</h4>
                    <small className="text-muted">Total Events</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Events (for organizers/admins) */}
        {(currentUser?.role === 'organizer' || currentUser?.role === 'admin') && myEvents.length > 0 && (
          <div className="card mb-4">
            <div className="card-header">
              <h5>My Recent Events</h5>
            </div>
            <div className="card-body">
              {myEvents.map(event => (
                <div key={event._id} className="border-bottom pb-2 mb-2">
                  <h6>{event.title}</h6>
                  <small className="text-muted">
                    {new Date(event.dateTime).toLocaleDateString()} - {event.attendees.length}/{event.capacity} registered
                    <br />Status: <span className={`badge bg-${event.status === 'published' ? 'success' : 'warning'}`}>{event.status}</span>
                  </small>
                </div>
              ))}
              <button 
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => navigate('/my-events')}
              >
                View All My Events
              </button>
            </div>
          </div>
        )}

        {/* Registered Events (for all users) */}
        {registeredEvents.length > 0 && (
          <div className="card mb-4">
            <div className="card-header">
              <h5>My Registered Events</h5>
            </div>
            <div className="card-body">
              {registeredEvents.map(event => (
                <div key={event._id} className="border-bottom pb-2 mb-2">
                  <h6>{event.title}</h6>
                  <small className="text-muted">
                    {new Date(event.dateTime).toLocaleDateString()} at {event.location.venue}
                    <br />Category: {event.category}
                  </small>
                </div>
              ))}
              <button 
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => navigate('/my-registrations')}
              >
                View All Registrations
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h5>System Status</h5>
          </div>
          <div className="card-body">
            <p className="text-success">✅ Authentication System: Active</p>
            <p className="text-success">✅ Event Management: Active</p>
            <p className="text-warning">⏳ Email Notifications: Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
