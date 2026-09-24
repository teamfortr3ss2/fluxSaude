import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { solicitacoesApi, ApiRequestError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Solicitacao, Status } from '../types/solicitacao';
import './Formulario.css';

const TRANSICOES: Record<Status, Status[]> = {
  RECEBIDA: ['EM_ANALISE', 'CANCELADA'],
  EM_ANALISE: ['AGENDADA', 'CANCELADA'],
  AGENDADA: ['CONCLUIDA', 'CANCELADA'],
  CONCLUIDA: [],
  CANCELADA: [],
};

export function DetalheSolicitacao() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    if (!id) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await solicitacoesApi.obter(Number(id));
      setSolicitacao(dados);
    } catch (err) {
      setErro('Solicitação não encontrada.');
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleMudarStatus(novoStatus: Status) {
    if (!solicitacao || !token) return;
    setAtualizando(true);
    setErro(null);
    try {
      const atualizada = await solicitacoesApi.atualizarStatus(solicitacao.id, novoStatus, token);
      setSolicitacao(atualizada);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setErro(err.message);
      } else {
        setErro('Erro ao atualizar status.');
      }
    } finally {
      setAtualizando(false);
    }
  }

  if (carregando) return <p className="mensagem-carregando">Carregando...</p>;

  if (!solicitacao) {
    return (
      <div>
        <Link to="/">← Voltar</Link>
        <p className="mensagem-erro">{erro ?? 'Solicitação não encontrada.'}</p>
      </div>
    );
  }

  const proximosStatus = TRANSICOES[solicitacao.status];
  const podeAlterarStatus = user?.role === 'gestor';

  return (
    <div>
      <Link to="/">← Voltar</Link>
      <h1>Solicitação {solicitacao.protocolo}</h1>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <dl className="detalhes-lista">
        <dt>Solicitante</dt>
        <dd>{solicitacao.nome_solicitante}</dd>

        <dt>Categoria</dt>
        <dd>{solicitacao.categoria}</dd>

        <dt>Prioridade</dt>
        <dd>{solicitacao.prioridade}</dd>

        <dt>Status</dt>
        <dd><span className={`badge-status badge-${solicitacao.status}`}>{solicitacao.status}</span></dd>

        <dt>Descrição</dt>
        <dd>{solicitacao.descricao}</dd>

        {solicitacao.justificativa_prioridade && (
          <>
            <dt>Justificativa da prioridade</dt>
            <dd>{solicitacao.justificativa_prioridade}</dd>
          </>
        )}

        <dt>Criada em</dt>
        <dd>{new Date(solicitacao.data_criacao).toLocaleString('pt-BR')}</dd>

        <dt>Atualizada em</dt>
        <dd>{new Date(solicitacao.data_atualizacao).toLocaleString('pt-BR')}</dd>
      </dl>

      <div>
        <h2>Alterar status</h2>
        {!podeAlterarStatus ? (
          <p>Apenas usuários com perfil gestor podem alterar o status.</p>
        ) : proximosStatus.length === 0 ? (
          <p>Este status é final, não pode mais ser alterado.</p>
        ) : (
          <div className="acoes-status">
            {proximosStatus.map((status) => (
              <button
                key={status}
                disabled={atualizando}
                onClick={() => handleMudarStatus(status)}
                className={status === 'CANCELADA' ? 'btn-perigo' : 'btn-secundario'}
              >
                Marcar como {status}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}