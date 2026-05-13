'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  const scrollTo = (id: string) => { window.location.href = `/#${id}`; };

  return (
    <div className="app-container">
      <Navbar scrollTo={scrollTo} />
      <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ minHeight: '80vh', padding: '120px 24px 80px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '16px' }}>â€” CONTACT</div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '64px', maxWidth: '800px' }}>
          Get in touch with our security operations team.
        </p>
        
        <div style={{ padding: '40px', background: 'var(--surface2)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{display:'grid',gap:'40px',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))'}}>
              <div>
                  <h3 style={{color:'var(--text)',fontSize:'24px',marginBottom:'16px'}}>General Inquiries</h3>
                  <p style={{color:'var(--muted)',fontSize:'15px',lineHeight:'1.6',marginBottom:'24px'}}>For general questions, media inquiries, or partnership opportunities, reach out to our team.</p>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px',color:'var(--text)'}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      hello@sentinelai.com
                  </div>
              </div>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'32px'}}>
                  <h3 style={{color:'var(--text)',fontSize:'20px',marginBottom:'24px'}}>Send a Message</h3>
                  <input type="text" placeholder="Name" style={{width:'100%',padding:'12px',marginBottom:'16px',background:'var(--glass-white)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)'}} />
                  <input type="email" placeholder="Email" style={{width:'100%',padding:'12px',marginBottom:'16px',background:'var(--glass-white)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)'}} />
                  <textarea placeholder="How can we help?" style={{width:'100%',padding:'12px',height:'120px',marginBottom:'16px',background:'var(--glass-white)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',resize:'none'}}></textarea>
                  <button style={{background:'var(--accent)',color:'#000',padding:'12px 24px',border:'none',borderRadius:'6px',fontWeight:'bold',cursor:'pointer',width:'100%'}}>Send Message</button>
              </div>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}


