import whois
import re
from datetime import datetime
from typing import Dict, Any, Optional

def get_domain_age_days(domain: str) -> Optional[int]:
    """
    Get domain age in days using WHOIS lookup.
    
    Args:
        domain: Domain name to analyze
        
    Returns:
        int: Age in days, or None if unable to determine
    """
    try:
        w = whois.whois(domain)
        
        # Handle multiple creation dates (some domains have them)
        creation_date = w.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        
        if creation_date:
            if isinstance(creation_date, str):
                # Parse string date
                creation_date = datetime.strptime(creation_date.split(' ')[0], '%Y-%m-%d')
            
            # Make creation_date naive if it's aware, or vice versa
            if creation_date.tzinfo is not None:
                creation_date = creation_date.replace(tzinfo=None)
            
            age_days = (datetime.now() - creation_date).days
            return age_days
        
    except Exception as e:
        print(f"WHOIS lookup failed for {domain}: {e}")
        return None
    
    return None

def analyze_domain_info(domain: str) -> Dict[str, Any]:
    """
    Perform comprehensive WHOIS analysis.
    
    Args:
        domain: Domain name to analyze
        
    Returns:
        Dict with WHOIS information and flags
    """
    result = {
        "domain_age_days": None,
        "registrar": None,
        "country": None,
        "creation_date": None,
        "expiration_date": None,
        "status": "failed",
        "error": None
    }
    
    try:
        w = whois.whois(domain)
        
        # Extract creation date
        creation_date = w.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        
        if creation_date:
            if isinstance(creation_date, str):
                creation_date = datetime.strptime(creation_date.split(' ')[0], '%Y-%m-%d')
            
            # Make creation_date naive if it's aware
            if creation_date.tzinfo is not None:
                creation_date = creation_date.replace(tzinfo=None)
                
            result["creation_date"] = str(creation_date.strftime('%Y-%m-%d'))
            result["domain_age_days"] = (datetime.now() - creation_date).days
        
        # Extract registrar
        if w.registrar:
            result["registrar"] = w.registrar
        
        # Extract country
        if w.country:
            result["country"] = w.country
        
        # Extract expiration date
        expiration_date = w.expiration_date
        if isinstance(expiration_date, list):
            expiration_date = expiration_date[0]
        if expiration_date:
            if isinstance(expiration_date, str):
                expiration_date = datetime.strptime(expiration_date.split(' ')[0], '%Y-%m-%d')
            result["expiration_date"] = expiration_date.strftime('%Y-%m-%d')
        
        result["status"] = "success"
        
    except Exception as e:
        result["error"] = str(e)
        result["status"] = "failed"
    
    return result

def extract_domain_from_url(url: str) -> Optional[str]:
    """Extract domain name from URL"""
    try:
        # Remove protocol
        url = re.sub(r'^https?://', '', url)
        # Remove path and query
        domain = url.split('/')[0]
        # Remove port if present
        domain = domain.split(':')[0]
        return domain
    except:
        return None

def is_recently_registered(domain_age_days: Optional[int], threshold_days: int = 30) -> bool:
    """Check if domain is recently registered"""
    return domain_age_days is not None and domain_age_days < threshold_days
