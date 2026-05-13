const fetch = require('node-fetch');

/**
 * Ollama AI Service: Enhanced analysis using Qwen3:8B via Ollama
 * @param {Object} analysisData - Complete analysis data from all agents
 * @returns {Object} Enhanced analysis with AI insights
 */
async function enhanceWithOllama(analysisData) {
  try {
    const { input, inputType, threat_score, risk_level, reasons, analysis_metadata } = analysisData;
    
    // Extract flags from analysis metadata or reasons
    const domainFlags = analysis_metadata?.agent_results?.domain?.flags || [];
    const phishingFlags = analysis_metadata?.agent_results?.phishing?.flags || [];
    
    // Create a comprehensive prompt for Qwen3:8B
    const prompt = `You are a cybersecurity expert analyzing a potential threat. Please analyze this data and provide enhanced insights:

Input: ${input}
Type: ${inputType}
Current Risk Score: ${threat_score}/100
Risk Level: ${risk_level}

Domain Flags Found:
${Array.isArray(domainFlags) && domainFlags.length > 0 ? domainFlags.map(f => `- ${f.description} (Severity: ${f.severity}, Score: ${f.score})`).join('\n') : 'No domain flags detected'}

Phishing Flags Found:
${Array.isArray(phishingFlags) && phishingFlags.length > 0 ? phishingFlags.map(f => `- ${f.description} (Severity: ${f.severity}, Score: ${f.score})`).join('\n') : 'No phishing flags detected'}

Please provide:
1. A brief summary of threat level and why
2. 2-3 additional specific concerns or observations
3. Enhanced recommendations beyond the basic ones

Respond in JSON format:
{
  "summary": "Brief threat assessment",
  "additionalConcerns": ["concern1", "concern2", "concern3"],
  "enhancedRecommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        options: { temperature: 0 }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    let aiInsights;
    try {
      aiInsights = JSON.parse(data.response);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', data.response);
      aiInsights = {
        summary: 'AI analysis unavailable',
        additionalConcerns: ['Unable to process AI insights'],
        enhancedRecommendations: ['Proceed with standard caution']
      };
    }

    return {
      ...analysisData,
      claudeInsights: aiInsights,
      enhanced: true
    };

  } catch (error) {
    console.error('Ollama API error:', error);
    
    // Return original analysis without AI enhancements
    return {
      ...analysisData,
      claudeInsights: {
        summary: 'AI analysis temporarily unavailable',
        additionalConcerns: ['AI service is currently down'],
        enhancedRecommendations: ['Rely on standard security practices']
      },
      enhanced: false,
      error: error.message
    };
  }
}

/**
 * Quick threat assessment using Qwen3:8B via Ollama
 * @param {string} input - User input to analyze
 * @returns {Object} Quick assessment
 */
async function quickThreatAssessment(input) {
  try {
    const prompt = `Quickly assess this potential threat (URL or email): "${input}"

Rate threat level 0-100 and provide one-sentence reason.
Respond with JSON: {"score": 0-100, "reason": "brief explanation"}`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        options: { temperature: 0 }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const assessment = JSON.parse(data.response);
    return { available: true, ...assessment };

  } catch (error) {
    console.error('Quick assessment error:', error);
    return { available: false, error: error.message };
  }
}

module.exports = {
  enhanceWithOllama,
  quickThreatAssessment
};
