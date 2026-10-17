import React, { useEffect } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  Globe,
  Instagram,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { OFFICIAL_DISCLAIMER } from '../data/content';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/10 shadow-2xl shadow-cyan-950/40 p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close disclaimer modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-mono uppercase tracking-wider mb-1.5">
              <Lock className="w-3 h-3" />
              <span>Official Regulatory & Legal Notice</span>
            </div>
            <h2
              id="disclaimer-modal-title"
              className="text-2xl font-bold text-white tracking-tight"
            >
              Company Disclaimer
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Core Identity Highlight */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-slate-200">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1 text-xs uppercase tracking-wider font-mono">
              <Building2 className="w-4 h-4" />
              <span>Independent IT & Technology Entity</span>
            </div>
            <p className="font-semibold text-white sm:text-base">
              BITSO Innovations is an independent Information Technology (IT) company
            </p>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              specializing in technology solutions, software development, website development, and other IT-related services.
            </p>
          </div>

          {/* Explicit Clarification Against Trading */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200">
            <div className="flex items-center gap-2 text-rose-400 font-bold mb-1.5 text-xs uppercase tracking-wider font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>No Cryptocurrency, Forex, or Investment Ties</span>
            </div>
            <p className="text-slate-200 font-medium">
              We hereby clarify that our company has <strong className="text-white font-bold">no association, affiliation, or involvement with cryptocurrency trading, forex trading, investment schemes, or any related financial trading activities.</strong> We do not provide trading services, investment advice, or financial brokerage services.
            </p>
          </div>

          {/* Unauthorized Representations */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Unauthorized Third-Party Representation
            </h4>
            <p className="text-slate-300">
              Any individual, organization, or third party claiming to represent our company in connection with cryptocurrency, forex trading, or investment-related activities does so without our authorization, unless explicitly stated otherwise by us in writing.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Operational Scope & Non-Liability
            </h4>
            <p className="text-slate-300">
              Our company operates solely as an IT and technology service provider. We shall not be held responsible for any financial transactions, losses, or commitments made by individuals or entities falsely using our company’s name.
            </p>
          </div>

          {/* Authorized Communication Channels */}
          <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authorized Official Communication Channels</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Only Official Touchpoints</span>
            </div>
            <p className="text-xs text-slate-400">
              For official information about our services, please contact us only through our authorized communication channels:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <a
                href={`https://${OFFICIAL_DISCLAIMER.authorizedChannels.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all"
              >
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{OFFICIAL_DISCLAIMER.authorizedChannels.website}</span>
              </a>

              <a
                href={`mailto:${OFFICIAL_DISCLAIMER.authorizedChannels.email}`}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all"
              >
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{OFFICIAL_DISCLAIMER.authorizedChannels.email}</span>
              </a>

              <a
                href={`tel:${OFFICIAL_DISCLAIMER.authorizedChannels.phone}`}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all"
              >
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{OFFICIAL_DISCLAIMER.authorizedChannels.phone}</span>
              </a>

              <a
                href="https://www.instagram.com/bitso_i.t?stkn=djUwOTUzZ2MxOW90"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{OFFICIAL_DISCLAIMER.authorizedChannels.instagram}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
