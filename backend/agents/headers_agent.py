import httpx
from typing import Dict, Any, Optional, List
from urllib.parse import urlparse

async def analyze_security_headers(url: str) -> Dict[str, Any]:
    """
    Real-time check for HTTP security headers.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=5.0, follow_redirects=True)
            headers = response.headers
            
            missing = []
            present = []
            
            checks = {
                "Strict-Transport-Security": "HSTS",
                "Content-Security-Policy": "CSP",
                "X-Frame-Options": "Clickjacking Protection",
                "X-Content-Type-Options": "MIME Sniffing Prevention"
            }
            
            for header, desc in checks.items():
                if header in headers:
                    present.append(desc)
                else:
                    missing.append(desc)
            
            return {
                "status": "success",
                "missing_headers": missing,
                "present_headers": present,
                "score": len(present) / len(checks) * 100
            }
    except Exception as e:
        return {"status": "error", "error": str(e)}

def get_headers_reason(result: Dict[str, Any]) -> Optional[str]:
    if result.get("status") == "success":
        score = result.get("score", 100)
        if score < 50:
            missing = ", ".join(result.get("missing_headers", []))
            return f"Weak security headers (missing: {missing})"
    return None
