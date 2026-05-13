'use client';

import { motion } from 'framer-motion';

export const AboutUs = () => {
  return (
    <section className="section" id="about" style={{
      background: 'var(--surface2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.05) 0%, transparent 70%)',
        transform: 'translate(30%, -30%)',
        pointerEvents: 'none'
      }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="section-eyebrow">— ABOUT THE PROJECT</div>
        <h2 className="section-h2" style={{ marginBottom: '40px' }}>Who We Are</h2>
      </motion.div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            width: '48px', height: '48px', 
            background: 'rgba(var(--accent-rgb), 0.1)', 
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px',
            color: 'var(--accent)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: '28px', color: 'var(--text)', marginBottom: '16px', fontWeight: 600 }}>The Mission</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '15px' }}>
            SentinelAI was built to democratize enterprise-grade cybersecurity. We recognized that while large corporations have dedicated security operations centers (SOCs), everyday users and small businesses are increasingly targeted by sophisticated phishing, social engineering, and brand impersonation attacks.
            <br /><br />
            Our goal is to provide an accessible, instant, AI-driven threat analysis tool that acts as your personal cybersecurity analyst—available 24/7.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            width: '48px', height: '48px', 
            background: 'rgba(var(--safe-rgb), 0.1)', 
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px',
            color: 'var(--safe)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: '28px', color: 'var(--text)', marginBottom: '16px', fontWeight: 600 }}>The Technology</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '15px' }}>
            Traditional antivirus software relies on static databases of known threats, meaning they are always one step behind the attackers. SentinelAI takes a fundamentally different approach.
            <br /><br />
            By leveraging advanced Large Language Models (LLMs) running on a highly parallelized backend architecture, we analyze the <em>intent</em> and <em>context</em> of suspicious links and emails in real-time, catching zero-day threats before they make it to public blacklists.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
