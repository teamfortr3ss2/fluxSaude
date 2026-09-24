import type {
  Solicitacao,
  NovaSolicitacao,
  PaginatedResponse,
  Status,
  ApiError,
  Resumo,
} from '../types/solicitacao';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  proximosStatusPermitidos?: Status[];

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
    proximosStatusPermitidos?: Status[]
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.errors = errors;
    this.proximosStatusPermitidos = proximosStatusPermitidos;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body: ApiError = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new ApiRequestError(
      body.message,
      response.status,
      body.errors,
      body.proximos_status_permitidos
    );
  }
  return response.json();
}

export interface ListaFiltros {
  status?: Status;
  categoria?: string;
  prioridade?: string;
  per_page?: number;
  page?: number;
}

export const solicitacoesApi = {
  async listar(filtros: ListaFiltros = {}): Promise<PaginatedResponse<Solicitacao>> {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const response = await fetch(`${API_URL}/solicitacoes?${params.toString()}`);
    return handleResponse(response);
  },

  async obter(id: number): Promise<Solicitacao> {
    const response = await fetch(`${API_URL}/solicitacoes/${id}`);
    return handleResponse(response);
  },

  async criar(dados: NovaSolicitacao, token: string): Promise<Solicitacao> {
    const response = await fetch(`${API_URL}/solicitacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });
    return handleResponse(response);
  },

  async atualizarStatus(id: number, status: Status, token: string): Promise<Solicitacao> {
    const response = await fetch(`${API_URL}/solicitacoes/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  async resumo(): Promise<Resumo> {
    const response = await fetch(`${API_URL}/solicitacoes/resumo`);
    return handleResponse(response);
  },
};

export { ApiRequestError };