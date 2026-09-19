import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Layers,
  ExternalLink,
  ShieldCheck,
  Store,
  Truck,
  Cpu,
  Database,
  Building,
  AlertCircle,
  Target,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Repeat,
} from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../../data/content';
import { PortfolioItem, SlideId } from '../../types';

interface PortfolioSlideProps {
  onSelectSolutionForInquiry: (title: string) => void;
  onNavigate: (slideId: SlideId) => void;
}

export const PortfolioSlide: React.FC<PortfolioSlideProps> = ({
  onSelectSolutionForInquiry,
  onNavigate,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(PORTFOLIO_ITEMS[0].id);

  const activeIndex = Math.max(0, PORTFOLIO_ITEMS.findIndex((item) => item.id === selectedCaseId));
  const activeCase = PORTFOLIO_ITEMS[activeIndex] || PORTFOLIO_ITEMS[0];

  const cycleNextProject = () => {
    if (PORTFOLIO_ITEMS.length === 0) return;
    const nextIdx = (activeIndex + 1) % PORTFOLIO_ITEMS.length;
    setSelectedCaseId(PORTFOLIO_ITEMS[nextIdx].id);
  };

  const cyclePrevProject = () => {
    if (PORTFOLIO_ITEMS.length === 0) return;
    const prevIdx = (activeIndex - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length;
    setSelectedCaseId(PORTFOLIO_ITEMS[prevIdx].id);
  };

  const handleSelectAndInquire = (title: string) => {
    onSelectSolutionForInquiry(title);
    onNavigate('contact');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'retail':
        return <Store className="w-4 h-4 text-cyan-400" />;
      case 'erp':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'logistics':
        return <Truck className="w-4 h-4 text-sky-400" />;
      case 'ai':
        return <Cpu className="w-4 h-4 text-teal-400" />;
      default:
        return <Layers className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-start lg:justify-center pt-4 sm:pt-6 pb-28 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header without horizontal category scroll tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Slide 05 • Proven Client Deployments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-display text-white tracking-tight">
              Enterprise Portfolio &amp; Case Studies
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-1 max-w-2xl">
              Proven digital transformations delivered across Indian retail chains, distribution networks, and logistics fleets.
            </p>
          </div>

          {/* Clean counter badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{PORTFOLIO_ITEMS.length} Flagship Deployments</span>
            </span>
          </div>
        </div>

        {/* Layout: Left Case Selector + Right Deep-Dive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Column: Project Thumbnails / Cards */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[420px] sm:max-h-[500px] lg:max-h-[660px] overflow-y-auto pr-1 sm:pr-2">
            {PORTFOLIO_ITEMS.map((item) => {
              const isSelected = item.id === activeCase.id;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.012, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/70 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  {/* Visual Thumbnail */}
                  {item.imageUrl && (
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 shadow-md">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-cyan-400">
                        {getCategoryIcon(item.category)}
                        <span>{item.categoryLabel}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold shrink-0">
                        {item.metrics.value}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white font-display truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {item.summary}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Selected Case Study Deep Dive with Picture & Motion */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-md overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Hero Photo Banner of the active case */}
                {activeCase.imageUrl && (
                  <div className="relative h-40 sm:h-52 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-7 lg:-mt-7 mb-4 overflow-hidden rounded-t-2xl sm:rounded-t-3xl group">
                    <img
                      src={activeCase.imageUrl}
                      alt={activeCase.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    
                    {/* Floating pill tags on image */}
                    <div className="absolute top-3.5 left-4 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/85 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 backdrop-blur-md shadow-md">
                        {activeCase.categoryLabel}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/85 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold backdrop-blur-md shadow-md">
                        {activeCase.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-700/80 text-[11px] text-white font-semibold backdrop-blur-md shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live Field Deployment
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        CASE {String(activeIndex + 1).padStart(2, '0')} OF {String(PORTFOLIO_ITEMS.length).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                        <button
                          type="button"
                          onClick={cyclePrevProject}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="Previous Project (circular loop)"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={cycleNextProject}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="Next Project (circular loop)"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-white">
                      {activeCase.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Client Profile: <span className="text-slate-200 font-medium">{activeCase.clientType}</span>
                    </p>
                  </div>

                  {/* Big Metric Badge */}
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-left sm:text-right shrink-0 self-start sm:self-auto">
                    <span className="text-xl sm:text-2xl font-black font-display text-emerald-300 block leading-none">
                      {activeCase.metrics.value}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mt-1">
                      {activeCase.metrics.label}
                    </span>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Operational Challenge</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {activeCase.challenge}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>The Bitso Engineered Solution</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {activeCase.solution}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-2">
                    Documented Commercial Results
                  </span>
                  <div className="space-y-1.5">
                    {activeCase.results.map((res, rIdx) => (
                      <motion.div
                        key={rIdx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rIdx * 0.06 }}
                        className="flex items-start gap-2 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-300 font-medium">Verified Client Project</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectAndInquire(activeCase.title)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <span>Request Similar Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
