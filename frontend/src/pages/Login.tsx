import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiRequestError } from '../services/api';
import './Formulario.css';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const destino = (location.state as { from?: string })?.from ?? '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      await login({ email, password });
      navigate(destino, { replace: true });
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setErro(err.message);
      } else {
        setErro('Erro inesperado ao entrar.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <Link to="/">← Voltar</Link>
      <h1>Entrar</h1>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="campo">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="campo">
          <label>
            Senha:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={enviando} className="btn-primario">
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}