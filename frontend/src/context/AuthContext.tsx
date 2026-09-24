import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, LoginCredentials } from '../types/auth';
import { authApi } from '../services/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  carregando: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'fluxsaude_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!tokenSalvo) {
      setCarregando(false);
      return;
    }

    authApi
      .me(tokenSalvo)
      .then((usuario) => {
        setUser(usuario);
        setToken(tokenSalvo);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setCarregando(false));
  }, []);

  async function login(credentials: LoginCredentials) {
    const resposta = await authApi.login(credentials);
    localStorage.setItem(TOKEN_STORAGE_KEY, resposta.token);
    setUser(resposta.user);
    setToken(resposta.token);
  }

  async function logout() {
    if (token) {
      await authApi.logout(token).catch(() => {});
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}