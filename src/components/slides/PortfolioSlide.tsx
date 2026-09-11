import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'retail' | 'erp' | 'logistics' | 'ai'>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(PORTFOLIO_ITEMS[0].id);

  const filteredItems = PORTFOLIO_ITEMS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const activeCase =
    filteredItems.find((item) => item.id === selectedCaseId) || filteredItems[0] || PORTFOLIO_ITEMS[0];

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
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Slide 05 • Proven Client Deployments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight">
              Enterprise Portfolio & Case Studies
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Proven digital transformations delivered across Indian retail chains, distribution networks, and logistics fleets.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Projects ({PORTFOLIO_ITEMS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('retail')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'retail'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Retail & E-commerce
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('erp')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'erp'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Enterprise ERP
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('logistics')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'logistics'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Logistics Fleet
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('ai')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'ai'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              AI & Automation
            </button>
          </div>
        </div>

        {/* Layout: Left Case Selector + Right Deep-Dive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Project Thumbnails / Cards */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[58vh] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = item.id === activeCase.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-cyan-400">
                      {getCategoryIcon(item.category)}
                      <span>{item.categoryLabel}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold">
                      {item.metrics.value}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white font-display">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Case Study Deep Dive */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  {activeCase.categoryLabel} • {activeCase.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {activeCase.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client Profile: <span className="text-slate-200 font-medium">{activeCase.clientType}</span>
                </p>
              </div>

              {/* Big Metric Badge */}
              <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-right">
                <span className="text-2xl font-black font-display text-emerald-300 block leading-none">
                  {activeCase.metrics.value}
                </span>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mt-1">
                  {activeCase.metrics.label}
                </span>
              </div>
            </div>

            {/* Challenge & Solution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
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
                  <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </div>
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <span>Request Similar Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
