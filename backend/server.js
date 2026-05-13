const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const analyzeRoutes = require('./routes/analyze');
const { limiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Routes
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 SentinelAI backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
