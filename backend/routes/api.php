<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\GoogleLoginController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\BookController\BookController;
use App\Http\Controllers\BookController\StoryController;
use App\Http\Controllers\BookController\CategoryController;
use App\Http\Controllers\BookController\LibraryController;
use App\Http\Controllers\ReviewController;



/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/google-login', [GoogleLoginController::class, 'googleLogin']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/signup', [RegisterController::class, 'signup']);
Route::post('/logout', [RegisterController::class, 'logout']);

// Public book & category routes
Route::get('/books/public', [BookController::class, 'publicBooks']);
Route::get('/books/{bookId}/chapters', [StoryController::class, 'getChaptersByBook']);
Route::get('/books/title/{slug}/stories', [CategoryController::class, 'getChaptersBySlug']);
Route::get('/categories/published-books', [CategoryController::class, 'categoriesWithPublishedBooks']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/{id}', [ReviewController::class, 'show']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Protected Routes (auth:sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // User Profile
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::post('/profile/avatar', [UserController::class, 'uploadAvatar']);
    Route::delete('/profile/avatar', [UserController::class, 'removeAvatar']);

    // Book Management
    Route::prefix('books')->group(function () {
        Route::get('/', [BookController::class, 'index']);
        Route::post('/', [BookController::class, 'store']);
        Route::get('/{id}', [BookController::class, 'show']);
        Route::put('/{id}', [BookController::class, 'update']);
        Route::delete('/{id}', [BookController::class, 'destroy']);
        Route::put('/{id}/publish', [BookController::class, 'publish']);
        Route::post('/{id}/upload-cover', [BookController::class, 'uploadCover']);
        Route::get('/{id}/stories', [StoryController::class, 'getStoriesByBook']);
    });
    

    // Story / Chapter Management
    Route::prefix('stories')->group(function () {
        Route::get('/', [StoryController::class, 'index']);
        Route::post('/', [StoryController::class, 'create']);
        Route::get('/{id}', [StoryController::class, 'show']);
        Route::put('/{id}', [StoryController::class, 'update']);
        Route::delete('/{id}', [StoryController::class, 'destroy']);
        Route::patch('/{id}/draft', [StoryController::class, 'saveDraft']);
        Route::patch('/{id}/complete', [StoryController::class, 'complete']);
    });

    // Library Management
    Route::get('/library', [LibraryController::class, 'index']);
    Route::post('/library/save', [LibraryController::class, 'save']);
    Route::delete('/library/remove', [LibraryController::class, 'remove']);
    Route::post('/library/progress', [LibraryController::class, 'updateProgress']);

   
});