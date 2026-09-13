import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { Appointment } from '../types';
import { api } from '../lib/api';
import {
  X,
  Calendar,
  Clock,
  Video,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  Clock3,
  CalendarCheck,
  Plus,
  MessageCircle,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Server,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/content';

interface AppointmentsDrawerProps {
  onBookNew?: () => void;
}

export const AppointmentsDrawer: React.FC<AppointmentsDrawerProps> = ({ onBookNew }) => {
  const { currentUser, isAppointmentsDrawerOpen, closeAppointmentsDrawer } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'cancelled'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [backendSynced, setBackendSynced] = useState<boolean>(true);

  // Helper to load offline/cached appointments
  const loadLocalAppointments = () => {
    try {
      const raw = localStorage.getItem('bitso_offline_appointments');
      if (raw) {
        const list: Appointment[] = JSON.parse(raw);
        const userAppts = list.filter(
          (a) => a.userId === currentUser?.uid || (currentUser?.email && a.userEmail === currentUser.email)
        );
        return userAppts;
      }
    } catch (e) {
      console.warn('Could not read local appointments:', e);
    }
    return [];
  };

  useEffect(() => {
    if (!currentUser || !isAppointmentsDrawerOpen) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubPrimary: (() => void) | null = null;
    let unsubSecondary: (() => void) | null = null;

    // Fetch from Backend API as well
    const fetchFromBackend = async () => {
      try {
        const res = await api.getAppointments(currentUser.uid, currentUser.email || undefined);
        if (res.appointments && Array.isArray(res.appointments)) {
          setAppointments((prev) => {
            const combined = [...prev];
            res.appointments.forEach((srvAppt: any) => {
              if (!combined.some((item) => item.id === srvAppt.id)) {
                combined.push(srvAppt);
              }
            });
            return combined;
          });
          setBackendSynced(true);
        }
      } catch (err) {
        // Backend query optional fallback
      }
    };
    fetchFromBackend();

    try {
      const appointmentsRef = collection(db, 'appointments');
      // Query appointments for this user
      const q = query(
        appointmentsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      unsubPrimary = onSnapshot(
        q,
        (snapshot) => {
          const list: Appointment[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<Appointment, 'id'>),
            });
          });
          // Merge with any local appointments not yet in firestore
          const localList = loadLocalAppointments();
          const combined = [...list];
          localList.forEach((loc) => {
            if (!combined.some((item) => item.id === loc.id)) {
              combined.push(loc);
            }
          });
          setAppointments((prev) => {
            // Merge with backend fetched records
            const merged = [...combined];
            prev.forEach((p) => {
              if (!merged.some((m) => m.id === p.id)) {
                merged.push(p);
              }
            });
            return merged;
          });
          setLoading(false);
        },
        (error) => {
          console.warn('Firestore primary query noticed:', error);
          // Fallback query without orderBy in case composite index is not yet built in Firestore
          try {
            const simpleQ = query(appointmentsRef, where('userId', '==', currentUser.uid));
            unsubSecondary = onSnapshot(
              simpleQ,
              (fallbackSnap) => {
                const list: Appointment[] = [];
                fallbackSnap.forEach((docSnap) => {
                  list.push({
                    id: docSnap.id,
                    ...(docSnap.data() as Omit<Appointment, 'id'>),
                  });
                });
                const localList = loadLocalAppointments();
                const combined = [...list];
                localList.forEach((loc) => {
                  if (!combined.some((item) => item.id === loc.id)) {
                    combined.push(loc);
                  }
                });
                setAppointments(combined);
                setLoading(false);
              },
              (fallbackErr) => {
                setLoading(false);
                handleFirestoreError(fallbackErr, OperationType.LIST, 'appointments');
                // Graceful fallback to local appointments
                const localList = loadLocalAppointments();
                setAppointments(localList);
              }
            );
          } catch (e) {
            setLoading(false);
            const localList = loadLocalAppointments();
            setAppointments(localList);
          }
        }
      );
    } catch (err) {
      console.warn('Could not establish Firestore listener:', err);
      const localList = loadLocalAppointments();
      setAppointments(localList);
      setLoading(false);
    }

    return () => {
      if (unsubPrimary) unsubPrimary();
      if (unsubSecondary) unsubSecondary();
    };
  }, [currentUser, isAppointmentsDrawerOpen]);

  if (!isAppointmentsDrawerOpen) return null;

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Confirmed
          </span>
        );
      case 'in_discussion':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-bold text-cyan-300">
            <Clock3 className="w-3.5 h-3.5 text-cyan-400" />
            In Discussion
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-xs font-bold text-rose-300">
            Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-bold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Pending Review
          </span>
        );
    }
  };

  const getMeetingIcon = (type: Appointment['meetingType']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-cyan-400" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'in-person':
        return <Building className="w-4 h-4 text-sky-400" />;
    }
  };

  const cancelAppointment = async (id?: string) => {
    if (!id) return;
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status: 'cancelled',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const openWhatsAppWithAppointment = (appt: Appointment) => {
    const text = encodeURIComponent(
      `Hello Shrikant Jhanwar & Bitso Team! Regarding my transformation consultation appointment for ${appt.businessName} (Ref: ${appt.id?.slice(0, 8)}): ${appt.preferredDate} at ${appt.timeSlot}.`
    );
    window.open(
      `https://wa.me/91${COMPANY_INFO.contact.phones[0].replace(/\s/g, '')}?text=${text}`,
      '_blank'
    );
  };

  const getGoogleCalendarUrlForAppt = (appt: Appointment) => {
    const title = encodeURIComponent(
      `Bitso Innovations Transformation Audit (${appt.businessName || 'Retail Enterprise'})`
    );
    const details = encodeURIComponent(
      `Transformation Strategy Audit Session with Bitso Innovations.\nRef: ${appt.id || ''}\nService: ${appt.interest}\nFormat: ${appt.meetingType}\nClient Phone: ${appt.userPhone}`
    );
    const location = encodeURIComponent(
      appt.meetingType === 'in-person' ? COMPANY_INFO.contact.fullAddress : 'Google Meet Video'
    );

    const dateClean = (appt.preferredDate || '').replace(/-/g, '');
    const slot = appt.timeSlot || '';
    const timeTag = slot.includes('11:00')
      ? 'T053000Z/T063000Z'
      : slot.includes('03:00')
      ? 'T093000Z/T103000Z'
      : 'T113000Z/T123000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateClean}${timeTag}`;
  };

  const copyRefId = (id?: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAppointments = appointments.filter((a) => {
    if (activeFilter === 'active') return a.status !== 'cancelled';
    if (activeFilter === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  const activeCount = appointments.filter((a) => a.status !== 'cancelled').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={closeAppointmentsDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 sm:p-7 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <CalendarCheck className="w-4 h-4" />
                <span>Client Dashboard</span>
              </div>
              <h2 className="text-2xl font-black font-display text-white">
                My Booked Appointments
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time consultation audits & transformation sessions with Bitso leadership.
              </p>
            </div>
            <button
              type="button"
              onClick={closeAppointmentsDrawer}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-slate-400 font-mono">Syncing appointments with Firestore...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="py-16 text-center bg-slate-950/60 rounded-3xl border border-slate-800/80 p-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-cyan-400">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-2">
                  No Appointments Booked Yet
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                  You haven&apos;t scheduled any digital transformation consultations yet. Book a session to audit your retail or enterprise tech stack.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeAppointmentsDrawer();
                    if (onBookNew) {
                      onBookNew();
                    } else {
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Transformation Audit</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Filter Controls */}
                <div className="flex items-center justify-between gap-2 pb-1">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        activeFilter === 'all'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      All ({appointments.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('active')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        activeFilter === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Active ({activeCount})
                    </button>
                    {cancelledCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveFilter('cancelled')}
                        className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                          activeFilter === 'cancelled'
                            ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Cancelled ({cancelledCount})
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      closeAppointmentsDrawer();
                      if (onBookNew) {
                        onBookNew();
                      } else {
                        const el = document.getElementById('contact');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book New</span>
                  </button>
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 text-xs text-slate-400">
                    No appointments matching this filter.
                  </div>
                ) : (
                  filteredAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                              {appt.businessType} • {appt.storesCount}
                            </span>
                            {appt.id && (
                              <button
                                type="button"
                                onClick={() => copyRefId(appt.id)}
                                className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 cursor-pointer"
                                title="Copy Reference ID"
                              >
                                <span>Ref: {appt.id.slice(0, 8)}</span>
                                {copiedId === appt.id ? (
                                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-white font-display">
                            {appt.businessName || 'Transformation Audit'}
                          </h4>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Requirement: <span className="text-white font-semibold">{appt.interest}</span>
                          </p>
                        </div>
                        <div className="shrink-0">{getStatusBadge(appt.status)}</div>
                      </div>

                      {/* Meeting Schedule Box */}
                      <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="font-semibold text-white">{appt.preferredDate || 'To be finalized'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-semibold text-white">{appt.timeSlot || 'Anytime'}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-slate-300 pt-1 border-t border-slate-800/80">
                          {getMeetingIcon(appt.meetingType)}
                          <span className="capitalize font-medium text-slate-200">
                            Format: {appt.meetingType === 'video' ? 'Google Meet / Zoom Video' : appt.meetingType === 'phone' ? 'Direct Phone Call' : 'In-Person (Delhi Headquarters)'}
                          </span>
                        </div>
                      </div>

                      {appt.message && (
                        <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                          <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-0.5">Notes:</span>
                          &ldquo;{appt.message}&rdquo;
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openWhatsAppWithAppointment(appt)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-semibold transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          {appt.status !== 'cancelled' && (
                            <a
                              href={getGoogleCalendarUrlForAppt(appt)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors cursor-pointer"
                            >
                              <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Google Calendar</span>
                            </a>
                          )}
                        </div>

                        {appt.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => cancelAppointment(appt.id)}
                            className="text-slate-400 hover:text-rose-400 transition-colors font-medium cursor-pointer"
                          >
                            Cancel Slot
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer Direct Guarantee */}
          <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Signed in as <span className="text-white font-medium">{currentUser?.email}</span></span>
            </div>
            <span className="font-mono text-cyan-400">24h SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
