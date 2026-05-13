import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any, List
import re

async def analyze_web_content(url: str) -> Dict[str, Any]:
    """
    Scrape website content and analyze for phishing indicators.
    """
    result = {
        "status": "pending",
        "title": "",
        "forms": [],
        "suspicious_elements": [],
        "brand_keywords_found": [],
        "external_scripts_count": 0,
        "has_login_form": False
    }

    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            }
            response = await client.get(url, headers=headers)
            
            if response.status_code != 200:
                return {"status": "error", "error": f"Failed to fetch content: {response.status_code}"}

            html = response.text
            soup = BeautifulSoup(html, 'html.parser')

            # Get Page Title
            result["title"] = soup.title.string.strip() if soup.title else "No title found"

            # Analyze Forms
            forms = soup.find_all('form')
            for form in forms:
                form_info = {
                    "action": form.get('action', ''),
                    "method": form.get('method', 'get').lower(),
                    "inputs": []
                }
                
                inputs = form.find_all(['input', 'textarea'])
                for inp in inputs:
                    inp_type = inp.get('type', 'text').lower()
                    inp_name = inp.get('name', '').lower()
                    form_info["inputs"].append({"type": inp_type, "name": inp_name})
                    
                    if inp_type in ['password', 'tel', 'email'] or 'pass' in inp_name:
                        result["has_login_form"] = True
                
                result["forms"].append(form_info)

            # Look for Brand Keywords
            brands = ["paypal", "amazon", "microsoft", "google", "apple", "netflix", "adobe", "facebook", "instagram"]
            page_text = soup.get_text().lower()
            for brand in brands:
                if brand in page_text:
                    result["brand_keywords_found"].append(brand)

            # Count External Scripts
            scripts = soup.find_all('script', src=True)
            result["external_scripts_count"] = len(scripts)

            # Detect Suspicious Elements
            # 1. Hidden form fields that seem sensitive
            hidden_sensitive = soup.find_all('input', type='hidden', name=re.compile(r'pass|key|token|auth', re.I))
            if hidden_sensitive:
                result["suspicious_elements"].append("Hidden sensitive fields detected")

            # 2. Iframing of other sites (rare but suspicious in phishing)
            iframes = soup.find_all('iframe')
            if iframes:
                result["suspicious_elements"].append(f"Contains {len(iframes)} iframes")

            result["status"] = "success"
            return result

    except Exception as e:
        return {"status": "error", "error": str(e)}

def get_content_reason(res: Dict[str, Any]) -> str:
    """Generate reason based on content analysis"""
    if res.get("status") != "success":
        return ""
    
    reasons = []
    if res.get("has_login_form"):
        reasons.append("Contains input forms (potential credential harvesting)")
    if res.get("brand_keywords_found"):
        reasons.append(f"Mentions major brands: {', '.join(res['brand_keywords_found'][:2])}")
    if res.get("external_scripts_count", 0) > 15:
        reasons.append("High number of external scripts detected")
        
    return " | ".join(reasons) if reasons else ""
