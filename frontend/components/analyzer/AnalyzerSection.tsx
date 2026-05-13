'use client';

import { useAnalyzer } from '@/hooks/useAnalyzer';
import { useEffect, useRef } from 'react';

interface AnalyzerSectionProps {
  analyzer: ReturnType<typeof useAnalyzer>;
}

export const AnalyzerSection = ({ analyzer }: AnalyzerSectionProps) => {
  const {
    inputValue, setInputValue,
    inputMode, setInputMode,
    analysisState,
    result,
    progress,
    activeAgent,
    runAnalysis,
    clearAnalysis,
    scanLog,
    elapsedTime
  } = analyzer;

  const isAnalyzing = analysisState === 'scanning';
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the terminal log (only the container, not the whole page)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [scanLog]);

  return (
    <section className="section" id="analyzer">
      <div className="section-eyebrow">— THREAT ANALYZER</div>
      <h2 className="section-h2">Analyze URL or Email</h2>
      <p className="section-desc">SentinelAI&apos;s multi-agent pipeline will perform a deep scan and return a live risk score with actionable intelligence.</p>

      <div className="analyzer-wrap" style={{ 
        background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px var(--glass-black), inset 0 1px 0 var(--glass-white)',
        borderRadius: '16px'
      }}>
        
        {/* TERMINAL HEADER */}
        <div className="analyzer-header" style={{ borderBottom: '1px solid var(--border)', background: 'var(--glass-white)' }}>
          <div className="traffic-dots">
            <div className="td td-r"></div>
            <div className="td td-y"></div>
            <div className="td td-g"></div>
          </div>
          <div className="analyzer-title" style={{ color: 'var(--text)', opacity: 0.7 }}>THREAT ANALYSIS TERMINAL V3.0.0</div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: 'var(--muted)' }}>
              UPTIME: 99.9%
            </div>
            <div className="dot-live"></div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: 'var(--safe)' }}>SYS ACTIVE</div>
          </div>
        </div>

        <div className="analyzer-body" style={{ padding: '32px' }}>
          
          {/* INPUT AREA (Hide during scan to focus on terminal) */}
          {analysisState === 'idle' || analysisState === 'error' ? (
            <div className="input-phase" style={{ animation: 'fadeIn 0.5s ease' }}>
              <div className="mode-row" style={{ marginBottom: '20px' }}>
                <button 
                  className={`mtab ${inputMode === 'url' ? 'on' : ''}`} 
                  onClick={() => setInputMode('url')}
                  style={{ borderRadius: '6px', padding: '8px 16px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  URL ANALYSIS
                </button>
                <button 
                  className={`mtab ${inputMode === 'email' ? 'on' : ''}`} 
                  onClick={() => setInputMode('email')}
                  style={{ borderRadius: '6px', padding: '8px 16px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  EMAIL ANALYSIS
                </button>
              </div>

              <textarea 
                className="ainput"
                placeholder={inputMode === 'url' ? "Enter suspicious URL (e.g. http://paypal-secure-verify.tk)..." : "Paste email content or headers here for phishing analysis..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  background: 'var(--glass-black)',
                  border: '1px solid var(--glass-white)',
                  borderRadius: '8px',
                  boxShadow: 'inset 0 2px 10px var(--glass-black)',
                  fontSize: '15px'
                }}
              />

              <div className="scan-row" style={{ marginTop: '24px' }}>
                <button 
                  className="scan-btn" 
                  onClick={runAnalysis} 
                  disabled={!inputValue.trim()}
                  style={{ 
                    background: 'var(--accent)', 
                    color: '#000', 
                    fontWeight: 700, 
                    boxShadow: '0 0 20px rgba(var(--accent-rgb), 0.3)',
                    border: 'none'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  INITIATE DEEP SCAN
                </button>
              </div>
            </div>
          ) : null}


          {/* LIVE TERMINAL VIEW (Shows during scanning AND when done) */}
          {(isAnalyzing || (analysisState === 'done' && result)) && (
            <div className="terminal-phase" style={{ animation: 'fadeIn 0.3s ease', marginBottom: analysisState === 'done' ? '40px' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {isAnalyzing ? (
                    <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--safe)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  )}
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '13px', color: isAnalyzing ? 'var(--accent)' : 'var(--safe)', letterSpacing: '1px' }}>
                    {isAnalyzing ? 'PIPELINE EXECUTING...' : 'PIPELINE COMPLETE'}
                  </div>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '13px', color: 'var(--muted)' }}>
                  ELAPSED: <span style={{ color: 'var(--text)' }}>{elapsedTime.toFixed(1)}s</span>
                </div>
              </div>

              {/* Console window */}
              <div 
                ref={logContainerRef}
                style={{ 
                background: 'var(--terminal-bg)', 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                padding: '20px', 
                height: analysisState === 'done' ? '200px' : '300px', 
                overflowY: 'auto',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                transition: 'height 0.5s ease'
              }}>
                {scanLog.map((log, i) => {
                  let color = 'var(--terminal-text)';
                  if (log.includes('✓')) color = 'var(--safe)';
                  if (log.includes('✕')) color = 'var(--danger)';
                  if (log.includes('▶')) color = 'var(--accent)';
                  if (log.includes('◈')) color = 'var(--warn)';
                  if (log.includes('─')) color = 'var(--terminal-muted)';
                  
                  return (
                    <div key={i} style={{ color, opacity: i === scanLog.length - 1 && isAnalyzing ? 1 : 0.7, marginBottom: '4px' }}>
                      {log}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              {progress && isAnalyzing && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'IBM Plex Mono', fontSize: '11px', color: 'var(--muted)' }}>
                    <span>{progress.agents[activeAgent]?.name || 'Finalizing'}</span>
                    <span>{Math.round(((activeAgent + 1) / progress.agents.length) * 100)}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--surface2)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${((activeAgent + 1) / progress.agents.length) * 100}%`,
                      background: 'var(--accent)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* RESULTS DASHBOARD */}
          {analysisState === 'done' && result && (
            <div className="results-phase" style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              
              {/* Top Row: Score & Brief */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
                
                {/* Score Gauge Card */}
                <div style={{ 
                  background: 'linear-gradient(145deg, var(--surface2) 0%, var(--surface) 100%)', 
                  border: `1px solid ${result.risk_level === 'SAFE' ? 'rgba(var(--safe-rgb), 0.3)' : result.risk_level === 'SUSPICIOUS' ? 'rgba(var(--warn-rgb), 0.3)' : 'rgba(var(--danger-rgb), 0.3)'}`,
                  borderRadius: '16px',
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 10px 30px ${result.risk_level === 'SAFE' ? 'rgba(var(--safe-rgb), 0.1)' : result.risk_level === 'SUSPICIOUS' ? 'rgba(var(--warn-rgb), 0.1)' : 'rgba(var(--danger-rgb), 0.15)'}`
                }}>
                  {/* Background Radial Glow */}
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '200px', height: '200px',
                    background: result.risk_level === 'SAFE' ? 'radial-gradient(circle, rgba(var(--safe-rgb), 0.15) 0%, transparent 70%)' : result.risk_level === 'SUSPICIOUS' ? 'radial-gradient(circle, rgba(var(--warn-rgb), 0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(var(--danger-rgb), 0.2) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }}></div>

                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: 'var(--muted)', letterSpacing: '3px', marginBottom: '24px', zIndex: 1 }}>THREAT SCORE</div>
                  
                  {/* Gauge Ring */}
                  <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                    <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--glass-white)" strokeWidth="6" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke={result.risk_level === 'SAFE' ? 'var(--safe)' : result.risk_level === 'SUSPICIOUS' ? 'var(--warn)' : 'var(--danger)'} strokeWidth="6" strokeDasharray={`${(result.threat_score / 100) * 283} 283`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
                    </svg>
                    <div style={{ 
                      fontSize: '56px', 
                      fontFamily: 'Barlow Condensed', 
                      fontWeight: 700, 
                      color: 'var(--text)',
                      textShadow: `0 0 20px ${result.risk_level === 'SAFE' ? 'rgba(var(--safe-rgb), 0.5)' : result.risk_level === 'SUSPICIOUS' ? 'rgba(var(--warn-rgb), 0.5)' : 'rgba(var(--danger-rgb), 0.5)'}`
                    }}>
                      {result.threat_score}
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '24px',
                    padding: '8px 24px',
                    borderRadius: '30px',
                    background: result.risk_level === 'SAFE' ? 'linear-gradient(90deg, rgba(var(--safe-rgb), 0.2), rgba(var(--safe-rgb), 0.05))' : result.risk_level === 'SUSPICIOUS' ? 'linear-gradient(90deg, rgba(var(--warn-rgb), 0.2), rgba(var(--warn-rgb), 0.05))' : 'linear-gradient(90deg, rgba(var(--danger-rgb), 0.2), rgba(var(--danger-rgb), 0.05))',
                    border: `1px solid ${result.risk_level === 'SAFE' ? 'rgba(var(--safe-rgb), 0.3)' : result.risk_level === 'SUSPICIOUS' ? 'rgba(var(--warn-rgb), 0.3)' : 'rgba(var(--danger-rgb), 0.3)'}`,
                    color: result.risk_level === 'SAFE' ? 'var(--safe)' : result.risk_level === 'SUSPICIOUS' ? 'var(--warn)' : 'var(--danger)',
                    fontFamily: 'IBM Plex Mono',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    zIndex: 1,
                    textTransform: 'uppercase'
                  }}>
                    {result.risk_level}
                  </div>
                </div>

                {/* Premium AI Briefing Card */}
                <div style={{ 
                  background: 'linear-gradient(145deg, var(--surface2) 0%, var(--surface) 100%)', 
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(var(--accent-rgb), 0.15)',
                  borderTop: '1px solid rgba(var(--accent-rgb), 0.3)',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px var(--glass-black), inset 0 1px 0 var(--glass-white)'
                }}>
                  {/* Grid background pattern */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(rgba(var(--invert-rgb), 0.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    opacity: 0.5,
                    pointerEvents: 'none'
                  }}></div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', zIndex: 1 }}>
                    <div style={{ padding: '8px', background: 'rgba(var(--accent-rgb), 0.1)', borderRadius: '8px', border: '1px solid rgba(var(--accent-rgb), 0.2)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '14px', color: 'var(--text)', fontWeight: 600, letterSpacing: '1px' }}>EXECUTIVE BRIEFING</div>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: 'var(--accent)', letterSpacing: '1px', opacity: 0.8 }}>GENERATED BY GEMINI AI</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    color: 'var(--text)', 
                    fontSize: '16px', 
                    lineHeight: '1.8',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    zIndex: 1,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {/* Render narrative with premium formatting */}
                    {(() => {
                      const text = result.ai_narrative || '';
                      if (text.startsWith('CRITICAL ALERT:')) {
                        return <p><strong style={{ color: 'var(--danger)', fontWeight: 700, letterSpacing: '1px', marginRight: '6px' }}>CRITICAL ALERT //</strong> {text.substring(15)}</p>;
                      } else if (text.startsWith('CAUTION:')) {
                        return <p><strong style={{ color: 'var(--warn)', fontWeight: 700, letterSpacing: '1px', marginRight: '6px' }}>CAUTION //</strong> {text.substring(8)}</p>;
                      } else if (text.startsWith('SYSTEM STATUS:')) {
                        return <p><strong style={{ color: 'var(--safe)', fontWeight: 700, letterSpacing: '1px', marginRight: '6px' }}>SYSTEM STATUS //</strong> {text.substring(14)}</p>;
                      }
                      return <p>{text}</p>;
                    })()}
                  </div>
                </div>
              </div>

              {/* Data Sources Grid */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>INTELLIGENCE SOURCES</span>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--glass-white), transparent)' }}></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  
                  <div className={`source-card ${result.api_results?.virustotal?.status === 'success' ? 'active' : ''}`} style={{ background: 'var(--surface)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div className="sc-name">VIRUSTOTAL</div>
                      <div className="sc-icon">{result.api_results?.virustotal?.malicious_count > 0 ? <span style={{ color: 'var(--danger)' }}>⚠️</span> : <span style={{ color: 'var(--safe)' }}>✓</span>}</div>
                    </div>
                    <div className="sc-val" style={{ fontSize: '18px', color: result.api_results?.virustotal?.malicious_count > 0 ? 'var(--danger)' : '#fff' }}>
                      {result.api_results?.virustotal?.malicious_count > 0 ? `${result.api_results.virustotal.malicious_count} Flags` : 'Clean'}
                    </div>
                  </div>

                  <div className={`source-card ${result.api_results?.safe_browsing?.status === 'success' ? 'active' : ''}`} style={{ background: 'var(--surface)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div className="sc-name">SAFE BROWSING</div>
                      <div className="sc-icon">{result.api_results?.safe_browsing?.safe_browsing_flagged ? <span style={{ color: 'var(--danger)' }}>⚠️</span> : <span style={{ color: 'var(--safe)' }}>✓</span>}</div>
                    </div>
                    <div className="sc-val" style={{ fontSize: '18px', color: result.api_results?.safe_browsing?.safe_browsing_flagged ? 'var(--danger)' : '#fff' }}>
                      {result.api_results?.safe_browsing?.safe_browsing_flagged ? 'Flagged' : 'Clean'}
                    </div>
                  </div>

                  <div className={`source-card ${result.api_results?.phishing?.status === 'success' || result.api_results?.phishing?.phishing_detected !== undefined ? 'active' : ''}`} style={{ background: 'var(--surface)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div className="sc-name">AI LINGUISTIC SCAN</div>
                      <div className="sc-icon">{result.api_results?.phishing?.phishing_detected ? <span style={{ color: 'var(--warn)' }}>⚠️</span> : <span style={{ color: 'var(--safe)' }}>✓</span>}</div>
                    </div>
                    <div className="sc-val" style={{ fontSize: '18px', color: result.api_results?.phishing?.phishing_detected ? 'var(--warn)' : '#fff' }}>
                      {result.api_results?.phishing?.phishing_detected ? 'Detected' : 'Passed'}
                    </div>
                  </div>

                  <div className={`source-card ${result.api_results?.ssl?.status === 'success' ? 'active' : ''}`} style={{ background: 'var(--surface)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div className="sc-name">SSL / TLS</div>
                      <div className="sc-icon">{result.api_results?.ssl?.error ? <span style={{ color: 'var(--warn)' }}>⚠️</span> : <span style={{ color: 'var(--safe)' }}>✓</span>}</div>
                    </div>
                    <div className="sc-val" style={{ fontSize: '18px', color: result.api_results?.ssl?.error ? 'var(--warn)' : '#fff' }}>
                      {result.api_results?.ssl?.error ? 'Invalid' : 'Secured'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Detailed Findings & Recommendations */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* Findings */}
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>TECHNICAL FINDINGS</span>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--glass-white), transparent)' }}></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {result.reasons && result.reasons.length > 0 ? (
                      result.reasons.map((r: any, i: number) => (
                        <div key={i} style={{ 
                          background: 'linear-gradient(90deg, var(--surface2) 0%, var(--surface) 100%)', 
                          border: '1px solid var(--glass-white)',
                          borderLeft: `4px solid ${r.severity === 'high' ? 'var(--danger)' : r.severity === 'medium' ? 'var(--warn)' : 'var(--accent)'}`,
                          padding: '20px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 15px var(--glass-black)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ fontSize: '15px', color: 'var(--text)', lineHeight: '1.5', fontWeight: 500 }}>{r.text}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>{r.source?.toUpperCase() || 'SYSTEM PIPELINE'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '32px', border: '1px dashed var(--glass-white)', borderRadius: '12px', background: 'var(--glass-black)', color: 'var(--muted)', textAlign: 'center', fontSize: '15px' }}>
                        <div style={{ marginBottom: '12px' }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--safe)" strokeWidth="1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
                        No significant threat indicators found.
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>ACTION PLAN</span>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--glass-white), transparent)' }}></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {result.recommendations?.map((rec: any, i: number) => (
                      <div key={i} style={{ 
                        background: rec.type === 'avoid' ? 'linear-gradient(90deg, rgba(var(--danger-rgb), 0.1) 0%, rgba(var(--danger-rgb), 0.02) 100%)' : 'linear-gradient(90deg, rgba(var(--safe-rgb), 0.1) 0%, rgba(var(--safe-rgb), 0.02) 100%)', 
                        border: `1px solid ${rec.type === 'avoid' ? 'rgba(var(--danger-rgb), 0.2)' : 'rgba(var(--safe-rgb), 0.2)'}`,
                        padding: '20px',
                        borderRadius: '12px',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        boxShadow: `0 8px 24px ${rec.type === 'avoid' ? 'rgba(var(--danger-rgb), 0.05)' : 'rgba(var(--safe-rgb), 0.05)'}`
                      }}>
                        <div style={{ 
                          width: '32px', height: '32px',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: rec.type === 'avoid' ? 'rgba(var(--danger-rgb), 0.2)' : 'rgba(var(--safe-rgb), 0.2)',
                          color: rec.type === 'avoid' ? 'var(--danger)' : 'var(--safe)',
                          flexShrink: 0
                        }}>
                          {rec.type === 'avoid' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          )}
                        </div>
                        <div style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 500 }}>{rec.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Reset Button */}
              <div style={{ marginTop: '56px', display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={clearAnalysis}
                  style={{ 
                    background: 'var(--glass-white)',
                    border: '1px solid var(--glass-white)',
                    color: 'var(--text)',
                    padding: '14px 40px',
                    borderRadius: '30px',
                    fontFamily: 'IBM Plex Mono',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--invert-rgb), 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px var(--glass-black)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'var(--glass-white)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
                  NEW SCAN
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};
