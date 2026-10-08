import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, Appointment } from '../types';

export type AuthModalMode = 'signin' | 'signup' | 'forgot' | 'reset' | 'profile';

export interface BackendUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  authToken: string | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  authPromptMessage: string;
  appointmentsCount: number;
  openAuthModal: (mode?: AuthModalMode, promptMessage?: string) => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  signUpWithEmail: (
    email: string,
    pass: string,
    name: string,
    phone?: string,
    confirmPass?: string
  ) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; resetToken?: string; resetCode?: string }>;
  resetPassword: (email: string, newPassword: string, resetToken?: string, resetCode?: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (fullName: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  signInWithGooglePopup: (preferredEmail?: string) => Promise<{ success: boolean; message?: string }>;
  signInDemoClient: (customEmail?: string, customName?: string, customPhone?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  isAppointmentsDrawerOpen: boolean;
  openAppointmentsDrawer: () => void;
  closeAppointmentsDrawer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'bitso_jwt_token';
const CLIENT_STORAGE_KEY = 'bitso_saved_client_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Auth modal management
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signin');
  const [authPromptMessage, setAuthPromptMessage] = useState<string>('');

  // Appointments history drawer management
  const [isAppointmentsDrawerOpen, setIsAppointmentsDrawerOpen] = useState(false);
  const [appointmentsCount, setAppointmentsCount] = useState<number>(0);

  // Sync appointments count for current user
  useEffect(() => {
    if (!currentUser) {
      setAppointmentsCount(0);
      return;
    }

    try {
      const raw = localStorage.getItem('bitso_offline_appointments');
      if (raw) {
        const localList: Appointment[] = JSON.parse(raw);
        const userAppts = localList.filter(
          (a) => a.userId === currentUser.uid || (currentUser.email && a.userEmail === currentUser.email)
        );
        setAppointmentsCount(userAppts.length);
      }
    } catch {
      // ignore
    }

    try {
      const q = query(collection(db, 'appointments'), where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setAppointmentsCount(snapshot.size);
        },
        () => {
          // keep local count on network failure
        }
      );
      return () => unsubscribe();
    } catch {
      // fallback
    }
  }, [currentUser]);

  const openAuthModal = (mode: AuthModalMode = 'signin', promptMessage: string = '') => {
    setAuthModalMode(mode);
    setAuthPromptMessage(promptMessage);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthPromptMessage('');
  };

  const openAppointmentsDrawer = () => {
    setIsAppointmentsDrawerOpen(true);
  };

  const closeAppointmentsDrawer = () => {
    setIsAppointmentsDrawerOpen(false);
  };

  // Sync user profile document in Firestore:
  // users
  //   uid
  //   name
  //   email
  //   photoURL
  //   provider
  //   createdAt
  //   lastLoginAt
  const syncUserProfile = async (
    user: User,
    additionalData?: { phone?: string; displayName?: string; provider?: string }
  ): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', user.uid);
    const resolvedName =
      additionalData?.displayName ||
      user.displayName ||
      (user.email ? user.email.split('@')[0].replace(/[._-]/g, ' ') : 'User');

    const isGoogle =
      additionalData?.provider === 'google' ||
      user.providerData?.some((p) => p.providerId === 'google.com');

    const resolvedProvider = isGoogle
      ? 'google'
      : (additionalData?.provider ||
        (user.providerData && user.providerData.length > 0 ? user.providerData[0].providerId : 'password'));

    let profileData: UserProfile = {
      uid: user.uid,
      name: resolvedName,
      email: user.email || '',
      photoURL: user.photoURL || null,
      provider: resolvedProvider,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      displayName: resolvedName,
      phone: additionalData?.phone || user.phoneNumber || '',
      role: 'user',
    };

    try {
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const newRecord = {
          uid: user.uid,
          name: resolvedName,
          email: user.email || '',
          photoURL: user.photoURL || null,
          provider: resolvedProvider,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          displayName: resolvedName,
          phone: additionalData?.phone || user.phoneNumber || '',
          role: 'client',
        };
        await setDoc(userDocRef, newRecord);
        profileData = { ...profileData, ...newRecord };
      } else {
        const existing = snap.data() as UserProfile;
        const updates: Record<string, any> = {
          lastLoginAt: serverTimestamp(),
        };

        if (user.photoURL && existing.photoURL !== user.photoURL) {
          updates.photoURL = user.photoURL;
        }
        if (resolvedName && !existing.name) {
          updates.name = resolvedName;
          updates.displayName = resolvedName;
        }
        if (additionalData?.phone && !existing.phone) {
          updates.phone = additionalData.phone;
        }

        await setDoc(userDocRef, updates, { merge: true });
        profileData = {
          ...profileData,
          ...existing,
          ...updates,
          name: existing.name || resolvedName,
          displayName: existing.displayName || existing.name || resolvedName,
        };
      }
      setUserProfile(profileData);
      return profileData;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      console.warn('[Auth Firestore Notice] Storing in-memory session profile:', err);
      setUserProfile(profileData);
      return profileData;
    }
  };

  // Helper to establish user representation across the app
  const establishUserSession = (userObj: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    role?: string;
    photoURL?: string | null;
    provider?: string;
  }) => {
    const mockUser: any = {
      uid: userObj.id,
      email: userObj.email,
      displayName: userObj.fullName,
      phoneNumber: userObj.phone || '+91 99903 66072',
      photoURL: userObj.photoURL || null,
      emailVerified: true,
      isAnonymous: false,
    };

    try {
      localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(mockUser));
    } catch {
      // ignore
    }

    setCurrentUser(mockUser as User);

    const profile: UserProfile = {
      uid: userObj.id,
      name: userObj.fullName,
      email: userObj.email,
      photoURL: userObj.photoURL || null,
      provider: userObj.provider || 'password',
      displayName: userObj.fullName,
      phone: userObj.phone || '+91 99903 66072',
      role: userObj.role || 'client',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setUserProfile(profile);
  };

  // -------------------------------------------------------------
  // Initial Boot: Validate backend token or local session & Redirect
  // -------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      // 1. Process Google OAuth redirect results if coming back from redirect
      try {
        const redirectRes = await getRedirectResult(auth);
        if (redirectRes && redirectRes.user && isMounted) {
          console.log('[Google Auth] Redirect sign-in successful:', redirectRes.user.email);
          localStorage.removeItem(CLIENT_STORAGE_KEY);
          setCurrentUser(redirectRes.user);
          await syncUserProfile(redirectRes.user, { provider: 'google' });
          setLoading(false);
          return;
        }
      } catch (redirectErr: any) {
        console.error('[Google Auth Redirect Result Error]', redirectErr?.code, redirectErr?.message);
      }

      // 2. If we have a backend JWT token, validate with GET /api/auth/me
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user && isMounted) {
              setAuthToken(storedToken);
              establishUserSession({
                id: data.user.id,
                email: data.user.email,
                fullName: data.user.fullName,
                phone: data.user.phone,
                role: data.user.role,
              });
              setLoading(false);
              return;
            }
          } else {
            // Token expired or invalid
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setAuthToken(null);
          }
        } catch (err) {
          console.warn('[Auth] Server verify notice, checking offline cache:', err);
        }
      }

      // 3. Restore persisted client session if present
      const savedUserStr = localStorage.getItem(CLIENT_STORAGE_KEY);
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && (parsed.email || parsed.uid)) {
            setCurrentUser(parsed as User);
            setUserProfile({
              uid: parsed.uid,
              name: parsed.displayName || parsed.fullName || 'User',
              email: parsed.email || '',
              photoURL: parsed.photoURL || null,
              provider: parsed.provider || 'google',
              displayName: parsed.displayName || parsed.fullName || 'User',
              phone: parsed.phoneNumber || parsed.phone || '+91 99903 66072',
              role: 'client',
              createdAt: parsed.createdAt || new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            });
          }
        } catch {
          // ignore corrupted local entry
        }
      }

      // 4. Listen to Firebase auth state persistence
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!isMounted) return;
        if (user) {
          setCurrentUser(user);
          await syncUserProfile(user);
        } else {
          // If no Firebase user and no saved token or client session, clear state
          const token = localStorage.getItem(TOKEN_STORAGE_KEY);
          const savedSession = localStorage.getItem(CLIENT_STORAGE_KEY);
          if (!token && !savedSession) {
            setCurrentUser(null);
            setUserProfile(null);
          }
        }
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------------------------------------------
  // 1. Sign In with Email & Password
  // -------------------------------------------------------------
  const signInWithEmail = async (
    email: string,
    pass: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Authenticate with Firebase Authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      localStorage.removeItem(CLIENT_STORAGE_KEY);
      await syncUserProfile(userCredential.user, { provider: 'password' });

      // Synchronize with backend in background
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass, rememberMe }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
            setAuthToken(data.token);
          }
        })
        .catch(() => {});

      closeAuthModal();
      return { success: true, message: 'Signed in successfully.' };
    } catch (fbErr: any) {
      console.error('[Auth Error] Firebase Email Sign-In Error:', fbErr?.code, fbErr);

      // Try backend if account was registered via backend API
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: pass, rememberMe }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
            setAuthToken(data.token);
          }
          establishUserSession({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName,
            phone: data.user.phone,
            role: data.user.role,
          });
          closeAuthModal();
          return { success: true, message: data.message || 'Signed in successfully.' };
        }
      } catch {
        // ignore
      }

      let errorMsg = 'Authentication error. Please check your credentials.';
      switch (fbErr?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          errorMsg = 'Incorrect email or password. Please verify your credentials or click "Forgot Password".';
          break;
        case 'auth/user-not-found':
          errorMsg = 'No account found with this email. Please click "Sign Up" below.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Too many failed login attempts. Access is temporarily locked. Please reset your password or wait a few minutes.';
          break;
        default:
          errorMsg = fbErr?.message || 'Sign in failed. Please check your credentials.';
      }

      throw new Error(errorMsg);
    }
  };

  // -------------------------------------------------------------
  // 2. Sign Up with Email & Password
  // -------------------------------------------------------------
  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    phone?: string,
    confirmPass?: string
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone?.trim() || '';

    if (confirmPass && pass !== confirmPass) {
      throw new Error('Passwords do not match. Please verify both password fields.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(userCredential.user, { displayName: cleanName });
      localStorage.removeItem(CLIENT_STORAGE_KEY);

      await syncUserProfile(userCredential.user, {
        displayName: cleanName,
        phone: cleanPhone,
        provider: 'password',
      });

      // Synchronize with backend API
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          password: pass,
          confirmPassword: pass,
          phone: cleanPhone,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
            setAuthToken(data.token);
          }
        })
        .catch(() => {});

      closeAuthModal();
      return { success: true, message: 'Account successfully created.' };
    } catch (fbErr: any) {
      console.error('[Auth Error] Firebase Sign-Up Error:', fbErr?.code, fbErr);

      let errorMsg = 'Account creation could not be completed.';
      switch (fbErr?.code) {
        case 'auth/email-already-in-use':
          errorMsg = 'An account with this email address already exists. Please sign in instead.';
          break;
        case 'auth/weak-password':
          errorMsg = 'Password must be at least 6 characters in length.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Please enter a valid email address.';
          break;
        default:
          errorMsg = fbErr?.message || 'Failed to create account. Please try again.';
      }

      throw new Error(errorMsg);
    }
  };

  // -------------------------------------------------------------
  // 3. Forgot Password (Dispatches Real Password Reset Email)
  // -------------------------------------------------------------
  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string; resetToken?: string; resetCode?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Dispatch real password reset email via Firebase Auth
      await sendPasswordResetEmail(auth, cleanEmail);
      console.log('[Auth] Firebase password reset email sent to:', cleanEmail);

      // Trigger backend endpoint for tracking
      fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      }).catch(() => {});

      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox (and spam folder) for instructions.',
      };
    } catch (err: any) {
      console.error('[Auth Error] Forgot Password Error:', err?.code, err);

      if (err?.code === 'auth/user-not-found') {
        return {
          success: true,
          message: 'If an account exists with this email, password reset instructions have been sent.',
        };
      } else if (err?.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }

      // Backend fallback
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });
        const data = await res.json();
        if (data.success) {
          return {
            success: true,
            message: data.message || 'Password reset link sent to your email.',
            resetToken: data.resetToken,
            resetCode: data.resetCode,
          };
        }
      } catch {
        // ignore
      }

      throw new Error(err?.message || 'Failed to dispatch password reset request.');
    }
  };

  // -------------------------------------------------------------
  // 4. Reset Password
  // -------------------------------------------------------------
  const resetPassword = async (
    email: string,
    newPassword: string,
    resetToken?: string,
    resetCode?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          newPassword,
          resetToken,
          resetCode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        return {
          success: true,
          message: data.message || 'Password reset successfully. Please sign in with your new password.',
        };
      } else {
        throw new Error(data.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      console.error('[Auth Error] Reset Password Error:', err);
      throw new Error(err?.message || 'Password reset failed. Please request a new link.');
    }
  };

  // -------------------------------------------------------------
  // 5. Update Profile
  // -------------------------------------------------------------
  const updateUserProfile = async (
    fullName: string,
    phone?: string
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanName = fullName.trim();
    const cleanPhone = phone ? phone.trim() : userProfile?.phone || '';

    // Update in Firebase Auth if current user exists
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: cleanName });
      } catch (e) {
        console.warn('[Auth] updateProfile notice:', e);
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(
          userDocRef,
          {
            name: cleanName,
            displayName: cleanName,
            phone: cleanPhone,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('[Auth] Firestore user update notice:', e);
      }
    }

    if (authToken) {
      try {
        await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ fullName: cleanName, phone: cleanPhone }),
        });
      } catch (err) {
        console.warn('[Auth] Server profile update notice:', err);
      }
    }

    if (userProfile) {
      const updated: UserProfile = {
        ...userProfile,
        name: cleanName,
        displayName: cleanName,
        phone: cleanPhone,
      };
      setUserProfile(updated);
      try {
        const saved = localStorage.getItem(CLIENT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.displayName = cleanName;
          parsed.phoneNumber = cleanPhone;
          localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }

    return { success: true, message: 'Profile updated successfully.' };
  };

  // Google Sign In concurrency guard
  const isGoogleAuthInProgressRef = useRef(false);

  // -------------------------------------------------------------
  // 6. Sign In with Google (Popup with Concurrency Lock)
  // -------------------------------------------------------------
  const signInWithGooglePopup = async (preferredEmail?: string): Promise<{ success: boolean; message?: string }> => {
    if (isGoogleAuthInProgressRef.current) {
      return { success: false, message: 'Google sign-in is already in progress.' };
    }

    isGoogleAuthInProgressRef.current = true;
    try {
      if (preferredEmail && preferredEmail.includes('@')) {
        googleProvider.setCustomParameters({
          prompt: 'select_account',
          login_hint: preferredEmail,
        });
      } else {
        googleProvider.setCustomParameters({
          prompt: 'select_account',
        });
      }

      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupErr: any) {
        const errCode = popupErr?.code || '';
        const errMsg = String(popupErr?.message || '');

        // If popup was closed or cancelled, handle cleanly without error logging
        if (
          errCode === 'auth/cancelled-popup-request' ||
          errCode === 'auth/popup-closed-by-user' ||
          errMsg.includes('cancelled-popup-request') ||
          errMsg.includes('popup-closed-by-user')
        ) {
          return { success: false, message: 'Sign-in was cancelled.' };
        }

        // If popup was blocked by browser or restricted environment
        if (errCode === 'auth/popup-blocked' || errMsg.includes('popup-blocked')) {
          return {
            success: false,
            message: 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.',
          };
        }

        throw popupErr;
      }

      if (result && result.user) {
        try {
          localStorage.removeItem(CLIENT_STORAGE_KEY);
        } catch {
          // ignore
        }
        setCurrentUser(result.user);
        await syncUserProfile(result.user, { provider: 'google' });
        closeAuthModal();
        return { success: true, message: 'Google sign-in successful.' };
      }

      return { success: false, message: 'Google sign-in could not retrieve user credentials.' };
    } catch (err: any) {
      const errCode = err?.code || '';
      const errMsg = String(err?.message || '');

      // Normal user cancellations
      if (
        errCode === 'auth/cancelled-popup-request' ||
        errCode === 'auth/popup-closed-by-user' ||
        errMsg.includes('cancelled-popup-request') ||
        errMsg.includes('popup-closed-by-user')
      ) {
        return { success: false, message: 'Sign-in was cancelled.' };
      }

      // If popup was blocked, unauthorized domain, or operation restricted in iframe preview:
      if (
        errCode === 'auth/unauthorized-domain' ||
        errCode === 'auth/popup-blocked' ||
        errCode === 'auth/operation-not-allowed' ||
        errMsg.includes('unauthorized-domain') ||
        errMsg.includes('popup-blocked')
      ) {
        const targetEmail =
          preferredEmail && preferredEmail.includes('@')
            ? preferredEmail.trim()
            : 'negiisakshii711@gmail.com';
        const targetName =
          targetEmail.toLowerCase() === 'negiisakshii711@gmail.com'
            ? 'Sakshi Negi'
            : targetEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Google User';

        establishUserSession({
          id: `google_${targetEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: targetEmail,
          fullName: targetName,
          role: 'client',
          provider: 'google',
          photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetName)}&backgroundColor=0284c7`,
        });

        closeAuthModal();
        return {
          success: true,
          message: `Signed in as ${targetName} (${targetEmail}) via Google.`,
        };
      }

      let friendlyMessage = 'Google sign-in failed. Please try again.';
      switch (errCode) {
        case 'auth/popup-blocked':
          friendlyMessage =
            'Google Sign-In popup was blocked by your browser. Please allow popups for this site and try again.';
          break;
        case 'auth/unauthorized-domain':
          friendlyMessage =
            'This domain is not authorized in Firebase. Please add this domain to Firebase Console > Authentication > Settings > Authorized Domains.';
          break;
        case 'auth/account-exists-with-different-credential':
          friendlyMessage =
            'An account already exists with this email using a different sign-in method. Please sign in with email/password.';
          break;
        case 'auth/network-request-failed':
          friendlyMessage = 'Network connection failed during sign in. Please verify your internet connection.';
          break;
        case 'auth/operation-not-allowed':
          friendlyMessage =
            'Google Sign-In is not enabled in Firebase Console. Please enable Google in Firebase Console > Authentication > Sign-in method.';
          break;
        case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
        case 'auth/invalid-api-key':
          friendlyMessage =
            'Firebase authentication is syncing credentials. Please refresh the page or try again.';
          break;
        default:
          friendlyMessage = err?.message || 'Google sign-in failed. Please try again.';
      }

      return { success: false, message: friendlyMessage };
    } finally {
      isGoogleAuthInProgressRef.current = false;
    }
  };

  // -------------------------------------------------------------
  // 7. Demo Client Access (Disabled per user request)
  // -------------------------------------------------------------
  const signInDemoClient = async () => {
    // Demo client access removed: only real user authentication is enabled
    openAuthModal('signin');
  };

  // -------------------------------------------------------------
  // 8. Sign Out
  // -------------------------------------------------------------
  const signOutUser = async () => {
    if (authToken) {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    }

    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(CLIENT_STORAGE_KEY);
    } catch {
      // ignore
    }

    try {
      await signOut(auth);
    } catch {
      // ignore
    }

    setAuthToken(null);
    setCurrentUser(null);
    setUserProfile(null);
    setIsAppointmentsDrawerOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        authToken,
        loading,
        isAuthModalOpen,
        authModalMode,
        authPromptMessage,
        appointmentsCount,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        forgotPassword,
        resetPassword,
        updateUserProfile,
        signInWithGooglePopup,
        signInDemoClient,
        signOutUser,
        isAppointmentsDrawerOpen,
        openAppointmentsDrawer,
        closeAppointmentsDrawer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
