require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'gateway.log' })
  ],
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Service URLs (from environment variables)
const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:3001';
const PROMPT_SERVICE_URL = process.env.PROMPT_SERVICE_URL || 'http://localhost:3002';
const MEMORY_SERVICE_URL = process.env.MEMORY_SERVICE_URL || 'http://localhost:3003';
const TOOLS_SERVICE_URL = process.env.TOOLS_SERVICE_URL || 'http://localhost:3004';
const EVALUATION_SERVICE_URL = process.env.EVALUATION_SERVICE_URL || 'http://localhost:3005';

// Authentication middleware
const authenticateRequest = (req, res, next) => {
  const apiKey = req.header('X-API-KEY');
  
  // Skip auth for health check
  if (req.path === '/health') {
    return next();
  }
  
  // Check if API key is provided and valid
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Apply authentication middleware
app.use(authenticateRequest);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      agent: process.env.AGENT_SERVICE_STATUS || 'unknown',
      prompt: process.env.PROMPT_SERVICE_STATUS || 'unknown',
      memory: process.env.MEMORY_SERVICE_STATUS || 'unknown',
      tools: process.env.TOOLS_SERVICE_STATUS || 'unknown',
      evaluation: process.env.EVALUATION_SERVICE_STATUS || 'unknown',
    }
  });
});

// Service proxies
app.use('/api/agents', createProxyMiddleware({
  target: AGENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/agents': '/api'
  },
  onError: (err, req, res) => {
    logger.error(`Agent service proxy error: ${err.message}`);
    res.status(500).json({ error: 'Agent service unavailable' });
  }
}));

app.use('/api/prompts', createProxyMiddleware({
  target: PROMPT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/prompts': '/api'
  },
  onError: (err, req, res) => {
    logger.error(`Prompt service proxy error: ${err.message}`);
    res.status(500).json({ error: 'Prompt service unavailable' });
  }
}));

app.use('/api/memory', createProxyMiddleware({
  target: MEMORY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/memory': '/api'
  },
  onError: (err, req, res) => {
    logger.error(`Memory service proxy error: ${err.message}`);
    res.status(500).json({ error: 'Memory service unavailable' });
  }
}));

app.use('/api/tools', createProxyMiddleware({
  target: TOOLS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/tools': '/api'
  },
  onError: (err, req, res) => {
    logger.error(`Tools service proxy error: ${err.message}`);
    res.status(500).json({ error: 'Tools service unavailable' });
  }
}));

app.use('/api/evaluate', createProxyMiddleware({
  target: EVALUATION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/evaluate': '/api'
  },
  onError: (err, req, res) => {
    logger.error(`Evaluation service proxy error: ${err.message}`);
    res.status(500).json({ error: 'Evaluation service unavailable' });
  }
}));

// Fallback route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
