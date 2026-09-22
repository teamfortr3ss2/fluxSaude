<?php

namespace App\Services;

use App\Models\Solicitacao;
use InvalidArgumentException;

class SolicitacaoStatusService
{
    private const TRANSICOES_PERMITIDAS = [
        'RECEBIDA'   => ['EM_ANALISE', 'CANCELADA'],
        'EM_ANALISE' => ['AGENDADA', 'CANCELADA'],
        'AGENDADA'   => ['CONCLUIDA', 'CANCELADA'],
        'CONCLUIDA'  => [],
        'CANCELADA'  => [],
    ];

    public function transicionar(Solicitacao $solicitacao, string $novoStatus): Solicitacao
    {
        $statusAtual = $solicitacao->status;

        if (!$this->transicaoEhPermitida($statusAtual, $novoStatus)) {
            throw new InvalidArgumentException(
                "Transição de '{$statusAtual}' para '{$novoStatus}' não é permitida."
            );
        }

        $solicitacao->status = $novoStatus;
        $solicitacao->save();

        return $solicitacao->fresh();
    }

    public function transicaoEhPermitida(string $statusAtual, string $novoStatus): bool
    {
        return in_array($novoStatus, self::TRANSICOES_PERMITIDAS[$statusAtual] ?? [], true);
    }

    public function proximosStatusPermitidos(string $statusAtual): array
    {
        return self::TRANSICOES_PERMITIDAS[$statusAtual] ?? [];
    }
}