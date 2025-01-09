require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import Routers
const usersRouter = require('./controllers/users.controller');
const filesRouter = require('./controllers/files.controller');
const bucketsRouter = require('./controllers/buckets.controller');

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Add security headers
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Log requests to the console

// API Routes
app.use('/api/users', usersRouter); // User-related routes
app.use('/api/files', filesRouter); // File-related routes
app.use('/api/buckets', bucketsRouter); // Bucket-related routes

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Export the app
module.exports = app;
