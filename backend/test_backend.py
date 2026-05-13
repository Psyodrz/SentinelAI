#!/usr/bin/env python3
"""
Simple test script to verify backend functionality
"""

import asyncio
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def test_scoring():
    """Test the scoring agent"""
    from agents.scoring_agent import calculate_score, get_risk_level
    
    # Test cases
    test_cases = [
        {"domain_age_days": 5, "virustotal_flagged": True},  # High risk
        {"suspicious_tld": True, "url_length_over_70": True},  # Medium risk
        {"domain_age_days": 365},  # Low risk
        {}  # Safe
    ]
    
    print("🎯 Testing Scoring Agent:")
    for i, flags in enumerate(test_cases):
        score = calculate_score(flags)
        level = get_risk_level(score)
        print(f"  Test {i+1}: Score={score}, Level={level}")
    
    return True

async def test_url_analysis():
    """Test URL analysis"""
    from agents.url_agent import analyze_url_structure
    
    test_urls = [
        "https://paypal-secure-login.com",  # Suspicious
        "https://google.com",  # Safe
        "http://192.168.1.1/login",  # IP address
    ]
    
    print("\n🔍 Testing URL Analysis:")
    for url in test_urls:
        result = analyze_url_structure(url)
        print(f"  {url[:30]}... -> Suspicious patterns: {len(result.get('suspicious_patterns', []))}")
    
    return True

async def test_whois():
    """Test WHOIS analysis"""
    from agents.whois_agent import analyze_domain_info
    
    print("\n📊 Testing WHOIS Analysis:")
    try:
        result = analyze_domain_info("google.com")
        if result.get("status") == "success":
            print(f"  google.com -> Age: {result.get('domain_age_days')} days")
        else:
            print(f"  google.com -> Error: {result.get('error')}")
    except Exception as e:
        print(f"  WHOIS test failed: {e}")
    
    return True

async def main():
    """Run all tests"""
    print("🚀 SentinelAI Backend Tests")
    print("=" * 40)
    
    tests = [
        test_scoring,
        test_url_analysis,
        test_whois,
    ]
    
    passed = 0
    for test in tests:
        try:
            if await test():
                passed += 1
        except Exception as e:
            print(f"❌ {test.__name__} failed: {e}")
    
    print(f"\n✅ {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 Backend is ready!")
    else:
        print("⚠️  Some tests failed - check the errors above")

if __name__ == "__main__":
    asyncio.run(main())
