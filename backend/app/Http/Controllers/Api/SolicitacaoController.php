<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSolicitacaoRequest;
use App\Http\Requests\UpdateStatusSolicitacaoRequest;
use App\Models\Solicitacao;
use App\Services\SolicitacaoStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class SolicitacaoController extends Controller
{
    public function __construct(
        private readonly SolicitacaoStatusService $statusService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Solicitacao::query();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->filled('categoria')) {
            $query->where('categoria', $request->input('categoria'));
        }
        if ($request->filled('prioridade')) {
            $query->where('prioridade', $request->input('prioridade'));
        }

        $perPage = (int) $request->input('per_page', 15);
        $solicitacoes = $query->orderByDesc('data_criacao')->orderByDesc('id')->paginate($perPage);

        return response()->json($solicitacoes);
    }

    public function store(StoreSolicitacaoRequest $request): JsonResponse
    {
        $solicitacao = Solicitacao::create($request->validated());

        return response()->json($solicitacao, 201);
    }

    public function show(Solicitacao $solicitacao): JsonResponse
    {
        return response()->json($solicitacao);
    }

    public function updateStatus(UpdateStatusSolicitacaoRequest $request, Solicitacao $solicitacao): JsonResponse
    {
        $this->authorize('updateStatus', $solicitacao);

        try {
            $atualizada = $this->statusService->transicionar(
                $solicitacao,
                $request->validated('status')
            );

            return response()->json($atualizada);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'proximos_status_permitidos' => $this->statusService->proximosStatusPermitidos($solicitacao->status),
            ], 422);
        }
    }

        public function resumo(): JsonResponse
    {
        $porStatus = Solicitacao::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $porPrioridade = Solicitacao::query()
            ->selectRaw('prioridade, count(*) as total')
            ->groupBy('prioridade')
            ->pluck('total', 'prioridade');

        return response()->json([
            'por_status' => $porStatus,
            'por_prioridade' => $porPrioridade,
            'total' => Solicitacao::count(),
        ]);
    }
}