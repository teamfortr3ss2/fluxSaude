<?php

namespace Tests\Unit;

use App\Models\Solicitacao;
use App\Services\SolicitacaoStatusService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class SolicitacaoStatusServiceTest extends TestCase
{
    use RefreshDatabase;

    private SolicitacaoStatusService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SolicitacaoStatusService();
    }

    private function criarSolicitacao(string $status = 'RECEBIDA'): Solicitacao
    {
        $solicitacao = Solicitacao::create([
            'nome_solicitante' => 'Paciente Teste',
            'categoria' => 'CONSULTA',
            'prioridade' => 'BAIXA',
            'descricao' => 'Descrição de teste',
        ]);

        // O status inicial já é RECEBIDA via boot() do Model;
        // se precisarmos de outro status para o teste, forçamos aqui.
        if ($status !== 'RECEBIDA') {
            $solicitacao->status = $status;
            $solicitacao->save();
        }

        return $solicitacao;
    }

    public function test_transicao_valida_de_recebida_para_em_analise(): void
    {
        $solicitacao = $this->criarSolicitacao('RECEBIDA');

        $atualizada = $this->service->transicionar($solicitacao, 'EM_ANALISE');

        $this->assertEquals('EM_ANALISE', $atualizada->status);
        $this->assertEquals('EM_ANALISE', $solicitacao->fresh()->status);
    }

    public function test_transicao_valida_completa_do_fluxo(): void
    {
        $solicitacao = $this->criarSolicitacao('RECEBIDA');

        $this->service->transicionar($solicitacao, 'EM_ANALISE');
        $this->assertEquals('EM_ANALISE', $solicitacao->fresh()->status);

        $this->service->transicionar($solicitacao, 'AGENDADA');
        $this->assertEquals('AGENDADA', $solicitacao->fresh()->status);

        $this->service->transicionar($solicitacao, 'CONCLUIDA');
        $this->assertEquals('CONCLUIDA', $solicitacao->fresh()->status);
    }

    public function test_transicao_invalida_pulando_etapa_lanca_excecao(): void
    {
        $solicitacao = $this->criarSolicitacao('RECEBIDA');

        $this->expectException(InvalidArgumentException::class);

        // RECEBIDA -> CONCLUIDA não é permitido (deveria passar por EM_ANALISE e AGENDADA)
        $this->service->transicionar($solicitacao, 'CONCLUIDA');
    }

    public function test_status_final_concluida_nao_permite_nova_transicao(): void
    {
        $solicitacao = $this->criarSolicitacao('CONCLUIDA');

        $this->expectException(InvalidArgumentException::class);

        $this->service->transicionar($solicitacao, 'EM_ANALISE');
    }

    public function test_status_final_cancelada_nao_permite_nova_transicao(): void
    {
        $solicitacao = $this->criarSolicitacao('CANCELADA');

        $this->expectException(InvalidArgumentException::class);

        $this->service->transicionar($solicitacao, 'RECEBIDA');
    }

    public function test_proximos_status_permitidos_retorna_lista_correta(): void
    {
        $this->assertEquals(
            ['EM_ANALISE', 'CANCELADA'],
            $this->service->proximosStatusPermitidos('RECEBIDA')
        );

        $this->assertEquals([], $this->service->proximosStatusPermitidos('CONCLUIDA'));
    }
}