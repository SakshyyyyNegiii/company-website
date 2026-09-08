import React, { useState, useId } from 'react';
import { DIGITAL_LOOP_STEPS } from '../data/content';
import {
  TrendingUp,
  Store,
  FileSpreadsheet,
  CreditCard,
  Truck,
  HeartHandshake,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface RoiAndLoopSectionProps {
  onOpenConsultation: () => void;
}

export const RoiAndLoopSection: React.FC<RoiAndLoopSectionProps> = ({ onOpenConsultation }) => {
  const storeCountId = useId();
  const monthlyExpenseId = useId();
  // State for interactive ROI calculator
  const [storeCount, setStoreCount] = useState<number>(3);
  const [monthlyExpenseLakhs, setMonthlyExpenseLakhs] = useState<number>(4); // in Lakhs INR

  // Math based on Slide 5: 40% Overhead Reduction
  const monthlyOverheadTotal = storeCount * monthlyExpenseLakhs; // In Lakhs
  const monthlySavings = monthlyOverheadTotal * 0.4;
  const annualSavings = monthlySavings * 12;
  const onboardingTimelineWeeks = Math.max(2, Math.ceil(storeCount * 0.75));

  const getLoopIcon = (stepNumber: string) => {
    switch (stepNumber) {
      case '01':
        return <Store className="w-5 h-5 text-cyan-400" />;
      case '02':
        return <FileSpreadsheet className="w-5 h-5 text-sky-400" />;
      case '03':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case '04':
        return <Truck className="w-5 h-5 text-teal-400" />;
      case '05':
        return <HeartHandshake className="w-5 h-5 text-cyan-300" />;
      default:
        return <Store className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="roi" className="py-20 md:py-28 bg-slate-950/90 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header from Slide 5 */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-4 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Financial Leverage & Efficiency</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.08]">
            Commercial Advantage & Client ROI
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-slate-200 leading-relaxed">
            Why partnering with us makes massive financial sense. Traditional retailers gain the exact tech leverage and operational visibility needed to battle massive e-commerce giants, while retaining local trust.
          </p>
        </div>

        {/* Value Proposition Hero Card & Top Stats from Slide 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-16">
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-9 flex flex-col justify-between shadow-2xl backdrop-blur-md">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold block mb-2">
                VALUE PROPOSITION
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-5">
                Leveling the Field with Digital-Native Monopolies
              </h3>
              <blockquote className="text-slate-200 text-base sm:text-lg leading-relaxed border-l-2 border-cyan-400 pl-4 sm:pl-5 italic">
                &ldquo;Our solutions empower brick-and-mortar businesses to compete on equal footing with digital-native competitors through seamless omni-channel integration, real-time inventory visibility, and customer-centric automation.&rdquo;
              </blockquote>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-5 text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero inventory reconciliation mismatch
              </span>
              <span className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Preserve trusted offline neighborhood equity
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {/* Stat 1: 40% Overhead Reduction */}
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-7 relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="text-5xl sm:text-6xl font-black font-display text-cyan-400 tracking-tight">
                40%
              </div>
              <div className="text-xl font-bold font-display text-white mt-2">
                Overhead Reduction
              </div>
              <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">
                Average operational cost savings delivered to enterprise retail clients through automation and centralized ledger controls.
              </p>
            </div>

            {/* Stat 2: 500+ Store Onboarding */}
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-7 relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="text-5xl sm:text-6xl font-black font-display text-emerald-400 tracking-tight">
                500+
              </div>
              <div className="text-xl font-bold font-display text-white mt-2">
                Store Onboarding Target
              </div>
              <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">
                Regional retail outlets and supermarkets scheduled for end-to-end digital infrastructure transformation in Year 1 alone.
              </p>
            </div>
          </div>
        </div>

        {/* The Digital Loop (Step 01 - 05) from Slide 5 */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold">
                CONTINUOUS RETENTION ENGINE
              </span>
              <h3 className="text-3xl font-bold font-display text-white mt-1">
                The Digital Loop
              </h3>
            </div>
            <span className="text-sm text-slate-300 font-medium hidden sm:inline">
              5 Connected Stages from Shelf to Repeat Retention
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5">
            {DIGITAL_LOOP_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/30 backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800">
                      Step {item.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 transition-colors shadow-inner">
                      {getLoopIcon(item.step)}
                    </div>
                  </div>

                  <h4 className="text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-sm font-semibold text-cyan-300/90 mt-1">
                    {item.tagline}
                  </p>
                  <p className="text-sm text-slate-200 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-800/90 text-xs font-mono font-bold text-emerald-300">
                  ✓ {item.metrics}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Client ROI & Savings Calculator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shrink-0 shadow-inner">
                <Calculator className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Interactive Operational Savings Calculator
                </h3>
                <p className="text-sm sm:text-base text-slate-300 mt-1 font-normal">
                  Simulate your store network&apos;s expected 40% overhead reduction with Bitso infrastructure.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3.5 py-1.5 rounded-xl border border-cyan-500/40 font-bold self-start md:self-auto">
              Based on Bitso 40% Client Benchmark
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-7">
              {/* Store Count Slider */}
              <div>
                <div className="flex justify-between items-center mb-2.5 text-base font-semibold">
                  <label htmlFor={storeCountId} className="text-slate-100">
                    Number of Retail Stores / Outlets:
                  </label>
                  <span className="text-cyan-300 font-mono text-lg font-bold px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg">
                    {storeCount} {storeCount === 1 ? 'Store' : 'Stores'}
                  </span>
                </div>
                <input
                  id={storeCountId}
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={storeCount}
                  onChange={(e) => setStoreCount(parseInt(e.target.value, 10))}
                  aria-label="Number of Retail Stores or Outlets"
                  className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>1 Store</span>
                  <span>10 Stores</span>
                  <span>25 Stores</span>
                </div>
              </div>

              {/* Monthly Overhead Slider */}
              <div>
                <div className="flex justify-between items-center mb-2.5 text-base font-semibold">
                  <label htmlFor={monthlyExpenseId} className="text-slate-100">
                    Est. Monthly Operating Overhead Per Store:
                  </label>
                  <span className="text-emerald-400 font-mono text-lg font-bold px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg">
                    ₹{monthlyExpenseLakhs} Lakhs
                  </span>
                </div>
                <input
                  id={monthlyExpenseId}
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={monthlyExpenseLakhs}
                  onChange={(e) => setMonthlyExpenseLakhs(parseFloat(e.target.value))}
                  aria-label="Estimated Monthly Operating Overhead Per Store in Lakhs INR"
                  className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>₹1 Lakh</span>
                  <span>₹7.5 Lakhs</span>
                  <span>₹15 Lakhs</span>
                </div>
              </div>

              <div className="text-sm text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                <span className="text-white font-bold block mb-1">Where do the savings come from?</span>
                Centralized POS inventory sync eliminates manual stock taking, automated WhatsApp marketing cuts agency ad spend, and neighborhood routing eliminates delivery middlemen.
              </div>
            </div>

            {/* Calculated Output Display */}
            <div className="lg:col-span-6 bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 mb-6">
                <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5">
                  <div className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Est. Monthly Savings
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-display text-cyan-400 mt-1.5">
                    ₹{monthlySavings.toFixed(1)} L
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">
                    40% operational efficiency
                  </div>
                </div>

                <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5">
                  <div className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Est. Annual ROI Gains
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400 mt-1.5">
                    ₹{annualSavings >= 100 ? `${(annualSavings / 100).toFixed(2)} Cr` : `${annualSavings.toFixed(1)} L`}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">
                    Compounded over 12 months
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-300 mb-7">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Total Store Network Overhead:</span>
                  <span className="font-bold text-white">₹{monthlyOverheadTotal.toFixed(1)} Lakhs / mo</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Projected Onboarding Time:</span>
                  <span className="font-bold text-cyan-300">~{onboardingTimelineWeeks} Weeks complete deployment</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Implementation Oversight:</span>
                  <span className="font-bold text-emerald-300">Direct Founding Team Mentorship</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenConsultation}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:brightness-110 active:scale-[0.99] rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                <span>Request Custom ROI Audit for {storeCount} Stores</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
