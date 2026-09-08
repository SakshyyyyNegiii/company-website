import React from 'react';
import { BrandLogo } from './BrandLogo';
import { COMPANY_INFO } from '../data/content';
import { Phone, Mail, Globe, MapPin, ArrowUp, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          {/* Company Identity */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo size="md" />
            <p className="text-slate-200 text-base max-w-sm mt-3 leading-relaxed">
              {COMPANY_INFO.subheading}
            </p>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-sm max-w-md shadow-inner">
              <span className="font-bold text-cyan-300 block mb-1">Flagship Focus:</span>
              {COMPANY_INFO.flagshipTitle}
            </div>
            <div className="text-sm text-slate-300 font-medium">
              Leadership: <span className="text-white font-bold">{COMPANY_INFO.leadership.name}</span> ({COMPANY_INFO.leadership.role})
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-base">
              <li>
                <a href="#services" className="text-slate-300 hover:text-cyan-300 transition-colors">
                  Core Services & Tech Stack
                </a>
              </li>
              <li>
                <a href="#retail" className="text-slate-300 hover:text-cyan-300 transition-colors">
                  Retail Digitization Suite
                </a>
              </li>
              <li>
                <a href="#roi" className="text-slate-300 hover:text-cyan-300 transition-colors">
                  The Digital Loop & ROI Calculator
                </a>
              </li>
              <li>
                <a href="#roadmap" className="text-slate-300 hover:text-cyan-300 transition-colors">
                  5-Year Strategic Roadmap (2026–2031)
                </a>
              </li>
              <li>
                <a href="#why-us" className="text-slate-300 hover:text-cyan-300 transition-colors">
                  Why Partner With Bitso
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-300 hover:text-cyan-300 transition-colors">
                  Schedule Consultation
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Head Office */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Headquarters & Contact
            </h4>
            <div className="space-y-3 text-base text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{COMPANY_INFO.contact.fullAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex flex-wrap gap-2.5">
                  {COMPANY_INFO.contact.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="hover:text-cyan-300 transition-colors font-semibold"
                    >
                      +91 {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="hover:text-cyan-300 transition-colors font-medium"
                >
                  {COMPANY_INFO.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-teal-400 shrink-0" />
                <a
                  href={`https://${COMPANY_INFO.contact.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors font-medium"
                >
                  {COMPANY_INFO.contact.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Bitso Innovations. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span>New Delhi, India</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
