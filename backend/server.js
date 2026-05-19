require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AcadTrack API is running' });
});

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/dashboard',     require('./routes/dashboard'));
app.use('/api/enrollments',   require('./routes/enrollment'));
app.use('/api/grades',        require('./routes/grades'));
app.use('/api/schedule',      require('./routes/schedule'));
app.use('/api/subjects',      require('./routes/subjects'));
app.use('/api/students',      require('./routes/students'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/faculty',       require('./routes/faculty'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AcadTrack Server running on port ${PORT}`);
});