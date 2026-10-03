import React, { useState } from 'react';
import { SERVICES, COMPANY_INFO } from '../data/content';
import {
  Globe,
  Code2,
  Sparkles,
  Smartphone,
  Layout,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Server,
  Zap,
} from 'lucide-react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

interface TechSpec {
  frameworks: string[];
  architecture: string;
  security: string;
  metric: string;
}

const TECH_SPECS: Record<string, TechSpec> = {
  'web-dev': {
    frameworks: ['React 19', 'Next.js 15', 'Tailwind v4', 'Edge CDN'],
    architecture: 'Sub-second dynamic SSR with distributed edge caching',
    security: 'Content Security Policy (CSP), automated SSL, DDoS mitigation',
    metric: '98+ Google Lighthouse Performance Score',
  },
  'software-dev': {
    frameworks: ['Go', 'Node.js', 'PostgreSQL 16', 'Docker', 'Kubernetes'],
    architecture: 'Event-driven microservices with gRPC and REST interoperability',
    security: 'Zero-trust IAM, mTLS encryption, automated vulnerability scans',
    metric: '99.99% production uptime SLA guarantee',
  },
  'ai-automation': {
    frameworks: ['Python', 'LangGraph', 'pgvector', 'FastAPI', 'Gemini APIs'],
    architecture: 'Autonomous agentic loops with semantic vector retrieval (RAG)',
    security: 'Strict data boundary isolation, prompt guardrails, zero training leakage',
    metric: '10x workflow cycle acceleration',
  },
  'app-dev': {
    frameworks: ['Flutter 3.x', 'React Native', 'SQLite WAL', 'Swift', 'Kotlin'],
    architecture: '60fps native Skia rendering with offline-first synchronization',
    security: 'Hardware biometric enclave, certificate pinning, encrypted local storage',
    metric: 'Sub-3s initial launch & instant offline persistence',
  },
  'ui-ux': {
    frameworks: ['Figma Tokens', 'Atomic Design', 'Radix Primitives', 'Storybook'],
    architecture: 'Multi-brand design system with automated developer token handoff',
    security: 'WCAG AA 4.5:1 accessible contrast & touch-target compliance',
    metric: 'Substantial boost in checkout completion & retention',
  },
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
}) => {
  const { ref, isVisible } = useFadeInOnScroll();
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-cyan-400" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-cyan-400" />;
      case 'Layout':
        return <Layout className="w-6 h-6 text-cyan-400" />;
      default:
        return <Code2 className="w-6 h-6 text-cyan-400" />;
    }
  };

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedServiceId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services" className="py-20 sm:py-28 relative border-t border-white/5 bg-slate-950/40">
      <div
        ref={ref}
        className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`}
      >
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            ENGINEERING & CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Everything You Need to Build Digital
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            From modern web storefronts to resilient microservices and autonomous AI agents.
          </p>
        </div>

        {/* 5 Concise Service Cards in a Balanced Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.slice(0, 3).map((service) => {
            const isExpanded = expandedServiceId === service.id;
            const spec = TECH_SPECS[service.id];

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service.title)}
                className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                      {getIcon(service.iconName)}
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                      PRODUCTION READY
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mb-2.5 group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Interactive Technical Spec Drawer */}
                  {isExpanded && spec && (
                    <div className="my-4 p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div>
                        <div className="font-mono text-[10px] text-cyan-400 uppercase">Core Stack</div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {spec.frameworks.map((f, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200 font-mono">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-slate-400 uppercase">Architecture</div>
                        <div className="text-[11px] text-slate-300 leading-snug">{spec.architecture}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-emerald-400 uppercase">Verified SLA / Benchmark</div>
                        <div className="text-[11px] text-emerald-300 font-medium">{spec.metric}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400 tracking-wide truncate max-w-[180px]">
                    {service.focus}
                  </div>
                  <button
                    onClick={(e) => toggleExpand(e, service.id)}
                    className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Specs' : 'Tech Specs'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Row of 2 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
          {SERVICES.slice(3, 5).map((service) => {
            const isExpanded = expandedServiceId === service.id;
            const spec = TECH_SPECS[service.id];

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service.title)}
                className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                      {getIcon(service.iconName)}
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                      PRODUCTION READY
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mb-2.5 group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Interactive Technical Spec Drawer */}
                  {isExpanded && spec && (
                    <div className="my-4 p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div>
                        <div className="font-mono text-[10px] text-cyan-400 uppercase">Core Stack</div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {spec.frameworks.map((f, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200 font-mono">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-slate-400 uppercase">Architecture</div>
                        <div className="text-[11px] text-slate-300 leading-snug">{spec.architecture}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-emerald-400 uppercase">Verified SLA / Benchmark</div>
                        <div className="text-[11px] text-emerald-300 font-medium">{spec.metric}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400 tracking-wide truncate max-w-[180px]">
                    {service.focus}
                  </div>
                  <button
                    onClick={(e) => toggleExpand(e, service.id)}
                    className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Specs' : 'Tech Specs'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Short Value Proposition */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {COMPANY_INFO.whyHeading}
              </h4>
              <p className="text-sm sm:text-base text-cyan-300 font-medium mt-0.5">
                {COMPANY_INFO.valueProposition}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectService('Full-Stack Digital Transformation')}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-white/15 text-xs sm:text-sm font-semibold whitespace-nowrap hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            Discuss Your Needs
          </button>
        </div>
      </div>
    </section>
  );
};
