'use client';

import { useState, useCallback } from 'react';
import { useAnalyzer } from '@/hooks/useAnalyzer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ThreatCategories } from '@/components/sections/ThreatCategories';
import { Features } from '@/components/sections/Features';
import { AboutUs } from '@/components/sections/AboutUs';
import { AnalyzerSection } from '@/components/analyzer/AnalyzerSection';

export default function Home() {
  const analyzer = useAnalyzer();
  const [pipelineDemo, setPipelineDemo] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Pipeline animation for the "How it works" section
  const runPipelineAnimation = useCallback(async () => {
    setPipelineDemo(true);
    const nodes = [0, 1, 2, 3, 4];
    
    // Reset
    nodes.forEach(n => {
      const el = document.getElementById(`pn${n}`);
      if (el) el.className = 'p-node';
    });

    for (const n of nodes) {
      const el = document.getElementById(`pn${n}`);
      if (el) {
        el.className = 'p-node lit';
        await new Promise(r => setTimeout(r, 600));
        el.className = 'p-node done';
      }
    }
    
    setTimeout(() => setPipelineDemo(false), 2000);
  }, []);

  return (
    <div className="app-container">
      <Navbar scrollTo={scrollTo} />
      
      <main>
        <Hero scrollTo={scrollTo} />
        
        <div className="divider"></div>
        
        <HowItWorks 
          runPipelineAnimation={runPipelineAnimation} 
          pipelineDemo={pipelineDemo} 
        />
        
        <div className="divider"></div>
        
        <ThreatCategories />
        
        <div className="divider" style={{opacity:0.3}}></div>
        
        <AnalyzerSection analyzer={analyzer} />
        
        <div className="divider" style={{opacity:0.3}}></div>
        
        <Features />

        <div className="divider" style={{opacity:0.3}}></div>

        <AboutUs />

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="cta-glow"></div>
          <div style={{fontFamily: 'IBM Plex Mono, monospace',fontSize:'11px',color:'var(--accent)',letterSpacing:'3px',marginBottom:'16px'}}>— STAY SECURE</div>
          <h2 className="cta-h">Don't Click.<br/><span style={{color:'var(--accent)'}}>Verify First.</span></h2>
          <p className="cta-sub">Every phishing attempt counts on you acting fast. SentinelAI gives you intelligence to pause and verify — in under 5 seconds.</p>
          <button className="btn-primary" onClick={() => scrollTo('analyzer')} style={{fontSize:'16px',padding:'14px 36px'}}>ANALYZE A THREAT NOW</button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
