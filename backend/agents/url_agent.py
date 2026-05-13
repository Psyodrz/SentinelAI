import re
from urllib.parse import urlparse
from typing import Dict, Any, List
from agents.whois_agent import extract_domain_from_url

def analyze_url_structure(url: str) -> Dict[str, Any]:
    """
    Analyze URL structure for suspicious patterns.
    
    Args:
        url: URL to analyze
        
    Returns:
        Dict with URL analysis flags
    """
    flags = {
        "url_length_over_70": False,
        "has_ip_address": False,
        "has_suspicious_chars": False,
        "has_shortener": False,
        "suspicious_tld": False,
        "brand_impersonation": False,
        "has_https": False,
        "domain": None,
        "suspicious_patterns": []
    }
    
    try:
        parsed = urlparse(url)
        domain = parsed.netloc
        flags["domain"] = domain
        
        # Check URL length
        if len(url) > 70:
            flags["url_length_over_70"] = True
            flags["suspicious_patterns"].append("URL length exceeds 70 characters")
        
        # Check for IP address instead of domain
        ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        if re.search(ip_pattern, domain):
            flags["has_ip_address"] = True
            flags["suspicious_patterns"].append("IP address used instead of domain name")
        
        # Check for suspicious characters
        suspicious_chars = ['@', '%', '$', '&', '|', ';', '<', '>', '"', "'", '`']
        if any(char in url for char in suspicious_chars):
            flags["has_suspicious_chars"] = True
            found_chars = [char for char in suspicious_chars if char in url]
            flags["suspicious_patterns"].append(f"Contains suspicious characters: {', '.join(found_chars)}")
        
        # Check for URL shorteners
        shorteners = [
            'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
            'buff.ly', 'adf.ly', 'bit.do', 'mcaf.ee', 'tiny.cc', 'short.link'
        ]
        if any(shortener in domain for shortener in shorteners):
            flags["has_shortener"] = True
            flags["suspicious_patterns"].append("URL shortener detected")
        
        # Check for suspicious TLDs
        suspicious_tlds = ['.xyz', '.top', '.ru', '.tk', '.ml', '.ga', '.cf', '.click', '.download']
        if any(domain.endswith(tld) for tld in suspicious_tlds):
            flags["suspicious_tld"] = True
            found_tld = next(tld for tld in suspicious_tlds if domain.endswith(tld))
            flags["suspicious_patterns"].append(f"Suspicious TLD: {found_tld}")
        
        # Check for HTTPS
        flags["has_https"] = parsed.scheme == 'https'
        if not flags["has_https"]:
            flags["suspicious_patterns"].append("No HTTPS encryption")
        
        # Check for brand impersonation
        brands = [
            'paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook',
            'instagram', 'twitter', 'linkedin', 'netflix', 'spotify', 'youtube',
            'dropbox', 'github', 'adobe', 'oracle', 'cisco', 'ibm'
        ]
        
        for brand in brands:
            # Look for brand name with suspicious modifications
            patterns = [
                rf'{brand}[-_]\w+',  # brand-something
                rf'\w+{brand}',      # somethingbrand
                rf'{brand}\d+',      # brand123
                rf'\d+{brand}',      # 123brand
            ]
            
            for pattern in patterns:
                if re.search(pattern, domain, re.IGNORECASE):
                    flags["brand_impersonation"] = True
                    flags["suspicious_patterns"].append(f"Potential brand impersonation: {brand}")
                    break
        
    except Exception as e:
        flags["error"] = str(e)
    
    return flags

def get_domain_info_string(url: str, whois_data: Dict[str, Any]) -> str:
    """Generate domain info string for display"""
    domain = extract_domain_from_url(url)
    if not domain:
        return "Invalid URL format"
    
    info_parts = [f"Domain: {domain}"]
    
    if whois_data.get("domain_age_days"):
        info_parts.append(f"Age: {whois_data['domain_age_days']} days")
    
    if whois_data.get("registrar"):
        info_parts.append(f"Registrar: {whois_data['registrar']}")
    
    if whois_data.get("country"):
        info_parts.append(f"Country: {whois_data['country']}")
    
    return " | ".join(info_parts)
