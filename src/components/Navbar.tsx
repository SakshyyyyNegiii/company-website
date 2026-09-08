import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  Menu,
  X,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  Mail,
  User as UserIcon,
  LogIn,
  LogOut,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/content';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const {
    currentUser,
    userProfile,
    openAuthModal,
    openAppointmentsDrawer,
    signOutUser,
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Retail Digitization', href: '#retail' },
    { name: 'Digital Loop & ROI', href: '#roi' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Why Partner', href: '#why-us' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Announcement top bar for flagship focus */}
      <div className="bg-slate-900/95 border-b border-cyan-500/25 py-2 px-4 text-center text-slate-200 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-cyan-300 font-bold uppercase tracking-wider text-xs bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Flagship Focus
        </span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="truncate text-slate-200 text-xs sm:text-sm font-medium">
          E-commerce Platform Transformation for Brick-and-Mortar Retail Stores
        </span>
        <a
          href="#retail"
          className="hidden md:inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-semibold text-xs sm:text-sm underline underline-offset-4 ml-1 transition-colors"
        >
          Explore Platform <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Sticky Navigation */}
      <header
        id="navbar-header"
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl shadow-black/50'
            : 'bg-slate-950/80 backdrop-blur-sm border-b border-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <a href="#" className="flex items-center focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-xl p-1 transition-transform hover:scale-[1.02]">
              <BrandLogo size="md" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[15px] font-semibold text-slate-200 hover:text-cyan-300 transition-colors duration-150 py-2 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-250 group-hover:w-full rounded-full" />
                </a>
              ))}
            </nav>

            {/* Desktop Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* User Authentication & Appointment State */}
              {currentUser ? (
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openAppointmentsDrawer}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-xl transition-all shadow-sm cursor-pointer"
                      title="View your booked transformation appointments"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>My Appointments</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs">
                        {(userProfile?.displayName || currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate text-slate-200">
                        {userProfile?.displayName || currentUser.displayName || 'Client'}
                      </span>
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
                        <div className="font-bold text-white truncate">
                          {userProfile?.displayName || currentUser.displayName || 'Client Partner'}
                        </div>
                        <div className="truncate text-[11px] text-slate-400">{currentUser.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAppointmentsDrawer();
                        }}
                        className="w-full mt-1 px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Booked Appointments</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenConsultation();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Schedule New Audit</span>
                      </button>
                      <div className="my-1 border-t border-slate-800" />
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOutUser();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-300 hover:bg-rose-950/40 rounded-xl flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 rounded-xl transition-all cursor-pointer"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                id="navbar-cta-button"
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:brightness-110 active:scale-[0.98] rounded-xl shadow-lg shadow-cyan-950/30 transition-all cursor-pointer"
              >
                <span>Schedule Audit</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                id="mobile-menu-toggle-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2.5 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150">
            {/* Mobile Auth Bar */}
            <div className="p-3 mb-3 rounded-2xl bg-slate-900 border border-slate-800">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      <div className="font-bold text-white">{userProfile?.displayName || currentUser.displayName || 'Client Partner'}</div>
                      <div className="text-slate-400 text-[11px]">{currentUser.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        signOutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs text-rose-400 font-semibold px-2 py-1 rounded bg-rose-950/60 border border-rose-500/40"
                    >
                      Sign Out
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAppointmentsDrawer();
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 rounded-xl flex items-center justify-center gap-2"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>View My Appointments</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signin');
                    }}
                    className="py-2 px-3 text-xs font-bold text-slate-200 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signup');
                    }}
                    className="py-2 px-3 text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-500/40 rounded-xl flex items-center justify-center"
                  >
                    <span>Create Account</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1 pb-4 border-b border-slate-800/80">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-900/60 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${COMPANY_INFO.contact.phones[0].replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2.5 w-full py-3 text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-700/60 rounded-lg"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Call: +91 {COMPANY_INFO.contact.phones[0]}
                </a>
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="flex items-center justify-center gap-2.5 w-full py-3 text-sm font-medium text-slate-300 bg-slate-900/50 border border-slate-800 rounded-lg"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  {COMPANY_INFO.contact.email}
                </a>
              </div>

              <button
                type="button"
                id="mobile-menu-cta-button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 rounded-lg"
              >
                Schedule Consultation
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

