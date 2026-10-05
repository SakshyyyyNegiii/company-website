import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSlider } from './components/ServicesSlider';
import { ServicesSection } from './components/ServicesSection';
import { WorkSection } from './components/WorkSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ClientAuthModal } from './components/ClientAuthModal';
import { ClientDashboardDrawer } from './components/ClientDashboardDrawer';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { CustomCursor } from './components/CustomCursor';
import { SectionId } from './types';
import { MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from './data/content';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('Web Development');

  // Smooth scroll to target section
  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const topOffset = 70; // offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: 'smooth',
      });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  // Scroll spy to update active section in navbar
  useEffect(() => {
    const sectionIds: SectionId[] = ['home', 'services', 'work', 'contact'];

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
  }, []);

  const handleOpenProjectModal = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsProjectModalOpen(true);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      'Hello Bitso Innovations team! I would like to consult on a digital project.'
    );
    window.open(`https://wa.me/91${COMPANY_INFO.contact.rawPhones[0]}?text=${text}`, '_blank');
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
        onNavigate={scrollToSection}
        onStartProject={() => handleOpenProjectModal()}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow flex flex-col">
        {/* Section 1: Hero — First Impression */}
        <HeroSection
          onStartProject={() => handleOpenProjectModal()}
          onExploreServices={() => scrollToSection('services')}
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

        {/* Section 4: Final CTA + Contact */}
        <ContactSection
          initialService={selectedService}
          onOpenDashboard={() => setIsDashboardOpen(true)}
        />
      </main>

      {/* Minimal Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Instant Project Intake Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        preSelectedService={selectedService}
      />

      {/* Client Portal Authentication Modal */}
      <ClientAuthModal onOpenDashboard={() => setIsDashboardOpen(true)} />

      {/* Client Dashboard / Firestore Persistence Drawer */}
      <ClientDashboardDrawer
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

      {/* Floating Direct WhatsApp Action */}
      <aside
        aria-label="Quick WhatsApp Consultation"
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          type="button"
          onClick={openWhatsApp}
          className="flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/70 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Chat directly with Bitso Leadership on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
      </aside>
    </div>
  );
}
