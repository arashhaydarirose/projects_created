import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and set user
      // This is a placeholder and should be replaced with actual token validation
      setUser({ id: '1', username: 'Arash' });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // This is a placeholder and should be replaced with actual API call
      // We're using the specified admin credentials: username "Arash" and password "@Gotvand874"
      if (username === 'Arash' && password === '@Gotvand874') {
        const user = { id: '1', username: 'Arash' };
        const token = 'fake-jwt-token';
        localStorage.setItem('token', token);
        setUser(user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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