import React from 'react';
import { ServicePageData, DEDICATED_SERVICES } from '../../data/servicePagesData';
import { Breadcrumbs } from '../Breadcrumbs';
import { SEOHead } from '../SEOHead';
import {
  Zap,
  Search,
  Layers,
  Smartphone,
  Server,
  Database,
  Shield,
  Award,
  Cpu,
  FileText,
  Users,
  Sparkles,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  Clock,
} from 'lucide-react';

interface ServiceDetailPageProps {
  serviceSlug: string;
  onNavigate: (href: string) => void;
  onStartProject: (serviceName?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceSlug,
  onNavigate,
  onStartProject,
}) => {
  const service = DEDICATED_SERVICES[serviceSlug] || DEDICATED_SERVICES['web-development'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'search':
        return <Search className="w-5 h-5 text-cyan-400" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'smartphone':
        return <Smartphone className="w-5 h-5 text-cyan-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-cyan-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-cyan-400" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-cyan-400" />;
      case 'award':
        return <Award className="w-5 h-5 text-cyan-400" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'fileText':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'users':
        return <Users className="w-5 h-5 text-cyan-400" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'messageCircle':
        return <MessageCircle className="w-5 h-5 text-cyan-400" />;
      case 'trendingUp':
        return <TrendingUp className="w-5 h-5 text-cyan-400" />;
      default:
        return <Zap className="w-5 h-5 text-cyan-400" />;
    }
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.keywords.join(', '),
    description: service.metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'Bitso Innovations',
      url: 'https://www.bitsoinnovations.com/',
      logo: 'https://www.bitsoinnovations.com/favicon.svg',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Worldwide',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.name,
      itemListElement: service.features.map((f) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: f.title,
          description: f.description,
        },
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen py-24 sm:py-28 relative">
      <SEOHead
        title={service.metaTitle}
        description={service.metaDescription}
        canonicalPath={`/services/${service.slug}`}
        keywords={service.keywords}
        schemaJson={[serviceSchema, faqSchema]}
      />

      {/* Dynamic Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Services', href: '/services' },
            { label: service.name, active: true },
          ]}
          onNavigate={onNavigate}
        />

        {/* Hero Section */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono mb-4 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{service.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {service.headline}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            {service.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onStartProject(service.name)}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>{service.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-sm transition-all cursor-pointer"
            >
              Consult with Technical Head
            </button>
          </div>
        </header>

        {/* Core Architectural Features Grid */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
            Engineering Standards & Deliverables
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {service.features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-sm group shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Step Engineering Lifecycle */}
        <section className="mb-20 p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Our 4-Stage Delivery Lifecycle
          </h2>
          <p className="text-sm text-slate-400 mb-8 max-w-2xl">
            Structured development sprints designed to avoid delays, scope creep, and unexpected production bugs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step) => (
              <div key={step.step} className="p-5 rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">
                  STAGE {step.step}
                </span>
                <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real-World Use Cases & Verified Benchmarks */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
            Real-World Deployments & Benchmarks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {service.useCases.map((uc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-mono border border-white/5 mb-3 inline-block">
                    {uc.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{uc.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {uc.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">Benchmark:</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{uc.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Service FAQ */}
        <section className="mb-20">
          <div className="flex items-center gap-2 text-white text-2xl sm:text-3xl font-bold mb-8">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {service.faq.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/70 border border-white/10"
              >
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {item.question}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Conversion Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Build Your {service.name}?
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl font-sans">
              Connect directly with our engineering heads for architectural consultation, feasibility analysis, and clear timelines.
            </p>
          </div>

          <button
            onClick={() => onStartProject(service.name)}
            className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all cursor-pointer shrink-0 inline-flex items-center gap-2"
          >
            <span>{service.primaryCtaText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </div>
  );
};
