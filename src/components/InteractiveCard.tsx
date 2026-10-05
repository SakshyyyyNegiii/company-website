import React, { useRef, useState, useCallback } from 'react';

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  enableTilt?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(6, 182, 212, 0.18)',
  maxTilt = 6,
  enableTilt = true,
  onClick,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [mousePos, setMousePos] = useState<{ x: number; y: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    isHovered: false,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y, isHovered: true });

      if (enableTilt) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        if (centerX > 0 && centerY > 0) {
          const rotateX = ((y - centerY) / centerY) * -maxTilt;
          const rotateY = ((x - centerX) / centerX) * maxTilt;

          setTransform(
            `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
          );
        }
      }
    },
    [enableTilt, maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        transition: mousePos.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`relative group overflow-hidden ${className}`}
      {...props}
    >
      {/* Interactive Cursor-Tracking Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: mousePos.isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`
            : undefined,
        }}
      />
      {children}
    </div>
  );
};
