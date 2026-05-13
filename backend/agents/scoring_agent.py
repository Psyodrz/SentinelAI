from typing import Dict, Any

def calculate_score(flags: Dict[str, Any]) -> int:
    """
    Deterministic risk scoring algorithm.
    Score must be same every time for same input. No randomness.
    
    Args:
        flags: Dictionary containing all detection flags
        
    Returns:
        int: Risk score (0-100)
    """
    score = 0
    
    # Domain age flags
    if flags.get("domain_age_days") and flags["domain_age_days"] < 30:
        score += 20
    elif flags.get("domain_age_days") and flags["domain_age_days"] < 90:
        score += 10
    
    # Suspicious TLD flags
    if flags.get("suspicious_tld"):  # .xyz .top .ru .tk .ml .ga
        score += 10
    
    # Brand impersonation flags
    if flags.get("brand_impersonation"):  # regex match known brands
        score += 25
    
    # URL length flags
    if flags.get("url_length_over_70"):
        score += 10
    
    # VirusTotal flags
    if flags.get("virustotal_flagged"):
        malicious_count = flags.get("virustotal_malicious_count", 1)
        score += min(40, malicious_count * 10)  # Cap at 40 points
    
    # Google Safe Browsing flags
    if flags.get("safe_browsing_flagged"):
        score += 40
    
    # Phishing language flags
    if flags.get("phishing_language"):
        score += 15
    
    # SSL/HTTPS flags
    if flags.get("no_ssl"):
        score += 15
    
    # Additional suspicious patterns
    if flags.get("has_ip_address"):
        score += 20
    if flags.get("has_suspicious_chars"):
        score += 10
    if flags.get("has_shortener"):
        score += 15
    
    # New analysis signals
    if flags.get("ssl_issue"):
        score += 20
    if flags.get("high_entropy"):
        score += 15
    if flags.get("missing_security_headers"):
        score += 10
    if flags.get("has_login_form"):
        score += 30
    if flags.get("is_proxy"):
        score += 15
    
    return min(score, 100)

def get_risk_level(score: int) -> str:
    """Convert numeric score to risk level"""
    if score >= 70:
        return "HIGH RISK"
    elif score >= 40:
        return "SUSPICIOUS"
    else:
        return "SAFE"

def generate_recommendations(score: int, flags: Dict[str, Any]) -> list:
    """Generate recommendations based on score and flags"""
    recommendations = []
    
    if score >= 70:
        recommendations.extend([
            {"text": "Do not click this link", "type": "avoid"},
            {"text": "Report to your IT security team immediately", "type": "do"},
            {"text": "Block this domain if possible", "type": "do"}
        ])
    elif score >= 40:
        recommendations.extend([
            {"text": "Exercise extreme caution", "type": "avoid"},
            {"text": "Verify the source independently", "type": "do"},
            {"text": "Scan with additional security tools", "type": "do"}
        ])
    else:
        recommendations.extend([
            {"text": "This appears to be safe, but always verify", "type": "do"},
            {"text": "Continue to monitor for any suspicious activity", "type": "do"}
        ])
    
    # Specific recommendations based on flags
    if flags.get("virustotal_flagged"):
        recommendations.append({"text": "Multiple security engines flagged this as malicious", "type": "avoid"})
    
    if flags.get("domain_age_days") and flags["domain_age_days"] < 30:
        recommendations.append({"text": "Recently registered domain - higher risk", "type": "avoid"})
    
    if flags.get("brand_impersonation"):
        recommendations.append({"text": "Potential brand impersonation detected", "type": "avoid"})
    
    if flags.get("ssl_issue"):
        recommendations.append({"text": "SSL/TLS certificate issue - connection may be intercepted", "type": "avoid"})
    
    if flags.get("high_entropy"):
        recommendations.append({"text": "Domain patterns suggest automated malware generation (DGA)", "type": "avoid"})

    if flags.get("missing_security_headers"):
        recommendations.append({"text": "Enable missing security headers (HSTS, CSP) to harden site", "type": "do"})
    
    if flags.get("has_login_form"):
        recommendations.append({"text": "Deep scan detected login forms - verify URL authenticity before entering credentials", "type": "avoid"})

    if flags.get("is_proxy"):
        recommendations.append({"text": "Server is using a proxy - could be for legitimate CDN or malicious cloaking", "type": "avoid"})
    
    return recommendations[:8]  # Limit to 8 recommendations
