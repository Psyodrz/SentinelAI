export const SAMPLE_URLS = [
  'https://www.google.com',
  'https://github.com/microsoft/vscode',
  'https://stackoverflow.com/questions/123456/example-question',
  'https://example-phishing-site.com/login',
  'https://suspicious-domain.tk/verify-account',
  'http://192.168.1.1/admin',
];

export const SAMPLE_EMAILS = [
  'user@example.com',
  'support@microsoft.com',
  'noreply@amazon.com',
  'suspicious@fake-domain.ru',
  'verify-account@phishing-site.ml',
];

export const AGENT_NAMES = [
  'Input Validation',
  'URL Analysis',
  'Phishing Detection',
  'Risk Assessment',
  'Recommendations'
];

export const AGENT_DESCRIPTIONS = [
  'Validates and classifies input as URL or email',
  'Analyzes domain structure and flags suspicious patterns',
  'Detects phishing attempts and malicious content',
  'Calculates overall threat score and risk level',
  'Generates personalized security recommendations'
];

export const RISK_LEVEL_COLORS = {
  'SAFE': {
    bg: 'bg-success-50',
    text: 'text-success-700',
    border: 'border-success-200',
    gauge: '#22c55e'
  },
  'SUSPICIOUS': {
    bg: 'bg-warning-50',
    text: 'text-warning-700',
    border: 'border-warning-200',
    gauge: '#f59e0b'
  },
  'HIGH RISK': {
    bg: 'bg-danger-50',
    text: 'text-danger-700',
    border: 'border-danger-200',
    gauge: '#ef4444'
  }
};

export const SEVERITY_COLORS = {
  'low': {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200'
  },
  'medium': {
    bg: 'bg-warning-100',
    text: 'text-warning-700',
    border: 'border-warning-200'
  },
  'high': {
    bg: 'bg-danger-100',
    text: 'text-danger-700',
    border: 'border-danger-200'
  }
};

export const API_ENDPOINTS = {
  ANALYZE: '/api/analyze',
  QUICK_ANALYZE: '/api/analyze/quick',
  HEALTH: '/health'
};

export const ANIMATION_DURATIONS = {
  AGENT_PROCESSING: 2000,
  PIPELINE_TRANSITION: 500,
  RESULT_FADE_IN: 800,
  LOADING_DOTS: 1500
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_INPUT: 'Please enter a valid URL or email address.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

export const SUCCESS_MESSAGES = {
  ANALYSIS_COMPLETE: 'Analysis completed successfully!',
  SECURE_CONNECTION: 'Connection is secure and encrypted.',
  NO_THREATS_DETECTED: 'No threats detected in this analysis.'
};
