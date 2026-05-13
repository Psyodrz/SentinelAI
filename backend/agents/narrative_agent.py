"""
Narrative Agent — Delegates to ai_service for threat brief generation.
"""
from typing import Dict, Any
from services.ai_service import generate_threat_narrative

# Re-export so existing imports in analyze.py keep working
__all__ = ["generate_threat_narrative"]
