import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { solicitacoesApi, ApiRequestError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Categoria, Prioridade } from '../types/solicitacao';
import './Formulario.css';

const CATEGORIA_OPTIONS: Categoria[] = ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO'];
const PRIORIDADE_OPTIONS: Prioridade[] = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

export function NovaSolicitacao() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [nomeSolicitante, setNomeSolicitante] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('CONSULTA');
  const [prioridade, setPrioridade] = useState<Prioridade>('BAIXA');
  const [descricao, setDescricao] = useState('');
  const [justificativaPrioridade, setJustificativaPrioridade] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Record<string, string[]>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!token) {
      setErroGeral('Você precisa estar autenticado para criar uma solicitação.');
      return;
    }

    setEnviando(true);
    setErros({});
    setErroGeral(null);

    try {
      const nova = await solicitacoesApi.criar(
        {
          nome_solicitante: nomeSolicitante,
          categoria,
          prioridade,
          descricao,
          justificativa_prioridade: justificativaPrioridade || undefined,
        },
        token
      );
      navigate(`/solicitacoes/${nova.id}`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.errors) {
          setErros(err.errors);
        } else {
          setErroGeral(err.message);
        }
      } else {
        setErroGeral('Erro inesperado ao criar solicitação.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <Link to="/">← Voltar</Link>
      <h1>Nova Solicitação</h1>

      {erroGeral && <p className="mensagem-erro">{erroGeral}</p>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="campo">
          <label>
            Nome do solicitante:
            <input
              type="text"
              value={nomeSolicitante}
              onChange={(e) => setNomeSolicitante(e.target.value)}
              required
            />
          </label>
          {erros.nome_solicitante && (
            <p className="erro-campo">{erros.nome_solicitante[0]}</p>
          )}
        </div>

        <div className="campo">
          <label>
            Categoria:
            <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
              {CATEGORIA_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <div className="campo">
          <label>
            Prioridade:
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value as Prioridade)}>
              {PRIORIDADE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
        </div>

        {prioridade === 'URGENTE' && (
          <div className="campo">
            <label>
              Justificativa da prioridade:
              <textarea
                value={justificativaPrioridade}
                onChange={(e) => setJustificativaPrioridade(e.target.value)}
                required
              />
            </label>
            {erros.justificativa_prioridade && (
              <p className="erro-campo">{erros.justificativa_prioridade[0]}</p>
            )}
          </div>
        )}

        <div className="campo">
          <label>
            Descrição:
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </label>
          {erros.descricao && <p className="erro-campo">{erros.descricao[0]}</p>}
        </div>

        <button type="submit" disabled={enviando} className="btn-primario">
          {enviando ? 'Enviando...' : 'Criar Solicitação'}
        </button>
      </form>
    </div>
  );
}