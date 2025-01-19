import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem('wallet_currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSetCurrentUser = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(!!user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser, isAuthenticated }}>
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

