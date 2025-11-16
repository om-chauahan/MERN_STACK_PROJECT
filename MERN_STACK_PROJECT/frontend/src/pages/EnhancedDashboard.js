import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { DashboardStatsSkeleton, ChartSkeleton, EventListSkeleton } from '../components/SkeletonLoaders';
import useEventStatistics from '../hooks/useEventStatistics';
import AnimatedCard from '../components/AnimatedCard';
import EventRegistrationChart from '../components/charts/EventRegistrationChart';
import EventsByOrganizerChart from '../components/charts/EventsByOrganizerChart';
import EventTrendsChart from '../components/charts/EventTrendsChart';
import axios from 'axios';

const EnhancedDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { stats, chartData, loading, error, refreshStats } = useEventStatistics(currentUser);
  
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user's events if organizer/admin
      if (currentUser.role === 'organizer' || currentUser.role === 'admin') {
        const eventsResponse = await axios.get('http://localhost:5001/api/events/my/created', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (eventsResponse.data.success) {
          setMyEvents(eventsResponse.data.data.slice(0, 3));
        }
      }

      // Fetch user's registrations
      if (currentUser.role === 'attendee' || currentUser.role === 'organizer') {
        const registrationsResponse = await axios.get('http://localhost:5001/api/events/my/registered', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (registrationsResponse.data.success) {
          setRegisteredEvents(registrationsResponse.data.data.slice(0, 3));
        }
      }
      
      setDashboardLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast.error('Failed to load dashboard data');
      setDashboardLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'organizer': return 'Event Organizer';
      case 'attendee': return 'Event Attendee';
      default: return role;
    }
  };

  const getQuickActions = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <div className="d-grid gap-2">
            <motion.button 
              className="btn btn-primary"
              onClick={() => navigate('/create-event')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-plus me-1"></i>
              Create Event
            </motion.button>
            <motion.button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/events')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-calendar me-1"></i>
              Browse Events
            </motion.button>
            <motion.button 
              className="btn btn-outline-warning"
              onClick={() => navigate('/manage-events')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-cogs me-1"></i>
              Manage Events
            </motion.button>
            <motion.button 
              className="btn btn-outline-info"
              onClick={() => navigate('/admin')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-shield-alt me-1"></i>
              Admin Panel
            </motion.button>
          </div>
        );
      case 'organizer':
        return (
          <div className="d-grid gap-2">
            <motion.button 
              className="btn btn-primary"
              onClick={() => navigate('/create-event')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-plus me-1"></i>
              Create Event
            </motion.button>
            <motion.button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/events')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-calendar me-1"></i>
              Browse Events
            </motion.button>
            <motion.button 
              className="btn btn-outline-warning"
              onClick={() => navigate('/my-events')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-list me-1"></i>
              My Events
            </motion.button>
          </div>
        );
      case 'attendee':
        return (
          <div className="d-grid gap-2">
            <motion.button 
              className="btn btn-primary"
              onClick={() => navigate('/events')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-search me-1"></i>
              Browse Events
            </motion.button>
            <motion.button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/my-registrations')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-calendar-check me-1"></i>
              My Registrations
            </motion.button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading || dashboardLoading) {
    return (
      <div className="container mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-4">
              <i className="fas fa-tachometer-alt me-3"></i>
              Dashboard
            </h1>
          </div>
          
          {/* Stats Skeleton */}
          <DashboardStatsSkeleton />
          
          {/* Charts Skeleton */}
          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Registration Overview</h5>
                </div>
                <div className="card-body">
                  <ChartSkeleton height={300} />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Events by Organizer</h5>
                </div>
                <div className="card-body">
                  <ChartSkeleton height={300} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Events Skeleton */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <EventListSkeleton count={3} />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={refreshStats}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Header */}
      <motion.div 
        className="row mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </h1>
              <p className="text-muted mb-0">
                Welcome back, {currentUser.name}! 
                <span className="badge bg-primary ms-2">{getRoleDisplayName(currentUser.role)}</span>
              </p>
            </div>
            <motion.button
              className="btn btn-outline-secondary"
              onClick={refreshStats}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-sync-alt me-1"></i>
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <AnimatedCard delay={0.1}>
            <div className="card-body text-center">
              <div className="h2 text-primary mb-2">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 className="h4 mb-1">{stats.totalEvents}</h3>
              <p className="text-muted mb-0">Total Events</p>
            </div>
          </AnimatedCard>
        </div>
        
        <div className="col-md-3 mb-3">
          <AnimatedCard delay={0.2}>
            <div className="card-body text-center">
              <div className="h2 text-success mb-2">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="h4 mb-1">{stats.totalRegistrations}</h3>
              <p className="text-muted mb-0">Total Registrations</p>
            </div>
          </AnimatedCard>
        </div>
        
        <div className="col-md-3 mb-3">
          <AnimatedCard delay={0.3}>
            <div className="card-body text-center">
              <div className="h2 text-warning mb-2">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="h4 mb-1">{stats.upcomingEvents}</h3>
              <p className="text-muted mb-0">Upcoming Events</p>
            </div>
          </AnimatedCard>
        </div>
        
        <div className="col-md-3 mb-3">
          <AnimatedCard delay={0.4}>
            <div className="card-body text-center">
              <div className="h2 text-info mb-2">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="h4 mb-1">{stats.completedEvents}</h3>
              <p className="text-muted mb-0">Completed Events</p>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-lg-6 mb-4">
          <EventRegistrationChart data={chartData.registrationDistribution} />
        </div>
        <div className="col-lg-6 mb-4">
          <EventsByOrganizerChart data={chartData.eventsByOrganizer} />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <EventTrendsChart data={chartData.eventTrends} />
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="row">
        <div className="col-lg-4 mb-4">
          <AnimatedCard delay={0.5}>
            <div className="card-header">
              <h5>
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              {getQuickActions()}
            </div>
          </AnimatedCard>
        </div>

        {/* My Events (for organizers/admins) */}
        {(currentUser.role === 'organizer' || currentUser.role === 'admin') && myEvents.length > 0 && (
          <div className="col-lg-4 mb-4">
            <AnimatedCard delay={0.6}>
              <div className="card-header">
                <h5>
                  <i className="fas fa-calendar-plus me-2"></i>
                  My Recent Events
                </h5>
              </div>
              <div className="card-body">
                {myEvents.map((event, index) => (
                  <motion.div 
                    key={event._id} 
                    className="border-bottom pb-2 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <h6 className="mb-1">{event.title}</h6>
                    <small className="text-muted">
                      {new Date(event.dateTime).toLocaleDateString()} - {event.attendees.length}/{event.capacity} registered
                      <br />
                      <span className={`badge bg-${event.status === 'published' ? 'success' : 'warning'}`}>
                        {event.status}
                      </span>
                    </small>
                  </motion.div>
                ))}
                <Link 
                  to="/my-events"
                  className="btn btn-outline-primary btn-sm mt-2 w-100"
                >
                  View All My Events
                </Link>
              </div>
            </AnimatedCard>
          </div>
        )}

        {/* My Registrations */}
        {registeredEvents.length > 0 && (
          <div className="col-lg-4 mb-4">
            <AnimatedCard delay={0.7}>
              <div className="card-header">
                <h5>
                  <i className="fas fa-calendar-check me-2"></i>
                  My Registered Events
                </h5>
              </div>
              <div className="card-body">
                {registeredEvents.map((event, index) => (
                  <motion.div 
                    key={event._id} 
                    className="border-bottom pb-2 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <h6 className="mb-1">{event.title}</h6>
                    <small className="text-muted">
                      {new Date(event.dateTime).toLocaleDateString()}
                      <br />
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {event.location.city}
                    </small>
                  </motion.div>
                ))}
                <Link 
                  to="/my-registrations"
                  className="btn btn-outline-primary btn-sm mt-2 w-100"
                >
                  View All My Registrations
                </Link>
              </div>
            </AnimatedCard>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedDashboard;
