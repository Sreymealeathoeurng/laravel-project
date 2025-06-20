<?php

namespace App\Http\Controllers\BookController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    // List all books with category and user info
    public function index()
    {
        try {
            $user = auth()->user();
            $books = Book::where('user_id', $user->id)->get();
    
            // Format each book's coverImage field
            $books = $books->map(function ($book) {
                return array_merge(
                    $book->toArray(),
                    ['coverImage' => $book->cover_image ? asset('storage/' . $book->cover_image) : null]
                );
            });
    
            return response()->json($books);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get books',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    // Store a new book
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'language' => 'nullable|string',
            'publicationDate' => 'nullable|date',
            'coverImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        try {
            $book = new Book();
            $book->title = $request->title;
            $book->description = strip_tags($request->description); // Sanitize input
            $book->category_id = $request->category_id;
            $book->language = $request->language;
            $book->publication_date = $request->publicationDate;
    
            if ($request->hasFile('coverImage')) {
                $path = $request->file('coverImage')->store('covers', 'public');
                $book->cover_image = $path;
            }
    
            $book->user_id = Auth::id(); // assign current authenticated user
            $book->save();
    
            return response()->json([
                'message' => 'Book created successfully',
                'book' => array_merge(
                    $book->toArray(),
                    ['coverImage' => $book->cover_image ? asset('storage/' . $book->cover_image) : null]
                ),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create book: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create book', 'error' => $e->getMessage()], 500);
        }
    }
    // Update book details
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $validated = $request->validate([
            'cover_image' => 'nullable|string',
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'publication_date' => 'nullable|date',
            'language' => 'nullable|string|max:50',
            'is_published' => 'boolean',
            'is_public' => 'boolean',
        ]);

        // Only assign user_id if you want to reassign the author
        $validated['user_id'] = Auth::id();

        $book->update($validated);

        return response()->json($book);
    }
    

    // Delete a book
    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();

        return response()->json(['message' => 'Book deleted successfully']);
    }

    // Publish a book (mark as published, update publication date)
    public function publish($id)
    {
        $book = Book::findOrFail($id);

        $book->is_published = true;
        $book->publication_date = now();
        $book->save();

        return response()->json([
            'message' => 'Book published successfully',
            'book' => $book,
        ]);
    }

    // Upload or update cover image


    public function uploadCover(Request $request, $id)
    {
        $request->validate([
            'cover_image' => 'required|image|max:2048',
        ]);
    
        $book = Book::findOrFail($id);
    
        if ($request->user()->id !== $book->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Delete old image if exists
        if ($book->cover_image && Storage::disk('public')->exists($book->cover_image)) {
            Storage::disk('public')->delete($book->cover_image);
        }
    
        $path = $request->file('cover_image')->store('book_covers', 'public');
        $book->cover_image = $path;
        $book->save();
    
        return response()->json(['coverImage' => asset('storage/' . $path)]);
    }
    

    // Return all published & public books (for genres or public listing)
    public function publicBooks()
    {
        $books = Book::with('category', 'user')
            ->where('is_published', true)
            ->where('is_public', true)
            ->latest()
            ->get();

        return response()->json($books);
    }

 
}
