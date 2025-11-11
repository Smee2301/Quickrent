# QuickRent - Instant Vehicle Rental System

A modern web application for instant vehicle rentals between vehicle owners and renters across India.

## Features

- **User Authentication**: Separate login/signup for vehicle owners and renters
- **Vehicle Management**: Add, view, and manage vehicle listings
- **Dashboard**: Separate dashboards for owners and renters
- **Document Upload**: Secure document management system
- **Responsive Design**: Mobile-friendly interface

## Key Components

• **Node.js and npm**: Backend runtime and package management for server-side operations.

• **Express.js**: RESTful API backend framework for routing, middleware, and handling HTTP requests.

• **React**: Frontend JavaScript library for building dynamic and interactive user interfaces.

• **MongoDB**: NoSQL document database to store users, vehicles, bookings, and documents.

• **Vite**: Modern build tool and development server for fast frontend development and HMR (Hot Module Replacement).

• **Mongoose**: MongoDB object modeling tool that provides schema-based solution for data modeling.

• **JWT (JSON Web Tokens)**: Secure authentication mechanism for user sessions and authorization.

• **bcryptjs**: Password hashing library for secure user credential storage.

• **Multer**: File upload middleware for handling vehicle photos and document uploads.

## Libraries and Tools

• **React Router**: Declarative routing library for navigation between web pages and dynamic route management.

• **Styled Components**: CSS-in-JS library used for modern and responsive styling with component-level style encapsulation.

• **React Testing Library**: Testing utility to test UI components for reliability and functionality across the application.

• **CSS Modules**: Component-scoped styling approach used for modern and responsive design without conflicts.

• **React Icons**: Comprehensive icon library providing scalable vector icons for enhanced UI design.

• **nodemon**: Development tool that automatically restarts the server when file changes are detected.

• **Concurrently**: Utility for running multiple npm scripts simultaneously (client and server).

• **dotenv**: Environment variable management for secure configuration handling.

• **CORS**: Cross-Origin Resource Sharing middleware for handling API requests from different origins.

## Tech Stack

### 4.2.2 Backend Technology (QuickRent)

**Node.js:**

Node.js serves as the server-side runtime environment for QuickRent. It allows the platform to handle multiple simultaneous vehicle bookings, real-time chat communications, and data requests efficiently. Its event-driven, non-blocking I/O model ensures high performance, enabling smooth interaction between vehicle owners and renters across India.

**Express.js:**

Express.js is used as the web framework for QuickRent's backend. It simplifies routing, API creation, and middleware management, allowing seamless integration of features such as vehicle listings, booking management, chat messages, document uploads, and payment processing.

**MongoDB:**

MongoDB stores all QuickRent data, including user profiles, vehicle listings, bookings, messages, and uploaded documents. Its flexible document-based structure accommodates varying vehicle specifications and user data, ensuring scalability and real-time access for multiple users simultaneously accessing the platform.

### 4.2.3 Frontend Technology (QuickRent)

**HTML:**

HTML is used to structure the QuickRent web pages, including dashboards, vehicle listing forms, booking interfaces, chat windows, and document sections, providing a clear and organized user interface for both owners and renters.

**CSS:**

CSS styles the platform's elements, maintaining consistency across owner and renter interfaces. It ensures responsive layouts so that users can access QuickRent from desktops, tablets, or mobile devices with an optimal viewing experience.

**JavaScript:**

JavaScript powers the interactivity of QuickRent, including dynamic updates to chat messages, booking statuses, vehicle availability, and notifications without reloading pages, creating a seamless single-page application experience.

**React:**

React is the front-end framework used for building QuickRent's single-page application. Its component-based architecture allows reusable elements like vehicle cards, booking forms, chat boxes, and profile dashboards, ensuring efficient rendering as data changes in real time.

**Vite:**

Vite provides the build tooling and development server for QuickRent's frontend. It offers lightning-fast Hot Module Replacement (HMR) during development and optimized production builds, significantly improving the development experience and application performance.

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
