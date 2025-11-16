const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const userSockets = new Map(); // Map to track userId -> socketId

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174'
      ],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.userId = decoded.id;
      socket.userType = decoded.role; // 'owner' or 'renter'
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userType})`);
    
    // Store the socket for this user
    userSockets.set(socket.userId, socket.id);
    
    // Join user to their personal room
    socket.join(`user:${socket.userId}`);
    
    // Join appropriate role room
    if (socket.userType === 'owner') {
      socket.join('owners');
    } else if (socket.userType === 'renter') {
      socket.join('renters');
    }

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      userSockets.delete(socket.userId);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

// Helper functions to emit events

function emitToUser(userId, event, data) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
}

function emitToOwners(event, data) {
  if (!io) return;
  io.to('owners').emit(event, data);
}

function emitToRenters(event, data) {
  if (!io) return;
  io.to('renters').emit(event, data);
}

function emitToAll(event, data) {
  if (!io) return;
  io.emit(event, data);
}

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToOwners,
  emitToRenters,
  emitToAll
};
