'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  const scrollTo = (id: string) => { window.location.href = `/#${id}`; };

  return (
    <div className="app-container">
      <Navbar scrollTo={scrollTo} />
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ minHeight: '80vh', padding: '120px 24px 80px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '16px' }}>â€” TERMS</div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '64px', maxWidth: '800px' }}>
          The rules and guidelines for using SentinelAI.
        </p>
        
        <div style={{ padding: '40px', background: 'var(--surface2)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{color:'var(--text)',fontSize:'16px',lineHeight:'1.8'}}>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>Last updated: May 13, 2026</p>
              <h3 style={{fontSize:'20px',margin:'32px 0 16px'}}>1. Acceptance of Terms</h3>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>By accessing and using the SentinelAI platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h3 style={{fontSize:'20px',margin:'32px 0 16px'}}>2. Acceptable Use</h3>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>You agree not to use the service for any automated scraping, reverse engineering of our AI models, or to submit classified/highly sensitive personal data into the public analyzer.</p>
              
              <h3 style={{fontSize:'20px',margin:'32px 0 16px'}}>3. Disclaimer of Warranties</h3>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>Our threat analysis is provided "as is". While we strive for accuracy, SentinelAI does not guarantee that our AI will catch 100% of malicious threats, nor does it guarantee that "Safe" results are immune from zero-day exploits.</p>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}


