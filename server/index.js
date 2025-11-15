require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
];
const envOrigin = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigin])];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

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

async function fixRenterIndexes() {
  try {
    const Renter = require('./models/Renter');
    const db = mongoose.connection.db;
    const collection = db.collection('renters');
    
    // Drop the old referralCode index if it exists (non-sparse)
    try {
      await collection.dropIndex('referralCode_1');
      console.log('Dropped old referralCode index');
    } catch (err) {
      // Index might not exist, which is fine
      if (err.code !== 27) { // 27 = IndexNotFound
        console.log('Note: Old referralCode index not found or already dropped');
      }
    }
    
    // Create the new sparse unique index
    try {
      await collection.createIndex({ referralCode: 1 }, { unique: true, sparse: true });
      console.log('Created sparse unique index on referralCode');
    } catch (err) {
      // Index might already exist with correct settings
      if (err.code !== 85) { // 85 = IndexOptionsConflict
        console.log('Note: referralCode index may already exist');
      }
    }
  } catch (err) {
    console.error('Error fixing renter indexes:', err.message);
    // Don't fail startup if index fix fails
  }
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Fix the referralCode index issue
    await fixRenterIndexes();
    
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


