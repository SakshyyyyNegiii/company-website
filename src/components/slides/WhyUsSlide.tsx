import React, { useState } from 'react';
import {
  Sparkles,
  Store,
  Layers,
  ShoppingBag,
  Truck,
  Users,
  Calculator,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { DIGITAL_LOOP_STEPS } from '../../data/content';
import { SlideId } from '../../types';
import { FaqAccordion } from '../FaqAccordion';

interface WhyUsSlideProps {
  onOpenConsultation: (topic?: string) => void;
  onNavigate: (slideId: SlideId) => void;
}

export const WhyUsSlide: React.FC<WhyUsSlideProps> = ({
  onOpenConsultation,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'roi' | 'loop' | 'features' | 'faq'>('roi');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // ROI Calculator Parameters
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(1500000); // 15 Lakhs
  const [storesCount, setStoresCount] = useState<number>(3);
  const [courierDeliveries, setCourierDeliveries] = useState<number>(60);

  // Dynamic Financial Calculations
  const annualRevenue = monthlyRevenue * 12;
  const estimatedLaborWasteMonthly = Math.round(monthlyRevenue * 0.045);
  const estimatedAnnualLaborSavings = estimatedLaborWasteMonthly * 12;
  const annualCourierSavings = courierDeliveries * 30 * 12 * 35; // Rs. 35 saved per delivery batch
  const totalAnnualSavings = estimatedAnnualLaborSavings + annualCourierSavings;
  const estimatedTransformationInvestment = Math.max(150000, storesCount * 75000);
  const paybackMonths = Math.max(1.2, Math.round((estimatedTransformationInvestment / (totalAnnualSavings / 12)) * 10) / 10);
  const threeYearNetRoi = Math.round(((totalAnnualSavings * 3 - estimatedTransformationInvestment) / estimatedTransformationInvestment) * 100);

  const formatCurrencyINR = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh`;
    return `₹${num.toLocaleString('en-IN')}`;
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
              Mathematical ROI modeling, closed-loop commerce, and zero-compromise enterprise engineering.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start md:self-auto shrink-0 text-xs overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('roi')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'roi'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive ROI Engine
            </button>
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

        {/* Tab 1: Interactive Real-Time ROI Engine */}
        {activeTab === 'roi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-in fade-in duration-300">
            {/* Left Column: Sliders */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Configure Your Business Metrics</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  Real-Time Model
                </span>
              </div>

              {/* Slider 1: Monthly Revenue */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Monthly Retail Revenue</span>
                  <span className="font-mono font-bold text-white text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {formatCurrencyINR(monthlyRevenue)}
                  </span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={10000000}
                  step={100000}
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>₹3 Lakh</span>
                  <span>₹50 Lakh</span>
                  <span>₹1 Crore</span>
                </div>
              </div>

              {/* Slider 2: Stores Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Physical Store Locations</span>
                  <span className="font-mono font-bold text-white text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {storesCount} Store{storesCount > 1 ? 's' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={storesCount}
                  onChange={(e) => setStoresCount(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 Store</span>
                  <span>10 Stores</span>
                  <span>25 Stores</span>
                </div>
              </div>

              {/* Slider 3: Courier Deliveries */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Daily Delivery Orders</span>
                  <span className="font-mono font-bold text-white text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {courierDeliveries} Orders / Day
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={300}
                  step={10}
                  value={courierDeliveries}
                  onChange={(e) => setCourierDeliveries(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10/day</span>
                  <span>150/day</span>
                  <span>300/day</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Projected Impact Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Projected Annual Commercial Gains
                </span>
                <span className="text-xs text-slate-300 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Payback: ~{paybackMonths} Months
                </span>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl font-black font-display text-white block">
                  {formatCurrencyINR(totalAnnualSavings)}
                </span>
                <span className="text-xs text-emerald-300 font-bold block mt-1">
                  Estimated Total Annual Overhead & Courier Recapture
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Labor & POS Savings</span>
                  <span className="text-base sm:text-lg font-bold font-mono text-white mt-0.5 block">
                    {formatCurrencyINR(estimatedAnnualLaborSavings)}
                  </span>
                  <span className="text-[10px] text-slate-500">Recaptured manual overhead</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 block">3-Year Net ROI</span>
                  <span className="text-base sm:text-lg font-bold font-mono text-cyan-300 mt-0.5 block">
                    +{threeYearNetRoi}%
                  </span>
                  <span className="text-[10px] text-slate-500">Based on standard scale rate</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenConsultation('ROI & Custom Enterprise Transformation Audit')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <span>Lock in This ROI Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('faq')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 underline cursor-pointer flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Scalability & FAQ →</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('portfolio')}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Case Studies →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 5-Step Digital Loop */}
        {activeTab === 'loop' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Step Navigation Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {DIGITAL_LOOP_STEPS.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                return (
                  <button
                    key={step.step}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/60 border-cyan-500/60 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">{step.step}</span>
                      {getLoopIcon(step.step)}
                    </div>
                    <div className="text-xs font-bold text-white truncate">{step.title}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Deep-Dive Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  <span>STAGE {currentLoopStep.step}</span>
                  <span>•</span>
                  <span>{currentLoopStep.tagline}</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  {currentLoopStep.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentLoopStep.description}
                </p>
              </div>

              <div className="md:col-span-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-center">
                <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Key Operational Metric
                </span>
                <span className="text-lg font-bold font-display text-emerald-300 block">
                  {currentLoopStep.metrics}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenConsultation(`Integration: ${currentLoopStep.title}`)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Incorporate into My Business</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Architectural Edge */}
        {activeTab === 'features' && (
          <div className="space-y-5 animate-in fade-in duration-300">
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
          </div>
        )}

        {/* Tab 4: Interactive Scalability & Transformation FAQ Accordion */}
        {activeTab === 'faq' && (
          <FaqAccordion
            onOpenConsultation={(topic) =>
              onOpenConsultation(topic || 'Scalability & Digital Transformation Consultation')
            }
            onNavigateROI={() => setActiveTab('roi')}
          />
        )}
      </div>
    </div>
  );
};
