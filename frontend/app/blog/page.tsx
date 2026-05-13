'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function BlogPage() {
  const scrollTo = (id: string) => { window.location.href = `/#${id}`; };

  return (
    <div className="app-container">
      <Navbar scrollTo={scrollTo} />
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ minHeight: '80vh', padding: '120px 24px 80px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '16px' }}>â€” BLOG</div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
          SentinelAI Intel Blog
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '64px', maxWidth: '800px' }}>
          Latest research, zero-day discoveries, and company updates.
        </p>
        
        <div style={{ padding: '40px', background: 'var(--surface2)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{color:'var(--text)',fontSize:'24px',marginTop:'32px',marginBottom:'16px'}}>Latest Articles</h3>
          <div style={{display:'grid',gap:'24px',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))'}}>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
                  <div style={{color:'var(--accent)',fontFamily:'IBM Plex Mono',fontSize:'12px',marginBottom:'12px'}}>THREAT RESEARCH â€” MAY 2026</div>
                  <h4 style={{color:'var(--text)',fontSize:'20px',marginBottom:'12px'}}>The Rise of AI-Generated Phishing Campaigns</h4>
                  <p style={{color:'var(--muted)',fontSize:'15px',lineHeight:'1.6'}}>How attackers are using LLMs to bypass traditional spam filters with hyper-personalized attacks.</p>
              </div>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
                  <div style={{color:'var(--accent)',fontFamily:'IBM Plex Mono',fontSize:'12px',marginBottom:'12px'}}>COMPANY NEWS â€” APR 2026</div>
                  <h4 style={{color:'var(--text)',fontSize:'20px',marginBottom:'12px'}}>Announcing SentinelAI V3.0</h4>
                  <p style={{color:'var(--muted)',fontSize:'15px',lineHeight:'1.6'}}>Our completely rebuilt threat analysis pipeline, featuring 10x faster scanning and a new visual dashboard.</p>
              </div>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}


