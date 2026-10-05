import React, { useState, useEffect, useRef } from 'react';
import { SectionId } from '../types';
import {
  Menu,
  X,
  ArrowUpRight,
  User,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  onStartProject: () => void;
  onOpenDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onStartProject,
  onOpenDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userProfile, openAuthModal, signOutUser } = useAuth();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: SectionId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'work', label: 'Work' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: SectionId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const displayName =
    currentUser?.displayName ||
    userProfile?.displayName ||
    currentUser?.email?.split('@')[0] ||
    'Client';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Authentic Bitso Innovations Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="cursor-pointer text-left focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.99]"
          title="Bitso Innovations"
        >
          <BrandLogo size="sm" showSubtitle={false} />
        </button>

        {/* Zone 2: Minimal Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors relative py-1 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            /* Authenticated State: User Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 hover:border-cyan-500/40 text-xs transition-all cursor-pointer shadow-sm"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={displayName}
                    className="w-5 h-5 rounded-full object-cover border border-cyan-400/50"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="text-slate-200 font-medium max-w-[120px] truncate">
                  {displayName}
                </span>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                  {/* User Info Header */}
                  <div className="px-4 py-2.5 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] font-mono text-slate-400 truncate">
                      {currentUser.email || userProfile?.email}
                    </p>
                    <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                      {userProfile?.role || 'Client Partner'}
                    </span>
                  </div>

                  {/* Dropdown Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        openAuthModal('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onOpenDashboard) onOpenDashboard();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-sky-400" />
                      <span>Dashboard</span>
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-1">
                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await signOutUser();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated State: Sign In & Sign Up Options */
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('signin')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-transparent hover:border-white/15 hover:bg-slate-900/60"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => openAuthModal('signup')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          <button
            onClick={onStartProject}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-white/10 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-base font-medium py-2 transition-colors cursor-pointer ${
                  activeSection === item.id ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-3">
            {currentUser ? (
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      {currentUser.email || userProfile?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('profile');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard?.();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dashboard</span>
                  </button>
                </div>

                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await signOutUser();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-xs cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-medium text-xs cursor-pointer hover:bg-cyan-900 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartProject();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/25 cursor-pointer transition-colors"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
