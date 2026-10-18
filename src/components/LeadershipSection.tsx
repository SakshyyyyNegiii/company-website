import React from 'react';
import { LEADERSHIP_MEMBERS } from '../data/content';
import {
  Users,
  Phone,
  MessageCircle,
  Linkedin,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface LeadershipSectionProps {
  onContactLeadership?: (leaderName: string) => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  onContactLeadership,
}) => {
  const { ref, isVisible } = useFadeInOnScroll();

  return (
    <section
      id="leadership"
      className="py-20 sm:py-28 relative border-t border-white/5 bg-slate-950/70"
    >
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono mb-4 tracking-wider uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>Executive Governance & Leadership</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Our Leadership Team
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            The visionary executives and engineering heads driving Bitso Innovations’ technological roadmap, commercial expansion, and enterprise digital solutions.
          </p>
        </div>

        {/* Leadership Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
          {LEADERSHIP_MEMBERS.map((member) => (
            <article
              key={member.id}
              className="relative rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-cyan-950/40 backdrop-blur-sm overflow-hidden"
            >
              {/* Subtle Top Glow Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent group-hover:via-cyan-400 transition-colors" />

              <div>
                {/* Executive Header: Stylized Monogram Avatar & Department */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  {/* Executive Monogram Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-800 to-sky-500/10 border border-cyan-400/40 text-cyan-300 font-extrabold text-xl flex items-center justify-center shadow-lg shadow-cyan-950/40 group-hover:scale-105 group-hover:border-cyan-300 transition-all duration-300 shrink-0">
                    <span>{member.initials}</span>
                  </div>

                  {/* Verification & Department Tag */}
                  <div className="flex flex-col items-end text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono mb-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Executive Board</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 max-w-[180px] leading-tight">
                      {member.department}
                    </span>
                  </div>
                </div>

                {/* Profile Header: Name & Designation */}
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>

                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 font-mono">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{member.designation}</span>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>

                {/* Core Responsibilities */}
                <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Key Areas of Responsibility:
                  </span>
                  <ul className="space-y-2">
                    {member.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Actions Footer */}
              <div className="mt-8 pt-5 border-t border-white/10 flex flex-col gap-3">
                {/* Direct Phone & WhatsApp Touchpoints */}
                <div className="flex items-center gap-2">
                  {member.phone && (
                    <a
                      href={`tel:${member.rawPhone || member.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer"
                      title={`Call ${member.name} directly`}
                    >
                      <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </a>
                  )}

                  {member.rawPhone && (
                    <a
                      href={`https://wa.me/91${member.rawPhone}?text=${encodeURIComponent(
                        `Hello ${member.name}, I am reaching out through the Bitso Innovations website regarding an enterprise consultation.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer shrink-0"
                      title={`Chat with ${member.name} on WhatsApp`}
                      aria-label={`WhatsApp ${member.name}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer shrink-0"
                      title={`Connect with ${member.name} on LinkedIn`}
                      aria-label={`${member.name} LinkedIn Profile`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Consultation Direct Trigger */}
                {onContactLeadership && (
                  <button
                    type="button"
                    onClick={() => onContactLeadership(member.name)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-400 text-xs font-bold transition-all cursor-pointer group/btn"
                  >
                    <span>Connect with {member.name.split(' ')[0]}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Strategic Governance Guarantee Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Direct Executive Accountability & Fast SLAs
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Every project at Bitso Innovations receives direct executive supervision and architectural sign-off from company leadership.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <a
              href="#contact"
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <span>Schedule Executive Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
