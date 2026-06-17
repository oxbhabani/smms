// Manages authentication state (user, login, register, logout) across the app

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, check if a token exists and verify it with the server
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getMeApi()
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Login: send credentials, save token, set user
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await loginApi({ email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      throw err;
    }
  }, []);

  // Register: create account, save token, set user
  const register = useCallback(async (name, email, password, role) => {
    setError(null);
    try {
      const res = await registerApi({ name, email, password, role });
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      throw err;
    }
  }, []);

  // Logout: clear token and user
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  }, []);

  // Update local user data (e.g. after profile edit)
  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Provide auth state and actions to all children
  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access auth context (must be used inside AuthProvider)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
