import React, { createContext, useState, useEffect, useContext } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('streamxcoder_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const clearError = () => setError('');

  const signup = async (email, password, displayName) => {
    setLoading(true);
    setError('');
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        
        // Create mock user
        const mockUser = {
          uid: 'mock-' + Date.now(),
          email,
          displayName,
          createdAt: new Date().toISOString()
        };
        
        setUser(mockUser);
        localStorage.setItem('streamxcoder_user', JSON.stringify(mockUser));
        resolve({ user: mockUser });
      }, 2000);
    });
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        
        const mockUser = {
          uid: 'mock-' + Date.now(),
          email,
          displayName: email.split('@')[0],
          createdAt: new Date().toISOString()
        };
        
        setUser(mockUser);
        localStorage.setItem('streamxcoder_user', JSON.stringify(mockUser));
        resolve({ user: mockUser });
      }, 1500);
    });
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError('');
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        
        const mockUser = {
          uid: 'google-mock-' + Date.now(),
          email: 'user@gmail.com',
          displayName: 'Google User',
          photoURL: 'https://ui-avatars.com/api/?name=Google+User',
          createdAt: new Date().toISOString()
        };
        
        setUser(mockUser);
        localStorage.setItem('streamxcoder_user', JSON.stringify(mockUser));
        resolve({ user: mockUser });
      }, 1500);
    });
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('streamxcoder_user');
  };

  const resetPassword = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const updateUserProfile = async (data) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('streamxcoder_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};