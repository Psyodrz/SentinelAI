'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CareersPage() {
  const scrollTo = (id: string) => { window.location.href = `/#${id}`; };

  return (
    <div className="app-container">
      <Navbar scrollTo={scrollTo} />
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ minHeight: '80vh', padding: '120px 24px 80px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '16px' }}>â€” CAREERS</div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
          Careers at SentinelAI
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '64px', maxWidth: '800px' }}>
          Join the mission to secure the digital frontier.
        </p>
        
        <div style={{ padding: '40px', background: 'var(--surface2)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{color:'var(--text)',fontSize:'24px',marginTop:'32px',marginBottom:'16px'}}>Open Positions</h3>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px',marginBottom:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                  <h4 style={{color:'var(--text)',fontSize:'18px',margin:0}}>Senior AI Engineer</h4>
                  <span style={{background:'rgba(var(--accent-rgb),0.1)',color:'var(--accent)',padding:'4px 12px',borderRadius:'20px',fontSize:'12px'}}>Remote</span>
              </div>
              <p style={{color:'var(--muted)',fontSize:'15px',lineHeight:'1.6'}}>Build the next generation of threat intelligence pipelines using LLMs and computer vision.</p>
          </div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px',marginBottom:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                  <h4 style={{color:'var(--text)',fontSize:'18px',margin:0}}>Frontend Security Engineer</h4>
                  <span style={{background:'rgba(var(--accent-rgb),0.1)',color:'var(--accent)',padding:'4px 12px',borderRadius:'20px',fontSize:'12px'}}>Remote</span>
              </div>
              <p style={{color:'var(--muted)',fontSize:'15px',lineHeight:'1.6'}}>Develop beautiful, ultra-fast threat analysis dashboards and security visualization components.</p>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}


