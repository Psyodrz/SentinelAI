export interface ThreatReason {
  text: string;
  severity: 'low' | 'medium' | 'high';
  source?: string; // Add source field
}

export interface Recommendation {
  text: string;
  type: 'avoid' | 'do';
}

export interface ClaudeInsights {
  summary: string;
  additionalConcerns: string[];
  enhancedRecommendations: string[];
}

export interface ThreatReport {
  threat_score: number;
  risk_level: 'SAFE' | 'SUSPICIOUS' | 'HIGH RISK';
  reasons: ThreatReason[];
  recommendations: Recommendation[];
  domain_info: string;
  input: string;
  inputType: 'url' | 'email';
  api_results?: {
    virustotal?: any;
    safe_browsing?: any;
    whois?: any;
    url_analysis?: any;
    phishing?: any;
    ssl?: any;
    headers?: any;
    entropy?: any;
    content?: any;
    ip_intel?: any;
  };
  ai_narrative?: string;
  errors?: string[];
  claudeInsights?: ClaudeInsights;
  enhanced?: boolean;
  analysis_metadata?: {
    timestamp: string;
    agent_results: {
      input: any;
      domain: any;
      phishing: any;
      risk: any;
      recommendations: any;
    };
  };
}

export type InputMode = 'url' | 'email';
export type AnalysisState = 'idle' | 'scanning' | 'done' | 'error';

export interface QuickAnalysisResult {
  threat_score: number;
  risk_level: 'SAFE' | 'SUSPICIOUS' | 'HIGH RISK';
  input_type: 'url' | 'email';
  quick_reasons: string[];
  timestamp: string;
}

export interface AgentStatus {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  error?: string;
}

export interface AnalysisProgress {
  activeAgent: number;
  agents: AgentStatus[];
  startTime?: number;
  endTime?: number;
}
