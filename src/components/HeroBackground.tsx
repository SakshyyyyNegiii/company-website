import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
}

interface PulsePacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  color: string;
}

export const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Handle high DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!container || !canvas) return;
      width = Math.max(container.clientWidth || window.innerWidth, 320);
      height = Math.max(container.clientHeight || 700, 320);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle Palette
    const colors = [
      'rgba(6, 182, 212, ',   // Cyan
      'rgba(56, 189, 248, ',  // Sky blue
      'rgba(99, 102, 241, ',  // Indigo
      'rgba(52, 211, 153, ',  // Emerald
      'rgba(147, 197, 253, ', // Light blue
    ];

    // Determine count based on screen size for optimal performance
    const particleCount = Math.min(Math.max(Math.floor(width / 24), 32), 64);

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.5 + 0.9,
      baseAlpha: Math.random() * 0.4 + 0.35,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    // Data packets that travel between connected nodes
    let packets: PulsePacket[] = [];
    let lastPacketTime = 0;

    const targetElement = container.parentElement || container;

    // Track mouse on hero container
    const handleMouseMove = (e: MouseEvent) => {
      const rect = targetElement.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
      mousePosRef.current.x = -1000;
      mousePosRef.current.y = -1000;
    };

    targetElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    // Pause when hero is not visible on screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(targetElement);

    const maxConnectDist = 125;
    const mouseRadius = 160;

    const render = (time: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const mouse = mousePosRef.current;

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse gentle magnetic repulsion or pull
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius && dist > 1) {
            const force = (1 - dist / mouseRadius) * 0.6;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Pulse
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = Math.max(0.1, p.baseAlpha + Math.sin(p.pulsePhase) * 0.2);

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw constellation connections
      const connectedPairs: { i: number; j: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Connect to mouse if close
        if (mouse.active) {
          const mdx = mouse.x - p1.x;
          const mdy = mouse.y - p1.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < mouseRadius) {
            const mAlpha = (1 - mDist / mouseRadius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect with other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            connectedPairs.push({ i, j });
            const alpha = (1 - dist / maxConnectDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Periodically spawn data packets traveling along links
      if (time - lastPacketTime > 600 && connectedPairs.length > 0 && packets.length < 8) {
        const pair = connectedPairs[Math.floor(Math.random() * connectedPairs.length)];
        packets.push({
          fromIdx: pair.i,
          toIdx: pair.j,
          progress: 0,
          speed: 0.02 + Math.random() * 0.02,
          color: Math.random() > 0.5 ? '#06b6d4' : '#38bdf8',
        });
        lastPacketTime = time;
      }

      // Render data packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;

        const pFrom = particles[pkt.fromIdx];
        const pTo = particles[pkt.toIdx];

        if (pkt.progress >= 1 || !pFrom || !pTo) {
          packets.splice(k, 1);
          continue;
        }

        const curX = pFrom.x + (pTo.x - pFrom.x) * pkt.progress;
        const curY = pFrom.y + (pTo.y - pFrom.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      targetElement.removeEventListener('mousemove', handleMouseMove);
      targetElement.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* 1. Shifting Deep Cyber Mesh Gradients */}
      <div className="absolute inset-0">
        {/* Shifting Orb 1: Vibrant Cyan/Teal (Top-Center) */}
        <div
          className="absolute -top-[15%] left-[20%] w-[680px] h-[520px] rounded-full blur-[130px] opacity-25 animate-mesh-1 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.75) 0%, rgba(13, 148, 136, 0.35) 50%, transparent 75%)',
          }}
        />

        {/* Shifting Orb 2: Electric Indigo/Violet (Top-Right) */}
        <div
          className="absolute top-[10%] -right-[10%] w-[620px] h-[580px] rounded-full blur-[140px] opacity-20 animate-mesh-2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.65) 0%, rgba(37, 99, 235, 0.35) 50%, transparent 75%)',
          }}
        />

        {/* Shifting Orb 3: Tech Emerald (Bottom-Center) */}
        <div
          className="absolute bottom-[-15%] left-[30%] w-[580px] h-[480px] rounded-full blur-[125px] opacity-15 animate-mesh-3 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.65) 0%, rgba(6, 182, 212, 0.25) 50%, transparent 75%)',
          }}
        />

        {/* Subtle Dark Vignette & Depth Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/30 via-transparent to-[#030712] pointer-events-none" />
      </div>

      {/* 2. Cyber Matrix Dot Grid with Radial Mask */}
      <div
        className="absolute inset-0 opacity-[0.16] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)',
        }}
      />

      {/* 3. High-Tech Corner HUD Reticles & Subtly Engineered Line Accents */}
      <div className="absolute top-6 left-6 font-mono text-[9px] tracking-widest text-cyan-500/35 hidden md:block select-none pointer-events-none">
        <span>[SYS.NET_ONLINE // LAT: 28.6139°N LON: 77.2090°E]</span>
      </div>

      <div className="absolute top-6 right-6 font-mono text-[9px] tracking-widest text-slate-500/40 hidden md:flex items-center gap-2 select-none pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>SYS://SECURE_NODE.V4</span>
      </div>

      {/* Thin horizontal guide lines */}
      <div className="absolute top-16 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-6 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent pointer-events-none" />

      {/* 4. Canvas Particle Network (Interactive Constellation) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.95 }}
      />
    </div>
  );
};
