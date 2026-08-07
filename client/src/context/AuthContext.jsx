import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getProfileApi } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('civicroute_token') || '');
  const [loading, setLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getProfileApi();
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[AuthContext] Session check failed, clearing token');
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await loginApi({ email, password });
      if (res.success) {
        localStorage.setItem('civicroute_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}!`);
        return { success: true, role: res.user.role };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerApi(userData);
      if (res.success) {
        localStorage.setItem('civicroute_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Account registered successfully! Welcome to CivicRoute.`);
        return { success: true, role: res.user.role };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('civicroute_token');
    setToken('');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  // Demo Login Presets for rapid presentation testing
  const demoLogin = async (role) => {
    let email = 'citizen@civicroute.com';
    if (role === 'Department Officer') email = 'officer.sanitation@civicroute.gov';
    if (role === 'Admin') email = 'admin@civicroute.gov';

    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        demoLogin,
        isAuthenticated: !!user,
        role: user?.role || ''
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
