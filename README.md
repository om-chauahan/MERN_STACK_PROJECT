# Event Management System - MERN Stack

A comprehensive, production-ready Event Management System built with the MERN stack featuring advanced UI/UX components, role-based authentication, and professional admin capabilities.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![Express](https://img.shields.io/badge/Express-4.x-yellow)

## 🚀 Features

### ✅ **Advanced UI/UX Features**
- **Toast Notifications** - Real-time user feedback with React-Toastify
- **Skeleton Loaders** - Professional loading states with React-Loading-Skeleton
- **Empty State Messages** - Elegant empty state components with animations
- **Profile Avatar System** - User profile management with avatar support
- **Responsive Design** - Mobile-first Bootstrap implementation

### ✅ **Authentication & User Management**
- **Role-Based Access Control** - Admin, Organizer, Attendee roles
- **JWT Authentication** - Secure token-based authentication
- **Role-Specific Welcome Messages** - Personalized login experience
- **Protected Routes** - Route-level security implementation
- **Enhanced Profile Management** - Comprehensive user profiles

### ✅ **Event Management**
- **Event CRUD Operations** - Create, Read, Update, Delete events
- **Event Registration System** - User registration/unregistration
- **Event Categories** - Organized event categorization
- **Capacity Management** - Event capacity tracking
- **Status Management** - Published/Draft/Cancelled states

### ✅ **Admin Panel**
- **Comprehensive Dashboard** - Real-time statistics and metrics
- **User Management** - Complete user oversight
- **Event Management** - Full event administration
- **System Analytics** - User counts, event stats, registrations

### ✅ **Modern Development Features**
- **Loading States** - Skeleton loaders for better UX
- **Error Handling** - Comprehensive error management
- **Form Validation** - Client and server-side validation
- **Static Header Navigation** - Role-aware links always visible (Home, Events, Dashboard, Create Event)
- **Avatar Dropdown** - Profile, Settings, Logout from user avatar (no collapse menu)
- **Theme Support** - Light/Dark theme toggle

## 🛠 Technology Stack

### **Frontend**
- **React 18** - Modern React with functional components and hooks
- **React Router v6** - Client-side routing
- **Bootstrap 5** - Responsive UI framework
- **React-Toastify** - Toast notifications
- **React-Loading-Skeleton** - Loading animations
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API requests
- **Context API** - State management

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### **Development Tools**
- **Concurrently** - Run multiple commands simultaneously
- **Nodemon** - Auto-restart development server
- **ESLint** - Code linting
- **Create React App** - React application setup

## 📁 Project Structure

```
MERN_STACK_PROJECT/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js          # User schema
│   │   │   └── Event.js         # Event schema with attendees & stats helpers
│   │   ├── routes/
│   │   │   ├── auth.js          # Authentication & profile routes
│   │   │   └── events.js        # Event CRUD and registration routes
│   │   └── server.js            # Express application entry point
│   ├── package.json             # Backend dependencies & scripts
│   └── .env.example             # Backend environment template
│
├── frontend/
│   ├── public/
│   │   └── index.html           # Main HTML template
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route-level pages
│   │   ├── context/             # Auth & theme providers
│   │   ├── styles/              # Global styles & themes
│   │   └── App.js               # React entry point
│   ├── package.json             # Frontend dependencies & scripts
│   └── .env.example             # Frontend environment template
│
├── db-backup/
│   └── README.md                # Instructions to generate MongoDB dump
├── package.json                 # Root scripts (dev, install helpers)
├── package-lock.json            # Root lockfile
├── README.md                    # Project documentation
└── .gitignore                   # Ignored files & folders
```

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd MERN_STACK_PROJECT
```

### **2. Install Dependencies**
```bash
# Root helpers (optional)
npm install
npm install --prefix backend
npm install --prefix frontend

# Or change into each package explicitly
cd backend
npm install
cd ../frontend
npm install
```

### **3. Environment Configuration**

Create dedicated environment files for the backend and frontend using the provided templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in the placeholders with your values:

**`backend/.env`**
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/eventmanagement
JWT_SECRET=your_super_secure_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
```

**`frontend/.env`**
```env
REACT_APP_API_BASE_URL=http://localhost:5001
```

> 📝 Keep the `.env.example` files untouched—they act as documentation for anyone cloning the project.

### **4. Database Setup**

If you generated a MongoDB dump inside `db-backup/`, restore it with:

```bash
mongorestore --db eventmanagement ./db-backup/eventmanagement
```

Alternatively, run your own seed script or create seed data manually before starting the app.

### **5. Start the Application**

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Run from individual folders
cd backend && npm run dev    # Express API on port 5001
cd frontend && npm run dev   # React app on port 3000

# Root shortcuts (optional)
npm run server    # Backend only (port 5001)
npm run client    # Frontend only (port 3000)
```

### **6. Access the Application**

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin) (admin role required)

## 🧭 UI Notes

- Header is static (no collapsible/toggler) and shows:
  - Brand (links to About)
  - Home, Events
  - Dashboard, Create Event (admin/organizer only)
  - Theme toggle + avatar initials + name + role badge
  - Avatar dropdown with Profile, Settings, Logout
- About page: “Get Started”, “Learn More”, and “Contact Admin” CTAs removed.
- Settings page: Left navigation simplified; “Notifications” section removed.

## ⚙️ Dropdown Troubleshooting

If the avatar dropdown doesn’t open:

- Ensure Bootstrap JS bundle is loaded.
  - We import it via `import 'bootstrap/dist/js/bootstrap.bundle.min.js';` in `frontend/src/App.js`.
  - Or include the CDN in `frontend/public/index.html`.
- In DevTools console, verify `window.bootstrap` is defined.

## 📡 API Endpoints

### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | User registration | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |
| DELETE | `/delete-account` | Delete user account | Private |
| GET | `/admin/stats` | Get user statistics | Admin Only |

### **Event Routes** (`/api/events`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all published events | Public |
| GET | `/:id` | Get event by ID | Public |
| POST | `/` | Create new event | Organizer/Admin |
| PUT | `/:id` | Update event | Organizer/Admin |
| DELETE | `/:id` | Delete event | Organizer/Admin |
| POST | `/:id/register` | Register for event | Private |
| DELETE | `/:id/register` | Unregister from event | Private |
| GET | `/my/created` | Get user's created events | Organizer/Admin |
| GET | `/my/registered` | Get user's registered events | Private |
| GET | `/my/stats` | Get user's event statistics | Private |

## 👥 User Roles & Permissions

### **Admin**

- Full system access
- User management
- Event management (all events)
- System analytics and statistics
- Access to admin panel

### **Organizer**

- Create, edit, delete own events
- View event registrations
- Manage event capacity and status
- Access to organizer dashboard

### **Attendee**

- Register/unregister for events
- View event details
- Manage personal profile
- View registration history

## 🎯 Implementation Phases

### **Phase 1: Core Authentication System** ✅

- [x] User registration and login
- [x] JWT-based authentication
- [x] Role-based access control
- [x] Protected routes implementation
- [x] Basic user management

### **Phase 2: Event Management System** ✅

- [x] Event CRUD operations
- [x] Event registration system
- [x] Event categories and filters
- [x] Capacity management
- [x] Status management (published/draft/cancelled)

### **Phase 3: Advanced UI/UX Features** ✅

- [x] Toast notification system
- [x] Skeleton loading states
- [x] Empty state components
- [x] Profile avatar system
- [x] Responsive navigation
- [x] Theme management

### **Phase 4: Admin Panel & Analytics** ✅

- [x] Comprehensive admin dashboard
- [x] User statistics and metrics
- [x] Event management interface
- [x] System analytics
- [x] Role-specific welcome messages

### **Phase 5: Enhanced User Experience** ✅

- [x] Profile management system
- [x] Settings page with preferences
- [x] Improved error handling
- [x] Form validation enhancement
- [x] Mobile responsiveness

## 🚀 Deployment

### **Production Build**

```bash
# Build frontend for production
cd frontend
npm run build

# Start backend in production mode
cd ../backend
npm start
```

### **Environment Variables for Production**
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_production_jwt_secret
PORT=5001
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Input Validation** - Server-side validation with express-validator
- **CORS Configuration** - Proper cross-origin resource sharing setup
- **Protected Routes** - Route-level access control
- **Role-Based Permissions** - Granular access control

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Mobile-first design approach
- **Loading States** - Skeleton loaders for better user experience
- **Toast Notifications** - Real-time feedback system
- **Empty States** - Helpful messages when no data is available
- **Smooth Animations** - Framer Motion powered transitions
- **Theme Support** - Light/Dark mode toggle

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**CHAUHAN OM**
- GitHub: [@chauhanom](https://github.com/chauhanom)
- Email: chauhanom1312@gmail.com
- LinkedIn: [Om Chauhan](https://www.linkedin.com/in/om-chauhan-a55999372)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- MongoDB team for the robust database
- Bootstrap team for the responsive framework
- All open-source contributors who made this project possible

## 📞 Support

For support, email chauhanom1312@gmail.com or create an issue in the GitHub repository.

---

**Made with ❤️ using MERN Stack**
