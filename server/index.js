require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add a route to handle uploads directory listing
app.get('/uploads/*', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params[0]);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: 'File not found' });
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/vehicles', require('./routes/vehicle.routes'));
app.use('/api/maintenance', require('./routes/maintenance.routes'));
app.use('/api/documents', require('./routes/documents.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 4000;
const RAW_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickrent';
// Normalize localhost to IPv4 to avoid ::1 issues on Windows
const MONGO_URI = RAW_MONGO_URI.replace('localhost', '127.0.0.1');

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


