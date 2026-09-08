import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-lg tracking-wider',
    md: 'text-2xl tracking-widest',
    lg: 'text-3xl tracking-widest',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circuit / Tech B emblem */}
      <div className={`relative flex-shrink-0 ${iconDimensions[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bitsoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Background subtle hex outline */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            fill="#090d16"
            stroke="url(#bitsoGrad)"
            strokeWidth="2"
            className="opacity-90"
          />

          {/* Digital circuit blocks representing the 'B' spine and flow */}
          <rect x="22" y="24" width="9" height="9" rx="2" fill="#38bdf8" />
          <rect x="34" y="20" width="9" height="9" rx="2" fill="#0ea5e9" />
          <rect x="26" y="37" width="9" height="9" rx="2" fill="#0284c7" />
          <rect x="22" y="50" width="9" height="9" rx="2" fill="#06b6d4" />
          <rect x="33" y="62" width="9" height="9" rx="2" fill="#10b981" />
          <rect x="24" y="73" width="9" height="9" rx="2" fill="#34d399" />

          {/* Smooth dynamic circuit ribbon shaping the B curves */}
          <path
            d="M44 26 C66 26 78 34 78 45 C78 54 68 58 58 60 C74 61 80 72 78 81 C75 90 60 91 46 91"
            stroke="url(#bitsoGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Circuit tracks and connecting nodes */}
          <path
            d="M48 42 L66 42"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="2 3"
          />
          <circle cx="68" cy="42" r="3" fill="#38bdf8" />

          <path
            d="M44 74 L68 74"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="2 3"
          />
          <circle cx="70" cy="74" r="3" fill="#10b981" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className={`font-extrabold text-white font-sans ${titleSizes[size]}`}>
            BITSO
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            INNOVATIONS
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1 text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400">
            <span className="text-cyan-400 font-semibold">AI</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">SOFTWARE</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">DIGITAL SOLUTIONS</span>
          </div>
        )}
      </div>
    </div>
  );
};
