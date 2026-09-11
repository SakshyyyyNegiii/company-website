import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Headphones,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Milestone,
  Cpu,
  Map,
  Globe2,
  Network,
  ArrowRight,
} from 'lucide-react';
import { COMPANY_INFO, CORE_PILLARS, ROADMAP_MILESTONES } from '../../data/content';
import { SlideId } from '../../types';

interface AboutSlideProps {
  onNavigate: (slideId: SlideId) => void;
  onOpenConsultation: () => void;
}

export const AboutSlide: React.FC<AboutSlideProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'leadership' | 'pillars' | 'roadmap'>('leadership');

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-sky-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getPhaseIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Milestone className="w-4 h-4 text-cyan-400" />;
      case 1:
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 2:
        return <Map className="w-4 h-4 text-sky-400" />;
      case 3:
        return <Globe2 className="w-4 h-4 text-teal-400" />;
      case 4:
        return <Network className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  const currentMilestone = ROADMAP_MILESTONES[selectedPhase];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Badge & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Slide 02 • About Bitso Innovations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight">
              Engineering the Digital Advantage
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Headquartered in Laxmi Nagar, East Delhi. We combine strategic leadership mentorship with battle-tested software engineering.
            </p>
          </div>

          {/* Sub-view switcher for smooth, non-scrolling UX */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start md:self-auto shrink-0 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('leadership')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'leadership'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Leadership & Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pillars')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'pillars'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3 Core Commitments
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5-Year Roadmap
            </button>
          </div>
        </div>

        {/* Dynamic Tabbed Content */}
        {activeTab === 'leadership' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-in fade-in duration-300">
            {/* Director Spotlight Card */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-xl shrink-0 group">
                  <img
                    src="/src/assets/images/director_portrait_1788799927541.jpg"
                    alt={`${COMPANY_INFO.leadership.name} - ${COMPANY_INFO.leadership.role}, Bitso Innovations`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-950/90 px-2 py-0.5 rounded border border-cyan-500/40">
                      DIRECTOR
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Leadership" />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {COMPANY_INFO.leadership.name}
                  </h3>
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mt-0.5">
                    {COMPANY_INFO.leadership.role}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Driving technology architecture and nationwide retail transformation from New Delhi headquarters.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Laxmi Nagar, East Delhi HQ</span>
                  </div>
                </div>
              </div>

              {/* Direct Quote Box */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 relative text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                <Quote className="w-6 h-6 text-cyan-500/20 absolute -top-2.5 right-3 pointer-events-none" />
                &ldquo;{COMPANY_INFO.leadership.quote}&rdquo;
              </div>
            </div>

            {/* Mission & Organization Overview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Mission Statement & Identity
                </div>
                <h4 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Bridging the Execution Gap Between Traditional Commerce and Automation
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Bitso Innovations was founded to solve a critical commercial bottleneck: traditional Indian businesses possess tremendous footfall and brand equity, but lose margins to digital aggregators and legacy operational silos.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We engineer end-to-end proprietary infrastructure—unifying physical checkout counters with instant cloud catalogs, real-time inventory reconciliation, and hyper-local fulfillment algorithms.
                </p>
              </div>

              {/* Quick Pillars Peek */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CORE_PILLARS.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
                    onClick={() => setActiveTab('pillars')}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-2">
                      {getPillarIcon(pillar.iconName)}
                    </div>
                    <div className="text-xs font-bold text-white truncate">{pillar.title}</div>
                    <div className="text-[11px] text-cyan-300 mt-0.5">{pillar.highlight}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 transition-all cursor-pointer"
                >
                  <span>See How We Execute (Services)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('roadmap')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-all cursor-pointer"
                >
                  <span>View 5-Year Roadmap</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pillars Tab */}
        {activeTab === 'pillars' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CORE_PILLARS.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl shadow-slate-950/50"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 shadow-inner">
                      {getPillarIcon(pillar.iconName)}
                    </div>
                    <h3 className="text-xl font-bold font-display text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      {pillar.highlight}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">
                Ready to review how our core pillars apply to your specific retail or enterprise workflow?
              </span>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition-all cursor-pointer"
              >
                Schedule Leadership Consultation
              </button>
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Phase Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {ROADMAP_MILESTONES.map((item, index) => {
                const isSelected = selectedPhase === index;
                return (
                  <button
                    key={item.yearRange}
                    type="button"
                    onClick={() => setSelectedPhase(index)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                        : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {getPhaseIcon(index)}
                    <span>{item.phase} ({item.yearRange})</span>
                    {item.status === 'active' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Phase Detail Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    {currentMilestone.phase} • {currentMilestone.yearRange}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white mt-1">
                    {currentMilestone.title}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                    currentMilestone.status === 'active'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {currentMilestone.status === 'active' ? '● Active Phase' : 'Upcoming Horizon'}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {currentMilestone.description}
              </p>

              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
                  Strategic Deliverables & Milestones
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentMilestone.deliverables.map((del, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
