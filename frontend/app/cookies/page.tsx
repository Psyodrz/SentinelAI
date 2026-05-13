'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CookiesPage() {
  const scrollTo = (id: string) => { window.location.href = `/#${id}`; };

  return (
    <div className="app-container">
      <Navbar scrollTo={scrollTo} />
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ minHeight: '80vh', padding: '120px 24px 80px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '16px' }}>â€” COOKIES</div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
          Cookie Policy
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '64px', maxWidth: '800px' }}>
          Information about how we use cookies and tracking technologies.
        </p>
        
        <div style={{ padding: '40px', background: 'var(--surface2)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{color:'var(--text)',fontSize:'16px',lineHeight:'1.8'}}>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>SentinelAI uses minimal cookies to ensure the basic functionality of the website.</p>
              <h3 style={{fontSize:'20px',margin:'32px 0 16px'}}>Essential Cookies</h3>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>We use essential cookies to maintain your session, remember your dark/light mode preferences, and protect against CSRF attacks. These cannot be disabled.</p>
              <h3 style={{fontSize:'20px',margin:'32px 0 16px'}}>Analytics</h3>
              <p style={{marginBottom:'24px',color:'var(--muted)'}}>We use privacy-friendly, anonymized analytics that do not store PII (Personally Identifiable Information) in your browser.</p>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}


