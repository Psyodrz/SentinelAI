# SentinelAI - AI-Powered Cyber Threat Intelligence

SentinelAI uses a multi-agent AI pipeline to analyze suspicious URLs and emails in real-time — before they cause damage.

## 🏗️ Architecture

### Backend (Express.js)
- **5 Specialized AI Agents**: Input validation, URL analysis, phishing detection, risk scoring, and recommendations
- **Claude Integration**: Enhanced analysis with Anthropic's Claude AI
- **Security Features**: Rate limiting, input sanitization, CORS protection
- **Port**: 5000

### Frontend (Next.js 14)
- **Modern UI**: Dark theme with Tailwind CSS
- **Real-time Analysis**: Live agent pipeline visualization
- **Responsive Design**: Mobile-friendly interface
- **Port**: 3000

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and setup**:
```bash
cd SentinelAI
```

2. **Backend setup**:
```bash
cd backend
npm install
```

3. **Frontend setup**:
```bash
cd ../frontend
npm install
```

4. **Environment configuration**:
```bash
# Copy the example .env file
cp .env.example .env

# Edit .env with your API keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Running the Application

1. **Start the backend**:
```bash
cd backend
npm start
```
Backend will run on http://localhost:5000

2. **Start the frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

3. **Access the application**:
Open http://localhost:3000 in your browser

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📊 Features

### Multi-Agent Analysis Pipeline
1. **Input Agent**: Validates and classifies input (URL/email)
2. **URL Analyzer**: Examines domain structure and flags suspicious patterns
3. **Phishing Detector**: Identifies phishing attempts and brand impersonation
4. **Risk Scorer**: Aggregates all signals into a threat score (0-100)
5. **Recommendation Engine**: Provides actionable security advice

### Threat Detection
- **Phishing URLs**: Fake domains mimicking trusted brands
- **Phishing Emails**: Urgency-driven scams with spoofed senders
- **Brand Impersonation**: Sites pretending to be official companies
- **Suspicious Domains**: Typosquatted and obfuscated domains
- **Social Engineering**: Manipulative language patterns
- **Credential Harvesting**: Fake login pages

### Risk Scoring
- **0-20**: SAFE - No significant threats detected
- **21-50**: SUSPICIOUS - Some concerning patterns found
- **51-100**: HIGH RISK - Multiple serious threats detected

## 🛡️ Security Features

### Backend Security
- **Rate Limiting**: 100 requests per 15 minutes, 10 analysis requests per minute
- **Input Sanitization**: HTML escaping and content validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet.js**: Security headers and protections

### Frontend Security
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Same-origin requests and secure headers
- **Content Security Policy**: Restricts resource loading

## 📁 Project Structure

```
sentinelai/
├── backend/                     # Express server
│   ├── server.js                # Entry point
│   ├── routes/
│   │   └── analyze.js           # POST /api/analyze
│   ├── agents/
│   │   ├── inputAgent.js        # Input validation
│   │   ├── urlAgent.js          # Domain analysis
│   │   ├── phishingAgent.js     # Phishing detection
│   │   ├── riskAgent.js         # Score aggregation
│   │   └── recommendAgent.js    # Advice generation
│   ├── services/
│   │   └── claudeService.js     # Claude API wrapper
│   └── middleware/
│       ├── rateLimit.js
│       └── sanitize.js
│
├── frontend/                    # Next.js 14 App
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   ├── globals.css          # Global styles
│   │   └── api/analyze/route.ts # API proxy
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── analyzer/
│   │   └── ui/
│   ├── hooks/
│   │   └── useAnalyzer.ts       # Analysis state management
│   ├── types/
│   │   └── threat.ts            # TypeScript interfaces
│   └── lib/
│       └── constants.ts         # App constants
│
├── .env                         # Environment variables
└── README.md
```

## 🔧 API Endpoints

### POST /api/analyze
Analyzes a URL or email for threats.

**Request Body**:
```json
{
  "input": "https://example-phishing-site.com"
}
```

**Response**:
```json
{
  "threat_score": 75,
  "risk_level": "HIGH RISK",
  "reasons": [
    {
      "text": "Domain uses suspicious TLD: .tk",
      "severity": "medium"
    }
  ],
  "recommendations": [
    {
      "text": "DO NOT click this link",
      "type": "avoid"
    }
  ],
  "domain_info": "Domain: example-phishing-site.tk | DNS resolution failed"
}
```

## 🧪 Testing

### Test URLs
- **Safe**: https://google.com
- **Suspicious**: https://amazon-login-security-update.verify-account.net
- **High Risk**: https://paypal-secure-verify.account-login.co

### Test Emails
- **Safe**: user@example.com
- **Suspicious**: noreply@phishing-site.ml
- **High Risk**: verify-account@fake-domain.ru

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check if port 5000 is available
   - Verify Node.js version (18+)
   - Run `npm install` in backend directory

2. **Frontend errors**:
   - Ensure backend is running on port 5000
   - Check NEXT_PUBLIC_API_URL in .env.local
   - Run `npm install` in frontend directory

3. **Analysis fails**:
   - Verify ANTHROPIC_API_KEY is set
   - Check network connectivity
   - Review backend logs for errors

4. **CORS issues**:
   - Ensure NEXT_PUBLIC_API_URL is correctly set
   - Check backend CORS configuration

### Logs

**Backend logs**:
```bash
cd backend
npm start
# Logs will appear in console
```

**Frontend logs**:
- Check browser developer console
- Network tab for API requests
- React DevTools for component state

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting section above

---

**Built for Hackathon 2025** - Cyber Threat Intelligence Platform
