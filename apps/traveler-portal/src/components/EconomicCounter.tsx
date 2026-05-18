// ============================================================
// ZimVisit Traveler Portal - Animated Economic Counter
// ============================================================

import React, { useEffect, useRef, useState } from 'react';

interface EconomicCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  style?: React.CSSProperties;
}

function formatNumber(num: number, decimals: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 10_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const EconomicCounter: React.FC<EconomicCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 2000,
  decimals = 0,
  style,
}) => {
  const [display, setDisplay] = useState('0');
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (value === 0) {
      setDisplay(formatNumber(0, decimals));
      return;
    }

    // Reset when value changes
    hasRun.current = false;
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = eased * value;

      setDisplay(formatNumber(current, decimals));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration, decimals]);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}{display}{suffix}
    </span>
  );
};

export default EconomicCounter;
