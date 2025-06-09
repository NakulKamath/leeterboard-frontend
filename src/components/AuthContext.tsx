'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../api/firebase.config';

interface AuthContextType {
  user: User | null;
  userLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUserLoggedIn(!!user);
      setLoading(false);
      if (user) {
        localStorage.setItem('uuid', user.uid);
      }
      else {
        localStorage.removeItem('uuid');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
