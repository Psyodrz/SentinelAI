/**
 * Recommend Agent: Generates recommendations based on risk analysis
 * @param {Object} input - Object containing risk score and all flags
 * @returns {Object} { recommendations: Array }
 */
async function recommendAgent({ threat_score, risk_level, domainFlags, phishingFlags, inputType }) {
  const recommendations = [];
  
  // Base recommendations by risk level
  if (risk_level === 'SAFE') {
    recommendations.push({
      text: 'This appears to be safe. Always exercise caution when clicking links.',
      type: 'do'
    });
    recommendations.push({
      text: 'Verify the sender/website before sharing personal information.',
      type: 'do'
    });
  } else if (risk_level === 'SUSPICIOUS') {
    recommendations.push({
      text: 'Avoid clicking this link or responding to this email.',
      type: 'avoid'
    });
    recommendations.push({
      text: 'If you recognize the sender, contact them through a different channel.',
      type: 'do'
    });
    recommendations.push({
      text: 'Report as phishing/phishing attempt to your email provider.',
      type: 'do'
    });
  } else { // HIGH RISK
    recommendations.push({
      text: 'DO NOT click this link or respond to this message.',
      type: 'avoid'
    });
    recommendations.push({
      text: 'Block the sender immediately.',
      type: 'do'
    });
    recommendations.push({
      text: 'Report to your IT department or security team.',
      type: 'do'
    });
    recommendations.push({
      text: 'Scan your device for malware if you already clicked.',
      type: 'do'
    });
  }
  
  // Specific recommendations based on flags
  domainFlags.forEach(flag => {
    switch (flag.type) {
      case 'dns_resolution_failed':
        recommendations.push({
          text: 'This domain does not exist - likely a fake or mistyped address.',
          type: 'avoid'
        });
        break;
      case 'suspicious_tld':
        recommendations.push({
          text: 'Be cautious of domains with uncommon top-level domains.',
          type: 'avoid'
        });
        break;
      case 'unusual_port':
        recommendations.push({
          text: 'Unusual port numbers may indicate malicious services.',
          type: 'avoid'
        });
        break;
      case 'insecure_protocol':
        recommendations.push({
          text: 'Only use HTTPS websites for secure communications.',
          type: 'avoid'
        });
        break;
    }
  });
  
  phishingFlags.forEach(flag => {
    switch (flag.type) {
      case 'domain_spoofing':
        recommendations.push({
          text: 'This appears to be impersonating a legitimate brand.',
          type: 'avoid'
        });
        break;
      case 'phishing_keywords':
        recommendations.push({
          text: 'Urgent language and account threats are common phishing tactics.',
          type: 'avoid'
        });
        break;
      case 'suspicious_url_pattern':
        recommendations.push({
          text: 'URL shorteners can hide malicious destinations.',
          type: 'avoid'
        });
        break;
    }
  });
  
  // Input type specific recommendations
  if (inputType === 'email') {
    recommendations.push({
      text: 'Never share passwords or financial information via email.',
      type: 'avoid'
    });
    recommendations.push({
      text: 'Check email headers to verify the actual sender.',
      type: 'do'
    });
  } else if (inputType === 'url') {
    recommendations.push({
      text: 'Hover over links to preview the actual destination.',
      type: 'do'
    });
    recommendations.push({
      text: 'Use a link scanner service before visiting unknown sites.',
      type: 'do'
    });
  }
  
  // Remove duplicates and limit to top recommendations
  const uniqueRecommendations = recommendations.filter((rec, index, self) =>
    index === self.findIndex((r) => r.text === rec.text)
  );
  
  // Sort by type (avoid first) and limit
  const sortedRecommendations = uniqueRecommendations
    .sort((a, b) => {
      if (a.type === 'avoid' && b.type !== 'avoid') return -1;
      if (a.type !== 'avoid' && b.type === 'avoid') return 1;
      return 0;
    })
    .slice(0, 8); // Limit to 8 recommendations
  
  return {
    recommendations: sortedRecommendations
  };
}

module.exports = recommendAgent;
