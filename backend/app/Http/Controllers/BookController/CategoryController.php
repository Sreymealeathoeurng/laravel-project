<?php

namespace App\Http\Controllers\BookController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Book;
use App\Models\Story;
use App\Models\ReviewRating;

class CategoryController extends Controller
{
    // Get all categories with their published + public books
    public function categoriesWithPublishedBooks()
    {
        $categories = Category::whereHas('books', function ($query) {
            $query->where('is_published', true)->where('is_public', true);
        })
        ->with(['books' => function ($query) {
            $query->where('is_published', true)->where('is_public', true)->latest();
        }])
        ->get();
    
        // Transform book image to full URL
        $categories->transform(function ($category) {
            $category->books->transform(function ($book) {
                $book->image = $book->cover_image ? asset('storage/' . $book->cover_image) : null;
                return $book;
            });
            return $category;
        });
    
        return response()->json($categories);
    }
    

    // Get chapters by book slug
    public function getChaptersBySlug($slug)
    {
        Log::info("Fetching chapters for slug: " . $slug);

        $book = Book::where('slug', $slug)->first();

        if (!$book) {
            Log::warning("Book not found for slug: " . $slug);
            return response()->json([
                'message' => 'Book not found',
                'slug_received' => $slug,
                'existing_slugs' => Book::pluck('slug'),
            ], 404);
        }

        $stories = $book->stories()->with('author')->get();

        $response = [
            'id' => $book->id,
            'title' => $book->title,
            'coverImage' => $book->cover_image ? asset('storage/' . $book->cover_image) : null,
            'isPublic' => $book->is_public,
            'chapters' => $stories->map(function ($story) {
                return [
                    'id' => $story->id,
                    'title' => $story->title,
                    'content' => $story->content,
                    'updatedAt' => $story->updated_at,
                    'authorName' => $story->user->name ?? 'Unknown',
                ];
            }),
        ];

        return response()->json($response);
    }

    // Store review
  
}
