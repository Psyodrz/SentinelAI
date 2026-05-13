import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ThreatReport, 
  InputMode, 
  AnalysisState, 
  QuickAnalysisResult,
  AnalysisProgress,
  AgentStatus 
} from '@/types/threat';
import { API_ENDPOINTS, ERROR_MESSAGES, ANIMATION_DURATIONS } from '@/lib/constants';

// Agent definitions with icons and descriptions
const AGENT_DEFINITIONS = [
  { name: 'Input Validation', desc: 'Parsing and validating input format...', icon: '◈' },
  { name: 'DNS & WHOIS', desc: 'Resolving domain records and registration data...', icon: '◉' },
  { name: 'SSL & Headers', desc: 'Checking certificate validity and security headers...', icon: '◎' },
  { name: 'Content Analysis', desc: 'Scanning page content for phishing indicators...', icon: '◇' },
  { name: 'Threat Intel', desc: 'Querying VirusTotal, Safe Browsing, IP databases...', icon: '◆' },
  { name: 'AI Phishing Scan', desc: 'Running Gemini AI deep phishing analysis...', icon: '◈' },
  { name: 'Risk Scoring', desc: 'Computing composite threat score...', icon: '◉' },
  { name: 'Report Generation', desc: 'Generating security briefing and recommendations...', icon: '◎' },
];

interface UseAnalyzerReturn {
  inputValue: string;
  inputMode: InputMode;
  analysisState: AnalysisState;
  activeAgent: number;
  result: ThreatReport | null;
  error: string | null;
  progress: AnalysisProgress | null;
  quickResult: QuickAnalysisResult | null;
  elapsedTime: number;
  scanLog: string[];
  setInputValue: (value: string) => void;
  setInputMode: (mode: InputMode) => void;
  runAnalysis: () => Promise<void>;
  runQuickAnalysis: () => Promise<void>;
  clearAnalysis: () => void;
  clearError: () => void;
}

export function useAnalyzer(): UseAnalyzerReturn {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [activeAgent, setActiveAgent] = useState<number>(0);
  const [result, setResult] = useState<ThreatReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [quickResult, setQuickResult] = useState<QuickAnalysisResult | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [scanLog, setScanLog] = useState<string[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<boolean>(false);

  // Elapsed time counter
  useEffect(() => {
    if (analysisState === 'scanning') {
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - start) / 100) / 10);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [analysisState]);

  // Add to scan log
  const addLog = useCallback((msg: string) => {
    setScanLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  // Run the live agent animation while backend works
  const runAgentAnimation = useCallback(async () => {
    animationRef.current = true;
    const agents: AgentStatus[] = AGENT_DEFINITIONS.map(a => ({
      name: a.name,
      status: 'pending' as const
    }));

    const prog: AnalysisProgress = {
      activeAgent: 0,
      agents,
      startTime: Date.now()
    };
    setProgress(prog);

    for (let i = 0; i < agents.length; i++) {
      if (!animationRef.current) break;

      // Mark current as processing
      agents[i] = { ...agents[i], status: 'processing' };
      setProgress({ ...prog, activeAgent: i, agents: [...agents] });
      setActiveAgent(i);
      addLog(`▶ ${AGENT_DEFINITIONS[i].name}: ${AGENT_DEFINITIONS[i].desc}`);

      // Wait 800-1500ms per agent (realistic stagger)
      const delay = 800 + Math.random() * 700;
      await new Promise(r => setTimeout(r, delay));

      if (!animationRef.current) break;

      // Mark as completed
      agents[i] = { ...agents[i], status: 'completed' };
      setProgress({ ...prog, activeAgent: i, agents: [...agents] });
      addLog(`✓ ${AGENT_DEFINITIONS[i].name} — Complete`);
    }
  }, [addLog]);

  // Run quick analysis
  const runQuickAnalysis = useCallback(async () => {
    if (!inputValue.trim()) {
      setError(ERROR_MESSAGES.INVALID_INPUT);
      return;
    }
    setAnalysisState('scanning');
    setError(null);

    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch(API_ENDPOINTS.QUICK_ANALYZE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputValue.trim() }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || ERROR_MESSAGES.SERVER_ERROR);
      }

      const data: QuickAnalysisResult = await response.json();
      setQuickResult(data);
      setAnalysisState('done');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      setAnalysisState('error');
      setQuickResult(null);
    }
  }, [inputValue]);

  // Run full analysis — animation runs IN PARALLEL with backend call
  const runAnalysis = useCallback(async () => {
    if (!inputValue.trim()) {
      setError(ERROR_MESSAGES.INVALID_INPUT);
      return;
    }

    // Reset state
    setAnalysisState('scanning');
    setError(null);
    setResult(null);
    setQuickResult(null);
    setElapsedTime(0);
    setScanLog([]);
    addLog('⬡ SentinelAI Threat Pipeline Initiated');
    addLog(`◈ Target: ${inputValue.trim()}`);
    addLog(`◈ Mode: ${inputMode.toUpperCase()}`);
    addLog('─'.repeat(40));

    try {
      abortControllerRef.current = new AbortController();

      // Start animation AND backend call in parallel
      const animationPromise = runAgentAnimation();
      const fetchPromise = fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputValue.trim(), mode: inputMode }),
        signal: abortControllerRef.current.signal,
      });

      // Wait for backend response (animation continues independently)
      const response = await fetchPromise;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || 'Backend analysis failed');
      }

      const data = await response.json();

      // Stop animation and mark all agents complete
      animationRef.current = false;
      addLog('─'.repeat(40));
      addLog(`✓ Analysis complete — Score: ${data.threat_score}/100`);
      addLog(`✓ Risk Level: ${data.risk_level}`);

      // Short delay for final animation frame
      await new Promise(r => setTimeout(r, 400));

      // Finalize all agents as complete
      if (progress) {
        const finalAgents = AGENT_DEFINITIONS.map(a => ({
          name: a.name,
          status: 'completed' as const
        }));
        setProgress({
          activeAgent: -1,
          agents: finalAgents,
          startTime: progress.startTime,
          endTime: Date.now()
        });
      }

      setResult(data);
      setAnalysisState('done');

    } catch (err) {
      animationRef.current = false;
      if (err instanceof Error && err.name === 'AbortError') return;
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      addLog(`✕ ERROR: ${errorMessage}`);
      setError(errorMessage);
      setAnalysisState('error');
      setResult(null);
    }
  }, [inputValue, inputMode, addLog, runAgentAnimation, progress]);

  // Clear analysis
  const clearAnalysis = useCallback(() => {
    animationRef.current = false;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setAnalysisState('idle');
    setActiveAgent(0);
    setResult(null);
    setError(null);
    setProgress(null);
    setQuickResult(null);
    setElapsedTime(0);
    setScanLog([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    if (analysisState === 'error') setAnalysisState('idle');
  }, [analysisState]);

  useEffect(() => {
    return () => {
      animationRef.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    inputValue, inputMode, analysisState, activeAgent, result,
    error, progress, quickResult, elapsedTime, scanLog,
    setInputValue, setInputMode, runAnalysis, runQuickAnalysis,
    clearAnalysis, clearError,
  };
}
