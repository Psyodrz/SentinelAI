const rateLimit = require('express-rate-limit');

// Create rate limiter for API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests (status codes < 400)
  skipSuccessfulRequests: false,
  // Skip failed requests (status codes >= 400)
  skipFailedRequests: false,
  // Custom key generator for more granular rate limiting
  keyGenerator: (req) => {
    return req.ip + ':' + (req.headers['user-agent'] || '');
  }
});

// Stricter rate limiting for analysis endpoint
const analysisLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 analysis requests per minute
  message: {
    error: 'Too many analysis requests, please wait before trying again.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  limiter,
  analysisLimiter
};
