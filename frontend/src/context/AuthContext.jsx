import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const storedToken = localStorage.getItem('access_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      const me = await authService.getCurrentUser();
      setUser(me);
      setToken(storedToken);
    } catch (err) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      setToken(null);
      toast.error('Session expired. Please sign in again.');
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_role', data.user?.role || 'candidate');
    setToken(data.access_token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user?.name || 'there'}!`);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_role', data.user?.role || 'candidate');
    setToken(data.access_token);
    setUser(data.user);
    toast.success('Account created successfully!');
    return data.user;
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    setUser(null);
    setToken(null);
    toast.info('You have been logged out.');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    role: user?.role || localStorage.getItem('user_role'),
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
