import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Smartphone,
  Globe,
  Database,
  Cloud,
  Cpu,
  Store,
  ShoppingBag,
  Truck,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
  Check,
} from 'lucide-react';
import { CORE_SERVICES, ADVANCED_STACK, FLAGSHIP_PILLARS } from '../../data/content';
import { SlideId } from '../../types';

interface ServicesSlideProps {
  onSelectServiceForInquiry: (serviceName: string) => void;
  onNavigate: (slideId: SlideId) => void;
}

export const ServicesSlide: React.FC<ServicesSlideProps> = ({
  onSelectServiceForInquiry,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'advanced' | 'retail'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-sky-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-indigo-400" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-teal-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'Laptop':
        return <Store className="w-5 h-5 text-cyan-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-sky-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-teal-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  // Harmonized all service offerings into a unified list
  const allServices = [
    ...CORE_SERVICES.map((s) => ({ ...s, group: 'core' as const, groupLabel: 'Core Software' })),
    ...ADVANCED_STACK.map((s) => ({ ...s, group: 'advanced' as const, groupLabel: 'Cloud & AI' })),
    ...FLAGSHIP_PILLARS.map((p) => ({
      id: p.id,
      title: p.title,
      category: 'advanced' as const,
      group: 'retail' as const,
      groupLabel: 'Retail Suite',
      description: p.description,
      bulletPoints: p.features,
      clientBenefit: p.badge,
      iconName: p.iconName,
    })),
  ];

  const filteredServices = allServices.filter((service) => {
    const matchesCategory =
      selectedCategory === 'all' || service.group === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConsultService = (title: string) => {
    onSelectServiceForInquiry(title);
    onNavigate('contact');
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header with Title & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Slide 03 • Engineering Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight">
              Enterprise Software, Cloud & AI Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Scalable, modular systems built with bank-grade encryption, zero-latency cloud synchronicity, and real-time operations.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative self-start md:self-auto w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Solutions ({allServices.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('retail')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'retail'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Retail Transformation Suite ({FLAGSHIP_PILLARS.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('core')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'core'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Core Software & Web ({CORE_SERVICES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('advanced')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'advanced'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-sm'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Cloud, ERP & AI ({ADVANCED_STACK.length})
          </button>
        </div>

        {/* Services Grid with Smooth Category Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + (searchQuery ? `-${searchQuery}` : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-h-[62vh] overflow-y-auto pr-1"
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl shadow-slate-950/60 backdrop-blur-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                      {service.groupLabel}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-display text-white mb-2 group-hover:text-cyan-200 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {service.description}
                  </p>

                  {/* Key Bullet Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 mb-3">
                    {service.bulletPoints.slice(0, 3).map((bp, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{bp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Benefit & CTA */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-300 truncate max-w-[170px]">
                    {service.clientBenefit}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleConsultService(service.title)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 active:scale-95 transition-all cursor-pointer shrink-0"
                    title={`Book audit for ${service.title}`}
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
