import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS, PROCESS_STEPS } from '../data/content';
import { ArrowRight, ChevronRight, Terminal, Activity, Layers, Check } from 'lucide-react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';
import { InteractiveCard } from './InteractiveCard';

interface WorkSectionProps {
  onSelectProject: (projectTitle: string) => void;
}

interface ProjectArchitecture {
  flow: string[];
  metrics: string[];
  latency: string;
}

const PROJECT_ARCHITECTURES: Record<string, ProjectArchitecture> = {
  'grocery-omnichannel': {
    flow: [
      'Physical POS Scanner',
      'WebSocket Real-Time Bus',
      'Inventory Lock Engine',
      'Neighborhood Runner Dispatch',
    ],
    metrics: ['Sub-second inventory sync', '99.8% 45-min SLA', 'Zero overselling'],
    latency: '< 35ms Cloud POS Sync',
  },
  'fashion-webstore': {
    flow: [
      'Headless Next.js Storefront',
      'Global Edge CDN Cache',
      'POS VIP Loyalty Engine',
      'WhatsApp Cloud Webhooks',
    ],
    metrics: ['1.6s mobile load time', '+48% repeat checkout rate', 'Multi-outlet sync'],
    latency: '1.6s Mobile FCP',
  },
  'wholesale-erp': {
    flow: [
      'B2B Dealer Reorder Portal',
      'Multi-Entity Ledger Service',
      'GST E-Way API Adapter',
      '3-Warehouse Stock Sync',
    ],
    metrics: ['100% automated tax compliance', '65% faster payment cycle', 'Real-time cashflow'],
    latency: 'Real-time Ledger Sync',
  },
  'courier-routing': {
    flow: [
      'Store Counter Checkout',
      'Redis Geo Spatial Indexing',
      'Batch Rider Optimization',
      'Live GPS Telemetry App',
    ],
    metrics: ['42% logistics overhead reduction', 'Zero third-party commission', 'Sub-hour SLA'],
    latency: '< 15ms Telemetry Lag',
  },
};

const PROCESS_DELIVERABLES: Record<string, string[]> = {
  '01': [
    'System Architecture Topology',
    'OpenAPI 3.0 Contract Specification',
    'Entity-Relationship Database Schema',
    'Threat Modeling & Security Review',
  ],
  '02': [
    'Figma Component Design System',
    'Interactive 60fps Clickable Prototypes',
    'Mobile-First UX & Touch Ergonomics',
    'WCAG AA Accessibility Verification',
  ],
  '03': [
    'Modular Sprints with Clean Git Flow',
    'Automated CI/CD Test Pipelines',
    'Containerized Docker Microservices',
    'End-to-End Regression & Load Testing',
  ],
  '04': [
    'Zero-Downtime Blue/Green Cloud Release',
    'Prometheus / Grafana Live Telemetry',
    'CDN Edge Caching & Compression',
    '24/7 Dedicated Technical Response SLA',
  ],
};

export const WorkSection: React.FC<WorkSectionProps> = ({ onSelectProject }) => {
  const { ref, isVisible } = useFadeInOnScroll();
  const [activeArchId, setActiveArchId] = useState<string | null>(null);
  const [activeProcessStep, setActiveProcessStep] = useState<string>('01');

  const toggleArchitecture = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveArchId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="work" className="py-20 sm:py-28 relative border-t border-white/5">
      <div
        ref={ref}
        className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`}
      >
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            PROVEN ENGINEERING
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            From Idea to Digital Product
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Genuine enterprise systems deployed and driving measurable results.
          </p>
        </div>

        {/* 4 Genuine Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO_PROJECTS.map((project) => {
            const arch = PROJECT_ARCHITECTURES[project.id];
            const isArchVisible = activeArchId === project.id;

            return (
              <InteractiveCard
                key={project.id}
                onClick={() => onSelectProject(project.title)}
                glowColor="rgba(6, 182, 212, 0.2)"
                className="group rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/30 flex flex-col cursor-pointer"
              >
                {/* Project Image Frame */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-85 group-hover:opacity-100"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = (e.target as HTMLElement).nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Fallback container if image fails */}
                  <div className="hidden absolute inset-0 bg-slate-900 items-center justify-center text-cyan-400 font-mono text-xs">
                    {project.title}
                  </div>
                  {/* Scrim overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Latency & Metric Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold backdrop-blur-md">
                      {project.metrics.value} {project.metrics.label}
                    </div>
                  </div>

                  {arch && (
                    <div className="absolute top-4 right-4 hidden sm:block">
                      <div className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/15 text-[11px] font-mono text-emerald-300 backdrop-blur-md">
                        {arch.latency}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
                        {project.categoryLabel}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {project.clientType}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {project.summary}
                    </p>

                    {/* Interactive System Architecture Topology Flow */}
                    {isArchVisible && arch && (
                      <div className="my-4 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>System Architecture Flow:</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-slate-300">
                          {arch.flow.map((step, idx) => (
                            <React.Fragment key={idx}>
                              <span className="px-2 py-1 rounded bg-slate-900 border border-white/10 text-cyan-200">
                                {step}
                              </span>
                              {idx < arch.flow.length - 1 && (
                                <ChevronRight className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-white/10 flex flex-wrap gap-3 text-[11px] text-slate-400 font-mono">
                          {arch.metrics.map((m, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{m}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleArchitecture(e, project.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-[11px] font-mono text-cyan-300 transition-colors cursor-pointer"
                      >
                        {isArchVisible ? 'Hide Architecture' : 'View Architecture'}
                      </button>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Scope Similar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </InteractiveCard>
            );
          })}
        </div>

        {/* Process Flow: Discover → Design → Develop → Launch */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Interactive Engineering Process
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Click any stage to inspect our production deliverables and technical governance.
            </p>
          </div>

          {/* Animated Connecting Stage Laser Beam Track */}
          <div className="relative mb-6 hidden lg:block px-4">
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-400 transition-all duration-500 ease-out shadow-[0_0_16px_rgba(6,182,212,0.9)]"
                style={{
                  width:
                    activeProcessStep === '01'
                      ? '25%'
                      : activeProcessStep === '02'
                      ? '50%'
                      : activeProcessStep === '03'
                      ? '75%'
                      : '100%',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = activeProcessStep === step.step;

              return (
                <div
                  key={step.step}
                  onClick={() => setActiveProcessStep(step.step)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    >
                      {step.step}
                    </span>
                    {idx < PROCESS_STEPS.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-600 hidden lg:block" />
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {step.shortDesc}
                  </p>

                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {isActive ? '● ACTIVE INSPECTION' : 'CLICK TO INSPECT'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detailed Engineering Deliverables for Active Stage */}
          <div className="mt-6 p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/25 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
                  STAGE {activeProcessStep} DELIVERABLES & TECHNICAL GOVERNANCE
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                AUDITED & SECURE REPO
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROCESS_DELIVERABLES[activeProcessStep]?.map((deliverable, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="leading-snug">{deliverable}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
