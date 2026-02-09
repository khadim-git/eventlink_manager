const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const websiteRoutes = require('./routes/websites');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EventLink Manager API is running', timestamp: new Date().toISOString() });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Serving frontend from build folder`);
  }
});
