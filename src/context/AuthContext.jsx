import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'; // ← onSnapshot yahan add karo
import { db } from '../firebase/firebase';

// Create context
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ✅ FIXED: Listen for auth state changes with real-time Firestore listener
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Get user data from Firestore (ONE TIME, not real-time)
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          ...firebaseUser,
          points: userData.points || 0,
          streak: userData.streak || 0,
          totalWatchTime: userData.totalWatchTime || 0,
          totalCodes: userData.totalCodes || 0,
          selectedLanguages: userData.selectedLanguages || [],
          role: userData.role || 'user',
          subscription: userData.subscription || 'free',
          completedCourses: userData.completedCourses || [],
          enrolledCourses: userData.enrolledCourses || []
        });
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  });

  return unsubscribe;
}, []);
  const clearError = () => setError('');

  const signup = async (email, password, displayName, selectedLanguages = []) => {
    try {
      setActionLoading(true);
      setError('');
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        selectedLanguages: selectedLanguages,
        subscription: 'free',
        points: 50,
        streak: 1,
        totalWatchTime: 0,
        totalCodes: 0,
        completedCourses: [],
        enrolledCourses: [],
        role: 'user'
      });

      setActionLoading(false);
      return userCredential;
    } catch (error) {
      setActionLoading(false);
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setActionLoading(true);
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: new Date().toISOString()
      }, { merge: true });

      setActionLoading(false);
      return userCredential;
    } catch (error) {
      setActionLoading(false);
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setActionLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          selectedLanguages: [],
          subscription: 'free',
          points: 50,
          streak: 1,
          totalWatchTime: 0,
          totalCodes: 0,
          completedCourses: [],
          enrolledCourses: [],
          role: 'user'
        });
      } else {
        await setDoc(doc(db, 'users', result.user.uid), {
          lastLogin: new Date().toISOString()
        }, { merge: true });
      }

      setActionLoading(false);
      return result;
    } catch (error) {
      setActionLoading(false);
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const value = {
    user,
    loading: actionLoading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};