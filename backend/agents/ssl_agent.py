import socket
import ssl
from datetime import datetime
from typing import Dict, Any, Optional
from urllib.parse import urlparse

async def analyze_ssl_certificate(url: str) -> Dict[str, Any]:
    """
    Real-time SSL certificate validation.
    """
    try:
        parsed = urlparse(url)
        hostname = parsed.netloc or parsed.path.split('/')[0]
        if not hostname:
            return {"status": "error", "error": "Invalid hostname"}

        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                
                if not cert:
                    return {"status": "error", "error": "No certificate found"}
                
                # Extract expiry
                not_after_str = cert.get('notAfter')
                if not not_after_str:
                    return {"status": "error", "error": "Expiry date not found in certificate"}
                
                expires = datetime.strptime(not_after_str, '%b %d %H:%M:%S %Y %Z')
                days_to_expire = (expires - datetime.now()).days
                
                # Extract issuer
                issuer_tuples = cert.get('issuer', ())
                issuer = {}
                for t in issuer_tuples:
                    for k, v in t:
                        issuer[k] = v
                
                common_name = issuer.get('commonName', 'Unknown')
                
                return {
                    "status": "success",
                    "issuer": common_name,
                    "expires": not_after_str,
                    "days_to_expire": days_to_expire,
                    "is_expired": days_to_expire < 0,
                    "is_self_signed": common_name == hostname
                }
    except Exception as e:
        return {"status": "error", "error": str(e)}

def get_ssl_reason(result: Dict[str, Any]) -> Optional[str]:
    if result.get("status") == "success":
        if result.get("is_expired"):
            return "SSL Certificate has expired"
        if result.get("days_to_expire", 100) < 15:
            return f"SSL Certificate expires soon ({result['days_to_expire']} days)"
    elif result.get("status") == "error":
        return f"SSL/TLS Check: {result.get('error')}"
    return None
