'use client';

interface HeroProps {
  scrollTo: (id: string) => void;
}

export const Hero = ({ scrollTo }: HeroProps) => {
  return (
    <section className="hero" id="top">
      <div className="hero-grid"></div>
      <div className="hero-glow"></div>
      <div className="hero-tag">
        <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--accent)'}}></div>
        AI-POWERED CYBER THREAT INTELLIGENCE
      </div>
      <h1 className="hero-h1">DETECT.<br/><span>ANALYZE.</span><br/>PROTECT.</h1>
      <p className="hero-sub">SentinelAI uses a multi-agent AI pipeline to analyze suspicious URLs and emails in real-time — before they cause damage.</p>
      <div className="hero-btns">
        <button className="btn-primary" onClick={() => scrollTo('analyzer')}>RUN ANALYSIS</button>
        <button className="btn-ghost" onClick={() => scrollTo('how')}>SEE HOW IT WORKS</button>
      </div>
      <div className="hero-stats">
        <div className="stat"><div className="stat-num">5</div><div className="stat-label">AI AGENTS</div></div>
        <div className="stat"><div className="stat-num">&lt;5s</div><div className="stat-label">SCAN TIME</div></div>
        <div className="stat"><div className="stat-num">100</div><div className="stat-label">RISK SCALE</div></div>
        <div className="stat"><div className="stat-num">3</div><div className="stat-label">THREAT TYPES</div></div>
      </div>
      <div className="scroll-hint"><div className="scroll-line"></div></div>
    </section>
  );
};
