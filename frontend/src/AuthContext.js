import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext(null);

// This wraps the whole app and shares the logged-in user everywhere
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // the logged-in user (or null)
  const [loading, setLoading] = useState(true); // true while Firebase checks session

  useEffect(() => {
    // Firebase calls this whenever login state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe; // cleanup when component unmounts
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Call this hook in any component to get the current user
// e.g. const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
