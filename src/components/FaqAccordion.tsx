import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Server,
  Zap,
  Cpu,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Database,
  Lock,
  Layers,
  Activity,
  X,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS_DATA, FaqItem } from '../data/faqs';

interface FaqAccordionProps {
  onOpenConsultation: (topic?: string) => void;
  onNavigateToLoop?: () => void;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  onOpenConsultation,
  onNavigateToLoop,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'scale-multi-store': true, // Default first question open
  });

  const categories = [
    { id: 'all', label: 'All Topics', count: FAQS_DATA.length },
    { id: 'scalability', label: 'Scalability & Cloud', icon: Cpu },
    { id: 'migration', label: 'Zero-Downtime Migration', icon: RefreshCw },
    { id: 'security', label: 'Security & Compliance', icon: Lock },
    { id: 'timelines', label: 'Timelines & Rollout', icon: Clock },
    { id: 'integrations', label: 'Hardware & Logistics', icon: Layers },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.summary.toLowerCase().includes(q) ||
        faq.detailedAnswer.toLowerCase().includes(q) ||
        faq.takeaways.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    filteredFaqs.forEach((faq) => {
      next[faq.id] = true;
    });
    setExpandedIds(next);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'scalability':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'migration':
        return <RefreshCw className="w-4 h-4 text-emerald-400" />;
      case 'security':
        return <Lock className="w-4 h-4 text-amber-400" />;
      case 'timelines':
        return <Clock className="w-4 h-4 text-sky-400" />;
      case 'integrations':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Visual Architectural Scalability Topology Card (Graphic Showcase) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-cyan-950/40 border border-slate-800 p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        {/* Background glow lines */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enterprise Scalability Benchmark</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Engineered for Elastic Growth & High-Concurrency Retail
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every client deployment is backed by containerized multi-node clusters, sub-second event replication, and zero-downtime legacy database migration.
            </p>
          </div>

          {/* Interactive Scalability Architecture Graphic */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/30 text-center flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>Node Scale</span>
              </div>
              <div className="text-lg sm:text-xl font-black font-display text-white mt-1">
                1 - 1,000+
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">Auto-Elastic Stores</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/90 border border-emerald-500/30 text-center flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Sync Latency</span>
              </div>
              <div className="text-lg sm:text-xl font-black font-display text-emerald-300 mt-1">
                &lt; 40ms
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">Counter Event Bus</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/90 border border-sky-500/30 text-center flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-sky-400 uppercase font-semibold">
                <RefreshCw className="w-3 h-3 text-sky-400" />
                <span>Migration Gap</span>
              </div>
              <div className="text-lg sm:text-xl font-black font-display text-sky-300 mt-1">
                0 Min
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">Zero Checkout Stoppage</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/90 border border-indigo-500/30 text-center flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>SLA Uptime</span>
              </div>
              <div className="text-lg sm:text-xl font-black font-display text-indigo-300 mt-1">
                99.99%
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">High-Availability Cloud</div>
            </div>
          </div>
        </div>

        {/* Visual Multi-Tier Topology Schematic */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 hidden sm:grid grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold shrink-0">
              01
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block">Edge Store POS</span>
              <span className="text-[10px] text-slate-400">Offline SQLite Cache</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-mono text-[10px] font-bold shrink-0">
              02
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block">Real-Time Event Mesh</span>
              <span className="text-[10px] text-slate-400">WebSocket / gRPC</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-6 h-6 rounded-lg bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-300 font-mono text-[10px] font-bold shrink-0">
              03
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block">Docker Clusters</span>
              <span className="text-[10px] text-slate-400">K8s Auto-Scale Nodes</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-mono text-[10px] font-bold shrink-0">
              04
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block">Multi-Region DB</span>
              <span className="text-[10px] text-slate-400">AES-256 Cloud Replicas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls: Search & Category Filter Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Expand Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search architecture, migration, POS..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 text-xs">
            <button
              type="button"
              onClick={expandAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] font-medium cursor-pointer transition-colors"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] font-medium cursor-pointer transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-bold text-white">No matching questions found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find an answer matching &ldquo;{searchQuery}&rdquo;. Contact our solutions engineering team directly for custom advice.
            </p>
            <button
              type="button"
              onClick={() => onOpenConsultation(`Custom inquiry: ${searchQuery}`)}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 cursor-pointer"
            >
              <span>Ask Our Technical Director</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = !!expandedIds[faq.id];

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900/95 border-cyan-500/50 shadow-xl shadow-cyan-950/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Clickable Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer select-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      {getCategoryIcon(faq.category)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-cyan-400">
                          {faq.categoryLabel}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                          {faq.graphicBadge}
                        </span>
                        {faq.metricBadge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-semibold">
                            {faq.metricBadge.label}: {faq.metricBadge.value}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white font-display">
                        {faq.question}
                      </h4>
                      {!isExpanded && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {faq.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white shrink-0 mt-1">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
                        {/* Summary Callout */}
                        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 font-medium">
                          <span className="font-bold text-cyan-400 mr-1.5">Executive Summary:</span>
                          {faq.summary}
                        </div>

                        {/* Detailed Technical Answer */}
                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {faq.detailedAnswer}
                        </div>

                        {/* Key Takeaways */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                            Key Architectural Commitments
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {faq.takeaways.map((takeaway, tIdx) => (
                              <div
                                key={tIdx}
                                className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{takeaway}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Footer for this specific question */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="text-slate-400 text-[11px]">
                            Need a custom configuration for your business?
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onOpenConsultation(`Consultation on: ${faq.question}`)
                              }
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                            >
                              <span>Consult on This Architecture</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Inquiries Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Have a Specific Store Setup or Legacy Architecture?</span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Our principal solutions architect will inspect your existing setup and supply an end-to-end zero-downtime blueprint.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onNavigateToLoop && (
            <button
              type="button"
              onClick={onNavigateToLoop}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
            >
              Explore 5-Step Loop
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenConsultation('Custom Legacy Architecture Review')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 cursor-pointer shadow-md"
          >
            <span>Book Free Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
