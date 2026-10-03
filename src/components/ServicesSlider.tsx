import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Code2,
  Smartphone,
  Sparkles,
  Layout,
} from 'lucide-react';

interface SliderCard {
  id: string;
  title: string;
  description: string;
  categoryTag: string;
  image: string;
  fallbackImage: string;
  icon: React.ReactNode;
  accentColor: string;
}

const SLIDER_CARDS: SliderCard[] = [
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    description: 'Powerful software built around your business.',
    categoryTag: 'ENTERPRISE & CLOUD',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/enterprise_erp.jpg',
    icon: <Code2 className="w-4 h-4 text-cyan-400" />,
    accentColor: '#06b6d4',
  },
  {
    id: 'web-mobile',
    title: 'Web & Mobile Development',
    description: 'Modern digital experiences built to grow.',
    categoryTag: 'MODERN APPS',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/smart_retail_store.jpg',
    icon: <Smartphone className="w-4 h-4 text-sky-400" />,
    accentColor: '#38bdf8',
  },
  {
    id: 'ai-genai',
    title: 'AI & GenAI Solutions',
    description: 'Smart technology that helps businesses work faster.',
    categoryTag: 'AI & AUTOMATION',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/hero_liquid_ribbon.jpg',
    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    accentColor: '#10b981',
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    description: 'Simple, engaging and user-focused experiences.',
    categoryTag: 'USER EXPERIENCE',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
    fallbackImage: '/images/fashion_store_pos.jpg',
    icon: <Layout className="w-4 h-4 text-indigo-400" />,
    accentColor: '#818cf8',
  },
];

interface ServicesSliderProps {
  onSelectCard: (title: string) => void;
}

export const ServicesSlider: React.FC<ServicesSliderProps> = ({ onSelectCard }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const touchStartXRef = useRef<number | null>(null);
  const totalCards = SLIDER_CARDS.length;

  // Responsive window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  // Autoplay timer every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;

    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
    touchStartXRef.current = null;
  };

  const isMobile = windowWidth < 768;

  // Calculate position & scale for each card
  const getCardStyle = (index: number) => {
    let offset = index - activeIndex;

    // Wrap around for circular 5-item carousel
    if (offset > totalCards / 2) {
      offset -= totalCards;
    } else if (offset < -totalCards / 2) {
      offset += totalCards;
    }

    const isActive = offset === 0;
    const isAdjacent = Math.abs(offset) === 1;

    // Card spacing calculation
    const baseSpacing = isMobile
      ? Math.min(windowWidth * 0.78, 320)
      : Math.min(windowWidth * 0.32, 380);

    const translateX = offset * baseSpacing;
    const scale = isActive ? 1.05 : isAdjacent ? 0.9 : 0.78;
    const opacity = isActive ? 1 : isAdjacent ? 0.55 : 0;
    const zIndex = isActive ? 20 : isAdjacent ? 10 : 0;
    const pointerEvents = isActive || isAdjacent ? 'auto' : 'none';

    const isHidden = Math.abs(offset) > 1.5;

    return {
      transform: `translateX(-50%) translateX(${translateX}px) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: pointerEvents as React.CSSProperties['pointerEvents'],
      visibility: isHidden ? ('hidden' as const) : ('visible' as const),
      transition: isHidden
        ? 'none'
        : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), opacity 600ms ease, border-color 300ms ease',
    };
  };

  return (
    <section
      aria-label="Featured Solutions Carousel"
      className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden bg-slate-950/60 border-t border-b border-white/5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle Ambient Radial Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Accent / Label */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>FEATURED DIGITAL SOLUTIONS</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Explore specialized engineering capabilities tailored for rapid business growth
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-7xl mx-auto px-4 h-[380px] sm:h-[420px] md:h-[450px] flex items-center justify-center overflow-hidden">
        {/* Animated Cards Track */}
        <div className="relative w-full h-full flex items-center justify-center">
          {SLIDER_CARDS.map((card, index) => {
            const isActive = index === activeIndex;
            const style = getCardStyle(index);

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (isActive) {
                    onSelectCard(card.title);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                style={style}
                className={`absolute left-1/2 top-1/2 -translate-y-1/2 w-[280px] sm:w-[340px] md:w-[380px] h-[350px] sm:h-[390px] md:h-[420px] rounded-2xl overflow-hidden cursor-pointer ${
                  isActive
                    ? 'border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/30'
                    : 'border border-white/10 hover:border-cyan-500/40 hover:opacity-75'
                }`}
              >
                {/* Background Image with Fallback */}
                <img
                  src={card.image}
                  alt={card.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = card.fallbackImage;
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Deep Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" />

                {/* Subtle Top Light Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

                {/* Card Content Overlay */}
                <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between z-10">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/15 backdrop-blur-md text-[11px] font-mono tracking-wider text-cyan-300">
                      {card.icon}
                      <span>{card.categoryTag}</span>
                    </div>

                    {isActive && (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                      </span>
                    )}
                  </div>

                  {/* Bottom Text & Action */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed line-clamp-2">
                      {card.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 group">
                        <span>{isActive ? 'Start Project' : 'Select'}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        0{index + 1} / 0{totalCards}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous card"
          className="absolute left-2 sm:left-6 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/20 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-300 flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next card"
          className="absolute right-2 sm:right-6 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/20 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-300 flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {SLIDER_CARDS.map((card, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={card.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}: ${card.title}`}
              className={`transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-7 sm:w-8 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  : 'w-2 h-2 rounded-full bg-slate-700 hover:bg-slate-500'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};
