import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

const starterAccounts = [
  {
    email: 'student@wellness.local',
    password: 'Student@123',
    role: 'STUDENT',
    name: 'Demo Student',
  },
  {
    email: 'admin@wellness.local',
    password: 'Admin@123',
    role: 'ADMIN',
    name: 'Demo Admin',
  },
];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (payload) => {
    setLoading(true);

    try {
      const normalizedEmail = payload.email.trim().toLowerCase();
      const starterAccount = starterAccounts.find(
        (account) =>
          account.email.toLowerCase() === normalizedEmail && account.password === payload.password
      );

      if (starterAccount) {
        const starterToken = `starter-token-${starterAccount.role.toLowerCase()}`;
        const starterUser = {
          email: starterAccount.email,
          role: starterAccount.role,
          name: starterAccount.name,
        };

        setToken(starterToken);
        setUser(starterUser);

        return starterUser;
      }

      const response = await api.post('/auth/login', payload);
      const responseToken = response.data?.token;
      const responseUser = response.data?.user || {
        email: payload.email,
        role: response.data?.role || 'STUDENT',
      };

      setToken(responseToken);
      setUser(responseUser);

      return responseUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);

    try {
      const response = await api.post('/auth/register', payload);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
