import React, { useState } from 'react';
import { CORE_SERVICES, ADVANCED_STACK } from '../data/content';
import {
  Code2,
  Smartphone,
  Globe,
  Database,
  Cloud,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'advanced'>('all');

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-sky-400" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-emerald-400" />;
      case 'Database':
        return <Database className="w-6 h-6 text-teal-400" />;
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-blue-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-cyan-300" />;
      default:
        return <Zap className="w-6 h-6 text-cyan-400" />;
    }
  };

  const servicesToDisplay: ServiceItem[] =
    activeTab === 'core'
      ? CORE_SERVICES
      : activeTab === 'advanced'
      ? ADVANCED_STACK
      : [...CORE_SERVICES, ...ADVANCED_STACK];

  return (
    <section id="services" className="py-20 md:py-28 bg-slate-950/80 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with exact wording from Slides 2 & 3 with Graphic Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14 sm:mb-16">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-4 uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Capabilities & Technology Portfolio</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.08]">
              About Us & Core Services
            </h2>
            <p className="mt-5 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl">
              How Bitso Innovations acts as a digital catalyst for enterprise growth. We engineer precision-built software ecosystems that eliminate inefficiency, accelerate revenue, and future-proof operations for enterprises ready to compete at scale.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md group">
              <div className="relative h-36 rounded-2xl overflow-hidden mb-4 border border-slate-700/70">
                <img
                  src="/images/hero_liquid_ribbon_1788799877334.jpg"
                  alt="Enterprise Cloud and AI Digital Catalyst"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
                <div className="absolute top-3 left-3.5">
                  <span className="text-xs font-mono uppercase text-cyan-300 font-bold bg-slate-950/90 px-2.5 py-1 rounded-md border border-cyan-500/40">
                    SLIDE 2 • CORE ARCHITECTURE
                  </span>
                </div>
                <div className="absolute bottom-3 left-3.5 right-3.5">
                  <div className="text-sm sm:text-base font-bold text-white drop-shadow">
                    Digital Catalyst for Enterprise Growth
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-300 pt-1 font-medium">
                <span>Tailored Solutions • Scalable Architecture</span>
                <span className="text-cyan-300 font-mono font-bold bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  9 Disciplines
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/90 mb-12">
          <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Full Stack ({CORE_SERVICES.length + ADVANCED_STACK.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('core')}
              className={`px-5 py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'core'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Core Services ({CORE_SERVICES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advanced')}
              className={`px-5 py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'advanced'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Advanced Stack ({ADVANCED_STACK.length})
            </button>
          </div>

          <div className="text-sm text-slate-300 flex items-center gap-2 font-medium">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Delivering the full enterprise spectrum under one roof</span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {servicesToDisplay.map((service) => (
            <div
              key={service.id}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/60 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-cyan-950/30 backdrop-blur-sm"
            >
              <div>
                {/* Icon & Category Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors shadow-inner">
                    {renderIcon(service.iconName)}
                  </div>
                  <span
                    className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full font-bold border ${
                      service.category === 'core'
                        ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                        : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {service.category === 'core' ? 'Core Foundation' : 'Advanced Stack'}
                  </span>
                </div>

                {/* Service Title & Description */}
                <h3 className="text-2xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="mt-3 text-base text-slate-200 leading-relaxed font-normal">
                  {service.description}
                </p>

                {/* Bullet Points from Slide */}
                <div className="mt-6 space-y-3 pt-5 border-t border-slate-800/80">
                  {service.bulletPoints.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Benefit Callout Box (as on Slide 2/3) */}
              <div className="mt-7 pt-5 border-t border-slate-800/90">
                {service.clientBenefit && (
                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                      Client Benefit
                    </span>
                    <span className="text-sm font-semibold text-slate-100 block leading-snug">
                      {service.clientBenefit}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="w-full inline-flex items-center justify-between text-sm font-bold text-slate-200 group-hover:text-cyan-300 py-2 transition-colors cursor-pointer"
                >
                  <span>Inquire about this capability</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-cyan-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner from Slide 3 */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-semibold">
              CORE SERVICES — ADVANCED STACK
            </div>
            <h4 className="text-xl font-bold text-white mt-1">
              End-to-End Enterprise Technology Spectrum Under One Roof
            </h4>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              From intelligent cloud infrastructure on AWS/Azure to predictive AI automation and CRM/ERP ledger systems, we build architectures engineered for high-velocity businesses.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectService('Full Enterprise Stack')}
            className="shrink-0 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all cursor-pointer"
          >
            Consult Our Engineering Team
          </button>
        </div>
      </div>
    </section>
  );
};
