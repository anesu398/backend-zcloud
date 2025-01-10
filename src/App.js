require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./config/db'); // Database configuration
const { setupWebSocketServer, broadcast } = require('./websocket/server');
// Import Routers
const usersRouter = require('./controllers/users.controller');
const filesRouter = require('./controllers/files.controller');
const bucketsRouter = require('./controllers/buckets.controller');
const authRouter = require('./controllers/auth.controller'); // For authentication routes
const queryRouter = require('./controllers/query.controller');
const schemaRouter = require('./controllers/schema.controller');
const rateLimit = require('express-rate-limit');
const statusMonitor = require('express-status-monitor');
// Initialize the app
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});
// Middleware
app.use(cors({ origin: '*' })); // Enable Cross-Origin Resource Sharing for all origins
app.use(helmet()); // Add security headers
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(morgan('combined')); // Log requests in combined format
app.use(statusMonitor());
// API Routes
app.use('/api/users', usersRouter); // User-related routes
app.use('/api/files', filesRouter); // File-related routes
app.use('/api/buckets', bucketsRouter); // Bucket-related routes
app.use('/api/auth', authRouter); // Authentication-related routes
app.use('/api/query', queryRouter); // Custom query route
app.use('/api/schema', schemaRouter); // Schema route
app.use('/api', limiter);
// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});
app.get('/status', (req, res) => {
  res.sendFile('node_modules/express-status-monitor/frontend/index.html');
});
// Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[Error]: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message });
});

// Set up HTTP Server
const server = http.createServer(app);

// Set up WebSocket (Socket.IO) server
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for now
    methods: ['GET', 'POST']
  }
});

// WebSocket Connection (Real-Time Updates)
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Event listeners for socket communication
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Example: Sending updates to clients when database changes
  db.on('update', (data) => {
    console.log('Database updated:', data);
    io.emit('database-update', data); // Notify all connected clients
  });
});

// Export the HTTP server (including Socket.IO)
module.exports = { app, server };
