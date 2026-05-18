// ============================================================
// ZimVisit Traveler Portal - Particle Canvas Background
// ============================================================

import React, { useEffect, useRef, useCallback } from 'react';

interface ParticleCanvasProps {
  particleCount?: number;
  color?: string;
  speed?: number;
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  hue: number;
}

const COLORS = [
  { r: 245, g: 158, b: 11 },   // Gold
  { r: 22, g: 101, b: 52 },    // Green
  { r: 251, g: 191, b: 36 },   // Bright gold
  { r: 34, g: 197, b: 94 },    // Light green
];

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  particleCount = 60,
  speed = 0.3,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });

  const createParticle = useCallback((w: number, h: number): Particle => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * w,
      y: h + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * speed + speed * 0.5),
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      life: 0,
      maxLife: Math.random() * 300 + 200,
      hue: color.r * 65536 + color.g * 256 + color.b,
    };
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      dimensionsRef.current = { w: rect.width, h: rect.height };
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const { w, h } = dimensionsRef.current;
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const p = createParticle(w, h);
      p.y = Math.random() * h; // Spread across canvas initially
      p.life = Math.random() * p.maxLife; // Stagger life cycles
      return p;
    });

    const draw = () => {
      const { w, h } = dimensionsRef.current;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Fade in and out
        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = Math.max(1 - (lifeRatio - 0.7) / 0.3, 0);
        const alpha = p.opacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1);

        // Reset particle when it dies
        if (p.life >= p.maxLife || p.y < -10) {
          particlesRef.current[i] = createParticle(w, h);
          continue;
        }

        // Extract color components
        const r = (p.hue >> 16) & 0xff;
        const g = (p.hue >> 8) & 0xff;
        const b = p.hue & 0xff;

        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [particleCount, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export default ParticleCanvas;
