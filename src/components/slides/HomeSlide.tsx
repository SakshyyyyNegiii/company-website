import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Store,
  TrendingUp,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Layers,
  Cpu,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { COMPANY_INFO } from '../../data/content';
import { SlideId } from '../../types';

interface HomeSlideProps {
  onNavigate: (slideId: SlideId) => void;
  onOpenConsultation: () => void;
}

export const HomeSlide: React.FC<HomeSlideProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Radial Glow Accent */}
        <div className="relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-blue-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Core Messaging */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Specialized Tech Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-bold text-cyan-300 shadow-md shadow-cyan-950/40 mb-6 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="tracking-wide uppercase">AI • Software • Digital Solutions</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.06] mb-5">
                INNOVATIVE <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                  SOLUTIONS.
                </span>
                <br />
                <span className="text-white">DIGITAL FUTURE.</span>
              </h1>

              {/* Concise Subheading */}
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl mb-8 font-normal">
                {COMPANY_INFO.subheading}
              </p>

              {/* Flagship Transformation Focus Card */}
              <div className="w-full bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5 sm:p-6 mb-8 shadow-xl hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                  <span className="p-1 rounded-md bg-cyan-950 border border-cyan-500/40">
                    <Store className="w-3.5 h-3.5 text-cyan-400" />
                  </span>
                  <span>Flagship Retail Transformation</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-cyan-200 transition-colors">
                  {COMPANY_INFO.flagshipTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  Empowering physical retail businesses to dominate local markets with synchronized cloud POS, instant digital storefronts, and automated hyper-local dispatch.
                </p>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:brightness-110 active:scale-95 rounded-xl shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
                >
                  <span>Schedule Transformation Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer"
                >
                  <span>Explore Services</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-xl transition-all cursor-pointer"
                >
                  <span>View Case Studies</span>
                </button>
              </div>

              {/* Leadership & Location Micro-Bar */}
              <div className="w-full pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-bold">{COMPANY_INFO.leadership.name}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">{COMPANY_INFO.leadership.role}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{COMPANY_INFO.contact.location}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase & Key Metrics Grid */}
            <div className="lg:col-span-5">
              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Visual Architecture Image Banner */}
                <div className="relative h-40 -mx-5 -mt-5 sm:-mx-7 sm:-mt-7 mb-6 overflow-hidden rounded-t-3xl">
                  <img
                    src="/src/assets/images/hero_liquid_ribbon_1788799877334.jpg"
                    alt="Bitso Innovations Systems Architecture"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                      ENTERPRISE CLOUD ARCHITECTURE
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      99.99% SLA
                    </span>
                  </div>
                </div>

                {/* 4 Core Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {COMPANY_INFO.keyMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="text-xl sm:text-2xl font-black font-display text-white block">
                        {metric.value}
                      </span>
                      <span className="text-xs font-bold text-cyan-300 block mt-0.5">
                        {metric.label}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1 leading-snug">
                        {metric.note}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Interactive Jump to ROI Calculator */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Calculate Your Annual Savings</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('why-us')}
                    className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Run ROI Model</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
