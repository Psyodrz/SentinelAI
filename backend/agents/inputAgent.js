const validator = require('validator');

/**
 * Input Agent: Sanitizes and classifies user input
 * @param {string} input - Raw user input (URL or email)
 * @returns {Object} { type: 'url'|'email'|'unknown', sanitized: string, isValid: boolean }
 */
async function inputAgent(input) {
  if (!input || typeof input !== 'string') {
    return {
      type: 'unknown',
      sanitized: '',
      isValid: false,
      error: 'Invalid input: input must be a non-empty string'
    };
  }

  const trimmed = input.trim();
  
  // Check if it's a URL
  if (validator.isURL(trimmed, { 
    protocols: ['http', 'https'],
    require_protocol: true,
    allow_underscores: false
  })) {
    return {
      type: 'url',
      sanitized: trimmed.toLowerCase(),
      isValid: true
    };
  }
  
  // Check if it's an email
  if (validator.isEmail(trimmed, { 
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true
  })) {
    return {
      type: 'email',
      sanitized: trimmed.toLowerCase(),
      isValid: true
    };
  }
  
  // Try to fix common URL issues (missing protocol)
  if (trimmed.includes('.') && !trimmed.includes(' ')) {
    const withHttps = `https://${trimmed}`;
    if (validator.isURL(withHttps, { 
      protocols: ['http', 'https'],
      require_protocol: true,
      allow_underscores: false
    })) {
      return {
        type: 'url',
        sanitized: withHttps.toLowerCase(),
        isValid: true
      };
    }
  }
  
  return {
    type: 'unknown',
    sanitized: trimmed,
    isValid: false,
    error: 'Input must be a valid URL or email address'
  };
}

module.exports = inputAgent;
