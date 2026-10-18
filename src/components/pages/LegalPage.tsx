import React from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { SEOHead } from '../SEOHead';
import { COMPANY_INFO, OFFICIAL_DISCLAIMER } from '../../data/content';
import { ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onNavigate: (href: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  const isPrivacy = type === 'privacy';

  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const canonicalPath = isPrivacy ? '/privacy-policy' : '/terms';
  const description = isPrivacy
    ? 'Official Privacy Policy for Bitso Innovations. Learn how we handle enterprise data, consultation inquiries, and client confidentiality.'
    : 'Official Terms of Service for Bitso Innovations. Understand service scopes, intellectual property rights, and commercial policies.';

  return (
    <div className="min-h-screen py-24 sm:py-28 relative">
      <SEOHead
        title={`${title} | Bitso Innovations`}
        description={description}
        canonicalPath={canonicalPath}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: title, active: true }]} onNavigate={onNavigate} />

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-cyan-400 text-xs font-mono mb-3">
            {isPrivacy ? <Lock className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span>LEGAL & COMPLIANCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h1>

          <p className="mt-2 text-xs font-mono text-slate-400">
            Last Updated: October 18, 2026 • Bitso Innovations
          </p>
        </header>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-8 text-sm text-slate-300 leading-relaxed font-sans">
          {isPrivacy ? (
            <>
              <section>
                <h2 className="text-lg font-bold text-white mb-2">1. Overview & Scope</h2>
                <p>
                  Bitso Innovations ("Company", "we", "our") values the trust you place in us when sharing your personal and business information. This Privacy Policy outlines our practices regarding data collection, usage, and safeguarding across our website ({COMPANY_INFO.contact.website}) and client communications.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-2">2. Information We Collect</h2>
                <p>We collect information voluntarily provided by you when requesting consultations or contacting our technical teams:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  <li>Contact details: Name, email address, phone number, and organization name.</li>
                  <li>Project requirements: Technical specifications, desired milestones, and meeting format preferences.</li>
                  <li>Technical telemetry: Anonymized browser version, device viewport, and latency diagnostics.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-2">3. How We Use Your Data</h2>
                <p>
                  Your information is used exclusively to evaluate project feasibility, schedule executive consultations, provide technical customer support, and communicate deliverables. We never sell, rent, or trade your data to third-party marketing brokers.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-2">4. Data Confidentiality & Security</h2>
                <p>
                  All project details, source code repositories, and commercial conversations are protected by strict professional non-disclosure practices. In-flight data is encrypted with TLS 1.3, and cloud storage is secured with role-based authenticated rules.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-2">5. Contact Information</h2>
                <p>
                  For privacy-related questions or data deletion requests, contact us at {COMPANY_INFO.contact.email} or by phone at {COMPANY_INFO.contact.phone}.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-bold text-white mb-2">1. Terms of Service Acceptance</h2>
                <p>
                  By accessing the website of Bitso Innovations ({COMPANY_INFO.contact.website}) or engaging our engineering services, you agree to comply with and be bound by these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-2">2. Nature of Services & Independent Status</h2>
                <p>
                  Bitso Innovations is an independent Information Technology company providing software development, web engineering, cloud AI workflows, and technical advisory services. We hereby reiterate that our company has no affiliation with cryptocurrency trading, forex schemes, or financial trading activities.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-2">3. Intellectual Property Rights</h2>
                <p>
                  Upon final payment and contractual project handover, all bespoke source code, database architectures, and graphical assets developed specifically for the client become the exclusive property of the client, subject to custom project agreements.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-2">4. Limitation of Liability</h2>
                <p>
                  Bitso Innovations provides services under standard software engineering industry SLAs. In no event shall Bitso Innovations be liable for indirect, punitive, or consequential damages arising outside the agreed scope of work.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-2">5. Governing Law & Jurisdiction</h2>
                <p>
                  These Terms are governed by and construed in accordance with the laws of the National Capital Territory of Delhi, India.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
