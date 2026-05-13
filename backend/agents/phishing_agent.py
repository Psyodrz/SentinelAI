import re
from typing import Dict, Any, List, Optional
from services.ai_service import analyze_phishing_language

async def analyze_phishing_patterns(text: str, text_type: str = "url") -> Dict[str, Any]:
    """
    Analyze text for phishing patterns using both rule-based detection and AI.
    
    Args:
        text: Text to analyze (URL or email)
        text_type: Type of text ("url" or "email")
        
    Returns:
        Dict with phishing analysis results
    """
    result = {
        "phishing_detected": False,
        "rule_based_patterns": [],
        "ai_patterns": [],
        "combined_patterns": [],
        "confidence_score": 0
    }
    
    # Rule-based analysis
    rule_result = analyze_rule_based_patterns(text, text_type)
    result["rule_based_patterns"] = rule_result["patterns"]
    
    # AI-based analysis (for emails or suspicious URLs)
    if text_type == "email" or rule_result["suspicious_score"] > 0:
        ai_result = await analyze_phishing_language(text, text_type)
        result["ai_patterns"] = ai_result.get("patterns_found", [])
        result["ai_detected"] = ai_result.get("phishing_detected", False)
    
    # Combine results
    all_patterns = result["rule_based_patterns"] + result["ai_patterns"]
    result["combined_patterns"] = list(set(all_patterns))  # Remove duplicates
    
    # Determine if phishing detected
    rule_detected = len(result["rule_based_patterns"]) > 0
    ai_detected = result.get("ai_detected", False)
    result["phishing_detected"] = rule_detected or ai_detected
    
    # Calculate confidence score
    result["confidence_score"] = calculate_confidence_score(result)
    
    return result

def analyze_rule_based_patterns(text: str, text_type: str) -> Dict[str, Any]:
    """
    Rule-based phishing pattern detection.
    
    Args:
        text: Text to analyze
        text_type: Type of text ("url" or "email")
        
    Returns:
        Dict with rule-based patterns and suspicious score
    """
    patterns = []
    suspicious_score = 0
    
    if text_type == "email":
        # Email-specific patterns
        urgency_keywords = [
            'urgent', 'immediate', 'act now', 'limited time', 'expiring',
            'suspended', 'blocked', 'deactivated', 'verify', 'confirm'
        ]
        
        threat_keywords = [
            'account will be', 'service suspended', 'legal action',
            'fraud detected', 'security breach', 'compromised'
        ]
        
        request_keywords = [
            'password', 'credit card', 'social security', 'bank account',
            'personal information', 'login details', 'verify identity'
        ]
        
        # Check for urgency
        for keyword in urgency_keywords:
            if keyword.lower() in text.lower():
                patterns.append(f"Urgency language: '{keyword}'")
                suspicious_score += 2
        
        # Check for threats
        for keyword in threat_keywords:
            if keyword.lower() in text.lower():
                patterns.append(f"Threat language: '{keyword}'")
                suspicious_score += 3
        
        # Check for sensitive info requests
        for keyword in request_keywords:
            if keyword.lower() in text.lower():
                patterns.append(f"Request for sensitive info: '{keyword}'")
                suspicious_score += 3
        
        # Check for generic greetings
        generic_greetings = ['dear customer', 'dear user', 'valued customer']
        for greeting in generic_greetings:
            if greeting.lower() in text.lower():
                patterns.append(f"Generic greeting: '{greeting}'")
                suspicious_score += 1
        
        # Check for poor grammar indicators
        grammar_issues = [
            r'\b(click|clicked|clicking)\s+here\b',  # "click here"
            r'\b(congratulation|congratulations)\s+you\s+(have|has)\s+won\b',  # lottery scams
            r'\b(no\s+reply|do\s+not\s+reply)\b',  # no-reply addresses
        ]
        
        for pattern in grammar_issues:
            if re.search(pattern, text, re.IGNORECASE):
                patterns.append(f"Suspicious pattern detected")
                suspicious_score += 2
    
    else:  # URL analysis
        # URL-specific patterns
        suspicious_patterns = [
            r'login', r'signin', r'sign-in', r'account', r'verify', r'secure',
            r'update', r'confirm', r'banking', r'paypal', r'amazon', r'microsoft'
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                patterns.append(f"Suspicious keyword in URL: '{pattern}'")
                suspicious_score += 1
        
        # Check for URL encoding abuse
        if text.count('%') > 3:  # Too much URL encoding
            patterns.append("Excessive URL encoding")
            suspicious_score += 2
        
        # Check for suspicious subdomains
        if 'secure-' in text or 'verification-' in text or 'account-' in text:
            patterns.append("Suspicious subdomain pattern")
            suspicious_score += 2
    
    return {
        "patterns": patterns,
        "suspicious_score": suspicious_score
    }

def calculate_confidence_score(result: Dict[str, Any]) -> int:
    """
    Calculate confidence score for phishing detection.
    
    Args:
        result: Phishing analysis result
        
    Returns:
        int: Confidence score (0-100)
    """
    score = 0
    
    # Base score from rule-based patterns
    rule_patterns = result.get("rule_based_patterns", [])
    score += len(rule_patterns) * 10
    
    # Extra score from AI detection
    if result.get("ai_detected"):
        score += 30
    
    # Bonus for multiple pattern types
    if rule_patterns and result.get("ai_patterns"):
        score += 20
    
    return min(score, 100)

def get_phishing_reason(result: Dict[str, Any]) -> Optional[str]:
    """Generate human-readable reason for phishing detection"""
    if result.get("phishing_detected"):
        patterns = result.get("combined_patterns", [])
        if patterns:
            return f"Phishing patterns detected: {', '.join(patterns[:3])}"
        else:
            return "Phishing indicators detected"
    
    return None
