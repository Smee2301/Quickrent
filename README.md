# QuickRent - Instant Vehicle Rental System

A modern web application for instant vehicle rentals between vehicle owners and renters across India.

## Features

- **User Authentication**: Separate login/signup for vehicle owners and renters
- **Vehicle Management**: Add, view, and manage vehicle listings
- **Dashboard**: Separate dashboards for owners and renters
- **Document Upload**: Secure document management system
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Modern CSS with animations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Quickrent
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   - Copy `server/env.example` to `server/.env`
   - Update the following variables in `server/.env`:
     ```env
     PORT=4000
     MONGO_URI=mongodb://127.0.0.1:27017/quickrent
     JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
     CLIENT_ORIGIN=http://localhost:5173
     ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or update MONGO_URI to point to your MongoDB instance

## Running the Application

### Development Mode (Both Client & Server)
```bash
npm run dev
```

### Run Only Server
```bash
npm run server
```

### Run Only Client
```bash
npm run client
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Add new vehicle (requires auth)
- `GET /api/vehicles/:id` - Get vehicle details

## Project Structure

```
Quickrent/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
└── package.json           # Root dependencies
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change ports in `vite.config.js` (client) and `server/.env` (server)

2. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

3. **Import Errors**
   - Run `npm run install-all` to ensure all dependencies are installed
   - Check file paths and case sensitivity

4. **Authentication Issues**
   - Verify JWT_SECRET is set in `.env`
   - Check token expiration

## Development

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new pages in `client/src/pages/`
3. Create new routes in `server/routes/`
4. Update models in `server/models/` if needed

### Code Style
- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
