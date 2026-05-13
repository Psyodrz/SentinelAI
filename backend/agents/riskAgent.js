/**
 * Risk Agent: Aggregates all flags and calculates final risk score
 * @param {Object} input - Object containing all agent results
 * @returns {Object} { score: number, level: 'SAFE'|'SUSPICIOUS'|'HIGH RISK', breakdown: Object }
 */
async function riskAgent({ domainFlags, phishingFlags, inputType }) {
  let totalScore = 0;
  const breakdown = {
    domain: { score: 0, flags: domainFlags.length },
    phishing: { score: 0, flags: phishingFlags.length },
    typeBonus: 0
  };
  
  // Calculate domain risk score
  domainFlags.forEach(flag => {
    totalScore += flag.score;
    breakdown.domain.score += flag.score;
  });
  
  // Calculate phishing risk score
  phishingFlags.forEach(flag => {
    totalScore += flag.score;
    breakdown.phishing.score += flag.score;
  });
  
  // Apply type-based modifiers
  if (inputType === 'email') {
    // Emails are inherently slightly riskier due to spoofing potential
    breakdown.typeBonus = 5;
    totalScore += 5;
  }
  
  // Determine risk level based on score
  let riskLevel;
  if (totalScore <= 20) {
    riskLevel = 'SAFE';
  } else if (totalScore <= 50) {
    riskLevel = 'SUSPICIOUS';
  } else {
    riskLevel = 'HIGH RISK';
  }
  
  // Apply additional heuristics
  const heuristics = [];
  
  // Multiple high-severity flags
  const highSeverityFlags = [...domainFlags, ...phishingFlags]
    .filter(flag => flag.severity === 'high').length;
  
  if (highSeverityFlags >= 2) {
    heuristics.push('Multiple high-severity flags detected');
    totalScore += 15;
    breakdown.heuristics = 15;
  }
  
  // Check for critical combinations
  const hasDNSFailure = domainFlags.some(f => f.type === 'dns_resolution_failed');
  const hasSpoofing = phishingFlags.some(f => f.type === 'domain_spoofing');
  
  if (hasDNSFailure && hasSpoofing) {
    heuristics.push('DNS failure combined with domain spoofing');
    totalScore += 25;
    breakdown.heuristics = (breakdown.heuristics || 0) + 25;
  }
  
  // Recalculate risk level with heuristics
  if (totalScore <= 20) {
    riskLevel = 'SAFE';
  } else if (totalScore <= 50) {
    riskLevel = 'SUSPICIOUS';
  } else {
    riskLevel = 'HIGH RISK';
  }
  
  // Normalize score to 0-100 scale
  const normalizedScore = Math.min(100, Math.max(0, totalScore));
  
  return {
    threat_score: normalizedScore,
    risk_level: riskLevel,
    breakdown,
    heuristics,
    rawScore: totalScore
  };
}

module.exports = riskAgent;
