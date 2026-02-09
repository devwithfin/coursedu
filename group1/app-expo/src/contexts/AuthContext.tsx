import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, logout as apiLogout } from '../api/auth'; // Renamed to avoid conflicts

// Define the User type based on your backend response
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string; // Add token property
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resetUserSession = async () => {
      try {
        console.log('AuthContext: Clearing stored user to force login screen.');
        await AsyncStorage.removeItem('user');
        setUser(null);
      } catch (error) {
        console.error('Failed to reset stored user session:', error);
      } finally {
        setLoading(false);
      }
    };
    resetUserSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      // Construct the full user object including the token
      const fetchedUserWithToken: User = { ...response.user, token: response.token };
      
      console.log('AuthContext: User logged in:', fetchedUserWithToken.email);
      if (fetchedUserWithToken.token) {
        console.log('AuthContext: User token available.');
      } else {
        console.log('AuthContext: User token IS NOT available!');
      }
      setUser(fetchedUserWithToken);
      await AsyncStorage.setItem('user', JSON.stringify(fetchedUserWithToken));
      return fetchedUserWithToken;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      try {
        await apiLogout();
      } catch (error) {
        console.warn('Logout request failed, clearing local session anyway:', error?.message || error);
      }
      await AsyncStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
