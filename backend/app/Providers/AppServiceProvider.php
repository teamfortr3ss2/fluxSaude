<?php

namespace App\Providers;

use App\Models\Solicitacao;
use App\Policies\SolicitacaoPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Solicitacao::class, SolicitacaoPolicy::class);
    }
}