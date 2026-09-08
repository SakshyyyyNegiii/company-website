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
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  authPromptMessage: string;
  openAuthModal: (mode?: 'signin' | 'signup', promptMessage?: string) => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  signInWithGooglePopup: () => Promise<void>;
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
          phone: additionalData?.phone || user.phoneNumber || '',
          role: 'client',
        };
        await setDoc(userDocRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
        });
        setUserProfile(newProfile);
      } else {
        const data = snap.data() as UserProfile;
        setUserProfile(data);
      }
    } catch (err) {
      console.warn('Could not sync user document to Firestore:', err);
      // Fallback local profile representation
      setUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: additionalData?.displayName || user.displayName || 'Client Partner',
        phone: additionalData?.phone || '',
        role: 'client',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    await syncUserProfile(userCredential.user);
    closeAuthModal();
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    await syncUserProfile(userCredential.user, { displayName: name, phone });
    closeAuthModal();
  };

  const signInWithGooglePopup = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(result.user);
    closeAuthModal();
  };

  const signOutUser = async () => {
    await signOut(auth);
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
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithGooglePopup,
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
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGooglePopup: async () => {},
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
