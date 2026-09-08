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
    appointmentsCount,
    openAuthModal,
    openAppointmentsDrawer,
    signOutUser,
    signInWithGooglePopup,
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
                      <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>My Appointments</span>
                      {appointmentsCount > 0 && (
                        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px]">
                          {appointmentsCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                    >
                      {userProfile?.photoURL || currentUser.photoURL ? (
                        <img
                          src={userProfile?.photoURL || currentUser.photoURL || ''}
                          alt={userProfile?.displayName || currentUser.displayName || 'User'}
                          className="w-6 h-6 rounded-lg object-cover border border-cyan-400/50"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs">
                          {(userProfile?.displayName || currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <span className="max-w-[100px] truncate text-slate-200">
                        {userProfile?.displayName || currentUser.displayName || 'Client'}
                      </span>
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white truncate max-w-[130px]">
                            {userProfile?.displayName || currentUser.displayName || 'Client Partner'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Synced
                          </span>
                        </div>
                        <div className="truncate text-[11px] text-slate-400">{currentUser.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAppointmentsDrawer();
                        }}
                        className="w-full mt-1.5 px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:bg-slate-800 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Booked Appointments</span>
                        </div>
                        {appointmentsCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold font-mono">
                            {appointmentsCount}
                          </span>
                        )}
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
                  {/* Quick Google Sign In */}
                  <button
                    type="button"
                    onClick={() => signInWithGooglePopup()}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer shadow-sm"
                    title="Sign in quickly with your Google Account"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Google Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Email</span>
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
                    className="w-full py-2.5 px-3 text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 rounded-xl flex items-center justify-center gap-2"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View My Appointments</span>
                    {appointmentsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px]">
                        {appointmentsCount}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signInWithGooglePopup();
                    }}
                    className="w-full py-2.5 px-3 text-xs font-bold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-center gap-2.5 shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('signin');
                      }}
                      className="py-2 px-3 text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center gap-1.5"
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

