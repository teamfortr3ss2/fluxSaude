<?php

namespace Database\Factories;

use App\Models\Solicitacao;
use Illuminate\Database\Eloquent\Factories\Factory;

class SolicitacaoFactory extends Factory
{
    protected $model = Solicitacao::class;

    public function definition(): array
    {
        $prioridade = $this->faker->randomElement(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']);

        return [
            'nome_solicitante' => $this->faker->name(),
            'categoria' => $this->faker->randomElement(['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO']),
            'prioridade' => $prioridade,
            'descricao' => $this->faker->sentence(10),
            'justificativa_prioridade' => $prioridade === 'URGENTE'
                ? $this->faker->sentence(6)
                : null,
        ];
    }
}