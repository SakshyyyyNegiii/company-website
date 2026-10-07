import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  color: string;
  glowColor: string;
  birthTime: number;
  lifeSpan: number;
}

// Cyan / Slate / Ice Blue palette matching Bitso Innovations theme
const THEME_COLORS = [
  { fill: 'rgba(34, 211, 238, ', glow: 'rgba(6, 182, 212, 0.8)' },   // Cyan-400
  { fill: 'rgba(56, 189, 248, ', glow: 'rgba(14, 165, 233, 0.8)' },  // Sky-400
  { fill: 'rgba(45, 212, 191, ', glow: 'rgba(20, 184, 166, 0.8)' },  // Teal-400
  { fill: 'rgba(186, 230, 253, ', glow: 'rgba(56, 189, 248, 0.6)' }, // Sky-200 / Ice
  { fill: 'rgba(148, 163, 184, ', glow: 'rgba(100, 116, 139, 0.5)' }, // Slate-400
];

export const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position references for 60fps / 120fps RAF without React re-render overhead
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const lastSpawnPos = useRef({ x: -100, y: -100 });
  const particlesRef = useRef<Particle[]>([]);
  const isLoopRunning = useRef(false);
  const rafId = useRef<number | null>(null);

  const isVisibleRef = useRef(false);

  // Check touch / pointer capability & reduced motion
  useEffect(() => {
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsTouchDevice(true);
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Spawn subtle glowing particles along the cursor path
    const spawnParticles = (x: number, y: number, prevX: number, prevY: number) => {
      const now = performance.now();
      const dx = x - prevX;
      const dy = y - prevY;
      const distance = Math.hypot(dx, dy);

      // Number of particles based on movement distance (1 to 3 particles)
      const count = Math.min(Math.max(Math.floor(distance / 12), 1), 3);

      for (let i = 0; i < count; i++) {
        const ratio = count === 1 ? 1 : i / (count - 1);
        const interpX = prevX + dx * ratio;
        const interpY = prevY + dy * ratio;

        // Subtle organic drift
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.4 + 0.15;
        const colorPalette = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];

        particlesRef.current.push({
          x: interpX + (Math.random() - 0.5) * 3,
          y: interpY + (Math.random() - 0.5) * 3,
          vx: Math.cos(angle) * speed + (dx * -0.03),
          vy: Math.sin(angle) * speed + (dy * -0.03),
          size: Math.random() * 2.2 + 1.2,
          baseAlpha: Math.random() * 0.45 + 0.45,
          color: colorPalette.fill,
          glowColor: colorPalette.glow,
          birthTime: now,
          lifeSpan: Math.random() * 300 + 500, // 500ms to 800ms dissipation
        });
      }

      // Limit particle count for optimal frame rate
      if (particlesRef.current.length > 80) {
        particlesRef.current.splice(0, particlesRef.current.length - 80);
      }
    };

    // Main animation loop
    const animate = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Direct DOM update for high-refresh-rate cursor tracking
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Fluid trailing ring interpolation
      const ease = 0.24;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      const particles = particlesRef.current;

      // Update and draw glowing particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.birthTime;

        if (age >= p.lifeSpan) {
          particles.splice(i, 1);
          continue;
        }

        // Dissipation progress (0 to 1)
        const progress = age / p.lifeSpan;
        // Ease out fade curve for soft dissipation
        const alpha = p.baseAlpha * Math.pow(1 - progress, 1.5);
        const currentSize = p.size * (1 - progress * 0.4);

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle with theme cyan glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(currentSize, 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha.toFixed(3)})`;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 6 * (1 - progress);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Keep running if there are active particles or cursor is on screen
      if (particles.length > 0 || isVisibleRef.current) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        isLoopRunning.current = false;
      }
    };

    const startLoopIfNeeded = () => {
      if (!isLoopRunning.current) {
        isLoopRunning.current = true;
        rafId.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
        ringPos.current = { x, y };
        lastSpawnPos.current = { x, y };
      }

      // Detect if hover target is clickable or interactive
      const target = e.target instanceof Element ? e.target : null;
      if (target) {
        let isInteractive = false;
        try {
          isInteractive = Boolean(
            target.closest('a, button, input, textarea, select, [role="button"], [role="tab"], [tabindex="0"], label, summary') ||
            target.classList.contains('cursor-pointer') ||
            window.getComputedStyle(target).cursor === 'pointer'
          );
        } catch {
          // fallback
        }
        setIsHoveringInteractive(isInteractive);
      }

      // Spawn particles along path
      const dist = Math.hypot(x - lastSpawnPos.current.x, y - lastSpawnPos.current.y);
      if (dist >= 6) {
        spawnParticles(x, y, lastSpawnPos.current.x, lastSpawnPos.current.y);
        lastSpawnPos.current = { x, y };
      }

      mousePos.current = { x, y };
      startLoopIfNeeded();
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
      // Spawn a micro burst of 5 glowing particles on click
      const now = performance.now();
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 + Math.random() * 0.4;
        const speed = Math.random() * 0.8 + 0.35;
        const colorPalette = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
        particlesRef.current.push({
          x: mousePos.current.x,
          y: mousePos.current.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.2 + 1.2,
          baseAlpha: 0.75,
          color: colorPalette.fill,
          glowColor: colorPalette.glow,
          birthTime: now,
          lifeSpan: 450,
        });
      }
      startLoopIfNeeded();
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice]);

  // Completely disabled on mobile/touch screens
  if (isTouchDevice) return null;

  return (
    <>
      {/* High-Performance Canvas for Particle Trails */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
        aria-hidden="true"
      />

      {/* Custom Cursor Pointer Elements */}
      <div
        className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        {/* Subtle Outer Halo Ring with smooth size transition on hover/click */}
        <div
          ref={ringRef}
          className={`fixed top-0 left-0 rounded-full border pointer-events-none transition-[width,height,background-color,border-color,box-shadow] duration-150 ease-out ${
            isHoveringInteractive
              ? 'w-10 h-10 border-cyan-300/80 bg-cyan-400/10 shadow-[0_0_16px_rgba(6,182,212,0.4)]'
              : isMouseDown
              ? 'w-6 h-6 border-cyan-400/90 bg-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
              : 'w-7 h-7 border-cyan-400/35 bg-transparent shadow-[0_0_8px_rgba(6,182,212,0.15)]'
          }`}
          style={{ willChange: 'transform' }}
        />

        {/* Central Precise Luminous Cyan Dot */}
        <div
          ref={dotRef}
          className={`fixed top-0 left-0 rounded-full pointer-events-none transition-[width,height,transform,background-color] duration-75 ease-out shadow-[0_0_8px_#22d3ee] ${
            isMouseDown
              ? 'w-2.5 h-2.5 bg-cyan-200 scale-90'
              : isHoveringInteractive
              ? 'w-2 h-2 bg-white scale-125'
              : 'w-1.5 h-1.5 bg-cyan-300'
          }`}
          style={{ willChange: 'transform' }}
        />
      </div>
    </>
  );
};
