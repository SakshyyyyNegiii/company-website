import React, { useState } from 'react';
import { ROADMAP_MILESTONES } from '../data/content';
import {
  Milestone,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Map,
  Globe2,
  Network,
} from 'lucide-react';

export const RoadmapSection: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);

  const getPhaseIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Milestone className="w-5 h-5 text-cyan-400" />;
      case 1:
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 2:
        return <Map className="w-5 h-5 text-sky-400" />;
      case 3:
        return <Globe2 className="w-5 h-5 text-teal-400" />;
      case 4:
        return <Network className="w-5 h-5 text-indigo-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="roadmap" className="py-20 md:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header from Slide 6 */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-xs font-bold text-emerald-300 mb-4 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strategic Horizon 2026–2031</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.08]">
            5-Year Scale & Growth Roadmap
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-slate-200 leading-relaxed">
            A bold, phased expansion from local retail digitization to becoming a global tech ecosystem leader — executed with precision at every milestone.
          </p>
        </div>

        {/* Phase Selector on Mobile / Tabs on Desktop */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {ROADMAP_MILESTONES.map((item, index) => {
            const isSelected = selectedPhase === index;
            return (
              <button
                key={item.yearRange}
                type="button"
                onClick={() => setSelectedPhase(index)}
                className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 border-cyan-300 shadow-xl font-black'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                <span>{item.phase} ({item.yearRange})</span>
              </button>
            );
          })}
        </div>

        {/* Featured Milestone Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-10 mb-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                {getPhaseIcon(selectedPhase)}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {ROADMAP_MILESTONES[selectedPhase].phase}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {ROADMAP_MILESTONES[selectedPhase].yearRange}
                  </span>
                  {selectedPhase === 0 && (
                    <span className="ml-2 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono uppercase font-bold">
                      Current Focus
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                  {ROADMAP_MILESTONES[selectedPhase].title}
                </h3>
              </div>
            </div>

            <div className="text-sm text-slate-400 max-w-xs md:text-right font-medium">
              Milestone {selectedPhase + 1} of 5 in the Bitso Long-term Strategy
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                CORE STRATEGIC OBJECTIVE
              </span>
              <p className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed">
                {ROADMAP_MILESTONES[selectedPhase].description}
              </p>
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                Designed to deliver tangible commercial upside at each phase while progressively scaling architectural complexity and recurring revenue.
              </div>
            </div>

            <div className="lg:col-span-7">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-4">
                KEY STRATEGIC DELIVERABLES & ROLLOUT
              </span>
              <div className="space-y-3.5">
                {ROADMAP_MILESTONES[selectedPhase].deliverables.map((deliv, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                      {deliv}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Complete 5-Year Visual Progression Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5">
          {ROADMAP_MILESTONES.map((milestone, idx) => (
            <div
              key={milestone.yearRange}
              onClick={() => setSelectedPhase(idx)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 ${
                selectedPhase === idx
                  ? 'bg-slate-900 border-cyan-400/80 shadow-xl ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="font-bold text-cyan-300">{milestone.phase}</span>
                <span className="text-slate-400 font-semibold">{milestone.yearRange.split('–')[0]}</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold font-display text-white line-clamp-2">
                {milestone.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed line-clamp-2">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
