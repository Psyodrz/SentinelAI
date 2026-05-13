'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function SecurityPage() {
  const scrollTo = (id: string) => { window.location.href = `/#${id}`; };

  return (
    <div className="app-container">
      <Navbar scrollTo={scrollTo} />
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ minHeight: '80vh', padding: '120px 24px 80px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '16px' }}>â€” SECURITY</div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
          Security Hub
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '64px', maxWidth: '800px' }}>
          How we protect the SentinelAI infrastructure.
        </p>
        
        <div style={{ padding: '40px', background: 'var(--surface2)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{display:'grid',gap:'32px',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))'}}>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'32px',textAlign:'center'}}>
                  <div style={{fontSize:'32px',marginBottom:'16px'}}>ðŸ”’</div>
                  <h4 style={{color:'var(--text)',fontSize:'18px',marginBottom:'12px'}}>End-to-End Encryption</h4>
                  <p style={{color:'var(--muted)',fontSize:'14px',lineHeight:'1.6'}}>All traffic between your browser and our analysis pipeline is secured via TLS 1.3.</p>
              </div>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'32px',textAlign:'center'}}>
                  <div style={{fontSize:'32px',marginBottom:'16px'}}>ðŸ›¡ï¸</div>
                  <h4 style={{color:'var(--text)',fontSize:'18px',marginBottom:'12px'}}>Ephemeral Processing</h4>
                  <p style={{color:'var(--muted)',fontSize:'14px',lineHeight:'1.6'}}>Analyzed URLs and payloads are processed in isolated, ephemeral containers that are destroyed immediately after.</p>
              </div>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'32px',textAlign:'center'}}>
                  <div style={{fontSize:'32px',marginBottom:'16px'}}>ðŸ”</div>
                  <h4 style={{color:'var(--text)',fontSize:'18px',marginBottom:'12px'}}>Bug Bounty</h4>
                  <p style={{color:'var(--muted)',fontSize:'14px',lineHeight:'1.6'}}>We actively reward security researchers who responsibly disclose vulnerabilities in our platform.</p>
              </div>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}


