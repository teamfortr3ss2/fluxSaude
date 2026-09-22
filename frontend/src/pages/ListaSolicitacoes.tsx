import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitacoesApi } from '../services/api';
import type { Solicitacao, Status, Categoria, Prioridade } from '../types/solicitacao';
import './ListaSolicitacoes.css';
import { ResumoSolicitacoes } from '../components/ResumoSolicitacoes';

const STATUS_OPTIONS: Status[] = ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'];
const CATEGORIA_OPTIONS: Categoria[] = ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO'];
const PRIORIDADE_OPTIONS: Prioridade[] = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

export function ListaSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [filtroStatus, setFiltroStatus] = useState<Status | ''>('');
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | ''>('');
  const [filtroPrioridade, setFiltroPrioridade] = useState<Prioridade | ''>('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const resposta = await solicitacoesApi.listar({
          status: filtroStatus || undefined,
          categoria: filtroCategoria || undefined,
          prioridade: filtroPrioridade || undefined,
          page: pagina,
          per_page: 10,
        });
        setSolicitacoes(resposta.data);
        setTotalPaginas(resposta.last_page);
      } catch (err) {
        setErro('Não foi possível carregar as solicitações.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [filtroStatus, filtroCategoria, filtroPrioridade, pagina]);

  return (
    <div>
      <ResumoSolicitacoes />
      <div className="lista-header">
        <h1>Solicitações de Atendimento</h1>
        <Link to="/solicitacoes/nova" className="btn-nova">+ Nova Solicitação</Link>
      </div>

      <div className="filtros">
        <label>
          Status:
          <select
            value={filtroStatus}
            onChange={(e) => { setFiltroStatus(e.target.value as Status | ''); setPagina(1); }}
          >
            <option value="">Todos</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label>
          Categoria:
          <select
            value={filtroCategoria}
            onChange={(e) => { setFiltroCategoria(e.target.value as Categoria | ''); setPagina(1); }}
          >
            <option value="">Todas</option>
            {CATEGORIA_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Prioridade:
          <select
            value={filtroPrioridade}
            onChange={(e) => { setFiltroPrioridade(e.target.value as Prioridade | ''); setPagina(1); }}
          >
            <option value="">Todas</option>
            {PRIORIDADE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>

      {carregando && <p className="mensagem-carregando">Carregando...</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {!carregando && !erro && solicitacoes.length === 0 && (
        <p className="mensagem-vazio">Nenhuma solicitação encontrada.</p>
      )}

      {!carregando && !erro && solicitacoes.length > 0 && (
        <div className="tabela-wrapper">
          <table className="tabela-solicitacoes">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Solicitante</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((s) => (
                <tr key={s.id}>
                  <td>{s.protocolo}</td>
                  <td>{s.nome_solicitante}</td>
                  <td>{s.categoria}</td>
                  <td>{s.prioridade}</td>
                  <td><span className={`badge-status badge-${s.status}`}>{s.status}</span></td>
                  <td><Link to={`/solicitacoes/${s.id}`}>Ver detalhes</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="paginacao">
        <button disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>Anterior</button>
        <span>Página {pagina} de {totalPaginas}</span>
        <button disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)}>Próxima</button>
      </div>
    </div>
  );
}