import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (formData) => {
    try {
      const { data } = await axios.post('/api/signup', formData);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };

  const login = async (formData) => {
    try {
      const { data } = await axios.post('/api/login', formData);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};