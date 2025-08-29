import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import API from '../services/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para normalizar el objeto de usuario
  const normalizeUser = (userData) => {
    if (!userData) return null;
    return {
      ...userData,
      id: userData._id || userData.id, // Asegura que siempre haya una propiedad 'id'
    };
  };

  // Cargar estado de autenticación desde localStorage al inicio
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const normalizedUser = normalizeUser(parsedUser);
          setUser(normalizedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        logout(); // Limpiar si hay un error de parseo
      }
      setLoading(false); // La carga inicial ha terminado
    };

    loadUserFromStorage();
  }, []);

  // Persistir estado de autenticación en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      const normalizedUser = normalizeUser(data);
      setUser(normalizedUser);
      setIsAuthenticated(true);
      toast.success(`Bienvenido, ${normalizedUser.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await authService.register(userData);
      toast.success('Registro exitoso. Por favor, inicia sesión.');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Has cerrado sesión.');
  };

  const updateAuthUser = (newUserData) => {
    const normalizedUser = normalizeUser(newUserData);
    setUser(normalizedUser);
  };

  const guestLogin = () => {
    // Asegurarse de que el usuario invitado también tenga un 'id' consistente
    const guestUserData = { id: 'guest', _id: 'guest', name: 'Invitado', email: 'guest@example.com', role: 'guest', token: 'guest-token' };
    setUser(normalizeUser(guestUserData));
    setIsAuthenticated(true);
    toast.info('Has iniciado sesión como invitado.');
  };

  /**
   * Verifica si el usuario actual tiene alguno de los roles especificados.
   * @param {Array<string>} roles - Un array de roles a verificar (ej. ['admin', 'teacher']).
   * @returns {boolean} True si el usuario tiene alguno de los roles, false en caso contrario.
   */
  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register, guestLogin, hasRole, updateAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
