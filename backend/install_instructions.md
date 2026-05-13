# SentinelAI Backend — Setup Instructions

## Prerequisites
- Python 3.10+
- pip

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required API Keys
VIRUSTOTAL_API_KEY=your_virustotal_api_key
GOOGLE_SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key
GEMINI_API_KEY=your_gemini_api_key

# AI Model Configuration
GEMINI_MODEL=gemini-2.0-flash

# Server
PORT=8000
```

### Getting API Keys

1. **Gemini API Key** (Required for AI features):
   - Visit https://aistudio.google.com/apikey
   - Create a new API key
   - This powers the phishing detection AI and security brief generation

2. **VirusTotal API Key** (Required for malware scanning):
   - Sign up at https://www.virustotal.com/gui/join-us
   - Get your free API key from your profile

3. **Google Safe Browsing API Key** (Required for blacklist checks):
   - Enable the API at https://console.cloud.google.com/apis/library/safebrowsing.googleapis.com
   - Create credentials → API Key

## Running the Server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Health Check

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/health
```

## Architecture

SentinelAI uses a multi-agent pipeline powered by **Google Gemini AI**:

| Agent | Purpose |
|-------|---------|
| URL Agent | Domain structure, TLD, subdomain analysis |
| WHOIS Agent | Domain age and registrar lookup |
| SSL Agent | Certificate validation and expiry check |
| Entropy Agent | DGA (Domain Generation Algorithm) detection |
| Headers Agent | Security headers analysis (HSTS, CSP, etc.) |
| Content Agent | Deep HTML scan for login forms and phishing |
| IP Agent | Geolocation and proxy detection |
| VirusTotal Agent | Multi-engine malware scanning |
| Safe Browsing Agent | Google blacklist check |
| Phishing Agent | AI + rule-based phishing detection |
| Narrative Agent | AI-generated security brief |
| Scoring Agent | Deterministic risk scoring (0-100) |
