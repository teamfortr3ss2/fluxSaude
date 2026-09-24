<?php

namespace App\Policies;

use App\Models\Solicitacao;
use App\Models\User;

class SolicitacaoPolicy
{
    public function updateStatus(User $user, Solicitacao $solicitacao): bool
    {
        return $user->isGestor();
    }
}