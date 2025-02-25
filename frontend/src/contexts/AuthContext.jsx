import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    const isDirectAccess = localStorage.getItem('directAccess') === 'true';
    
    if (isDirectAccess) {
      const tempUser = {
        id: 'temp',
        nome: 'Usuário Temporário',
        email: 'temp@local.dev',
        ativo: true
      };
      setUser(tempUser);
      setLoading(false);
    }
    else if (token) {
      authService.setToken(token);
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const { user } = await authService.verifyToken();
      setUser(user);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    localStorage.removeItem('directAccess');
    const { token, user } = await authService.login(credentials);
    authService.setToken(token);
    setUser(user);
  };

  const bypassAuth = () => {
    localStorage.setItem('directAccess', 'true');
    const tempUser = {
      id: 'temp',
      nome: 'Usuário Temporário',
      email: 'temp@local.dev',
      ativo: true
    };
    setUser(tempUser);
  };

  const logout = () => {
    localStorage.removeItem('directAccess');
    authService.removeToken();
    setUser(null);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, bypassAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const 
useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
