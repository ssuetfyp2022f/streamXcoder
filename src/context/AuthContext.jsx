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
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            ...userData
          });
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = () => setError('');

  const signup = async (email, password, displayName, technologies = []) => {
    try {
      setActionLoading(true);
      setError('');
      
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // 3. Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        technologies: technologies, // Save selected technologies
        subscription: 'free',
        points: 0,
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
      
      // Update last login time
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
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          technologies: [],
          subscription: 'free',
          points: 0,
          completedCourses: [],
          enrolledCourses: [],
          role: 'user'
        });
      } else {
        // Update last login time
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

  // Helper function to convert Firebase error codes to user-friendly messages
  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or login.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const value = {
    user,
    loading: actionLoading, // Use actionLoading for form submissions
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
      {!loading && children} {/* Show children only after initial auth check */}
    </AuthContext.Provider>
  );
};