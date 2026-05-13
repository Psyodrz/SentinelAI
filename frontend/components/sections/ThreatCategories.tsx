'use client';

export const ThreatCategories = () => {
  return (
    <section className="section" id="threats">
      <div className="section-eyebrow">— WHAT WE DETECT</div>
      <h2 className="section-h2">Threat Categories</h2>
      <p className="section-desc">SentinelAI identifies most common and dangerous forms of cyber threats targeting everyday users.</p>
      <div className="threat-grid">
        <div className="threat-card">
          <div className="threat-icon ti-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div>
            <div className="threat-name">Phishing URLs</div>
            <div className="threat-desc">Fake domains that mimic trusted brands — PayPal, Amazon, Google — to steal credentials.</div>
          </div>
        </div>
        <div className="threat-card">
          <div className="threat-icon ti-warn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <div className="threat-name">Phishing Emails</div>
            <div className="threat-desc">Urgency-driven email scams with fake sender domains, spoofed logos, and malicious links.</div>
          </div>
        </div>
        <div className="threat-card">
          <div className="threat-icon ti-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <div className="threat-name">Brand Impersonation</div>
            <div className="threat-desc">Sites or emails pretending to be official companies to extract personal or financial data.</div>
          </div>
        </div>
        <div className="threat-card">
          <div className="threat-icon ti-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <div>
            <div className="threat-name">Suspicious Domains</div>
            <div className="threat-desc">Newly registered, typosquatted, or obfuscated domains designed to look legitimate.</div>
          </div>
        </div>
        <div className="threat-card">
          <div className="threat-icon ti-warn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <div className="threat-name">Social Engineering</div>
            <div className="threat-desc">Manipulative language patterns — urgency, fear, authority — used to pressure users into action.</div>
          </div>
        </div>
        <div className="threat-card">
          <div className="threat-icon ti-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <div className="threat-name">Credential Harvesting</div>
            <div className="threat-desc">Fake login pages cloning real sites to intercept usernames, passwords, and 2FA codes.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
