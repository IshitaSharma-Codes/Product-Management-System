'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import API from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromStorage = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const response = await API.get('/auth/profile');
            if (response.data.success) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            console.error('Failed to load user profile:', error.message);
            // Token might be expired, Axios interceptor will handle redirect/refresh
          }
        }
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: loggedUser } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      
      // Set short-lived session cookie for Next.js Middleware check
      document.cookie = `token=${accessToken}; path=/; max-age=900; SameSite=Strict;`;
      
      setUser(loggedUser);
      toast.success(response.data.message || 'Login successful!');
      
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/register', { name, email, password, confirmPassword });
      const { accessToken, refreshToken, user: registeredUser } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      
      // Set short-lived session cookie for Next.js Middleware check
      document.cookie = `token=${accessToken}; path=/; max-age=900; SameSite=Strict;`;
      
      setUser(registeredUser);
      toast.success('Registration successful! Welcome aboard.');
      
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed.';
      const errors = error.response?.data?.errors;
      
      if (errors && errors.length > 0) {
        errors.forEach(err => toast.error(`${err.field}: ${err.message}`));
      } else {
        toast.error(errorMsg);
      }
      return { success: false, error: errorMsg, errors };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Clear middleware session cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;';
    }
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
