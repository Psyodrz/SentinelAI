import math
from collections import Counter
from typing import Dict, Any, Optional

def calculate_entropy(text: str) -> float:
    """
    Calculate Shannon entropy of a string.
    Higher entropy suggests more randomness (DGA pattern).
    """
    if not text:
        return 0.0
    
    counts = Counter(text)
    probs = [count/len(text) for count in counts.values()]
    entropy = -sum(p * math.log2(p) for p in probs)
    return entropy

def analyze_domain_entropy(domain: str) -> Dict[str, Any]:
    """
    Analyze domain for randomness suggesting DGA.
    """
    # Remove TLD if possible for more accurate domain entropy
    parts = domain.split('.')
    main_part = parts[-2] if len(parts) >= 2 else parts[0]
    
    entropy = calculate_entropy(main_part)
    
    # Heuristic for DGA: typically entropy > 3.8 for main domain part
    is_suspicious = entropy > 3.8
    
    return {
        "status": "success",
        "entropy": round(entropy, 2),
        "is_suspicious": is_suspicious,
        "details": "Calculated Shannon entropy for domain randomness detection."
    }

def get_entropy_reason(result: Dict[str, Any]) -> Optional[str]:
    if result.get("status") == "success" and result.get("is_suspicious"):
        return f"High domain entropy ({result['entropy']}) - patterns suggest malware DGA"
    return None
