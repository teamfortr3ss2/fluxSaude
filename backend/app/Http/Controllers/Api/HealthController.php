<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function check(): JsonResponse
    {
        $status = 'ok';
        $database = 'ok';
        $httpStatus = 200;

        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $status = 'degraded';
            $database = 'unavailable';
            $httpStatus = 503;
        }

        return response()->json([
            'status' => $status,
            'services' => [
                'api' => 'ok',
                'database' => $database,
            ],
            'timestamp' => now()->toIso8601String(),
        ], $httpStatus);
    }
}