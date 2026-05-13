import hashlib
import httpx
import os
from typing import Dict, Any, Optional

def get_url_id(url: str) -> str:
    """
    Convert URL to VirusTotal URL ID format.
    VirusTotal uses SHA-256 hash of the URL.
    """
    return hashlib.sha256(url.encode()).hexdigest()

async def scan_url_virustotal(url: str) -> Dict[str, Any]:
    """
    Scan URL using VirusTotal API.
    
    Args:
        url: URL to scan
        
    Returns:
        Dict with VirusTotal analysis results
    """
    api_key = os.getenv("VIRUSTOTAL_API_KEY")
    if not api_key or api_key == "your_virustotal_api_key_here":
        return {
            "status": "error",
            "error": "VirusTotal API key not configured",
            "malicious_count": 0,
            "harmless_count": 0,
            "suspicious_count": 0
        }
    
    url_id = get_url_id(url)
    
    async with httpx.AsyncClient() as client:
        try:
            # First, try to get existing analysis
            headers = {"x-apikey": api_key}
            response = await client.get(
                f"https://www.virustotal.com/api/v3/urls/{url_id}",
                headers=headers,
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                attributes = data.get("data", {}).get("attributes", {})
                last_analysis_stats = attributes.get("last_analysis_stats", {})
                
                malicious = last_analysis_stats.get("malicious", 0)
                suspicious = last_analysis_stats.get("suspicious", 0)
                harmless = last_analysis_stats.get("harmless", 0)
                undetected = last_analysis_stats.get("undetected", 0)
                
                return {
                    "status": "success",
                    "malicious_count": malicious,
                    "suspicious_count": suspicious,
                    "harmless_count": harmless,
                    "undetected_count": undetected,
                    "total_engines": malicious + suspicious + harmless + undetected,
                    "scan_date": attributes.get("last_analysis_date"),
                    "permalink": data.get("data", {}).get("links", {}).get("self"),
                    "virustotal_flagged": malicious > 0
                }
            
            elif response.status_code == 404:
                # URL not found in VirusTotal, submit for analysis
                return await submit_url_for_analysis(url, client, headers)
            
            else:
                return {
                    "status": "error",
                    "error": f"VirusTotal API error: {response.status_code}",
                    "malicious_count": 0,
                    "harmless_count": 0,
                    "suspicious_count": 0
                }
                
        except httpx.TimeoutException:
            return {
                "status": "error",
                "error": "VirusTotal API timeout",
                "malicious_count": 0,
                "harmless_count": 0,
                "suspicious_count": 0
            }
        except Exception as e:
            return {
                "status": "error",
                "error": f"VirusTotal API error: {str(e)}",
                "malicious_count": 0,
                "harmless_count": 0,
                "suspicious_count": 0
            }

async def submit_url_for_analysis(url: str, client: httpx.AsyncClient, headers: Dict[str, str]) -> Dict[str, Any]:
    """
    Submit URL for analysis to VirusTotal.
    """
    try:
        # Submit URL for analysis
        response = await client.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": url},
            timeout=10.0
        )
        
        if response.status_code == 200:
            # Analysis submitted successfully, but we need to wait for results
            return {
                "status": "submitted",
                "error": "URL submitted for analysis - results not yet available",
                "malicious_count": 0,
                "harmless_count": 0,
                "suspicious_count": 0
            }
        else:
            return {
                "status": "error",
                "error": f"Failed to submit URL: {response.status_code}",
                "malicious_count": 0,
                "harmless_count": 0,
                "suspicious_count": 0
            }
            
    except Exception as e:
        return {
            "status": "error",
            "error": f"Failed to submit URL: {str(e)}",
            "malicious_count": 0,
            "harmless_count": 0,
            "suspicious_count": 0
        }

def get_virustotal_reason(result: Dict[str, Any]) -> Optional[str]:
    """Generate human-readable reason for VirusTotal result"""
    if result.get("status") == "success" and result.get("malicious_count", 0) > 0:
        count = result["malicious_count"]
        total = result.get("total_engines", count)
        return f"Flagged by VirusTotal ({count}/{total} engines detected threats)"
    elif result.get("status") == "submitted":
        return "URL submitted to VirusTotal - analysis pending"
    elif result.get("status") == "error":
        return f"VirusTotal analysis failed: {result.get('error', 'Unknown error')}"
    
    return None
