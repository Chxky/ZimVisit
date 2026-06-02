// ============================================================
// ZimVisit Traveler Portal - Skip to Content Link (WCAG 2.1 AA)
// ============================================================

import React from 'react';

const SkipToContent: React.FC = () => (
  <a
    className="skip-to-content"
    href="#main-content"
    style={{
      position: 'absolute',
      left: '-9999px',
      top: 'auto',
      width: 1,
      height: 1,
      overflow: 'hidden',
      zIndex: 9999,
      padding: '12px 24px',
      background: '#166534',
      color: '#ffffff',
      fontWeight: 600,
      fontSize: 14,
      textDecoration: 'none',
      borderRadius: '0 0 8px 0',
    }}
    onFocus={(e) => {
      e.currentTarget.style.left = '0';
      e.currentTarget.style.top = '0';
      e.currentTarget.style.width = 'auto';
      e.currentTarget.style.height = 'auto';
    }}
    onBlur={(e) => {
      e.currentTarget.style.left = '-9999px';
      e.currentTarget.style.width = '1';
      e.currentTarget.style.height = '1';
    }}
  >
    Skip to main content
  </a>
);

export default SkipToContent;
