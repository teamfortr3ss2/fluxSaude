import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { NovaSolicitacao } from './NovaSolicitacao';

function renderComRouter() {
  return render(
    <BrowserRouter>
      <NovaSolicitacao />
    </BrowserRouter>
  );
}

describe('NovaSolicitacao', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('não mostra o campo de justificativa por padrão (prioridade BAIXA)', () => {
    renderComRouter();

    expect(screen.queryByLabelText(/justificativa da prioridade/i)).not.toBeInTheDocument();
  });

  it('mostra o campo de justificativa obrigatório ao selecionar prioridade URGENTE', async () => {
    const user = userEvent.setup();
    renderComRouter();

    const selectPrioridade = screen.getByLabelText(/^prioridade:/i);
    await user.selectOptions(selectPrioridade, 'URGENTE');

    const campoJustificativa = screen.getByLabelText(/justificativa da prioridade/i);
    expect(campoJustificativa).toBeInTheDocument();
    expect(campoJustificativa).toBeRequired();
  });

  it('esconde o campo de justificativa novamente ao trocar de volta para prioridade não-urgente', async () => {
    const user = userEvent.setup();
    renderComRouter();

    const selectPrioridade = screen.getByLabelText(/^prioridade:/i);
    await user.selectOptions(selectPrioridade, 'URGENTE');
    expect(screen.getByLabelText(/justificativa da prioridade/i)).toBeInTheDocument();

    await user.selectOptions(selectPrioridade, 'MEDIA');
    expect(screen.queryByLabelText(/justificativa da prioridade/i)).not.toBeInTheDocument();
  });
});