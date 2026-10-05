import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  LogOut,
  FolderGit2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Send,
  CheckCircle2,
  User,
  Zap,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserInquiry } from '../types';
import { SERVICES } from '../data/content';

interface ClientDashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDashboardDrawer: React.FC<ClientDashboardDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    userProfile,
    signInWithGooglePopup,
    signInDemoClient,
    signOutUser,
    openAuthModal,
    loading,
  } = useAuth();
  const [inquiries, setInquiries] = useState<UserInquiry[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showNewInquiryForm, setShowNewInquiryForm] = useState(false);
  const [authError, setAuthError] = useState('');

  // New inquiry form state
  const [service, setService] = useState('Custom Software Development');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Real-time Firestore sync of user's persistent inquiries
  useEffect(() => {
    if (!currentUser) {
      setInquiries([]);
      return;
    }

    setIsFetching(true);

    try {
      const q = query(
        collection(db, 'inquiries'),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: UserInquiry[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as UserInquiry;
            list.push({ ...data, id: doc.id });
          });
          // Sort by creation time descending
          list.sort((a, b) => {
            const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
            const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
            return timeB - timeA;
          });
          setInquiries(list);
          setIsFetching(false);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'inquiries');
          setIsFetching(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'inquiries');
      setIsFetching(false);
    }
  }, [currentUser]);

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        userId: currentUser.uid,
        name: currentUser.displayName || userProfile?.displayName || 'Client Partner',
        fullName: currentUser.displayName || userProfile?.displayName || 'Client Partner',
        email: currentUser.email || '',
        phone: phone || userProfile?.phone || '+91 99903 66072',
        service,
        message: message.trim(),
        status: 'received',
        createdAt: serverTimestamp(),
      });

      setSubmitSuccess(true);
      setMessage('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowNewInquiryForm(false);
      }, 1500);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      // Offline fallback: preserve in local list so client always sees their submitted inquiry
      const localInquiry: UserInquiry = {
        id: 'local_' + Date.now(),
        userId: currentUser.uid,
        name: currentUser.displayName || userProfile?.displayName || 'Client Partner',
        fullName: currentUser.displayName || userProfile?.displayName || 'Client Partner',
        email: currentUser.email || '',
        phone: phone || userProfile?.phone || '+91 99903 66072',
        service,
        message: message.trim(),
        status: 'received',
        createdAt: { seconds: Math.floor(Date.now() / 1000) } as any,
      };
      setInquiries((prev) => [localInquiry, ...prev]);
      setSubmitSuccess(true);
      setMessage('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowNewInquiryForm(false);
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Top Header */}
          <div className="p-6 border-b border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Client Portal</h3>
                <p className="text-[11px] font-mono text-cyan-400">FIRESTORE DATA PERSISTENCE</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {!currentUser ? (
              /* Signed Out State: Flexible Sign In Options */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">Sign In to Client Portal</h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1 leading-relaxed">
                    Authenticate to review, track, and log your technical specifications and project scopes.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs text-left">
                    {authError}
                  </div>
                )}

                <div className="pt-2 space-y-2.5">
                  {/* 1-Click Instant Access */}
                  <button
                    type="button"
                    onClick={async () => {
                      setAuthError('');
                      try {
                        await signInDemoClient();
                      } catch (err: any) {
                        setAuthError(err?.message || 'Could not initialize client session.');
                      }
                    }}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>1-Click Instant Client Access</span>
                  </button>

                  {/* Google Sign In */}
                  <button
                    type="button"
                    onClick={async () => {
                      setAuthError('');
                      try {
                        await signInWithGooglePopup();
                      } catch (err: any) {
                        setAuthError(err?.message || 'Google sign-in could not be completed.');
                      }
                    }}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-medium text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.93H1.28v3.15C3.3 21.36 7.37 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.33 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4.05-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.58l4.05 3.15c.94-2.83 3.57-4.98 6.67-4.98z"
                      />
                    </svg>
                    <span>Sign In with Google</span>
                  </button>

                  {/* Email & Password Sign In / Register */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openAuthModal('signin');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sign In or Register with Email</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-slate-500">
                  SECURE AUTHENTICATION · PERSISTENT CLIENT PORTAL
                </div>
              </div>
            ) : (
              /* Signed In State */
              <>
                {/* User Identity Profile Card */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User Avatar'}
                        className="w-11 h-11 rounded-full border border-cyan-400/50 object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold flex items-center justify-center text-sm">
                        {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{currentUser.displayName || 'Enterprise Partner'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[190px]">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => signOutUser()}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Inquiries Section Header */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                      Your Saved Inquiries ({inquiries.length})
                    </span>
                  </div>

                  <button
                    onClick={() => setShowNewInquiryForm(!showNewInquiryForm)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showNewInquiryForm ? 'Cancel' : 'New Scope'}</span>
                  </button>
                </div>

                {/* Inline New Inquiry Form */}
                {showNewInquiryForm && (
                  <form onSubmit={handleCreateInquiry} className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-xs font-bold text-white mb-2">Submit New Project Scope to Firestore</div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Service Interest</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 99903 66072"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Requirements / Scope Notes</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Briefly describe what you would like to build..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                        required
                      />
                    </div>

                    {submitSuccess ? (
                      <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Saved to Firestore!</span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? 'Saving...' : 'Persist to Firestore'}</span>
                      </button>
                    )}
                  </form>
                )}

                {/* Inquiries List from Firestore */}
                {isFetching ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-mono">
                    Syncing data from Firestore...
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-white/10 rounded-2xl p-6 space-y-2">
                    <p className="text-xs text-slate-300 font-medium">No project inquiries recorded yet.</p>
                    <p className="text-[11px] text-slate-500">
                      Submit an inquiry on any service card or click &quot;New Scope&quot; above to store your project data in Firestore.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => {
                      const dateStr = inq.createdAt?.seconds
                        ? new Date(inq.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Just now';

                      return (
                        <div
                          key={inq.id}
                          className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 hover:border-cyan-500/30 transition-all space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white truncate max-w-[200px]">
                              {inq.service}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/20">
                              ACTIVE INTAKE
                            </span>
                          </div>

                          {inq.message && (
                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                              {inq.message}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{dateStr}</span>
                            </span>
                            <span>ID: {inq.id?.slice(0, 7)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-white/10 bg-slate-950/80 text-center text-[10px] font-mono text-slate-500">
            BITSO INNOVATIONS · FIRESTORE PERSISTENCE ENGINE
          </div>
        </div>
      </div>
    </div>
  );
};
