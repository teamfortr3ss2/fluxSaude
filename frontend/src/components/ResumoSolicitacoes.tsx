import { useEffect, useState } from 'react';
import { solicitacoesApi } from '../services/api';
import type { Resumo, Status } from '../types/solicitacao';
import './ResumoSolicitacoes.css';

const STATUS_LABELS: Record<Status, string> = {
  RECEBIDA: 'Recebidas',
  EM_ANALISE: 'Em análise',
  AGENDADA: 'Agendadas',
  CONCLUIDA: 'Concluídas',
  CANCELADA: 'Canceladas',
};

const STATUS_ORDEM: Status[] = ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'];

export function ResumoSolicitacoes() {
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await solicitacoesApi.resumo();
        setResumo(dados);
      } catch {
        // Resumo é informativo; se falhar, a tela principal (lista) ainda funciona.
        setResumo(null);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando || !resumo) return null;

  return (
    <div className="resumo-container">
      <div className="resumo-card resumo-total">
        <span className="resumo-numero">{resumo.total}</span>
        <span className="resumo-label">Total de solicitações</span>
      </div>

      {STATUS_ORDEM.map((status) => (
        <div key={status} className={`resumo-card resumo-${status}`}>
          <span className="resumo-numero">{resumo.por_status[status] ?? 0}</span>
          <span className="resumo-label">{STATUS_LABELS[status]}</span>
        </div>
      ))}
    </div>
  );
}