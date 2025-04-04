import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Wrapper pour localStorage
const storage = {
  getItem: async (key: string): Promise<string | null> => Promise.resolve(localStorage.getItem(key)),
  setItem: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await storage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    if (username === 'admin' && password === '1234') {
      await storage.setItem('authToken', 'loggedIn');
      setIsAuthenticated(true);
    } else {
      throw new Error('Identifiants incorrects');
    }
  };

  const logout = async () => {
    await storage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};