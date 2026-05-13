from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio
from urllib.parse import urlparse

# Import agents
from agents.url_agent import analyze_url_structure, get_domain_info_string
from agents.whois_agent import analyze_domain_info, extract_domain_from_url
from agents.virustotal_agent import scan_url_virustotal, get_virustotal_reason
from agents.safebrowsing_agent import check_single_url, get_safe_browsing_reason
from agents.phishing_agent import analyze_phishing_patterns, get_phishing_reason
from agents.scoring_agent import calculate_score, get_risk_level, generate_recommendations

# New Real Features
from agents.ssl_agent import analyze_ssl_certificate, get_ssl_reason
from agents.headers_agent import analyze_security_headers, get_headers_reason
from agents.entropy_agent import analyze_domain_entropy, get_entropy_reason
from agents.content_agent import analyze_web_content, get_content_reason
from agents.ip_agent import analyze_ip_security, get_ip_reason
from agents.narrative_agent import generate_threat_narrative

router = APIRouter()

class AnalysisRequest(BaseModel):
    input: str
    mode: str = "url"  # "url" or "email"

class AnalysisResponse(BaseModel):
    threat_score: int
    risk_level: str
    reasons: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    domain_info: str
    api_results: Dict[str, Any]
    errors: List[str]
    ai_narrative: Optional[str] = None

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_threat(request: AnalysisRequest):
    """
    Main analysis endpoint that orchestrates all threat detection agents.
    """
    input_text = request.input.strip()
    mode = request.mode
    
    if not input_text:
        raise HTTPException(status_code=400, detail="Input cannot be empty")
    
    if mode not in ["url", "email"]:
        raise HTTPException(status_code=400, detail="Mode must be 'url' or 'email'")
    
    # Initialize results
    all_flags = {}
    reasons = []
    api_results = {}
    errors = []
    
    # Step 1: URL Structure Analysis
    try:
        if mode == "url":
            url_analysis = analyze_url_structure(input_text)
            all_flags.update(url_analysis)
            
            # Add URL analysis reasons
            for pattern in url_analysis.get("suspicious_patterns", []):
                reasons.append({
                    "text": pattern,
                    "severity": "medium",
                    "source": "URL Analysis"
                })
            
            api_results["url_analysis"] = {
                "status": "success",
                "flags": url_analysis
            }
    except Exception as e:
        errors.append(f"URL analysis failed: {str(e)}")
        api_results["url_analysis"] = {"status": "error", "error": str(e)}
    
    # Step 2: WHOIS Analysis (only for URLs)
    domain = None
    if mode == "url":
        try:
            domain = extract_domain_from_url(input_text)
            if domain:
                whois_result = analyze_domain_info(domain)
                
                if whois_result.get("status") == "success":
                    all_flags["domain_age_days"] = whois_result.get("domain_age_days")
                    
                    # Add WHOIS reasons
                    if whois_result.get("domain_age_days") and whois_result["domain_age_days"] < 30:
                        reasons.append({
                            "text": f"Recently registered domain ({whois_result['domain_age_days']} days old)",
                            "severity": "high",
                            "source": "WHOIS"
                        })
                    
                    api_results["whois"] = {
                        "status": "success",
                        "domain_age_days": whois_result.get("domain_age_days"),
                        "registrar": whois_result.get("registrar"),
                        "country": whois_result.get("country")
                    }
                else:
                    errors.append(f"WHOIS lookup failed: {whois_result.get('error', 'Unknown error')}")
                    api_results["whois"] = {"status": "error", "error": whois_result.get("error")}
        except Exception as e:
            errors.append(f"WHOIS analysis failed: {str(e)}")
            api_results["whois"] = {"status": "error", "error": str(e)}
    
    # Parallel Execution of Independent Agents
    tasks = []
    task_names = []
    if mode == "url":
        tasks.append(analyze_ssl_certificate(input_text))
        task_names.append("ssl")
        tasks.append(analyze_security_headers(input_text))
        task_names.append("headers")
        tasks.append(analyze_web_content(input_text))
        task_names.append("content")
        tasks.append(analyze_ip_security(input_text))
        task_names.append("ip_intel")
        tasks.append(scan_url_virustotal(input_text))
        task_names.append("virustotal")
        tasks.append(check_single_url(input_text))
        task_names.append("safe_browsing")
    
    tasks.append(analyze_phishing_patterns(input_text, mode))
    task_names.append("phishing")

    if mode == "url" and domain:
        tasks.append(asyncio.to_thread(analyze_domain_info, domain))
        task_names.append("whois")
        entropy_result = analyze_domain_entropy(domain)
        api_results["entropy"] = entropy_result
        if ent_r := get_entropy_reason(entropy_result):
            reasons.append({"text": ent_r, "severity": "medium", "source": "Entropy Analysis"})
            if entropy_result.get("is_suspicious"): all_flags["high_entropy"] = True

    # Execute and process results
    parallel_results = await asyncio.gather(*tasks, return_exceptions=True)
    for name, res in zip(task_names, parallel_results):
        if isinstance(res, Exception):
            errors.append(f"{name} failed: {str(res)}")
            continue
        
        if name == "ssl":
            if res.get("status") == "success":
                if reason := get_ssl_reason(res):
                    reasons.append({"text": reason, "severity": "high", "source": "SSL/TLS"})
                    all_flags["ssl_issue"] = True
                api_results["ssl"] = res
        elif name == "headers":
            if res.get("status") == "success":
                if reason := get_headers_reason(res):
                    reasons.append({"text": reason, "severity": "medium", "source": "Security Headers"})
                    if res.get("score", 100) < 60: all_flags["missing_security_headers"] = True
                api_results["headers"] = res
        elif name == "content":
            if res.get("status") == "success":
                if reason := get_content_reason(res):
                    reasons.append({"text": reason, "severity": "high", "source": "Deep Scan"})
                    if res.get("has_login_form"): all_flags["has_login_form"] = True
                api_results["content"] = res
        elif name == "ip_intel":
            if res.get("status") == "success":
                if reason := get_ip_reason(res):
                    reasons.append({"text": reason, "severity": "medium", "source": "IP Intelligence"})
                    if res.get("is_proxy"): all_flags["is_proxy"] = True
                api_results["ip_intel"] = res
        elif name == "virustotal":
            if res.get("status") == "success":
                all_flags["virustotal_flagged"] = res.get("virustotal_flagged", False)
                all_flags["virustotal_malicious_count"] = res.get("malicious_count", 0)
                if reason := get_virustotal_reason(res):
                    reasons.append({"text": reason, "severity": "high" if res.get("malicious_count", 0) > 0 else "medium", "source": "VirusTotal"})
                api_results["virustotal"] = res
        elif name == "safe_browsing":
            if res.get("status") == "success":
                all_flags["safe_browsing_flagged"] = res.get("safe_browsing_flagged", False)
                if reason := get_safe_browsing_reason(res):
                    reasons.append({"text": reason, "severity": "high" if res.get("safe_browsing_flagged") else "medium", "source": "Google Safe Browsing"})
                api_results["safe_browsing"] = res
        elif name == "phishing":
            if res.get("phishing_detected"):
                all_flags["phishing_language"] = True
                if reason := get_phishing_reason(res):
                    reasons.append({"text": reason, "severity": "high", "source": "Phishing Detection"})
            api_results["phishing"] = res
        elif name == "whois":
            if res.get("status") == "success":
                all_flags["domain_age_days"] = res.get("domain_age_days")
                if res.get("domain_age_days") and res["domain_age_days"] < 30:
                    reasons.append({"text": f"Recently registered domain ({res['domain_age_days']} days old)", "severity": "high", "source": "WHOIS"})
                api_results["whois"] = res
    
    # Step 9: Calculate Final Score
    try:
        threat_score = calculate_score(all_flags)
        risk_level = get_risk_level(threat_score)
        recommendations = generate_recommendations(threat_score, all_flags)
        
        # Generate domain info
        if mode == "url" and domain:
            domain_info = get_domain_info_string(input_text, api_results.get("whois", {}))
        else:
            domain_info = f"Analyzed {mode}: {input_text[:50]}{'...' if len(input_text) > 50 else ''}"
        
        # Step 10: Generate AI Narrative
        ai_narrative = await generate_threat_narrative({
            "domain": domain or input_text,
            "threat_score": threat_score,
            "virustotal": api_results.get("virustotal", {}),
            "safe_browsing": api_results.get("safe_browsing", {}),
            "ssl": api_results.get("ssl", {}),
            "content": api_results.get("content", {}),
            "entropy": api_results.get("entropy", {})
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Score calculation failed: {str(e)}")
    
    # Return response
    return AnalysisResponse(
        threat_score=threat_score,
        risk_level=risk_level,
        reasons=reasons,
        recommendations=recommendations,
        domain_info=domain_info,
        api_results=api_results,
        errors=errors,
        ai_narrative=ai_narrative
    )

@router.get("/health")
async def health_check():
    """Check health of all external services"""
    from services.ai_service import check_ai_health
    
    health_status = {
        "status": "healthy",
        "services": {}
    }
    
    # Check Gemini AI
    try:
        ai_health = await check_ai_health()
        health_status["services"]["ai_engine"] = ai_health
    except:
        health_status["services"]["ai_engine"] = {"status": "error", "engine": "gemini"}
    
    # Check API keys
    import os
    vt_key = os.getenv("VIRUSTOTAL_API_KEY", "")
    sb_key = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY", "")
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    
    health_status["services"]["virustotal"] = {
        "status": "configured" if vt_key and vt_key != "your_virustotal_api_key_here" else "not_configured"
    }
    
    health_status["services"]["safe_browsing"] = {
        "status": "configured" if sb_key and sb_key != "your_google_safe_browsing_api_key_here" else "not_configured"
    }

    health_status["services"]["gemini"] = {
        "status": "configured" if gemini_key and gemini_key != "your_gemini_api_key_here" else "not_configured"
    }
    
    return health_status

