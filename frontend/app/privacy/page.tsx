'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  const scrollTo = (id: string) => { window.location.href = `/#${id}`; };

  return (
    <div className="app-container">
      <Navbar scrollTo={scrollTo} />
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ minHeight: '80vh', padding: '120px 24px 80px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '16px' }}>â€” PRIVACY</div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '64px', maxWidth: '800px' }}>
          How we handle, protect, and process your data.
        </p>
        
        <div style={{ padding: '40px', background: 'var(--surface2)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{color:'var(--text)',fontSize:'16px',lineHeight:'1.8'}}>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>Last updated: May 13, 2026</p>
              <h3 style={{fontSize:'20px',margin:'32px 0 16px'}}>1. Information We Collect</h3>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>When you use the SentinelAI Threat Analyzer, we collect the URLs and email contents you submit for analysis. This data is processed in memory to generate the threat report and is not stored permanently in our databases.</p>
              
              <h3 style={{fontSize:'20px',margin:'32px 0 16px'}}>2. How We Use Information</h3>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>We use the submitted data strictly for the purpose of executing security analysis via our LLM pipeline and external APIs (VirusTotal, Safe Browsing). We do not use your submitted URLs or emails for marketing.</p>
              
              <h3 style={{fontSize:'20px',margin:'32px 0 16px'}}>3. Data Sharing</h3>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>We do not sell your personal data. Submitted artifacts (URLs/domains) may be checked against third-party threat intelligence APIs to verify their reputation.</p>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}


