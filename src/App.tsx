import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HomeSlide } from './components/slides/HomeSlide';
import { AboutSlide } from './components/slides/AboutSlide';
import { ServicesSlide } from './components/slides/ServicesSlide';
import { WhyUsSlide } from './components/slides/WhyUsSlide';
import { PortfolioSlide } from './components/slides/PortfolioSlide';
import { ContactSection } from './components/ContactSection';
import { SlideController } from './components/SlideController';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AppointmentsDrawer } from './components/AppointmentsDrawer';
import { MessageCircle } from 'lucide-react';
import { COMPANY_INFO, SLIDES_META } from './data/content';
import { SlideId } from './types';
import { motion, AnimatePresence } from 'motion/react';

const SLIDE_ORDER: SlideId[] = ['home', 'about', 'services', 'why-us', 'portfolio', 'contact'];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<SlideId>('home');
  const [direction, setDirection] = useState<number>(0);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string>('');

  const [isAutoLooping, setIsAutoLooping] = useState<boolean>(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Sync with initial URL hash if provided
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as SlideId;
      if (SLIDE_ORDER.includes(hash)) {
        setCurrentSlide(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const goToSlide = (targetSlide: SlideId) => {
    if (targetSlide === currentSlide) return;
    const currentIndex = SLIDE_ORDER.indexOf(currentSlide);
    const targetIndex = SLIDE_ORDER.indexOf(targetSlide);
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setCurrentSlide(targetSlide);
    window.history.replaceState(null, '', `#${targetSlide}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Continuous Circular Loops: Next wraps to 0, Prev wraps to last
  const nextSlide = () => {
    const currentIndex = SLIDE_ORDER.indexOf(currentSlide);
    const nextIndex = (currentIndex + 1) % SLIDE_ORDER.length;
    goToSlide(SLIDE_ORDER[nextIndex]);
  };

  const prevSlide = () => {
    const currentIndex = SLIDE_ORDER.indexOf(currentSlide);
    const prevIndex = (currentIndex - 1 + SLIDE_ORDER.length) % SLIDE_ORDER.length;
    goToSlide(SLIDE_ORDER[prevIndex]);
  };

  // Auto-Loop Slideshow Effect
  useEffect(() => {
    if (!isAutoLooping) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 9000);
    return () => clearInterval(timer);
  }, [isAutoLooping, currentSlide]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing inside forms or inputs
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // Touch Swipe navigation for mobile and tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Verify horizontal swipe was dominant and exceeded threshold
    if (Math.abs(diffX) > 65 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleConsultationRequest = (serviceOrSolution?: string) => {
    if (serviceOrSolution) {
      setSelectedServiceForInquiry(serviceOrSolution);
    }
    goToSlide('contact');
  };

  const openWhatsAppDirect = () => {
    const text = encodeURIComponent(
      'Hello Bitso Innovations team! I would like to consult on digital transformation for our business.'
    );
    window.open(
      `https://wa.me/91${COMPANY_INFO.contact.phones[0].replace(/\s/g, '')}?text=${text}`,
      '_blank'
    );
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Navbar */}
      <Navbar
        currentSlide={currentSlide}
        onSelectSlide={goToSlide}
        onOpenConsultation={() => handleConsultationRequest()}
      />

      {/* Main Slide Deck Presentation Container */}
      <main className="flex-grow flex flex-col justify-center relative pb-24 sm:pb-28">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: direction >= 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -30 : 30 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full flex-grow flex flex-col justify-center"
          >
            {/* Slide 1: Home */}
            {currentSlide === 'home' && (
              <HomeSlide
                onNavigate={goToSlide}
                onOpenConsultation={() => handleConsultationRequest()}
              />
            )}

            {/* Slide 2: About Us */}
            {currentSlide === 'about' && (
              <AboutSlide
                onNavigate={goToSlide}
                onOpenConsultation={() => handleConsultationRequest('Executive Strategy & Leadership Consultation')}
              />
            )}

            {/* Slide 3: Services */}
            {currentSlide === 'services' && (
              <ServicesSlide
                onSelectServiceForInquiry={(service) => handleConsultationRequest(service)}
                onNavigate={goToSlide}
              />
            )}

            {/* Slide 4: Why Choose Us / Features */}
            {currentSlide === 'why-us' && (
              <WhyUsSlide
                onNavigate={goToSlide}
                onOpenConsultation={(topic) =>
                  handleConsultationRequest(topic || 'Enterprise Transformation & Strategic Partnership')
                }
              />
            )}

            {/* Slide 5: Portfolio */}
            {currentSlide === 'portfolio' && (
              <PortfolioSlide
                onSelectSolutionForInquiry={(title) => handleConsultationRequest(title)}
                onNavigate={goToSlide}
              />
            )}

            {/* Slide 6: Contact Us */}
            {currentSlide === 'contact' && (
              <div className="w-full">
                <ContactSection initialServiceSelection={selectedServiceForInquiry} />
                {/* Footer rendered at the base of Contact slide */}
                <Footer />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Slide Controller & Navigation Bar */}
      <SlideController
        currentSlide={currentSlide}
        onSelectSlide={goToSlide}
        onNextSlide={nextSlide}
        onPrevSlide={prevSlide}
        onOpenConsultation={() => handleConsultationRequest()}
        isAutoLooping={isAutoLooping}
        onToggleAutoLoop={() => setIsAutoLooping((prev) => !prev)}
      />

      {/* Global Firebase Auth Modal & Appointments Drawer */}
      <AuthModal />
      <AppointmentsDrawer onBookNew={() => handleConsultationRequest()} />

      {/* Floating Quick WhatsApp Button */}
      <aside aria-label="Quick WhatsApp Consultation" className="fixed bottom-24 right-4 sm:bottom-24 sm:right-6 z-40">
        <button
          type="button"
          onClick={openWhatsAppDirect}
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
