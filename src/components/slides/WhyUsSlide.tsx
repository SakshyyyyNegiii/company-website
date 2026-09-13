import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Store,
  Layers,
  ShoppingBag,
  Truck,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  HelpCircle,
  Repeat,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Server,
  Activity,
  RotateCw,
} from 'lucide-react';
import { DIGITAL_LOOP_STEPS } from '../../data/content';
import { SlideId } from '../../types';
import { FaqAccordion } from '../FaqAccordion';
import { api, DigitalLoopTelemetryResponse } from '../../lib/api';

interface WhyUsSlideProps {
  onOpenConsultation: (topic?: string) => void;
  onNavigate: (slideId: SlideId) => void;
}

export const WhyUsSlide: React.FC<WhyUsSlideProps> = ({
  onOpenConsultation,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'loop' | 'features' | 'faq'>('loop');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isLoopAutoCycle, setIsLoopAutoCycle] = useState<boolean>(true);

  // Backend telemetry state
  const [telemetry, setTelemetry] = useState<DigitalLoopTelemetryResponse | null>(null);

  // Poll backend loop telemetry
  useEffect(() => {
    let mounted = true;
    const fetchLoopTelemetry = async () => {
      try {
        const data = await api.getDigitalLoopTelemetry();
        if (mounted) setTelemetry(data);
      } catch (e) {
        // Fallback silently
      }
    };
    fetchLoopTelemetry();
    const interval = setInterval(fetchLoopTelemetry, 8000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-Cycle Loop Effect
  useEffect(() => {
    if (!isLoopAutoCycle || activeTab !== 'loop') return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % DIGITAL_LOOP_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isLoopAutoCycle, activeTab]);

  const cycleNextStep = () => {
    setActiveStepIndex((prev) => (prev + 1) % DIGITAL_LOOP_STEPS.length);
  };

  const cyclePrevStep = () => {
    setActiveStepIndex((prev) => (prev - 1 + DIGITAL_LOOP_STEPS.length) % DIGITAL_LOOP_STEPS.length);
  };

  const getLoopIcon = (step: string) => {
    switch (step) {
      case '01':
        return <Store className="w-5 h-5 text-cyan-400" />;
      case '02':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case '03':
        return <ShoppingBag className="w-5 h-5 text-sky-400" />;
      case '04':
        return <Truck className="w-5 h-5 text-teal-400" />;
      case '05':
        return <Users className="w-5 h-5 text-indigo-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const currentLoopStep = DIGITAL_LOOP_STEPS[activeStepIndex];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header with Sub-view Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Slide 04 • Commercial Value & Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight">
              Why Choose Bitso Innovations
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              5-step closed-loop commerce, proprietary retail features, and battle-tested enterprise engineering.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start md:self-auto shrink-0 text-xs overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('loop')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'loop'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5-Step Digital Loop
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'features'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architectural Edge
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === 'faq'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scalability & FAQs</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tabbed Content with Motion */}
        <AnimatePresence mode="wait">
          {/* Tab 1: 5-Step Digital Loop */}
          {activeTab === 'loop' && (
          <motion.div
            key="loop"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Top Loop Controller Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-5 sm:py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-cyan-300">
                  Continuous Omnichannel Lifecycle
                </span>
                {telemetry && (
                  <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                    Cycle #{telemetry.cycleCount} Active
                  </span>
                )}
              </div>

              {/* Loop Controls: Prev, Next, and Auto-Cycle Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLoopAutoCycle((p) => !p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isLoopAutoCycle
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isLoopAutoCycle ? 'Pause auto-cycle loop' : 'Start auto-cycling stages (4.5s)'}
                >
                  {isLoopAutoCycle ? <Pause className="w-3 h-3 text-cyan-400" /> : <Play className="w-3 h-3" />}
                  <span>{isLoopAutoCycle ? 'Auto-Cycle Active' : 'Auto-Cycle Paused'}</span>
                </button>

                <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                  <button
                    type="button"
                    onClick={cyclePrevStep}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Previous Stage (loops to 05 if at 01)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-300 px-1">
                    {currentLoopStep.step}/05
                  </span>
                  <button
                    type="button"
                    onClick={cycleNextStep}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Next Stage (loops to 01 if at 05)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step Navigation Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {DIGITAL_LOOP_STEPS.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                const stageTelemetry = telemetry?.stages.find((s) => s.step === step.step);
                return (
                  <button
                    key={step.step}
                    type="button"
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setIsLoopAutoCycle(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isActive
                        ? 'bg-cyan-950/70 border-cyan-500/70 shadow-lg ring-1 ring-cyan-500/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pulse" />
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">{step.step}</span>
                      {getLoopIcon(step.step)}
                    </div>
                    <div className="text-xs font-bold text-white truncate">{step.title}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{step.tagline}</div>
                    {stageTelemetry && (
                      <div className="text-[9px] font-mono text-emerald-400 mt-1 flex items-center justify-between">
                        <span>{stageTelemetry.latency}</span>
                        <span className="text-slate-500">•</span>
                        <span>{stageTelemetry.status}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Step Deep-Dive Card with Circular Loop Navigation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLoopStep.step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    <span>STAGE {currentLoopStep.step} OF 05</span>
                    <span>•</span>
                    <span>{currentLoopStep.tagline}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    {currentLoopStep.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentLoopStep.description}
                  </p>
                  
                  {/* Step Cycle Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cyclePrevStep}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous Stage</span>
                    </button>
                    <button
                      type="button"
                      onClick={cycleNextStep}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Next Stage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4 p-5 rounded-2xl bg-slate-950 border border-slate-800/90 text-center space-y-2">
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Key Operational Metric
                  </span>
                  <span className="text-xl font-bold font-display text-emerald-300 block">
                    {currentLoopStep.metrics}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(`Integration: ${currentLoopStep.title}`)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Incorporate into My Business</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Closed-Loop Continuity Connector */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>
                  <strong className="text-white">Closed-Loop Reinforcement:</strong> Stage 05 (Automated Retention & Loyalty) automatically recirculates customer repurchase data back into Stage 01 (Storefront & Omnichannel Footfall).
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveStepIndex(0);
                  setIsLoopAutoCycle(true);
                }}
                className="shrink-0 px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-900 transition-colors cursor-pointer"
              >
                Restart Cycle at Stage 01 ↻
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Architectural Edge */}
        {activeTab === 'features' && (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-colors shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-display text-white mb-2">
                  Sub-Second POS & Cloud Sync
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cash counter barcode scans reconcile across all online channels and warehouse ledgers within 40 milliseconds, eliminating stockouts.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
                  ● Millisecond Event Stream
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-colors shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-display text-white mb-2">
                  Zero-Trust Bank Encryption
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Strict AES-256 encrypted payload transfers, tokenized customer data, and secure Indian payment gateway integrations (UPI, QR, NetBanking).
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-300">
                  ● RBI / NPCI Standard Ready
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition-colors shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-display text-white mb-2">
                  Offline-First Resilience
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Frontline retail store counters continue billing and dispatching during local internet outages, auto-syncing as soon as connection restores.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-sky-300">
                  ● Zero Checkout Stoppage
                </div>
              </div>
            </div>

            {/* Link to FAQ */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Have questions about multi-store scale, legacy POS data migration, or offline cashier mode?</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('faq')}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/80 font-bold shrink-0 cursor-pointer transition-colors"
              >
                Browse Scalability FAQ & Architecture Diagram →
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Interactive Scalability & Transformation FAQ Accordion */}
        {activeTab === 'faq' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <FaqAccordion
              onOpenConsultation={(topic) =>
                onOpenConsultation(topic || 'Scalability & Digital Transformation Consultation')
              }
              onNavigateToLoop={() => setActiveTab('loop')}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
