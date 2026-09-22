<?php

namespace Database\Seeders;

use App\Models\Solicitacao;
use Illuminate\Database\Seeder;

class SolicitacaoSeeder extends Seeder
{
    public function run(): void
    {
        if (Solicitacao::count() > 0) {
            $this->command?->info('Solicitações já existem, seeding ignorado.');
            return;
        }

        Solicitacao::factory()->count(15)->create();
    }
}