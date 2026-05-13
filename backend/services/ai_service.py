"""
SentinelAI AI Service — Powered by Google Gemini (google-genai SDK)
Cloud-native AI engine for phishing detection and threat narrative generation.
No local dependencies required. Works 24/7 online.
"""

import os
import json
import asyncio
from typing import Dict, Any, Optional
from google import genai
from google.genai.types import GenerateContentConfig

# Lazy-loaded config and client
_client = None

def _get_api_key():
    return os.getenv("GEMINI_API_KEY", "")

def _get_model():
    return os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

def _get_client():
    """Lazy-initialize the Gemini client."""
    global _client
    key = _get_api_key()
    if _client is None and key and key != "your_gemini_api_key_here":
        _client = genai.Client(api_key=key)
    return _client


# ─── Phishing Language Analysis ───────────────────────────────────────────────

async def analyze_phishing_language(text: str, text_type: str = "email") -> Dict[str, Any]:
    """
    Analyze text for phishing language patterns using Gemini AI.
    Falls back to rule-based analysis if Gemini is unavailable.
    """
    prompt = _build_phishing_prompt(text, text_type)
    client = _get_client()

    if client:
        try:
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=_get_model(),
                contents=prompt,
                config=GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=300,
                )
            )
            parsed = _parse_ai_json(response.text)
            if parsed.get("status") == "success":
                parsed["engine"] = "gemini"
                return parsed
        except Exception as e:
            print(f"[SentinelAI] Gemini phishing analysis failed: {e}")

    # Fallback: Rule-based analysis (always works)
    result = _rule_based_phishing_analysis(text)
    result["engine"] = "rule-based"
    return result


# ─── Threat Narrative Generation ──────────────────────────────────────────────

async def generate_threat_narrative(results: Dict[str, Any]) -> str:
    """
    Generate a professional security brief using Gemini AI.
    Falls back to intelligent templates if Gemini is unavailable.
    """
    # Build findings summary
    threats = []
    vt = results.get("virustotal", {})
    if isinstance(vt, dict) and vt.get("malicious_count", 0) > 0:
        threats.append(f"Flagged by {vt['malicious_count']} antivirus engines on VirusTotal")
    sb = results.get("safe_browsing", {})
    if isinstance(sb, dict) and sb.get("safe_browsing_flagged"):
        threats.append("Flagged by Google Safe Browsing as a dangerous site")
    ssl = results.get("ssl", {})
    if isinstance(ssl, dict) and (ssl.get("status") == "error" or ssl.get("is_expired")):
        threats.append("Critical SSL/TLS certificate issues detected")
    content = results.get("content", {})
    if isinstance(content, dict) and content.get("has_login_form"):
        threats.append("Potential credential harvesting login forms detected on the page")
    entropy = results.get("entropy", {})
    if isinstance(entropy, dict) and entropy.get("is_suspicious"):
        threats.append("Domain name entropy suggests algorithmically generated domain (DGA)")

    findings_str = "\n".join([f"- {t}" for t in threats]) if threats else "No critical technical threats detected by automated scans."
    domain = results.get("domain", "this target")
    score = results.get("threat_score", 0)

    prompt = f"""You are SentinelAI, an elite cyber threat intelligence system.
Analyze these technical findings for the domain: {domain}
Threat Score: {score}/100

Key Investigative Findings:
{findings_str}

Write a professional 2-3 sentence Security Brief summarizing the threat level for a non-technical user.
Be direct, authoritative, and explain the main risk clearly. Do NOT use markdown formatting.
Do NOT mention JSON, flags, implementation details, or that you are an AI."""

    client = _get_client()
    if client:
        try:
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=_get_model(),
                contents=prompt,
                config=GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=200,
                )
            )
            brief = response.text.strip()
            if brief and len(brief) > 20:
                return brief
        except Exception as e:
            print(f"[SentinelAI] Gemini narrative generation failed: {e}")

    # Fallback: Intelligent template-based narratives
    return _generate_template_narrative(domain, score, threats)


# ─── Health Check ─────────────────────────────────────────────────────────────

async def check_ai_health() -> Dict[str, Any]:
    """Check if the Gemini AI service is configured (without consuming a request)."""
    key = _get_api_key()
    model = _get_model()
    if not key or key == "your_gemini_api_key_here":
        return {"status": "not_configured", "engine": "gemini", "model": model}

    client = _get_client()
    if not client:
        return {"status": "error", "engine": "gemini", "error": "Client init failed"}

    # Just verify configuration — don't waste API quota on health pings
    return {"status": "configured", "engine": "gemini", "model": model}


# ─── Internal Helpers ─────────────────────────────────────────────────────────

def _build_phishing_prompt(text: str, text_type: str) -> str:
    """Build a structured prompt for phishing analysis."""
    if text_type == "email":
        return f"""You are a cybersecurity expert specializing in phishing detection.
Analyze this email text for phishing language patterns.

Return ONLY a valid JSON object with this exact format (no markdown, no explanation):
{{"phishing_detected": true/false, "patterns_found": ["pattern1", "pattern2"]}}

Look for:
- Urgency language (act now, immediate, urgent, limited time)
- Threats (account suspended, legal action, security breach)
- Requests for sensitive information (passwords, credit cards, SSN)
- Generic greetings (Dear Customer, Dear User)
- Suspicious links or call-to-action buttons
- Grammar and spelling errors indicating non-native composition

Email text:
{text}"""
    else:
        return f"""You are a cybersecurity expert specializing in phishing URL detection.
Analyze this URL for phishing indicators.

Return ONLY a valid JSON object with this exact format (no markdown, no explanation):
{{"phishing_detected": true/false, "patterns_found": ["pattern1", "pattern2"]}}

Look for:
- Brand impersonation (e.g. paypa1.com, amaz0n-secure.tk)
- Suspicious TLDs (.tk, .ml, .ga, .top, .click)
- Misleading subdomains (secure-login.suspicious-domain.com)
- Homoglyph attacks (using similar-looking characters)
- Excessive URL length or obfuscation
- IP addresses instead of domain names

URL: {text}"""


def _parse_ai_json(response_text: str) -> Dict[str, Any]:
    """Extract and parse JSON from AI response text."""
    try:
        clean = response_text.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[-1]
            if clean.endswith("```"):
                clean = clean[:-3]
            clean = clean.strip()

        json_start = clean.find('{')
        json_end = clean.rfind('}') + 1
        if json_start != -1 and json_end > json_start:
            analysis = json.loads(clean[json_start:json_end])
            return {
                "status": "success",
                "phishing_detected": bool(analysis.get("phishing_detected", False)),
                "patterns_found": analysis.get("patterns_found", []),
                "raw_response": response_text
            }
    except (json.JSONDecodeError, Exception):
        pass
    return {
        "status": "error",
        "error": "Failed to parse AI response",
        "phishing_detected": False,
        "patterns_found": []
    }


def _rule_based_phishing_analysis(text: str) -> Dict[str, Any]:
    """Reliable rule-based phishing detection — always works offline."""
    patterns = []
    text_lower = text.lower()

    for kw in ["urgent", "immediately", "act now", "limited time", "expires", "suspended"]:
        if kw in text_lower:
            patterns.append(f"Urgency language detected: '{kw}'")

    for kw in ["verify your", "confirm your", "update your", "login", "password", "credit card", "ssn", "bank account"]:
        if kw in text_lower:
            patterns.append(f"Sensitive data request: '{kw}'")

    brands = ["paypal", "amazon", "microsoft", "google", "apple", "netflix", "facebook", "instagram", "whatsapp", "chase", "wells fargo"]
    for brand in brands:
        if brand in text_lower and not text_lower.endswith(f".{brand}.com") and not text_lower.endswith(f".{brand}.com/"):
            patterns.append(f"Possible brand impersonation: '{brand}'")

    if text_lower.startswith("http"):
        if "@" in text_lower:
            patterns.append("URL contains @ symbol (credential obfuscation)")
        if text_lower.count(".") > 4:
            patterns.append("Excessive subdomains in URL")
        suspicious_tlds = [".tk", ".ml", ".ga", ".cf", ".top", ".click", ".download", ".pw"]
        for tld in suspicious_tlds:
            if text_lower.endswith(tld) or (tld + "/") in text_lower:
                patterns.append(f"Suspicious TLD: {tld}")

    return {
        "status": "success",
        "phishing_detected": len(patterns) >= 2,
        "patterns_found": patterns,
        "method": "rule-based"
    }


def _generate_template_narrative(domain: str, score: int, threats: list) -> str:
    """Generate an intelligent template-based narrative when AI is unavailable."""
    threat_summary = "; ".join(threats[:3]) if threats else "no critical threats identified"

    if score >= 70:
        return (
            f"CRITICAL ALERT: SentinelAI analysis of {domain} has identified significant security concerns "
            f"(Score: {score}/100). Key findings include: {threat_summary}. "
            f"This target exhibits strong indicators of malicious intent. Immediate avoidance is strongly recommended."
        )
    elif score >= 40:
        return (
            f"CAUTION: Analysis of {domain} reveals moderate security concerns "
            f"(Score: {score}/100). Notable findings: {threat_summary}. "
            f"While not definitively malicious, the technical signals warrant caution. Verify the source independently before proceeding."
        )
    else:
        return (
            f"SYSTEM STATUS: Analysis of {domain} indicates standard security configurations "
            f"(Score: {score}/100). {threat_summary.capitalize()}. "
            f"The site appears safe for standard use, though users should always remain vigilant."
        )
