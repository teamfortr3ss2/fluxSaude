<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\SolicitacaoController;
use Illuminate\Support\Facades\Route;

Route::get('health', [HealthController::class, 'check']);

Route::prefix('v1')->group(function () {
    Route::post('solicitacoes', [SolicitacaoController::class, 'store']);
    Route::get('solicitacoes', [SolicitacaoController::class, 'index']);
    Route::get('solicitacoes/resumo', [SolicitacaoController::class, 'resumo']);
    Route::get('solicitacoes/{solicitacao}', [SolicitacaoController::class, 'show']);
    Route::patch('solicitacoes/{solicitacao}/status', [SolicitacaoController::class, 'updateStatus']);
});