<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Solicitacao extends Model
{
    use HasFactory;
    protected $table = 'solicitacoes';

    protected $fillable = [
        'protocolo',
        'nome_solicitante',
        'categoria',
        'prioridade',
        'status',
        'descricao',
        'justificativa_prioridade',
    ];

    protected $casts = [
        'data_criacao' => 'datetime',
        'data_atualizacao' => 'datetime',
    ];

    // Laravel usa created_at/updated_at por padrão; aqui usamos nomes customizados
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_atualizacao';

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Solicitacao $solicitacao) {
            $solicitacao->protocolo = 'PROT-' . strtoupper(Str::random(10));
            $solicitacao->status = 'RECEBIDA';
        });
    }
}