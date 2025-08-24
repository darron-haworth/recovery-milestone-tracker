import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual login logic
    setIsAuthenticated(true);
    setUser({ email });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    // TODO: Implement actual registration logic
    setIsAuthenticated(true);
    setUser({ email });
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
