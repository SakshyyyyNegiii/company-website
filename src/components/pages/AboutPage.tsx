import React from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { SEOHead } from '../SEOHead';
import { COMPANY_INFO, OFFICIAL_DISCLAIMER } from '../../data/content';
import {
  ShieldCheck,
  Code2,
  Sparkles,
  Users,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (href: string) => void;
  onOpenDisclaimer?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenDisclaimer }) => {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Bitso Innovations',
    description: 'Learn about Bitso Innovations: an independent IT solutions and custom software engineering company in New Delhi, India.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Bitso Innovations',
      url: 'https://www.bitsoinnovations.com/',
      foundingLocation: 'New Delhi, India',
    },
  };

  return (
    <div className="min-h-screen py-24 sm:py-28 relative">
      <SEOHead
        title="About Us | Independent IT Solutions & Software Company"
        description="Learn about Bitso Innovations: our technical philosophy, engineering standards, leadership team, and independent corporate IT operations."
        canonicalPath="/about"
        keywords={[
          'about Bitso Innovations',
          'IT solutions company Delhi',
          'independent software development firm',
          'Bitso Innovations leadership',
        ]}
        schemaJson={aboutSchema}
      />

      {/* Dynamic Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'About Us', active: true }]} onNavigate={onNavigate} />

        {/* Page Hero Header */}
        <header className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono mb-4 tracking-wider uppercase">
            <Building2 className="w-3.5 h-3.5" />
            <span>CORPORATE OVERVIEW & IDENTITY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineering High-Performance Digital Solutions for Modern Enterprises
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Bitso Innovations is an independent Information Technology (IT) firm headquartered in New Delhi. We specialize in custom software engineering, high-concurrency web platforms, cloud AI automation, and technical project development.
          </p>
        </header>

        {/* Corporate Independence Notice */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-amber-950/20 border border-amber-500/30 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-200">
                Independent IT Entity Declaration
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {OFFICIAL_DISCLAIMER.heading}. {OFFICIAL_DISCLAIMER.clarification}
              </p>
              {onOpenDisclaimer && (
                <button
                  onClick={onOpenDisclaimer}
                  className="mt-3 text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Read Full Official Legal Disclaimer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
            Our Engineering Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pristine Architecture</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                We write strict, type-safe code with modular microservices and modern design patterns to guarantee long-term maintainability.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sub-Second Execution</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Every API and web page is benchmarked for speed. We leverage edge CDN caching and in-memory Redis indexing to eliminate lag.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Direct Accountability</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                All client projects receive direct executive supervision from company leadership with clear delivery milestones and SLAs.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership & Team CTA */}
        <section className="mb-16 p-8 rounded-3xl bg-slate-900/70 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white">Meet Our Leadership Team</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Learn more about Founder & President Ch. Aman, Vice President of Business Development Jitendra Singh, and Technical / IT Head Tamanna Aggarwal.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/leadership')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs sm:text-sm shrink-0 transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>View Leadership</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Contact CTA */}
        <div className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/30">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Have a Project in Mind?</h2>
          <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
            Get in touch with our team in Laxmi Nagar, New Delhi for a comprehensive technical evaluation.
          </p>
          <button
            onClick={() => onNavigate('/contact')}
            className="mt-6 px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all cursor-pointer"
          >
            Contact Bitso Innovations
          </button>
        </div>
      </div>
    </div>
  );
};
