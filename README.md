# Community Management System

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/node->=12.0.0-brightgreen.svg" alt="Node Version">
</p>

## 📋 Overview

The Community Management System is a comprehensive web application designed to streamline community administration. It enables community leaders to manage households, assign and track tasks, issue alerts, and rate household performance, creating an efficient and transparent environment for community governance.

![Community System Dashboard](https://via.placeholder.com/800x400?text=Community+System+Dashboard)

## ✨ Features

### 🏠 Household Management
- Register and manage household information
- Track household members and their roles
- View household performance metrics

### 🔔 Alert System
- Send community-wide or targeted alerts
- Categorize alerts by priority and type
- Track alert acknowledgments and responses

### ✅ Task Management
- Assign tasks to specific households
- Set task priorities, categories, and due dates
- Track task status: pending, in progress, completed, or overdue
- Rate completed tasks and provide feedback

### ⭐ Rating System
- Rate households on various performance metrics
- Calculate and display average ratings
- Provide feedback to improve community standards

### 👤 User Management
- Role-based access control: Admin, Leader, and Household members
- Profile management and authentication
- Dashboard customization based on user role

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Express Validator** - Input validation

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **React Bootstrap** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Font Awesome** - Icons
- **Formik & Yup** - Form handling and validation

## 🚀 Getting Started

### Prerequisites

- Node.js >= 12.0.0
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OnpointSoftwares/community_system.git
   cd community_system
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```

## 🗄️ Project Structure

```
community_system/
├── backend/               # Backend Node.js application
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Entry point
└── frontend/              # React frontend application
    ├── public/            # Static files
    └── src/               # React source files
        ├── components/    # Reusable components
        ├── pages/         # Page components
        ├── utils/         # Utility functions
        └── App.jsx        # Main application component
```

## 📝 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user profile

### Household Routes
- `GET /api/households` - Get all households
- `GET /api/households/:id` - Get single household
- `POST /api/households` - Create a new household
- `PUT /api/households/:id` - Update a household
- `DELETE /api/households/:id` - Delete a household

### Task Routes
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `PUT /api/tasks/:id/rate` - Rate a completed task
- `DELETE /api/tasks/:id` - Delete a task

### Alert Routes
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get single alert
- `POST /api/alerts` - Create a new alert
- `PUT /api/alerts/:id` - Update an alert
- `DELETE /api/alerts/:id` - Delete an alert

### Rating Routes
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Create a new rating
- `GET /api/ratings/household/:id` - Get ratings for a specific household

## 👥 User Roles

### Admin
- Full system access
- Manage all users, households, and zones
- Access to all system features

### Leader
- Manage households in assigned zones
- Create and manage tasks, alerts, and ratings
- View zone-specific statistics

### Household
- View assigned tasks and alerts
- Update task status
- Access household-specific information

## 🔒 Security

- Authentication via JWT (JSON Web Tokens)
- Password encryption using bcrypt
- Role-based access control
- Input validation with Express Validator
- Protection against common web vulnerabilities

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

If you have any questions, please open an issue or contact the repository owner.

---

<p align="center">
  Made with ❤️ for better community management
</p>
