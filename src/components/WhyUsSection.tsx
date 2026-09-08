import React from 'react';
import { CORE_PILLARS, COMPANY_INFO } from '../data/content';
import { Sparkles, Layers, Headphones, Quote, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-emerald-400" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-sky-400" />;
      default:
        return <Award className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="why-us" className="py-20 md:py-28 bg-slate-950/80 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header from Slide 7 */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-4 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Our Commitments & DNA</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.08]">
            Why Partner With Bitso Innovations
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-slate-200 leading-relaxed">
            Our Core Pillars — engineering excellence combined with hands-on leadership mentorship to future-proof your commercial enterprise.
          </p>
        </div>

        {/* 3 Core Pillars Grid from Slide 7 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {CORE_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-cyan-950/30 backdrop-blur-md"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 shadow-inner">
                  {getPillarIcon(pillar.iconName)}
                </div>

                <h3 className="text-2xl font-bold font-display text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="text-base text-slate-200 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-800/90">
                <span className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  {pillar.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Executive Director Quote Card from Slide 7 */}
        <div className="bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-7 sm:p-12 relative overflow-hidden shadow-2xl backdrop-blur-md">
          <Quote className="w-16 h-16 text-cyan-500/10 absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Portrait Column */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl shadow-cyan-950/50 shrink-0 mb-5 group">
                <img
                  src="/src/assets/images/director_portrait_1788799927541.jpg"
                  alt={`${COMPANY_INFO.leadership.name} - ${COMPANY_INFO.leadership.role}, Bitso Innovations`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-950/90 px-2.5 py-1 rounded-md border border-cyan-500/40">
                    EXECUTIVE DIRECTOR
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Active Leadership" />
                </div>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {COMPANY_INFO.leadership.name}
                </h4>
                <p className="text-sm font-bold text-cyan-400 mt-0.5">
                  {COMPANY_INFO.leadership.role}, Bitso Innovations
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  Leading enterprise digital transformations across India & international markets.
                </p>
              </div>
            </div>

            {/* Direct Quote & Vision Column */}
            <div className="lg:col-span-8 lg:border-l lg:border-slate-800 lg:pl-10">
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold block mb-4">
                EXECUTIVE LEADERSHIP PERSPECTIVE
              </span>
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-white leading-snug tracking-tight">
                &ldquo;{COMPANY_INFO.leadership.quote}&rdquo;
              </blockquote>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-5">
                <div className="text-sm text-slate-200 flex items-center gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>True Partnership: We don&apos;t just deliver software, we stay and scale with you.</span>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2.5 text-sm font-bold text-cyan-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 px-5 py-3 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all shadow-md"
                >
                  <span>Connect with Shrikant Jhanwar</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
