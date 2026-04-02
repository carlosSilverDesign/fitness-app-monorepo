import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// 1. SOLUCIÓN REACTNODE: Importación exclusiva de tipos
import type { ReactNode } from 'react';

// 🟢 AÑADIMOS LOS CAMPOS OPCIONALES AL TIPO
type UserProfile = {
  firstName: string;
  lastName: string;
  role: string;
  gender?: string;      
  dateOfBirth?: string; 
  heightCm?: number;    
} | null;

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 2. SOLUCIÓN CASCADING RENDERS: Inicializamos leyendo el token directamente
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState<UserProfile>(null);

  // Envolvemos la función en useCallback para que no se recree en cada render
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/profiles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Todo perfecto, el perfil existe
        const data = await response.json();
        if (data.profile) {
          // 🟢 MAPEAMOS LOS NUEVOS CAMPOS DEL BACKEND AL CONTEXTO
          setUser({
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
            role: data.user.role,
            gender: data.profile.gender,
            dateOfBirth: data.profile.dateOfBirth,
            heightCm: data.profile.heightCm
          });
          setIsAuthenticated(true);
        }
      } else if (response.status === 404) {
        // El token es válido, pero el perfil aún no existe.
        // Lo mantenemos logueado con un nombre genérico para que no lo expulse.
        setUser({
          firstName: 'Atleta', // Nombre por defecto
          lastName: '',
          role: 'FREE'
        });
        setIsAuthenticated(true);
      } else {
        // Solo si es un error 401 (No Autorizado) u otro, borramos el token
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error validando sesión:", error);
    }
  }, []);

  // Ahora el useEffect es 100% seguro y limpio
  useEffect(() => {
    // eslint-disable-next-line
    checkAuth();
  }, [checkAuth]);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/login'; // Forzamos redirección limpia
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. SOLUCIÓN FAST REFRESH: Le decimos a ESLint que esto es intencional
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};