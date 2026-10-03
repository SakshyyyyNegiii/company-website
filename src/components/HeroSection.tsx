import React from 'react';
import { COMPANY_INFO } from '../data/content';
import { TechVisual } from './TechVisual';
import { HeroBackground } from './HeroBackground';
import { ArrowRight, Sparkles, Cpu, Zap, Cloud, Bot } from 'lucide-react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface HeroSectionProps {
  onStartProject: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartProject,
  onExploreServices,
}) => {
  const { ref, isVisible } = useFadeInOnScroll({ threshold: 0.05, initialDelayMs: 50 });

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Dynamic Futuristic Shifting Mesh & Interactive Particle Constellation Background */}
      <HeroBackground />

      {/* Animated Content Container */}
      <div
        ref={ref}
        className={`relative z-10 transition-all duration-700 ease-out motion-reduce:transition-none ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Subtle Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>NEXT-GEN DIGITAL ENGINEERING</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Building{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                Digital Solutions
              </span>{' '}
              That Move Your Business Forward.
            </h1>

            {/* Highly Technical & Attractive Supporting Line */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-xl font-normal leading-relaxed text-balance">
              {COMPANY_INFO.subline}
            </p>

            {/* High-Tech Architecture Highlights Strip */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-300 backdrop-blur-md shadow-sm">
                <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>ENTERPRISE CLOUD ARCHITECTURE</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-indigo-500/30 text-indigo-300 backdrop-blur-md shadow-sm">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>HIGH-CONCURRENCY PLATFORMS</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-purple-500/30 text-purple-300 backdrop-blur-md shadow-sm">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>AUTONOMOUS AI AUTOMATION</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-emerald-500/30 text-emerald-300 backdrop-blur-md shadow-sm">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>SUB-SECOND LATENCY &amp; 99.99% UPTIME</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onStartProject}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreServices}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 text-base font-semibold transition-all hover:border-cyan-500/40 cursor-pointer"
              >
                <span>Our Services</span>
              </button>
            </div>

            {/* Unboxed Metadata Trust Line */}
            <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-slate-400">
              <span className="text-slate-300">Client-First Engineering</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-300">Sub-Second Performance</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-300">Full-Stack Execution</span>
            </div>
          </div>

          {/* Right Column: Futuristic Technology Visual */}
          <div className="lg:col-span-5 w-full flex flex-col items-center">
            {/* Major Technical Line for Dashboard */}
            <div className="w-full max-w-lg lg:max-w-xl flex items-center justify-between px-3.5 py-1.5 mb-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md text-[11px] font-mono text-slate-300 shadow-[0_0_15px_rgba(6,182,212,0.12)]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-bold text-white tracking-wider">LIVE INFRASTRUCTURE DASHBOARD</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-cyan-400">
                <span className="font-semibold">SUB-15MS LATENCY</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-semibold">14.8k REQ/SEC</span>
              </div>
            </div>

            <TechVisual onStartProject={onStartProject} />
          </div>
        </div>
      </div>
    </section>
  );
};
