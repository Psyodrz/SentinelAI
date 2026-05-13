import Link from 'next/link';

export const Footer = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: '80px 24px 40px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '60px'
      }}>
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L5 8v8c0 6.6 4.7 12.8 11 14 6.3-1.2 11-7.4 11-14V8L16 3z" stroke="var(--accent)" strokeWidth="1.5" fill="rgba(var(--accent-rgb),0.08)"/>
              <path d="M12 16l3 3 5-6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: 'var(--text)' }}>SENTINELAI</div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '250px' }}>
            Advanced cyber threat intelligence powered by multi-agent AI. Real-time scanning, analysis, and defense.
          </p>
        </div>

        {/* Product Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--text)', letterSpacing: '2px', fontWeight: 600 }}>PRODUCT</h4>
          <span style={{ color: 'var(--muted)', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s ease' }} onClick={() => scrollTo('analyzer')} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Threat Analyzer</span>
          <span style={{ color: 'var(--muted)', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s ease' }} onClick={() => scrollTo('features')} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Features</span>
          <span style={{ color: 'var(--muted)', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s ease' }} onClick={() => scrollTo('how')} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>How It Works</span>
          <span style={{ color: 'var(--muted)', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s ease' }} onClick={() => scrollTo('threats')} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Threat Catalog</span>
        </div>

        {/* Company Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--text)', letterSpacing: '2px', fontWeight: 600 }}>COMPANY</h4>
          <span style={{ color: 'var(--muted)', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s ease', textDecoration: 'none' }} onClick={() => scrollTo('about')} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>About Us</span>
          <Link href="/careers" style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Careers</Link>
          <Link href="/blog" style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Blog</Link>
          <Link href="/contact" style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Contact</Link>
        </div>

        {/* Legal Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--text)', letterSpacing: '2px', fontWeight: 600 }}>LEGAL</h4>
          <Link href="/privacy" style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Terms of Service</Link>
          <Link href="/cookies" style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Cookie Policy</Link>
          <Link href="/security" style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>Security</Link>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        paddingTop: '32px', 
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
          © 2026 SentinelAI. All rights reserved. CodeAlpha Internship Project.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: 'var(--muted)', cursor: 'pointer' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></span>
          <span style={{ color: 'var(--muted)', cursor: 'pointer' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></span>
          <span style={{ color: 'var(--muted)', cursor: 'pointer' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></span>
        </div>
      </div>
    </footer>
  );
};
