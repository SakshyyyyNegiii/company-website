import React, { useState } from 'react';
import { FLAGSHIP_PILLARS } from '../data/content';
import {
  Store,
  Layers,
  ShoppingBag,
  Truck,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  MonitorCheck,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface FlagshipRetailSectionProps {
  onOpenConsultation: () => void;
}

export const FlagshipRetailSection: React.FC<FlagshipRetailSectionProps> = ({
  onOpenConsultation,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('pillar-1');

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Store className="w-5 h-5 text-cyan-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-sky-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-teal-400" />;
      default:
        return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  const selectedPillar =
    FLAGSHIP_PILLARS.find((p) => p.id === selectedPillarId) || FLAGSHIP_PILLARS[0];

  return (
    <section id="retail" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Decorative gradient blur backdrop */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header from Slide 4 */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-4 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flagship Transformation Suite</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.08]">
            FROM BRICK-AND-MORTAR TO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
              OMNI-CHANNEL DIGITAL GIANTS
            </span>
          </h2>
          <div className="mt-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-base sm:text-lg leading-relaxed shadow-xl">
            <span className="font-bold uppercase text-xs font-mono tracking-wider block text-cyan-300 mb-2">
              TARGET AUDIENCE & STRATEGIC OBJECTIVE
            </span>
            Traditional retail businesses, regional supermarkets, and showrooms looking to future-proof operations. We deliver the complete digital infrastructure stack to transform physical retail into a high-velocity omni-channel powerhouse.
          </div>
        </div>

        {/* Visual Dual Photo Showcase: In-Store & Hyperlocal Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div
            onClick={() => setSelectedPillarId('pillar-1')}
            className={`relative rounded-3xl overflow-hidden border p-6 cursor-pointer transition-all duration-300 group ${
              selectedPillarId === 'pillar-1' || selectedPillarId === 'pillar-2'
                ? 'border-cyan-500/80 bg-slate-900/90 ring-1 ring-cyan-500/40 shadow-2xl shadow-cyan-950/30'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="relative w-full sm:w-44 h-32 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-700/70">
                <img
                  src="/src/assets/images/smart_retail_store_1788799895410.jpg"
                  alt="Modern smart supermarket store with cloud POS"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 font-bold bg-slate-950/90 px-2 py-0.5 rounded border border-cyan-500/30">
                  POS SYNC
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Store className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    Front-Of-House & Shelf POS
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  Physical Store Digitize & Catalog
                </h3>
                <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">
                  Seamless barcode integration, multi-counter billing, and instantaneous stock reflection across e-commerce storefronts.
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setSelectedPillarId('pillar-3')}
            className={`relative rounded-3xl overflow-hidden border p-6 cursor-pointer transition-all duration-300 group ${
              selectedPillarId === 'pillar-3' || selectedPillarId === 'pillar-4'
                ? 'border-emerald-500/80 bg-slate-900/90 ring-1 ring-emerald-500/40 shadow-2xl shadow-emerald-950/30'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="relative w-full sm:w-44 h-32 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-700/70">
                <img
                  src="/src/assets/images/hyperlocal_logistics_1788799912853.jpg"
                  alt="Modern urban micro-fulfillment logistics dispatch center"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 font-bold bg-slate-950/90 px-2 py-0.5 rounded border border-emerald-500/30">
                  30-MIN DISPATCH
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                    Back-Of-House & Neighborhood Delivery
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  Hyper-Local Logistics & Order Routing
                </h3>
                <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">
                  Automated packing checklists, EV courier dispatch APIs, and live WhatsApp tracking updates for your local buyers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid & Interactive Architecture Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 4 Pillars Interactive List */}
          <div className="lg:col-span-6 space-y-4">
            {FLAGSHIP_PILLARS.map((pillar) => {
              const isSelected = pillar.id === selectedPillarId;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`p-6 sm:p-7 rounded-3xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-slate-900/95 border-cyan-500/80 shadow-2xl shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-cyan-950/90 border-cyan-400/60 shadow-inner'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        {getPillarIcon(pillar.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-cyan-400">
                            {pillar.number}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                            {pillar.title}
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base text-slate-200 mt-1.5 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`hidden sm:inline-block text-xs font-mono uppercase px-3 py-1 rounded-full shrink-0 font-bold border ${
                        isSelected
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Expanded features if selected */}
                  {isSelected && (
                    <div className="mt-5 pt-4 border-t border-slate-800/90 space-y-2.5 animate-in fade-in duration-200">
                      {pillar.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Live Interactive Omni-Channel Architecture Diagram */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              {/* Contextual Photo Preview Card synced with Active Pillar */}
              <div className="relative h-48 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden rounded-t-3xl group">
                <img
                  src={
                    selectedPillarId === 'pillar-1' || selectedPillarId === 'pillar-2'
                      ? '/src/assets/images/smart_retail_store_1788799895410.jpg'
                      : '/src/assets/images/hyperlocal_logistics_1788799912853.jpg'
                  }
                  alt={
                    selectedPillarId === 'pillar-1' || selectedPillarId === 'pillar-2'
                      ? 'Smart retail store POS and digitized shelf fulfillment'
                      : 'Hyper-local logistics dispatch and electric delivery fleet'
                  }
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute top-3.5 left-4 flex items-center gap-2">
                  <span className="text-xs font-mono uppercase bg-slate-950/90 backdrop-blur-md text-cyan-300 font-bold px-3 py-1 rounded-lg border border-cyan-500/40">
                    {selectedPillarId === 'pillar-1' || selectedPillarId === 'pillar-2'
                      ? 'DEPLOYMENT PHASE 01 • IN-STORE DIGITIZATION'
                      : 'DEPLOYMENT PHASE 02 • HYPERLOCAL LOGISTICS'}
                  </span>
                </div>

                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-white drop-shadow-md">
                    {selectedPillarId === 'pillar-1' || selectedPillarId === 'pillar-2'
                      ? 'Point-of-Sale Hardware Sync & Instant Web Catalog'
                      : '30-Min Neighborhood Courier Dispatch & WhatsApp CRM'}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-slate-950/90 px-2.5 py-1 rounded-md border border-emerald-500/40 shrink-0">
                    LIVE
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold">
                    REAL-TIME INFRASTRUCTURE STACK
                  </span>
                  <h3 className="text-xl font-bold font-display text-white mt-0.5">
                    Omni-Channel Flow Engine
                  </h3>
                </div>
                <span className="text-xs sm:text-sm px-3 py-1 bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded-lg font-mono font-bold">
                  {selectedPillar.number} / 04 ACTIVE
                </span>
              </div>

              {/* Visual Interactive Pipeline */}
              <div className="space-y-3.5">
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    selectedPillarId === 'pillar-1'
                      ? 'bg-cyan-950/40 border-cyan-400/60 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">
                        1. Physical Store POS & Central Inventory
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-500/30 font-semibold">
                      &lt; 50ms Sync
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mt-2 leading-relaxed">
                    Every offline barcode scan instantly updates central cloud stock across all retail outlets.
                  </p>
                </div>

                <div className="flex justify-center text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    selectedPillarId === 'pillar-2'
                      ? 'bg-emerald-950/40 border-emerald-400/60 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">
                        2. Custom E-Commerce & Indian UPI Checkout
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-500/30 font-semibold">
                      Sub-3s Checkout
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mt-2 leading-relaxed">
                    Customers browse real-time local shelf inventory with seamless payment through PhonePe, Google Pay, Paytm, cards, or COD.
                  </p>
                </div>

                <div className="flex justify-center text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    selectedPillarId === 'pillar-3'
                      ? 'bg-sky-950/40 border-sky-400/60 ring-1 ring-sky-500/30'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-sky-400" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">
                        3. Hyper-Local Routing & Same-Day Dispatch
                      </span>
                    </div>
                    <span className="text-xs font-mono text-sky-300 bg-sky-950 px-2.5 py-1 rounded-md border border-sky-500/30 font-semibold">
                      Neighborhood APIs
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mt-2 leading-relaxed">
                    Zero-delay courier allocation fulfills orders directly from the nearest neighborhood store hub.
                  </p>
                </div>

                <div className="flex justify-center text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    selectedPillarId === 'pillar-4'
                      ? 'bg-teal-950/40 border-teal-400/60 ring-1 ring-teal-500/30'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-teal-400" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">
                        4. WhatsApp/SMS Automated Loyalty & Retention
                      </span>
                    </div>
                    <span className="text-xs font-mono text-teal-300 bg-teal-950 px-2.5 py-1 rounded-md border border-teal-500/30 font-semibold">
                      Targeted CRM
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mt-2 leading-relaxed">
                    Automated dispatch notifications, points credit, and personalized replenishment alerts driving recurring footfall and orders.
                  </p>
                </div>
              </div>

              {/* Call to action */}
              <div className="mt-7 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-300 font-medium">
                  Ready to deploy across your retail network?
                </div>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Transform Your Retail Business
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
