import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSlider } from './components/ServicesSlider';
import { ServicesSection } from './components/ServicesSection';
import { WorkSection } from './components/WorkSection';
import { LeadershipSection } from './components/LeadershipSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ClientAuthModal } from './components/ClientAuthModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { CustomCursor } from './components/CustomCursor';
import { SectionId } from './types';
import { MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from './data/content';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { AboutPage } from './components/pages/AboutPage';
import { LegalPage } from './components/pages/LegalPage';
import { BlogListPage } from './components/pages/BlogListPage';
import { BlogPostPage } from './components/pages/BlogPostPage';
import { SeoDashboard } from './components/admin/SeoDashboard';
import { ENRICHED_BLOG_ARTICLES } from './data/enhancedBlogData';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('Web Development');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Universal Navigation Handler (Supports both SPA routes and Homepage sections)
  const navigateTo = useCallback(
    (target: string | SectionId) => {
      const targetStr = String(target);

      // Section anchors on homepage
      if (
        targetStr === 'home' ||
        targetStr === 'services' ||
        targetStr === 'work' ||
        targetStr === 'leadership' ||
        targetStr === 'contact'
      ) {
        if (targetStr === 'home') {
          if (currentPath !== '/') {
            window.history.pushState(null, '', '/');
            setCurrentPath('/');
          }
          setActiveSection('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // Target is an anchor on homepage
        if (currentPath !== '/') {
          window.history.pushState(null, '', `/#${targetStr}`);
          setCurrentPath('/');
          setTimeout(() => {
            const el = document.getElementById(targetStr);
            if (el) {
              const topOffset = 70;
              const pos = el.getBoundingClientRect().top + window.pageYOffset;
              window.scrollTo({ top: pos - topOffset, behavior: 'smooth' });
            }
          }, 100);
        } else {
          const el = document.getElementById(targetStr);
          if (el) {
            const topOffset = 70;
            const pos = el.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: pos - topOffset, behavior: 'smooth' });
            window.history.replaceState(null, '', `/#${targetStr}`);
          }
        }
        setActiveSection(targetStr as SectionId);
        return;
      }

      // Explicit route paths (e.g. /about, /blog, /admin/seo, /services/web-development)
      let resolvedPath = targetStr;
      if (targetStr === 'about') resolvedPath = '/about';
      if (targetStr === 'blog') resolvedPath = '/blog';
      if (targetStr === 'seo-dashboard') resolvedPath = '/admin/seo';

      if (window.location.pathname !== resolvedPath) {
        window.history.pushState(null, '', resolvedPath);
      }
      setCurrentPath(resolvedPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (resolvedPath === '/about') setActiveSection('about');
      else if (resolvedPath === '/blog' || resolvedPath.startsWith('/blog/')) setActiveSection('blog');
      else if (resolvedPath === '/admin/seo') setActiveSection('seo-dashboard');
      else setActiveSection('home');
    },
    [currentPath]
  );

  // Scroll spy on homepage
  useEffect(() => {
    if (currentPath !== '/') return;

    const sectionIds: SectionId[] = ['home', 'services', 'work', 'leadership', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  const handleOpenProjectModal = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsProjectModalOpen(true);
  };

  // Determine which page to render based on currentPath
  const renderPageContent = () => {
    // 0. SEO Strategy & Keyword Control Dashboard
    if (currentPath === '/admin/seo') {
      return <SeoDashboard onNavigate={navigateTo} />;
    }

    // 1. Dedicated About Us Page
    if (currentPath === '/about') {
      return (
        <AboutPage
          onNavigate={navigateTo}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      );
    }

    // 2. Blog Index Page
    if (currentPath === '/blog' || currentPath === '/blog/') {
      return (
        <BlogListPage
          onNavigate={navigateTo}
          onOpenConsultation={(s) => handleOpenProjectModal(s)}
        />
      );
    }

    // 3. Single Blog Post Page
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '').replace(/\/$/, '');
      const post = ENRICHED_BLOG_ARTICLES.find((p) => p.slug === slug);
      if (post) {
        return (
          <BlogPostPage
            post={post}
            onNavigate={navigateTo}
            onStartProject={(s) => handleOpenProjectModal(s)}
          />
        );
      }
      return (
        <BlogListPage
          onNavigate={navigateTo}
          onOpenConsultation={(s) => handleOpenProjectModal(s)}
        />
      );
    }

    // 4. Dedicated Service Pages (/services/web-development, etc.)
    if (currentPath.startsWith('/services/')) {
      const serviceSlug = currentPath.replace('/services/', '').replace(/\/$/, '');
      return (
        <ServiceDetailPage
          serviceSlug={serviceSlug}
          onNavigate={navigateTo}
          onStartProject={(s) => handleOpenProjectModal(s)}
        />
      );
    }

    // 5. Legal Pages
    if (currentPath === '/privacy-policy') {
      return <LegalPage type="privacy" onNavigate={navigateTo} />;
    }
    if (currentPath === '/terms') {
      return <LegalPage type="terms" onNavigate={navigateTo} />;
    }

    // 6. Direct /services route or /projects route
    if (currentPath === '/services') {
      return (
        <>
          <div className="pt-20">
            <ServicesSection
              onSelectService={(serviceTitle) => handleOpenProjectModal(serviceTitle)}
            />
          </div>
          <ContactSection
            initialService={selectedService}
            onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
          />
        </>
      );
    }

    if (currentPath === '/projects' || currentPath === '/work') {
      return (
        <>
          <div className="pt-20">
            <WorkSection
              onSelectProject={(projectTitle) => handleOpenProjectModal(projectTitle)}
            />
          </div>
          <ContactSection
            initialService={selectedService}
            onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
          />
        </>
      );
    }

    if (currentPath === '/leadership') {
      return (
        <>
          <div className="pt-20">
            <LeadershipSection
              onContactLeadership={(leaderName) =>
                handleOpenProjectModal(`Executive Consultation - ${leaderName}`)
              }
            />
          </div>
          <ContactSection
            initialService={selectedService}
            onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
          />
        </>
      );
    }

    if (currentPath === '/contact') {
      return (
        <div className="pt-20">
          <ContactSection
            initialService={selectedService}
            onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
          />
        </div>
      );
    }

    // Default: Complete Main Homepage
    return (
      <>
        {/* Section 1: Hero — First Impression */}
        <HeroSection
          onStartProject={() => handleOpenProjectModal()}
          onExploreServices={() => navigateTo('services')}
        />

        {/* Featured Solutions Animated Carousel Slider */}
        <ServicesSlider
          onSelectCard={(serviceTitle) => handleOpenProjectModal(serviceTitle)}
        />

        {/* Section 2: Services + Why Bitso (Combined) */}
        <ServicesSection
          onSelectService={(serviceTitle) => handleOpenProjectModal(serviceTitle)}
        />

        {/* Section 3: Work + Process (Combined) */}
        <WorkSection
          onSelectProject={(projectTitle) => handleOpenProjectModal(projectTitle)}
        />

        {/* Section 4: Our Leadership Team */}
        <LeadershipSection
          onContactLeadership={(leaderName) =>
            handleOpenProjectModal(`Executive Consultation - ${leaderName}`)
          }
        />

        {/* Section 5: Final CTA + Contact */}
        <ContactSection
          initialService={selectedService}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-x-hidden">
      {/* Custom Cursor with Dissipating Glowing Particle Trail */}
      <CustomCursor />

      {/* Slim Fixed Progress Bar at Very Top of Screen */}
      <ScrollProgressBar />

      {/* 1-Row Minimal Top Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateTo}
        onStartProject={() => handleOpenProjectModal()}
        onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-grow flex flex-col">
        {renderPageContent()}
      </main>

      {/* Minimal Footer with Permanent Disclaimer Card */}
      <Footer
        onNavigate={navigateTo}
        onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
      />

      {/* Instant Project Intake Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        preSelectedService={selectedService}
      />

      {/* Authentication Modal */}
      <ClientAuthModal />

      {/* Dedicated Legal Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
      />

      {/* Floating Direct WhatsApp Action */}
      <aside
        aria-label="Quick WhatsApp Consultation"
        className="fixed bottom-6 right-6 z-40"
      >
        <a
          href={`https://wa.me/91${COMPANY_INFO.contact.rawPhones[0]}?text=${encodeURIComponent(
            'Hello Bitso Innovations team! I would like to consult on a digital project.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/70 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Chat directly with Bitso Leadership on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </aside>
    </div>
  );
}
