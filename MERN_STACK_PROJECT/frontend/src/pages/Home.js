import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    if (currentUser.role === 'attendee') {
      return (
        <div>
          <div className="text-center mb-4">
            <h1 className="display-5">Welcome back, {currentUser.name}!</h1>
            <p className="lead">You're logged in as attendee</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-8 col-lg-6">
              <div className="card mb-4">
                <div className="card-header"><h5 className="mb-0">Quick Action</h5></div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary" onClick={() => navigate('/events')}>Browse Events</button>
                    <button className="btn btn-outline-primary" onClick={() => navigate('/my-registrations')}>My Registrations</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Non-attendee users keep existing experience
    return (
      <div className="text-center">
        <h1 className="display-4">Welcome back, {currentUser.name}!</h1>
        <p className="lead">You're logged in as {currentUser.role}</p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard
          </Link>
          <Link to="/events" className="btn btn-outline-primary btn-lg">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="display-4">Welcome to Event Management System</h1>
      <p className="lead">Streamline your event planning and management</p>
      
      <div className="mb-4">
        <Link to="/events" className="btn btn-outline-primary btn-lg me-3">
          Browse Events
        </Link>
        <span className="text-muted">No login required to view events</span>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">New User?</h5>
              <p className="card-text">Register to start creating or attending events</p>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Existing User?</h5>
              <p className="card-text">Login to access your dashboard</p>
              <Link to="/login" className="btn btn-success">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
