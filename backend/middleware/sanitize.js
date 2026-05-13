const validator = require('validator');

/**
 * Middleware to sanitize and validate input
 */
function sanitizeInput(req, res, next) {
  // Only sanitize POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    
    // Sanitize string inputs in the body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    
    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }
  }
  
  next();
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const sanitized = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        // Escape HTML entities and normalize
        sanitized[key] = validator.escape(value.trim());
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}

/**
 * Validate analysis input specifically
 */
function validateAnalysisInput(req, res, next) {
  const { input } = req.body;
  
  if (!input) {
    return res.status(400).json({
      error: 'Missing required field: input',
      code: 'MISSING_INPUT'
    });
  }
  
  if (typeof input !== 'string') {
    return res.status(400).json({
      error: 'Input must be a string',
      code: 'INVALID_INPUT_TYPE'
    });
  }
  
  if (input.length > 2048) {
    return res.status(400).json({
      error: 'Input too long (max 2048 characters)',
      code: 'INPUT_TOO_LONG'
    });
  }
  
  if (input.length < 3) {
    return res.status(400).json({
      error: 'Input too short (min 3 characters)',
      code: 'INPUT_TOO_SHORT'
    });
  }
  
  // Check for potentially malicious content
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi
  ];
  
  const hasDangerousContent = dangerousPatterns.some(pattern => pattern.test(input));
  
  if (hasDangerousContent) {
    return res.status(400).json({
      error: 'Input contains potentially dangerous content',
      code: 'DANGEROUS_CONTENT'
    });
  }
  
  next();
}

module.exports = {
  sanitizeInput,
  validateAnalysisInput
};
