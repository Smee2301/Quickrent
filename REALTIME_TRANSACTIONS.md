# Real-Time Transactions Implementation

## Overview
This document describes the real-time transaction feature implemented in QuickRent using Socket.IO for instant communication between owners and renters.

## Features Implemented

### 1. Real-Time Vehicle Updates
- When an owner adds a new vehicle through the "Add Vehicle" page, it immediately appears in the Renter Browse section
- Renters see a notification toast showing the new vehicle
- No page refresh needed - vehicles appear instantly

### 2. Real-Time Booking Requests
- When a renter clicks "Book Now" and confirms a booking, the request is sent to the vehicle owner
- Owner receives an instant notification in the "Booking Requests" page
- The new booking appears in the table without needing to refresh

### 3. Real-Time Booking Status Updates
- When an owner approves/rejects a booking request, the renter receives an instant notification
- Notification appears on the Renter Dashboard with success (green) for approved or error (red) for rejected
- Notifications auto-dismiss after 10 seconds or can be manually closed

## Technical Architecture

### Backend (Server)

#### New Models
1. **Booking Model** (`server/models/Booking.js`)
   - Stores all booking information including vehicle, owner, renter references
   - Tracks pickup/return dates and times, total cost, security deposit
   - Status field: pending, approved, rejected, cancelled, completed, ongoing

2. **Notification Model** (`server/models/Notification.js`)
   - Stores user notifications with type, title, message
   - Tracks read/unread status
   - Links to related bookings or vehicles

#### Socket.IO Setup (`server/socket.js`)
- Handles WebSocket connections with JWT authentication
- Creates user-specific rooms for targeted messaging
- Provides helper functions to emit events to specific users or groups
- Manages connection/disconnection events

#### Updated Routes
1. **Vehicle Routes** (`server/routes/vehicle.routes.js`)
   - Emits `new_vehicle` event to all renters when vehicle is created
   
2. **Booking Routes** (`server/routes/booking.routes.js`)
   - Complete rewrite to use MongoDB Booking model
   - POST `/api/bookings` - Creates booking and notifies owner
   - PUT `/api/bookings/:id/approve` - Approves booking and notifies renter
   - PUT `/api/bookings/:id/reject` - Rejects booking and notifies renter
   - GET `/api/bookings/owner/:ownerId` - Fetches owner's bookings
   - GET `/api/bookings/renter/:renterId` - Fetches renter's bookings

### Frontend (Client)

#### Socket Context (`client/src/contexts/SocketContext.jsx`)
- React Context provider for Socket.IO client
- Manages connection state and authentication
- Automatically connects when user has valid token
- Provides `socket` and `connected` status to all components

#### Updated Components

1. **Renterbrowse** (`client/src/components/Renterbrowse.jsx`)
   - Fetches vehicles from API instead of mock data
   - Listens for `new_vehicle` events and updates vehicle list
   - Shows notification toast when new vehicles are added
   - Sends booking requests to API with proper data

2. **Bookingreq** (`client/src/components/Bookingreq.jsx`)
   - Listens for `new_booking_request` events
   - Shows notification when new booking arrives
   - Calls approve/reject endpoints with proper data
   - Fetches real bookings from MongoDB

3. **RenterDashboard** (`client/src/components/RenterDashboard.jsx`)
   - Listens for `booking_approved` and `booking_rejected` events
   - Displays real-time notifications with dismiss functionality
   - Shows success (green) or error (red) notifications

## Usage Guide

### For Owners

1. **Adding a Vehicle:**
   - Navigate to "Add Vehicle" page
   - Fill in vehicle details and upload required documents
   - Submit the form
   - All logged-in renters will see a notification about the new vehicle

2. **Managing Booking Requests:**
   - Navigate to "Booking Requests" from owner dashboard
   - New bookings will appear instantly with a notification
   - Click "Approve" to accept the booking (renter gets notified)
   - Click "Reject" to decline the booking (renter gets notified)

### For Renters

1. **Browsing Vehicles:**
   - Navigate to "Browse Vehicles" from renter dashboard
   - View all available vehicles
   - Watch for real-time notifications when new vehicles are added

2. **Booking a Vehicle:**
   - Click "Book Now" on any available vehicle
   - Select pickup/return dates and times
   - Click "Calculate Cost" to see total amount
   - Click "Confirm Booking" to send request to owner
   - Owner will receive instant notification

3. **Receiving Booking Updates:**
   - Stay on Renter Dashboard to see notifications
   - Green notification = Booking Approved! 🎉
   - Red notification = Booking Not Approved ❌
   - Click notification or × button to dismiss

## API Endpoints

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle (requires auth)

### Bookings
- `GET /api/bookings/owner/:ownerId` - Get bookings for owner (requires auth)
- `GET /api/bookings/renter/:renterId` - Get bookings for renter (requires auth)
- `POST /api/bookings` - Create new booking (requires auth)
- `PUT /api/bookings/:bookingId/approve` - Approve booking (owner only)
- `PUT /api/bookings/:bookingId/reject` - Reject booking (owner only)

## Socket.IO Events

### Server to Client

1. **new_vehicle**
   - Emitted to: All renters
   - Data: `{ vehicle: {...}, message: string }`
   - When: Owner adds a new vehicle

2. **new_booking_request**
   - Emitted to: Specific owner
   - Data: `{ booking: {...}, notification: {...} }`
   - When: Renter creates a booking

3. **booking_approved**
   - Emitted to: Specific renter
   - Data: `{ booking: {...}, notification: {...} }`
   - When: Owner approves a booking

4. **booking_rejected**
   - Emitted to: Specific renter
   - Data: `{ booking: {...}, notification: {...} }`
   - When: Owner rejects a booking

## Running the Application

### Start Server
```bash
cd server
npm run dev
```
Server runs on http://localhost:4000

### Start Client
```bash
cd client
npm run dev
```
Client runs on http://localhost:5173

### Prerequisites
- MongoDB running on mongodb://127.0.0.1:27017/quickrent
- Node.js installed
- All dependencies installed (`npm install` in both server and client folders)

## Testing the Feature

1. **Test Vehicle Real-Time Updates:**
   - Open two browser windows
   - Login as renter in one window, owner in another
   - As owner, add a new vehicle
   - Check renter's "Browse Vehicles" page - vehicle appears instantly with notification

2. **Test Booking Requests:**
   - As renter, browse vehicles and click "Book Now"
   - Fill in booking details and confirm
   - As owner, check "Booking Requests" page - request appears instantly with notification

3. **Test Booking Status Updates:**
   - As owner, approve or reject a booking
   - As renter, stay on dashboard - notification appears instantly
   - Green for approved, red for rejected

## Troubleshooting

### Socket Connection Issues
- Check browser console for connection errors
- Verify JWT token is present in localStorage as `qr_token`
- Ensure server is running on port 4000
- Check server logs for authentication errors

### Notifications Not Appearing
- Verify user is logged in with valid token
- Check browser console for socket events
- Ensure Socket.IO connection is established (check network tab)
- Verify server is emitting events (check server logs)

### Bookings Not Saving
- Check MongoDB is running
- Verify database connection in server logs
- Check browser console for API errors
- Ensure proper authentication headers are sent

## Security Considerations

- All Socket.IO connections are authenticated using JWT
- Users can only see their own bookings
- Owners can only approve/reject bookings for their vehicles
- All API endpoints are protected with authentication middleware

## Future Enhancements

- Push notifications for mobile devices
- Email notifications as backup
- Sound alerts for important notifications
- Notification history and persistence
- Read receipts for notifications
- Chat functionality between owner and renter
