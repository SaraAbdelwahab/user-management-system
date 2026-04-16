const mysql = require('mysql2/promise'); // Use promise version for async/await
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool (NOT a single connection)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,        // Max 10 connections in pool
  queueLimit: 0,              // Unlimited queueing
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection immediately
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // Exit if cannot connect to DB
  }
};

testConnection();

module.exports = pool;