<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Isso aqui nao existe nao mano pode ir embora, so achei feio q retornava erro',
    ]);
});