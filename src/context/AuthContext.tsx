import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, Appointment } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  authPromptMessage: string;
  appointmentsCount: number;
  openAuthModal: (mode?: 'signin' | 'signup', promptMessage?: string) => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  signInWithGooglePopup: () => Promise<void>;
  signInDemoClient: (customEmail?: string, customName?: string, customPhone?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  isAppointmentsDrawerOpen: boolean;
  openAppointmentsDrawer: () => void;
  closeAppointmentsDrawer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth modal management
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
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

    // Check offline cache count first
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
          // If firestore listener fails, keep local count
        }
      );
      return () => unsubscribe();
    } catch {
      // fallback
    }
  }, [currentUser]);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin', promptMessage: string = '') => {
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

  // Sync user profile document in Firestore
  const syncUserProfile = async (user: User, additionalData?: { phone?: string; displayName?: string }) => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: additionalData?.displayName || user.displayName || 'Client Partner',
          photoURL: user.photoURL || undefined,
          phone: additionalData?.phone || user.phoneNumber || '',
          role: 'client',
        };
        await setDoc(userDocRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setUserProfile(newProfile);
      } else {
        const data = snap.data() as UserProfile;
        // Update photoURL if changed or missing
        if (user.photoURL && data.photoURL !== user.photoURL) {
          await setDoc(userDocRef, { photoURL: user.photoURL, updatedAt: serverTimestamp() }, { merge: true });
          data.photoURL = user.photoURL;
        }
        setUserProfile(data);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      // Fallback local profile representation
      setUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: additionalData?.displayName || user.displayName || 'Client Partner',
        photoURL: user.photoURL || undefined,
        phone: additionalData?.phone || '',
        role: 'client',
      });
    }
  };

  useEffect(() => {
    // Check if we have an active local client session
    try {
      const saved = localStorage.getItem('bitso_saved_client_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed as User);
        setUserProfile({
          uid: parsed.uid,
          email: parsed.email || '',
          displayName: parsed.displayName || 'Client Partner',
          phone: parsed.phoneNumber || '',
          role: 'client',
        });
      }
    } catch {
      // ignore
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        localStorage.removeItem('bitso_saved_client_user');
        setCurrentUser(user);
        await syncUserProfile(user);
      } else {
        // If no firebase user, check local session before clearing
        const saved = localStorage.getItem('bitso_saved_client_user');
        if (!saved) {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInDemoClient = async (
    customEmail = 'client.partner@bitsoinnovations.com',
    customName = 'Client Partner',
    customPhone = '+91 93101 89235'
  ) => {
    const fallbackUid = 'client_' + Math.abs(
      customEmail.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
    ).toString(36);

    const mockUser: any = {
      uid: fallbackUid,
      email: customEmail,
      displayName: customName,
      phoneNumber: customPhone,
      photoURL: null,
      emailVerified: true,
      isAnonymous: false,
    };

    try {
      localStorage.setItem('bitso_saved_client_user', JSON.stringify(mockUser));
    } catch {
      // ignore
    }

    setCurrentUser(mockUser as User);

    const localProfile: UserProfile = {
      uid: fallbackUid,
      email: customEmail,
      displayName: customName,
      phone: customPhone,
      role: 'client',
      createdAt: new Date().toISOString(),
    };
    setUserProfile(localProfile);
    closeAuthModal();
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      localStorage.removeItem('bitso_saved_client_user');
      await syncUserProfile(userCredential.user);
      closeAuthModal();
    } catch (err: any) {
      console.warn('Email sign in notice:', err?.code, err?.message);
      if (err?.code === 'auth/operation-not-allowed') {
        // Gracefully authorize as client partner
        await signInDemoClient(email.trim(), email.split('@')[0]);
        return;
      }
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        // Try automatically registering account
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
          localStorage.removeItem('bitso_saved_client_user');
          await syncUserProfile(userCredential.user, { displayName: email.split('@')[0] });
          closeAuthModal();
          return;
        } catch (signupErr: any) {
          if (signupErr?.code === 'auth/operation-not-allowed') {
            await signInDemoClient(email.trim(), email.split('@')[0]);
            return;
          }
          throw new Error('No account found for this email. Click "Sign Up" below to create one.');
        }
      }
      if (err?.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please verify and try again.');
      }
      if (err?.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone: string) => {
    if (pass.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      localStorage.removeItem('bitso_saved_client_user');
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      await syncUserProfile(userCredential.user, { displayName: name, phone });
      closeAuthModal();
    } catch (err: any) {
      console.warn('Email sign up notice:', err?.code, err?.message);
      if (err?.code === 'auth/operation-not-allowed') {
        await signInDemoClient(email.trim(), name || email.split('@')[0], phone);
        return;
      }
      if (err?.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
          localStorage.removeItem('bitso_saved_client_user');
          await syncUserProfile(userCredential.user, { displayName: name, phone });
          closeAuthModal();
          return;
        } catch {
          throw new Error('An account with this email already exists. Please switch to Sign In.');
        }
      }
      if (err?.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      }
      throw err;
    }
  };

  const signInWithGooglePopup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.removeItem('bitso_saved_client_user');
      await syncUserProfile(result.user);
      closeAuthModal();
    } catch (err: any) {
      console.warn('Google popup notice:', err?.code, err?.message);
      if (
        err?.code === 'auth/unauthorized-domain' ||
        err?.code === 'auth/operation-not-allowed' ||
        err?.code === 'auth/popup-blocked' ||
        err?.code === 'auth/internal-error'
      ) {
        throw new Error(
          'Google Sign-In popup is restricted in this preview sandbox. Please use 1-Click Client Access or Email below.'
        );
      }
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in popup was closed. Please try again or use 1-Click Client Access.');
      }
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      localStorage.removeItem('bitso_saved_client_user');
    } catch {
      // ignore
    }
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setUserProfile(null);
    setIsAppointmentsDrawerOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAuthModalOpen,
        authModalMode,
        authPromptMessage,
        appointmentsCount,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
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

const defaultAuthFallback: AuthContextType = {
  currentUser: null,
  userProfile: null,
  loading: false,
  isAuthModalOpen: false,
  authModalMode: 'signin',
  authPromptMessage: '',
  appointmentsCount: 0,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGooglePopup: async () => {},
  signInDemoClient: async () => {},
  signOutUser: async () => {},
  isAppointmentsDrawerOpen: false,
  openAppointmentsDrawer: () => {},
  closeAppointmentsDrawer: () => {},
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return defaultAuthFallback;
  }
  return context;
};
