import { useState, useEffect } from 'react';
import { authService, User, LoginData, RegisterData } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Función para actualizar el usuario desde localStorage
  const updateUserFromStorage = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  // Verificar si Supabase está configurado
  useEffect(() => {
    try {
      const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
      const supabaseUrl = import.meta.env.VITE_PROJECT_URL_SUPABASE;
      
      if (!supabaseKey || !supabaseUrl) {
        console.warn('Supabase no está configurado. Usando modo simulado.');
        setIsConfigured(false);
        setLoading(false);
        return;
      }
      
      setIsConfigured(true);
      updateUserFromStorage();
      setLoading(false);
    } catch (err) {
      console.warn('Error al inicializar autenticación:', err);
      setIsConfigured(false);
      setLoading(false);
    }
  }, []);

  // Listener para cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      updateUserFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios en el mismo tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === 'user') {
        updateUserFromStorage();
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Función de login
  const login = async (loginData: LoginData) => {
    if (!isConfigured) {
      setError('Sistema de autenticación no configurado');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await authService.loginUser(loginData);

      if (error) {
        setError('Credenciales incorrectas');
        return { success: false };
      }

      if (data) {
        authService.setCurrentUser(data);
        setUser(data);
        return { success: true, user: data };
      } else {
        setError('Usuario no encontrado');
        return { success: false };
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (registerData: RegisterData) => {
    if (!isConfigured) {
      setError('Sistema de autenticación no configurado');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      // Verificar si el email ya existe
      const { exists } = await authService.checkEmailExists(registerData.correo);
      
      if (exists) {
        setError('El email ya está registrado');
        return { success: false };
      }

      // Registrar el usuario
      const { data, error } = await authService.registerUser(registerData);

      if (error) {
        setError('Error al registrar usuario');
        return { success: false };
      }

      if (data) {
        return { success: true, user: data };
      } else {
        setError('Error al crear la cuenta');
        return { success: false };
      }
    } catch (err) {
      setError('Error al registrar usuario');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    if (isConfigured) {
      authService.logout();
    }
    setUser(null);
    setError(null);
  };

  // Limpiar error
  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    isConfigured
  };
}; 