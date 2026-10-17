import React from 'react';
import { SectionId } from '../types';
import { BrandLogo } from './BrandLogo';
import { ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: SectionId) => void;
  onOpenDisclaimer?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDisclaimer }) => {
  return (
    <footer className="border-t border-white/10 bg-slate-950 pt-12 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Prominent Official Disclaimer Card */}
        <section
          aria-labelledby="footer-disclaimer-title"
          className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5 text-amber-400">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 id="footer-disclaimer-title" className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                Official Company Disclaimer
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[11px] font-mono">
              <span>IT & Software Development Sole Entity</span>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white font-semibold">
                BITSO Innovations is an independent Information Technology (IT) company
              </strong>{' '}
              specializing in technology solutions, software development, website development, and other IT-related services.
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/25 text-slate-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p>
                  We hereby clarify that our company has{' '}
                  <strong className="text-white font-semibold">
                    no association, affiliation, or involvement with cryptocurrency trading, forex trading, investment schemes, or any related financial trading activities.
                  </strong>{' '}
                  We do not provide trading services, investment advice, or financial brokerage services.
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs">
              Any individual, organization, or third party claiming to represent our company in connection with cryptocurrency, forex trading, or investment-related activities does so without our authorization, unless explicitly stated otherwise by us in writing. Our company operates solely as an IT and technology service provider. We shall not be held responsible for any financial transactions, losses, or commitments made by individuals or entities falsely using our company’s name.
            </p>
          </div>

          {onOpenDisclaimer && (
            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
              <span className="text-[11px] text-slate-500 font-mono">
                For official information, contact only authorized communication channels.
              </span>
              <button
                type="button"
                onClick={onOpenDisclaimer}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-all border border-white/5 hover:border-cyan-500/30 cursor-pointer"
              >
                <span>Read Full Legal Notice & Channels</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* Bottom Navigation & Brand Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          {/* Authentic Bitso Innovations Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="cursor-pointer text-left focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.99]"
            title="Bitso Innovations"
          >
            <BrandLogo size="sm" showSubtitle={true} />
          </button>

          {/* Navigation Links + Disclaimer link */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => onNavigate('work')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Work
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
            {onOpenDisclaimer && (
              <button
                onClick={onOpenDisclaimer}
                className="text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Disclaimer</span>
              </button>
            )}
          </div>

          {/* Copyright */}
          <div className="text-xs font-mono text-slate-500">
            © {new Date().getFullYear()} BITSO Innovations. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
