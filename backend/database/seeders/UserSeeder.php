<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        if (User::count() > 0) {
            $this->command?->info('Usuários já existem, seeding ignorado.');
            return;
        }

        User::create([
            'name' => 'Ana Gestora',
            'email' => 'gestor@fluxsaude.local',
            'password' => Hash::make('senha123'),
            'role' => 'gestor',
        ]);

        User::create([
            'name' => 'Bruno Atendente',
            'email' => 'atendente@fluxsaude.local',
            'password' => Hash::make('senha123'),
            'role' => 'atendente',
        ]);
    }
}