import React from 'react';
import { ArrowRight, Sparkles, Store, TrendingUp, ShieldCheck, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/content';

interface HeroProps {
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation }) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-slate-950">
      {/* Background radial glow accents for modern tech feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-cyan-900/20 via-blue-900/10 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute -top-24 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Core Messaging */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tech Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/40 text-sm font-bold text-cyan-300 shadow-lg shadow-cyan-950/30 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="tracking-wide">AI • SOFTWARE • DIGITAL SOLUTIONS</span>
            </div>

            {/* Main Headline from Slide 1 with Ultra-Modern Display Scale */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white leading-[1.03] mb-8">
              INNOVATIVE <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                SOLUTIONS.
              </span>
              <br />
              <span className="text-white">DIGITAL FUTURE.</span>
            </h1>

            {/* Subheading from Slide 1 */}
            <p className="text-xl sm:text-2xl text-slate-200 leading-relaxed max-w-2xl mb-10 font-normal">
              {COMPANY_INFO.subheading}
            </p>

            {/* Flagship Focus Card Highlight (Modern Glass Panel) */}
            <div className="w-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 sm:p-7 mb-10 shadow-2xl hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-cyan-300 mb-2">
                <span className="p-1 rounded-md bg-cyan-950 border border-cyan-500/40">
                  <Store className="w-4 h-4 text-cyan-400" />
                </span>
                <span>Flagship Transformation Focus</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-cyan-200 transition-colors">
                {COMPANY_INFO.flagshipTitle}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed">
                Empowering traditional retailers to battle digital monopolies with unified cloud POS, instant cataloging, and hyper-local fulfillment.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <button
                type="button"
                id="hero-start-button"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:brightness-110 active:scale-[0.98] rounded-2xl shadow-xl shadow-cyan-950/50 transition-all cursor-pointer"
              >
                <span>Schedule Transformation Call</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#retail"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all shadow-md"
              >
                <span>View Retail Architecture</span>
                <ChevronRight className="w-5 h-5 text-cyan-400" />
              </a>
            </div>

            {/* Leadership & Location Micro-Bar (from Slide 1) */}
            <div className="w-full pt-6 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white font-bold text-base">{COMPANY_INFO.leadership.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">{COMPANY_INFO.leadership.role}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="font-medium">{COMPANY_INFO.contact.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Ecosystem Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header with Graphic Banner */}
              <div className="relative h-44 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-7 overflow-hidden rounded-t-3xl">
                <img
                  src="/src/assets/images/hero_liquid_ribbon_1788799877334.jpg"
                  alt="Bitso Innovations Digital Systems Architecture"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-cyan-300 tracking-wider font-bold bg-slate-950/90 px-2.5 py-1 rounded-lg border border-cyan-500/40">
                      ENTERPRISE DIGITAL CATALYST
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-1.5 drop-shadow-md">
                      Bitso Systems Architecture
                    </h3>
                  </div>
                  <div className="px-3 py-1 bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-xs font-mono font-bold rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE
                  </div>
                </div>
              </div>

              {/* Key Impact Stats Grid */}
              <div className="grid grid-cols-2 gap-3.5 mb-6">
                <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
                  <div className="text-3xl sm:text-4xl font-black font-display text-cyan-400">
                    40%
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-1">
                    Overhead Reduction
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1 leading-snug">
                    Average operational savings for clients
                  </div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
                  <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400">
                    500+
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-1">
                    Store Onboarding
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1 leading-snug">
                    Targeted in Year 1 alone (2026–2027)
                  </div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
                  <div className="text-3xl sm:text-4xl font-black font-display text-sky-400">
                    1 to 1k
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-1">
                    Locations Elasticity
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1 leading-snug">
                    Scales frictionlessly without latency
                  </div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
                  <div className="text-3xl sm:text-4xl font-black font-display text-teal-400">
                    24/7
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-1">
                    Proactive Support
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1 leading-snug">
                    Continuous uptime monitoring & SLAs
                  </div>
                </div>
              </div>

              {/* Verified Capabilities Checklist */}
              <div className="space-y-3 bg-slate-950/80 rounded-2xl p-5 border border-slate-800/90">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Verified Enterprise Capabilities
                </div>
                {[
                  'Cloud POS Sync & Centralized Real-Time Inventory',
                  'Localized UPI & Indian Multi-Gateway Checkout',
                  'Sub-Second Hyper-Local Courier Dispatch APIs',
                  'Automated WhatsApp/SMS Customer Retention Loops',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Direct Founder Quote Callout */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-sm sm:text-base text-slate-200 italic">
                &ldquo;{COMPANY_INFO.leadership.quote}&rdquo;
                <div className="not-italic text-right font-bold text-cyan-300 text-sm mt-1.5">
                  — {COMPANY_INFO.leadership.name}, {COMPANY_INFO.leadership.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
