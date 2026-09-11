import React from 'react';
import { BrandLogo } from './BrandLogo';
import { COMPANY_INFO } from '../data/content';
import { Phone, Mail, Globe, MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-10 pb-24 sm:pb-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-900">
          {/* Company Identity */}
          <div className="lg:col-span-7 space-y-3">
            <BrandLogo size="md" />
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mt-2 leading-relaxed">
              {COMPANY_INFO.subheading}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs max-w-lg shadow-inner">
              <span className="font-bold text-cyan-300 block mb-0.5">Flagship Transformation:</span>
              {COMPANY_INFO.flagshipTitle}
            </div>
            <div className="text-xs text-slate-400">
              Co-Founder & Director: <span className="text-white font-bold">{COMPANY_INFO.leadership.name}</span>
            </div>
          </div>

          {/* Direct Contact & Head Office */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Delhi Headquarters
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{COMPANY_INFO.contact.fullAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex flex-wrap gap-2">
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
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="hover:text-cyan-300 transition-colors font-medium"
                >
                  {COMPANY_INFO.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-teal-400 shrink-0" />
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

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Bitso Innovations. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Enterprise Architecture
            </span>
            <span>New Delhi, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
