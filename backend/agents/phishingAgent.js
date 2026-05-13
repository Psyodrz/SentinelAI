/**
 * Phishing Agent: Detects phishing patterns in URLs and emails
 * @param {string} input - Sanitized URL or email
 * @param {string} type - 'url' or 'email'
 * @returns {Object} { phishingFlags: Array }
 */
async function phishingAgent(input, type) {
  const phishingFlags = [];
  
  // Common phishing keywords
  const phishingKeywords = [
    'verify', 'secure', 'account', 'update', 'confirm', 'suspended',
    'limited', 'urgent', 'immediate', 'action', 'required', 'click',
    'login', 'signin', 'password', 'security', 'alert', 'warning',
    'expire', 'expire', 'blocked', 'unusual', 'activity', 'protect'
  ];
  
  // Suspicious domains (commonly spoofed)
  const spoofedDomains = [
    'paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook',
    'instagram', 'twitter', 'linkedin', 'netflix', 'spotify', 'dropbox',
    'gmail', 'yahoo', 'outlook', 'hotmail', 'bank', 'chase', 'wellsfargo'
  ];
  
  // Check for phishing keywords
  const lowerInput = input.toLowerCase();
  const foundKeywords = phishingKeywords.filter(keyword => 
    lowerInput.includes(keyword)
  );
  
  if (foundKeywords.length > 0) {
    phishingFlags.push({
      type: 'phishing_keywords',
      severity: 'medium',
      description: `Contains suspicious keywords: ${foundKeywords.join(', ')}`,
      score: foundKeywords.length * 10
    });
  }
  
  if (type === 'url') {
    // URL-specific phishing checks
    try {
      const url = new URL(input);
      const hostname = url.hostname;
      
      // Check for domain spoofing
      const spoofedFound = spoofedDomains.filter(domain => 
        hostname.includes(domain) && !hostname.endsWith(`${domain}.com`)
      );
      
      if (spoofedFound.length > 0) {
        phishingFlags.push({
          type: 'domain_spoofing',
          severity: 'high',
          description: `Potential domain spoofing: ${spoofedFound.join(', ')}`,
          score: 35
        });
      }
      
      // Check for suspicious URL patterns
      const suspiciousPatterns = [
        { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl/, desc: 'URL shortener service', score: 15 },
        { pattern: /\/login|\/signin|\/account|\/verify/, desc: 'Login-related path', score: 20 },
        { pattern: /[a-f0-9]{20,}/, desc: 'Long hex string in URL', score: 25 },
        { pattern: /[0-9]{8,}/, desc: 'Long numeric sequence in URL', score: 20 }
      ];
      
      suspiciousPatterns.forEach(({ pattern, desc, score }) => {
        if (pattern.test(input)) {
          phishingFlags.push({
            type: 'suspicious_url_pattern',
            severity: 'medium',
            description: desc,
            score
          });
        }
      });
      
      // Check for HTTP instead of HTTPS
      if (url.protocol === 'http:') {
        phishingFlags.push({
          type: 'insecure_protocol',
          severity: 'medium',
          description: 'Uses HTTP instead of HTTPS',
          score: 25
        });
      }
      
    } catch (error) {
      // Invalid URL, already caught by urlAgent
    }
    
  } else if (type === 'email') {
    // Email-specific phishing checks
    
    // Check for suspicious sender patterns
    const suspiciousEmailPatterns = [
      { pattern: /[0-9]{3,}@/, desc: 'Numeric prefix in email', score: 20 },
      { pattern: /noreply|no-reply|donotreply/, desc: 'Generic no-reply address', score: 10 },
      { pattern: /[a-z]{15,}@/, desc: 'Unusually long local part', score: 15 }
    ];
    
    suspiciousEmailPatterns.forEach(({ pattern, desc, score }) => {
      if (pattern.test(input)) {
        phishingFlags.push({
          type: 'suspicious_email_pattern',
          severity: 'low',
          description: desc,
          score
        });
      }
    });
    
    // Check for free email providers with suspicious patterns
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = input.split('@')[1]?.toLowerCase();
    
    if (freeProviders.includes(domain) && foundKeywords.length > 2) {
      phishingFlags.push({
        type: 'free_email_phishing',
        severity: 'medium',
        description: 'Free email provider with multiple phishing keywords',
        score: 30
      });
    }
  }
  
  // Check for encoded content (common in phishing)
  if (/%[0-9a-f]{2}/i.test(input) && input.includes('%')) {
    phishingFlags.push({
      type: 'url_encoding',
      severity: 'medium',
      description: 'Contains URL encoded characters',
      score: 20
    });
  }
  
  return {
    phishingFlags,
    totalPhishingScore: phishingFlags.reduce((sum, flag) => sum + flag.score, 0)
  };
}

module.exports = phishingAgent;
