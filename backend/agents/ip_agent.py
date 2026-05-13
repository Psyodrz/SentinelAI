import socket
import httpx
from typing import Dict, Any

async def analyze_ip_security(url: str) -> Dict[str, Any]:
    """
    Resolve domain to IP and get Geo-intelligence.
    """
    from urllib.parse import urlparse
    
    result = {
        "status": "pending",
        "ip": "",
        "country": "",
        "city": "",
        "isp": "",
        "org": "",
        "as_info": "",
        "is_proxy": False
    }

    try:
        # Extract hostname
        hostname = urlparse(url).netloc
        if not hostname:
            hostname = url.split('/')[0]
        
        # Resolve IP
        try:
            ip = socket.gethostbyname(hostname)
            result["ip"] = ip
        except Exception as e:
            return {"status": "error", "error": f"Resolution failed: {str(e)}"}

        # Geo Intel (using ip-api.com - free for dev)
        async with httpx.AsyncClient(timeout=5.0) as client:
            geo_response = await client.get(f"http://ip-api.com/json/{ip}?fields=status,message,country,city,isp,org,as,proxy")
            
            if geo_response.status_code == 200:
                geo_data = geo_response.json()
                if geo_data.get("status") == "success":
                    result["country"] = geo_data.get("country", "")
                    result["city"] = geo_data.get("city", "")
                    result["isp"] = geo_data.get("isp", "")
                    result["org"] = geo_data.get("org", "")
                    result["as_info"] = geo_data.get("as", "")
                    result["is_proxy"] = geo_data.get("proxy", False)
                    result["status"] = "success"
                else:
                    return {"status": "error", "error": f"Geo lookup failed: {geo_data.get('message')}"}
            else:
                return {"status": "error", "error": f"Geo service error: {geo_response.status_code}"}

        return result

    except Exception as e:
        return {"status": "error", "error": str(e)}

def get_ip_reason(res: Dict[str, Any]) -> str:
    """Generate human-readable IP security reason"""
    if res.get("status") != "success":
        return ""
    
    reasons = []
    if res.get("is_proxy"):
        reasons.append("Server behind a known proxy/VPN (common in cloaking)")
    if res.get("country"):
        reasons.append(f"Hosted in {res['country']} ({res.get('city', '')})")
    if "Cloudflare" in res.get("isp", "") or "Amazon" in res.get("isp", ""):
        reasons.append(f"Verified infrastructure: {res['isp']}")
        
    return " | ".join(reasons)
