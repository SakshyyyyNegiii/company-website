import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { FlagshipRetailSection } from './components/FlagshipRetailSection';
import { RoiAndLoopSection } from './components/RoiAndLoopSection';
import { RoadmapSection } from './components/RoadmapSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AppointmentsDrawer } from './components/AppointmentsDrawer';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { COMPANY_INFO } from './data/content';

export default function App() {
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string>('');

  const scrollToContact = (serviceTitle?: string) => {
    if (serviceTitle) {
      setSelectedServiceForInquiry(serviceTitle);
    }
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Sticky Header with Brand Navigation */}
      <Navbar onOpenConsultation={() => scrollToContact()} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section (Slide 1) */}
        <Hero onOpenConsultation={() => scrollToContact()} />

        {/* Core Services & Advanced Stack (Slide 2 & Slide 3) */}
        <ServicesSection onSelectService={(service) => scrollToContact(service)} />

        {/* Flagship Omni-Channel Retail Digitization Suite (Slide 4) */}
        <FlagshipRetailSection onOpenConsultation={() => scrollToContact('Retail Omni-Channel Transformation')} />

        {/* Commercial Advantage, Digital Loop & ROI Calculator (Slide 5) */}
        <RoiAndLoopSection onOpenConsultation={() => scrollToContact('Operational ROI Audit')} />

        {/* 5-Year Scale & Growth Roadmap 2026–2031 (Slide 6) */}
        <RoadmapSection />

        {/* Why Partner With Bitso Innovations (Slide 7) */}
        <WhyUsSection />

        {/* Contact & Transformation Consultation Form (Slide 7) */}
        <ContactSection initialServiceSelection={selectedServiceForInquiry} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Firebase Auth Modal & User Appointments Drawer */}
      <AuthModal />
      <AppointmentsDrawer onBookNew={() => scrollToContact()} />

      {/* Floating Quick WhatsApp Button for instant mobile inquiry */}
      <aside aria-label="Quick Communication Bar" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={openWhatsAppDirect}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Chat with Bitso Innovations on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp Us</span>
        </button>
      </aside>
    </div>
  );
}
