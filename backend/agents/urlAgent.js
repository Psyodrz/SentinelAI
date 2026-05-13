const URL = require('url').URL;
const dns = require('dns').promises;

/**
 * URL Agent: Analyzes domain structure and flags suspicious patterns
 * @param {string} url - Sanitized URL
 * @returns {Object} { domainFlags: Array, domainInfo: string }
 */
async function urlAgent(url) {
  const domainFlags = [];
  let domainInfo = '';
  
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const domain = hostname.toLowerCase();
    
    // Extract domain parts
    const parts = domain.split('.');
    const tld = parts[parts.length - 1];
    const subdomainCount = Math.max(0, parts.length - 2);
    
    // Flag suspicious TLDs
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.pw', '.top', '.click', '.download'];
    if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
      domainFlags.push({
        type: 'suspicious_tld',
        severity: 'medium',
        description: `Domain uses suspicious TLD: .${tld}`,
        score: 20
      });
    }
    
    // Flag excessive subdomains
    if (subdomainCount > 3) {
      domainFlags.push({
        type: 'excessive_subdomains',
        severity: 'medium',
        description: `Domain has ${subdomainCount} subdomains`,
        score: 15
      });
    }
    
    // Flag suspicious patterns in domain
    const suspiciousPatterns = [
      { pattern: /\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}/, desc: 'IP-like pattern in domain', score: 30 },
      { pattern: /[0-9]{5,}/, desc: 'Long numeric sequence in domain', score: 25 },
      { pattern: /[a-z]{20,}/, desc: 'Unusually long string in domain', score: 20 },
      { pattern: /[^a-zA-Z0-9.-]/, desc: 'Special characters in domain', score: 35 }
    ];
    
    suspiciousPatterns.forEach(({ pattern, desc, score }) => {
      if (pattern.test(domain)) {
        domainFlags.push({
          type: 'suspicious_pattern',
          severity: 'high',
          description: desc,
          score
        });
      }
    });
    
    // Flag URL length
    if (url.length > 100) {
      domainFlags.push({
        type: 'long_url',
        severity: 'low',
        description: `URL is ${url.length} characters long`,
        score: 10
      });
    }
    
    // Check for suspicious ports
    if (parsedUrl.port && !['80', '443'].includes(parsedUrl.port)) {
      domainFlags.push({
        type: 'unusual_port',
        severity: 'medium',
        description: `Uses non-standard port: ${parsedUrl.port}`,
        score: 20
      });
    }
    
    // Try to get domain info (basic)
    try {
      await dns.resolve(domain);
      domainInfo = `Domain: ${domain} | Resolves successfully`;
    } catch (error) {
      domainFlags.push({
        type: 'dns_resolution_failed',
        severity: 'high',
        description: 'Domain does not resolve',
        score: 40
      });
      domainInfo = `Domain: ${domain} | DNS resolution failed`;
    }
    
    return {
      domainFlags,
      domainInfo,
      parsedDomain: {
        hostname,
        tld,
        subdomainCount,
        urlLength: url.length
      }
    };
    
  } catch (error) {
    return {
      domainFlags: [{
        type: 'invalid_url',
        severity: 'high',
        description: 'Invalid URL format',
        score: 50
      }],
      domainInfo: 'Invalid URL format',
      error: error.message
    };
  }
}

module.exports = urlAgent;
