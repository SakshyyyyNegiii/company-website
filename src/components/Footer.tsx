import React from 'react';
import { SectionId } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (section: SectionId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Authentic Bitso Innovations Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="cursor-pointer text-left focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.99]"
          title="Bitso Innovations"
        >
          <BrandLogo size="sm" showSubtitle={true} />
        </button>

        {/* Minimal Navigation Mirror */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
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
        </div>

        {/* Copyright */}
        <div className="text-xs font-mono text-slate-500">
          © {new Date().getFullYear()} Bitso Innovations. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
