import React from 'react';
import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react';
import { SLIDES_META } from '../data/content';
import { SlideId } from '../types';

interface SlideControllerProps {
  currentSlide: SlideId;
  onSelectSlide: (slideId: SlideId) => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  onOpenConsultation?: () => void;
}

export const SlideController: React.FC<SlideControllerProps> = ({
  currentSlide,
  onSelectSlide,
  onNextSlide,
  onPrevSlide,
  onOpenConsultation,
}) => {
  const currentIndex = SLIDES_META.findIndex((s) => s.id === currentSlide);
  const currentMeta = SLIDES_META[currentIndex] || SLIDES_META[0];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === SLIDES_META.length - 1;

  return (
    <aside
      aria-label="Slide Deck Navigation"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl sm:rounded-full px-3 sm:px-5 py-2.5 shadow-2xl shadow-slate-950/80 flex items-center justify-between gap-2 sm:gap-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrevSlide}
          disabled={isFirst}
          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
          title="Previous Slide (or press Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Slide Counter & Dots */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="font-mono text-xs font-bold text-cyan-400">
            {currentMeta.number}
            <span className="text-slate-600 font-normal"> / 06</span>
          </span>

          {/* Dots on sm+ screens */}
          <div className="flex items-center gap-1.5">
            {SLIDES_META.map((slide, idx) => {
              const isActive = slide.id === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => onSelectSlide(slide.id)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-6 sm:w-8 bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-sm shadow-cyan-400/50'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Slide ${idx + 1}: ${slide.label}`}
                />
              );
            })}
          </div>

          <span className="hidden md:inline text-[11px] font-semibold text-slate-300 max-w-[130px] truncate">
            {currentMeta.label}
          </span>
        </div>

        {/* Quick Actions & Next */}
        <div className="flex items-center gap-2 shrink-0">
          {currentSlide !== 'contact' && (
            <button
              type="button"
              onClick={() => (onOpenConsultation ? onOpenConsultation() : onSelectSlide('contact'))}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 transition-all cursor-pointer shadow-sm"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Call</span>
            </button>
          )}

          {/* Next Button */}
          <button
            type="button"
            onClick={onNextSlide}
            disabled={isLast}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm shrink-0"
            title="Next Slide (or press Right Arrow)"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
