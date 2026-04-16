const http = require('http');
const app = require('./src/app');
const SocketConfig = require('./src/config/socket');
const dotenv = require('dotenv');


dotenv.config();



const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
const socketInstance = new SocketConfig(server);

// Make socket instance available globally
global.socketIO = socketInstance;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});