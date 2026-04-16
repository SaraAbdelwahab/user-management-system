const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));




// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/users', userRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    service: 'user-management-api',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use(errorMiddleware.notFound);

// Global Error Handler (MUST be last)
app.use(errorMiddleware.handleError);

module.exports = app;