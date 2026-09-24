import type { LoginCredentials, LoginResponse, User } from '../types/auth';
import { ApiRequestError } from './api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new ApiRequestError(body.message, response.status, body.errors);
  }
  return response.json();
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  async logout(token: string): Promise<void> {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async me(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },
};