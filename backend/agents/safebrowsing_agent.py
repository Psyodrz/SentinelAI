import httpx
import os
from typing import Dict, Any, List, Optional

async def check_safe_browsing(urls: List[str]) -> Dict[str, Any]:
    """
    Check URLs against Google Safe Browsing API.
    
    Args:
        urls: List of URLs to check
        
    Returns:
        Dict with Safe Browsing results
    """
    api_key = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")
    if not api_key or api_key == "your_google_safe_browsing_api_key_here":
        return {
            "status": "error",
            "error": "Google Safe Browsing API key not configured",
            "matches": [],
            "safe_browsing_flagged": False
        }
    
    # Google Safe Browsing API endpoint
    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}"
    
    # Prepare request body
    request_body = {
        "client": {
            "clientId": "sentinelai",
            "clientVersion": "1.0.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url} for url in urls]
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                endpoint,
                json=request_body,
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                matches = data.get("matches", [])
                
                if matches:
                    # Parse threat information
                    threat_info = []
                    for match in matches:
                        threat_info.append({
                            "threat": match.get("threatType", "Unknown"),
                            "platform": match.get("platformType", "Unknown"),
                            "url": match.get("threat", {}).get("url", "")
                        })
                    
                    return {
                        "status": "success",
                        "matches": threat_info,
                        "safe_browsing_flagged": True,
                        "threat_count": len(threat_info)
                    }
                else:
                    return {
                        "status": "success",
                        "matches": [],
                        "safe_browsing_flagged": False,
                        "threat_count": 0
                    }
            
            else:
                return {
                    "status": "error",
                    "error": f"Google Safe Browsing API error: {response.status_code}",
                    "matches": [],
                    "safe_browsing_flagged": False
                }
                
        except httpx.TimeoutException:
            return {
                "status": "error",
                "error": "Google Safe Browsing API timeout",
                "matches": [],
                "safe_browsing_flagged": False
            }
        except Exception as e:
            return {
                "status": "error",
                "error": f"Google Safe Browsing API error: {str(e)}",
                "matches": [],
                "safe_browsing_flagged": False
            }

async def check_single_url(url: str) -> Dict[str, Any]:
    """
    Check a single URL against Google Safe Browsing.
    
    Args:
        url: URL to check
        
    Returns:
        Dict with Safe Browsing results
    """
    result = await check_safe_browsing([url])
    result["checked_url"] = url
    return result

def get_safe_browsing_reason(result: Dict[str, Any]) -> Optional[str]:
    """Generate human-readable reason for Safe Browsing result"""
    if result.get("status") == "success" and result.get("safe_browsing_flagged"):
        threat_count = result.get("threat_count", 1)
        threats = [match.get("threat", "Unknown") for match in result.get("matches", [])]
        threat_types = ", ".join(list(set(threats))[:3])  # Limit to 3 unique threats
        return f"Flagged by Google Safe Browsing ({threat_count} threats: {threat_types})"
    elif result.get("status") == "error":
        return f"Safe Browsing check failed: {result.get('error', 'Unknown error')}"
    
    return None
