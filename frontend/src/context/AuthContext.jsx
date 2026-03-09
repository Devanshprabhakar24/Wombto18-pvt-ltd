import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wombto18_token'));
  const [loading, setLoading] = useState(true);

  // Set token on api instance whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('wombto18_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('wombto18_token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Normalize user object to a consistent shape
  const normalizeUser = (u) => {
    if (!u) return null;
    return {
      id: u.id || u._id,
      name: u.name,
      email: u.email,
      role: typeof u.role === 'object' ? u.role?.name : u.role,
      plan_type: u.plan_type || 'FREE',
      maternal_status: u.maternal_status || 'NONE',
      is_tree_enrolled: u.is_tree_enrolled || false,
    };
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(res => {
        setUser(normalizeUser(res.data.user));
      })
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(normalizeUser(res.data.user));
    return res.data;
  };

  const sendOtp = async (email) => {
    const res = await api.post('/auth/send-otp', { email });
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    if (res.data.requireAdminVerify) {
      return res.data; // don't set token yet, admin needs password step
    }
    setToken(res.data.token);
    setUser(normalizeUser(res.data.user));
    return res.data;
  };

  const adminVerify = async (email, password) => {
    const res = await api.post('/auth/admin-verify', { email, password });
    setToken(res.data.token);
    setUser(normalizeUser(res.data.user));
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    setToken(res.data.token);
    setUser(normalizeUser(res.data.user));
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(normalizeUser(res.data.user));
    } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, sendOtp, verifyOtp, adminVerify, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
