<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Event Management System - MERN Stack

This is a comprehensive Event Management System built using the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Project Structure
- `backend/` - Node.js/Express.js server with MongoDB
- `frontend/` - React.js application
- Root package.json includes scripts for running both frontend and backend

## Technology Stack
- **Backend**: Node.js, Express.js, MongoDB with Mongoose, JWT authentication, bcryptjs, nodemailer
- **Frontend**: React.js, React Router, Axios, Bootstrap
- **Database**: MongoDB
- **Authentication**: JWT tokens with role-based access control

## Current Implementation Status
✅ **Phase 1 - User Authentication System**
- User registration and login
- JWT-based authentication
- Role-based access (Admin, Organizer, Attendee)
- Protected routes and middleware
- Frontend auth context and components

🔄 **Next Phases** (To be implemented):
- Event creation and management
- Event registration system
- Email notifications
- Admin dashboard
- Reporting features

## Key Design Patterns
- RESTful API design
- React Context for state management
- Protected routes with authentication middleware
- Responsive design with Bootstrap
- Error handling and validation

## API Endpoints (Current)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

## Development Commands
- `npm run dev` - Run both frontend and backend concurrently
- `npm run server` - Run only backend server
- `npm run client` - Run only frontend
- `npm run install-all` - Install dependencies for both frontend and backend

## Environment Setup
Required `.env` variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - Email configuration

## Code Style Guidelines
- Use functional components with React hooks
- Implement proper error handling
- Follow RESTful API conventions
- Use consistent naming conventions
- Include proper validation on both frontend and backend
