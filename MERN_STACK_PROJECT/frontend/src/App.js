import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import EnhancedDashboard from './pages/EnhancedDashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyRegistrations from './pages/MyRegistrations';
import MyEvents from './pages/MyEvents';
import AdminPanel from './pages/AdminPanel';
import ManageEvents from './pages/ManageEvents';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './styles/theme.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <PageTransition>
              <Routes>
                <Route path="/" element={<div className="container mt-4"><Home /></div>} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<div className="container mt-4"><Login /></div>} />
                <Route path="/register" element={<div className="container mt-4"><Register /></div>} />
                <Route path="/events" element={<div className="container mt-4"><Events /></div>} />
                <Route path="/events/:id" element={<div className="container mt-4"><EventDetails /></div>} />
                <Route 
                  path="/dashboard" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute allowedRoles={['admin', 'organizer']}>
                        <EnhancedDashboard />
                      </ProtectedRoute>
                    </div>
                  } 
                />
                <Route 
                  path="/create-event" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute>
                        <CreateEvent />
                      </ProtectedRoute>
                    </div>
                  } 
                />
                <Route 
                  path="/edit-event/:id" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute>
                        <EditEvent />
                      </ProtectedRoute>
                    </div>
                  } 
                />
                <Route 
                  path="/my-registrations" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute>
                        <MyRegistrations />
                      </ProtectedRoute>
                    </div>
                  } 
                />
                <Route 
                  path="/my-events" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute>
                        <MyEvents />
                      </ProtectedRoute>
                    </div>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute>
                        <AdminPanel />
                      </ProtectedRoute>
                    </div>
                  } 
                />
                <Route 
                  path="/manage-events" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute>
                        <ManageEvents />
                      </ProtectedRoute>
                    </div>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    </div>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <div className="container mt-4">
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    </div>
                  } 
                />
              </Routes>
            </PageTransition>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
