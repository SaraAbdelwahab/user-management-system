const { Server } = require('socket.io');
const JWTConfig = require('./jwt');

class SocketConfig {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
      }
    });
    
    this.setupMiddleware();
    this.setupHandlers();
  }

  setupMiddleware() {
    // Authentication middleware for socket connections
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      try {
        const decoded = JWTConfig.verifyAccessToken(token);
        socket.userId = decoded.id;
        socket.userEmail = decoded.email;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  setupHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`✅ User connected: ${socket.userEmail}`);
      
      // Join user-specific room for targeted updates
      socket.join(`user:${socket.userId}`);
      
      // Join admin room if user is admin
      if (socket.handshake.auth.isAdmin) {
        socket.join('admin');
      }

      socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.userEmail}`);
      });
    });
  }

  // Emit events to specific users or rooms
  emitUserUpdate(userId, event, data) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  emitAdminUpdate(event, data) {
    this.io.to('admin').emit(event, data);
  }

  emitGlobalUpdate(event, data) {
    this.io.emit(event, data);
  }
}

module.exports = SocketConfig;