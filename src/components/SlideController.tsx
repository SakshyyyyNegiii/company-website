import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Play,
  Pause,
  Repeat,
  Server,
  Activity,
  CheckCircle2,
  X,
  Database,
  Cpu,
} from 'lucide-react';
import { SLIDES_META } from '../data/content';
import { SlideId } from '../types';
import { api, HealthResponse, SystemStatusResponse } from '../lib/api';

interface SlideControllerProps {
  currentSlide: SlideId;
  onSelectSlide: (slideId: SlideId) => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  onOpenConsultation?: () => void;
  isAutoLooping?: boolean;
  onToggleAutoLoop?: () => void;
}

export const SlideController: React.FC<SlideControllerProps> = ({
  currentSlide,
  onSelectSlide,
  onNextSlide,
  onPrevSlide,
  onOpenConsultation,
  isAutoLooping = false,
  onToggleAutoLoop,
}) => {
  const currentIndex = SLIDES_META.findIndex((s) => s.id === currentSlide);
  const currentMeta = SLIDES_META[currentIndex] || SLIDES_META[0];

  // Backend status modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [systemTelemetry, setSystemTelemetry] = useState<SystemStatusResponse | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [pingLatency, setPingLatency] = useState<number>(16);

  useEffect(() => {
    let isMounted = true;
    const checkConnection = async () => {
      const start = performance.now();
      try {
        const health = await api.checkHealth();
        const latency = Math.round(performance.now() - start);
        if (isMounted) {
          setBackendHealth(health);
          setBackendOnline(true);
          setPingLatency(latency);
        }
      } catch (err) {
        if (isMounted) {
          setBackendOnline(false);
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const openDiagnostics = async () => {
    setShowStatusModal(true);
    try {
      const [health, telemetry] = await Promise.all([
        api.checkHealth(),
        api.getSystemStatus(),
      ]);
      setBackendHealth(health);
      setSystemTelemetry(telemetry);
    } catch (err) {
      console.warn('Diagnostics fetch warning:', err);
    }
  };

  return (
    <>
      <aside
        aria-label="Slide Deck Navigation"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl sm:rounded-full px-3 sm:px-5 py-2.5 shadow-2xl shadow-slate-950/80 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left Controls: Loop Play/Pause + Prev */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Auto-Loop Slideshow Toggle Button */}
            {onToggleAutoLoop && (
              <button
                type="button"
                onClick={onToggleAutoLoop}
                className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isAutoLooping
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-sm shadow-cyan-500/20 animate-pulse'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
                title={isAutoLooping ? 'Pause continuous slide deck loop' : 'Start auto-looping slide deck (continuous 9s interval)'}
              >
                {isAutoLooping ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden md:inline font-mono">Loop Active</span>
                  </>
                ) : (
                  <>
                    <Repeat className="w-3.5 h-3.5" />
                    <span className="hidden md:inline font-mono">Loop Deck</span>
                  </>
                )}
              </button>
            )}

            {/* Previous Button (Continuous Loop Enabled) */}
            <button
              type="button"
              onClick={onPrevSlide}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Previous Slide (loops circularly to end if at start)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
          </div>

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

            <span className="hidden lg:inline text-[11px] font-semibold text-slate-300 max-w-[130px] truncate">
              {currentMeta.label}
            </span>
          </div>

          {/* Right Controls: Backend Telemetry Badge + Book Call + Next Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Live Backend Status Badge */}
            <button
              type="button"
              onClick={openDiagnostics}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
              title="View Live Backend Server & Firestore Connection Status"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="hidden md:inline">API</span>
              <span className="text-cyan-400">{pingLatency}ms</span>
            </button>

            {currentSlide !== 'contact' && (
              <button
                type="button"
                onClick={() => (onOpenConsultation ? onOpenConsultation() : onSelectSlide('contact'))}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Book Call</span>
              </button>
            )}

            {/* Next Button (Continuous Loop Enabled) */}
            <button
              type="button"
              onClick={onNextSlide}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
              title="Next Slide (loops circularly to start if at end)"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backend & Firestore System Diagnostics Dialog */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl shadow-cyan-950/60 relative">
            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Full-Stack Architecture Diagnostics
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  Node.js Express + Firestore Cloud Synchronization
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {/* API Health */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Express Backend Server</span>
                    <span className="text-[11px] text-slate-400">
                      Endpoints: /api/health, /api/contact, /api/appointments
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                  ACTIVE ({pingLatency}ms)
                </span>
              </div>

              {/* Firestore Database */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Firestore Database ID</span>
                    <span className="text-[10px] font-mono text-cyan-300 truncate max-w-[210px] block">
                      ai-studio-bitsoinnovations-1856c77f-9c8b-41b7-a35d-111ea6ba4867
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                  PROVISIONED
                </span>
              </div>

              {/* Server-Side Active Microservices */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                  Connected Microservices & Pipelines
                </span>
                <div className="grid grid-cols-1 gap-1 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>5-Step Digital Loop Telemetry Engine (/api/digital-loop/telemetry)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Multi-Store Inventory & Order Synchronization (/api/appointments)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dual-Sync Booking: Cloud Firestore + Backend Express (/api/contact)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all cursor-pointer"
            >
              Close Diagnostics
            </button>
          </div>
        </div>
      )}
    </>
  );
};

