import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RotaProtegida({ children }: { children: ReactNode }) {
  const { user, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return <p className="mensagem-carregando">Carregando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}