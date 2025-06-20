<?php

namespace App\Http\Controllers\BookController;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Book;    // Your Book model
use App\Models\User;    // Your User model
use Illuminate\Validation\Rule;

class LibraryController extends Controller
{
    // Get all books in user's library
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Load books with pivot info for this user
        $libraryBooks = $user->books()->withPivot('status', 'progress')->get();

        return response()->json($libraryBooks);
    }

    // Add or update a book in library
    public function save(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'action'  => ['required', Rule::in(['reading', 'favorite', 'saved'])],
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        // Attach or update pivot
        $user->books()->syncWithoutDetaching([
            $validated['book_id'] => [
                'status' => $validated['action'],
                'progress' => $validated['progress'] ?? 0,
            ],
        ]);

        return response()->json(['message' => 'Book saved/updated successfully']);
    }

    // Remove book from library (any status)
    public function remove(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $request->validate(['book_id' => 'required|exists:books,id']);

        // Detach book entirely
        $user->books()->detach($request->book_id);

        return response()->json(['message' => 'Book removed from library']);
    }

    // Optionally update progress only
    public function updateProgress(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'progress' => 'required|integer|min:0|max:100',
        ]);

        // Update progress for the pivot entry
        $user->books()->updateExistingPivot($validated['book_id'], [
            'progress' => $validated['progress'],
        ]);

        return response()->json(['message' => 'Progress updated']);
    }
}
