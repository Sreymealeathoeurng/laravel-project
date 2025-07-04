<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});



// Required for Sanctum CSRF protection with SPA
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_cookie' => 'set']);
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
