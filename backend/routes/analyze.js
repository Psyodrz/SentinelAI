const express = require('express');
const router = express.Router();

// Import agents and services
const inputAgent = require('../agents/inputAgent');
const urlAgent = require('../agents/urlAgent');
const phishingAgent = require('../agents/phishingAgent');
const riskAgent = require('../agents/riskAgent');
const recommendAgent = require('../agents/recommendAgent');
const { enhanceWithOllama } = require('../services/ollamaService');

// Import middleware
const { analysisLimiter } = require('../middleware/rateLimit');
const { validateAnalysisInput } = require('../middleware/sanitize');

// Main analysis endpoint
router.post('/', analysisLimiter, validateAnalysisInput, async (req, res) => {
  try {
    const { input } = req.body;
    
    // Step 1: Input validation and classification
    const inputResult = await inputAgent(input);
    
    if (!inputResult.isValid) {
      return res.status(400).json({
        error: inputResult.error || 'Invalid input',
        code: 'INVALID_INPUT'
      });
    }
    
    // Step 2: URL analysis (if URL)
    let domainFlags = [];
    let domainInfo = '';
    
    if (inputResult.type === 'url') {
      const urlResult = await urlAgent(inputResult.sanitized);
      domainFlags = urlResult.domainFlags;
      domainInfo = urlResult.domainInfo;
    }
    
    // Step 3: Phishing analysis
    const phishingResult = await phishingAgent(inputResult.sanitized, inputResult.type);
    const phishingFlags = phishingResult.phishingFlags;
    
    // Step 4: Risk assessment
    const riskResult = await riskAgent({
      domainFlags,
      phishingFlags,
      inputType: inputResult.type
    });
    
    // Step 5: Recommendations
    const recommendResult = await recommendAgent({
      threat_score: riskResult.threat_score,
      risk_level: riskResult.risk_level,
      domainFlags,
      phishingFlags,
      inputType: inputResult.type
    });
    
    // Step 6: Enhanced analysis with Claude (if available)
    const baseAnalysis = {
      input: inputResult.sanitized,
      inputType: inputResult.type,
      threat_score: riskResult.threat_score,
      risk_level: riskResult.risk_level,
      reasons: [
        ...domainFlags.map(flag => ({
          text: flag.description,
          severity: flag.severity
        })),
        ...phishingFlags.map(flag => ({
          text: flag.description,
          severity: flag.severity
        }))
      ],
      recommendations: recommendResult.recommendations,
      domain_info: domainInfo || `Analyzed ${inputResult.type}: ${inputResult.sanitized}`,
      analysis_metadata: {
        timestamp: new Date().toISOString(),
        agent_results: {
          input: inputResult,
          domain: { flags: domainFlags, info: domainInfo },
          phishing: phishingResult,
          risk: riskResult,
          recommendations: recommendResult
        }
      }
    };
    
    // Enhance with Ollama insights
    const finalAnalysis = await enhanceWithOllama(baseAnalysis);
    
    res.json(finalAnalysis);
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: 'ANALYSIS_ERROR'
    });
  }
});

// Quick analysis endpoint (for real-time feedback)
router.post('/quick', analysisLimiter, validateAnalysisInput, async (req, res) => {
  try {
    const { input } = req.body;
    
    // Basic input validation
    const inputResult = await inputAgent(input);
    
    if (!inputResult.isValid) {
      return res.status(400).json({
        error: inputResult.error || 'Invalid input',
        code: 'INVALID_INPUT'
      });
    }
    
    // Quick risk assessment without full pipeline
    let quickScore = 0;
    const reasons = [];
    
    // Basic heuristics for quick assessment
    if (inputResult.type === 'url') {
      const urlResult = await urlAgent(inputResult.sanitized);
      quickScore += urlResult.domainFlags.reduce((sum, flag) => sum + flag.score, 0);
      reasons.push(...urlResult.domainFlags.map(flag => flag.description));
    }
    
    const phishingResult = await phishingAgent(inputResult.sanitized, inputResult.type);
    quickScore += phishingResult.phishingFlags.reduce((sum, flag) => sum + flag.score, 0);
    reasons.push(...phishingResult.phishingFlags.map(flag => flag.description));
    
    // Normalize to 0-100
    const normalizedScore = Math.min(100, Math.max(0, quickScore));
    
    let riskLevel;
    if (normalizedScore <= 20) {
      riskLevel = 'SAFE';
    } else if (normalizedScore <= 50) {
      riskLevel = 'SUSPICIOUS';
    } else {
      riskLevel = 'HIGH RISK';
    }
    
    res.json({
      threat_score: normalizedScore,
      risk_level: riskLevel,
      input_type: inputResult.type,
      quick_reasons: reasons.slice(0, 3), // Top 3 reasons
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Quick analysis error:', error);
    res.status(500).json({
      error: 'Quick analysis failed',
      code: 'QUICK_ANALYSIS_ERROR'
    });
  }
});

module.exports = router;
