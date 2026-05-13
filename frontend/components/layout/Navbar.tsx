'use client';

import { useState, useEffect } from 'react';

interface NavbarProps {
  scrollTo: (id: string) => void;
}

export const Navbar = ({ scrollTo }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !isMenuClosing) {
        const target = event.target as Element;
        if (!target.closest('.nav-mobile-menu') && !target.closest('.nav-links')) {
          toggleMobileMenu();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen, isMenuClosing]);

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      setIsMenuClosing(true);
      setMobileMenuOpen(false);
      setTimeout(() => {
        setIsMenuClosing(false);
      }, 300);
    } else {
      setMobileMenuOpen(true);
      setIsMenuClosing(false);
    }
  };

  const handleNavClick = (id: string) => {
    scrollTo(id);
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <nav className="nav">
      <div className="nav-logo">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M16 3L5 8v8c0 6.6 4.7 12.8 11 14 6.3-1.2 11-7.4 11-14V8L16 3z" stroke="var(--accent)" strokeWidth="1.5" fill="rgba(0,229,255,0.08)"/>
          <path d="M12 16l3 3 5-6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <div className="nav-title">SENTINELAI</div>
        </div>
      </div>

      <div className={`nav-mobile-menu ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div className={`nav-links ${mobileMenuOpen ? 'active' : ''} ${isMenuClosing ? 'closing' : ''}`}>
        <span className="nav-link" onClick={() => handleNavClick('how')}>HOW IT WORKS</span>
        <span className="nav-link" onClick={() => handleNavClick('threats')}>THREATS</span>
        <span className="nav-link" onClick={() => handleNavClick('analyzer')}>ANALYZER</span>
        <span className="nav-link" onClick={() => handleNavClick('features')}>FEATURES</span>
        <span className="nav-link" onClick={() => handleNavClick('about')}>ABOUT US</span>
      </div>
    </nav>
  );
};
