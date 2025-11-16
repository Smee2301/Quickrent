# QuickRent - Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- Git (optional)

## Installation Steps

### 1. Install Dependencies

#### Server Dependencies
```powershell
cd C:\Users\mjpat\OneDrive\Desktop\Quickrent\server
npm install
```

#### Client Dependencies
```powershell
cd C:\Users\mjpat\OneDrive\Desktop\Quickrent\client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory if it doesn't exist:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/quickrent
JWT_SECRET=your-secret-key-here
CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows (if MongoDB is installed as a service):**
```powershell
net start MongoDB
```

**Or if you have MongoDB running manually:**
```powershell
mongod --dbpath "C:\path\to\your\data\db"
```

### 4. Start the Server

```powershell
cd C:\Users\mjpat\OneDrive\Desktop\Quickrent\server
npm run dev
```

You should see:
```
Server running on http://localhost:4000
Connected to MongoDB
Socket.IO initialized
```

### 5. Start the Client

Open a new terminal/PowerShell window:

```powershell
cd C:\Users\mjpat\OneDrive\Desktop\Quickrent\client
npm run dev
```

You should see:
```
VITE ready in xxx ms
Local: http://localhost:5173/
```

### 6. Access the Application

Open your browser and navigate to:
- **Client Application:** http://localhost:5173
- **API Server:** http://localhost:4000

## Testing the Real-Time Features

### Quick Test Scenario

1. **Setup:**
   - Open two browser windows side by side
   - In Window 1: Login/signup as an Owner
   - In Window 2: Login/signup as a Renter

2. **Test Vehicle Real-Time Updates:**
   - Window 1 (Owner): Navigate to "Add Vehicle" and add a new vehicle
   - Window 2 (Renter): Keep "Browse Vehicles" page open
   - You should see the new vehicle appear instantly with a notification!

3. **Test Booking Requests:**
   - Window 2 (Renter): Click "Book Now" on any vehicle
   - Fill in the booking details and confirm
   - Window 1 (Owner): Navigate to "Booking Requests"
   - You should see the booking appear instantly with a notification!

4. **Test Approval/Rejection:**
   - Window 1 (Owner): Click "Approve" or "Reject" on a booking
   - Window 2 (Renter): Keep the dashboard open
   - You should see a green (approved) or red (rejected) notification appear!

## Troubleshooting

### Server won't start
- Check if MongoDB is running
- Verify port 4000 is not in use
- Check for syntax errors in the console

### Client won't start
- Verify port 5173 is available
- Check for dependency issues: `npm install`
- Clear node_modules and reinstall if needed

### Socket connection fails
- Ensure server is running on port 4000
- Check browser console for connection errors
- Verify JWT token exists (login again if needed)
- Check CORS settings in `server/index.js`

### Real-time features not working
- Verify both server and client are running
- Check browser console for Socket.IO connection
- Look at server logs for authentication issues
- Ensure you're logged in with a valid token

## File Structure

```
Quickrent/
├── server/
│   ├── models/
│   │   ├── Booking.js          (NEW - Booking schema)
│   │   ├── Notification.js      (NEW - Notification schema)
│   │   ├── Vehicle.js
│   │   ├── Owner.js
│   │   └── Renter.js
│   ├── routes/
│   │   ├── booking.routes.js    (UPDATED - Real-time bookings)
│   │   ├── vehicle.routes.js    (UPDATED - Real-time vehicles)
│   │   └── ...
│   ├── socket.js                (NEW - Socket.IO manager)
│   ├── index.js                 (UPDATED - Socket integration)
│   └── package.json
├── client/
│   ├── src/
│   │   ├── contexts/
│   │   │   └── SocketContext.jsx (NEW - Socket.IO context)
│   │   ├── components/
│   │   │   ├── Renterbrowse.jsx  (UPDATED - Real-time vehicles)
│   │   │   ├── Bookingreq.jsx    (UPDATED - Real-time bookings)
│   │   │   └── RenterDashboard.jsx (UPDATED - Notifications)
│   │   ├── App.jsx               (UPDATED - Socket provider)
│   │   └── ...
│   └── package.json
├── REALTIME_TRANSACTIONS.md     (NEW - Feature documentation)
└── SETUP_GUIDE.md               (NEW - This file)
```

## New Dependencies Added

### Server
- `socket.io@^4.x` - WebSocket library for real-time communication

### Client
- `socket.io-client@^4.x` - Socket.IO client for React

## Next Steps

After successful setup:
1. Explore the application features
2. Read `REALTIME_TRANSACTIONS.md` for detailed feature documentation
3. Test all real-time features with multiple browser windows
4. Check the browser console and server logs to see real-time events

## Support

If you encounter any issues:
1. Check the console logs (browser and server)
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check the troubleshooting section above
5. Review the `REALTIME_TRANSACTIONS.md` documentation

## Development Tips

- Use browser DevTools Network tab to monitor Socket.IO connections
- Check the Console for real-time event logs
- Server logs will show all Socket.IO connections and events
- Use two different browsers (e.g., Chrome and Firefox) for easier testing
- MongoDB Compass can help visualize the database collections

Enjoy building with QuickRent! 🚗💨
