import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnecting = false;
  }

  connect(token, isAdmin = false) {
    // 🔥 GUARD 1: no token → block connection
    if (!token) {
      console.warn('Socket not connected: missing token');
      return;
    }

    // 🔥 GUARD 2: prevent multiple connection spam
    if (this.socket?.connected || this.isConnecting) return;

    this.isConnecting = true;

    const baseURL = import.meta.env.VITE_API_URL.replace('/api/v1', '');

    this.socket = io(baseURL, {
      auth: {
        token,
        isAdmin,
      },
      transports: ['websocket'],

      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected');
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);

      this.isConnecting = false;

      if (reason === 'io server disconnect') {
        // server forced disconnect → manual reconnect
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);

      this.isConnecting = false;

      // optional UX feedback
      toast.error('Realtime connection failed');
    });

    this.setupGlobalListeners();
  }

  setupGlobalListeners() {
    if (!this.socket) return;

    this.socket.on('user:created', (data) => {
      toast.success(`New user created: ${data.user.fullName}`);
      window.dispatchEvent(new CustomEvent('users:changed'));
    });

    this.socket.on('user:updated', (data) => {
      toast.info(`User ${data.userId} was updated`);
      window.dispatchEvent(new CustomEvent('users:changed'));
    });

    this.socket.on('user:deleted', () => {
      toast.info('User was deleted');
      window.dispatchEvent(new CustomEvent('users:changed'));
    });

    this.socket.on('profile:updated', (data) => {
      toast.info(data.message);
    });
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
    this.listeners.set(event, callback);
  }

  off(event) {
    if (!this.socket) return;
    const callback = this.listeners.get(event);

    if (callback) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }
}

export default new SocketClient();