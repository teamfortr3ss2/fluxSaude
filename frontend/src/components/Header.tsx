import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
  await logout();
  navigate('/login');
}

  return (
    <header className="app-header">
      <div className="app-header-content">
        <h2>FluxSaúde</h2>
        <div className="app-header-auth">
          {user ? (
            <>
              <span>{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="btn-header">Sair</button>
            </>
          ) : (
            <Link to="/login" className="btn-header">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}