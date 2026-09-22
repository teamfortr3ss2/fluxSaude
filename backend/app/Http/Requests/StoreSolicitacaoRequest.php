<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreSolicitacaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome_solicitante' => ['required', 'string', 'max:255'],
            'categoria' => ['required', 'in:CONSULTA,EXAME,VACINACAO,OUTRO'],
            'prioridade' => ['required', 'in:BAIXA,MEDIA,ALTA,URGENTE'],
            'descricao' => ['required', 'string'],
            'justificativa_prioridade' => ['nullable', 'string'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->input('prioridade') === 'URGENTE' && empty($this->input('justificativa_prioridade'))) {
                $validator->errors()->add(
                    'justificativa_prioridade',
                    'A justificativa de prioridade é obrigatória quando a prioridade é URGENTE.'
                );
            }
        });
    }
}