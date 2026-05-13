'use client';

interface HowItWorksProps {
  runPipelineAnimation: () => void;
  pipelineDemo: boolean;
}

export const HowItWorks = ({ runPipelineAnimation, pipelineDemo }: HowItWorksProps) => {
  return (
    <section className="section" id="how">
      <div className="section-eyebrow">— HOW IT WORKS</div>
      <h2 className="section-h2">Multi-Agent Threat<br/>Detection Pipeline</h2>
      <p className="section-desc">Five specialized AI agents work in sequence to evaluate every input — from raw URL parsing to final security recommendations.</p>
      <div className="steps">
        <div className="step-card">
          <div className="step-num">01</div>
          <div className="step-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div className="step-title">User Input</div>
          <div className="step-text">Paste any suspicious URL or email content. The system auto-detects input type.</div>
          <div className="step-accent"></div>
        </div>
        <div className="step-card">
          <div className="step-num">02</div>
          <div className="step-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <div className="step-title">AI Analysis</div>
          <div className="step-text">Agents inspect domain structure, phishing keywords, brand impersonation, and blacklist status.</div>
          <div className="step-accent"></div>
        </div>
        <div className="step-card">
          <div className="step-num">03</div>
          <div className="step-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div className="step-title">Risk Score</div>
          <div className="step-text">All signals are aggregated into a threat score from 0–100 with a risk classification.</div>
          <div className="step-accent"></div>
        </div>
        <div className="step-card">
          <div className="step-num">04</div>
          <div className="step-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div className="step-title">You're Protected</div>
          <div className="step-text">Clear security advice tells you exactly what to do next to stay safe.</div>
          <div className="step-accent"></div>
        </div>
      </div>

      <div className="pipeline-wrap" style={{marginTop:'40px'}}>
        <div style={{fontFamily: 'IBM Plex Mono, monospace',fontSize:'11px',color:'var(--muted)',letterSpacing:'2px',marginBottom:'20px'}}>AGENT PIPELINE VISUALIZATION</div>
        <div className="pipeline" id="pipe">
          <div className="p-node" id="pn0">
            <div className="p-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div className="p-label">INPUT<br/>AGENT</div>
          </div>
          <div className="p-node" id="pn1">
            <div className="p-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div className="p-label">URL<br/>ANALYZER</div>
          </div>
          <div className="p-node" id="pn2">
            <div className="p-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div className="p-label">PHISHING<br/>DETECTOR</div>
          </div>
          <div className="p-node" id="pn3">
            <div className="p-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div className="p-label">RISK<br/>SCORER</div>
          </div>
          <div className="p-node" id="pn4">
            <div className="p-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="p-label">RECOMMEND<br/>ENGINE</div>
          </div>
        </div>
        <button className="pipe-demo-btn" onClick={runPipelineAnimation} disabled={pipelineDemo}>
          {pipelineDemo ? '▶ ANALYZING...' : '▶ RUN THREAT PIPELINE'}
        </button>
      </div>
    </section>
  );
};
