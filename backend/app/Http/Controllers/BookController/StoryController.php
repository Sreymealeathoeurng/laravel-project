<?php
namespace App\Http\Controllers\BookController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Story;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;

class StoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
   
    
// StoryController.php

public function index(Request $request)
{
    $query = Story::query();

    if ($request->has('book_id')) {
        $query->where('book_id', $request->input('book_id'));
    }

    if ($request->has('title')) {
        $query->where('title', $request->input('title'));
    }

    return response()->json($query->first());
}

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */


     public function create(Request $request)
     {
         $validated = $request->validate([
             'book_id' => 'required|exists:books,id',
             'title' => 'required|string|max:255',
             'content' => 'required|string',
             'status' => 'nullable|in:draft,revising,final',
             'summary' => 'nullable|string',
             'notes' => 'nullable|string',
             'last_saved' => 'nullable|date',
         ]);
 
         if (Story::where('book_id', $request->book_id)->where('title', $request->title)->exists()) {
             return response()->json(['message' => 'A story with this title already exists for this book.'], 422);
         }
 
         $validated['user_id'] = Auth::id();
 
         $story = Story::create($validated);
 
         return response()->json($story, 201);
     }
 
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $story = Story::with(['book', 'author'])->find($id);
    
        if (!$story) {
            return response()->json(['message' => 'Story not found'], 404);
        }
    
        return response()->json([
            'id' => $story->id,
            'title' => $story->title,
            'content' => $story->content,
            'status' => $story->status,
            'readingTime' => $story->reading_time ?? 5,
            'updatedAt' => $story->updated_at->toISOString(),
            'book' => [
                'id' => $story->book->id,
                'title' => $story->book->title,
            ],
            'authorName' => $story->author->name ?? 'Unknown',
        ]);
    }
    


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $story = Story::findOrFail($id);

        // Optional: Check if the user is authorized to update this story
        // if ($story->user_id !== auth()->id()) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'status' => 'sometimes|in:draft,revising,final',
            'summary' => 'nullable|string',
            'notes' => 'nullable|string',
            'last_saved' => 'nullable|date',
        ]);

        if ($request->has('title')) {
            if (Story::where('book_id', $story->book_id)->where('title', $request->title)->where('id', '!=', $id)->exists()) {
                return response()->json(['message' => 'Another story with this title already exists for this book.'], 422);
            }
        }

        $story->update($validated);
        return response()->json($story);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $story = Story::findOrFail($id);

        // Optional: Check if the user is authorized to delete this story
        // if ($story->user_id !== auth()->id()) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $story->delete();
        return response()->json(['message' => 'Story deleted successfully']);
    }

    public function saveDraft(Request $request, $id)
    {
        $story = Story::findOrFail($id);
        $story->update(['status' => 'draft']);
        return response()->json($story);
    }

    public function complete(Request $request, $id)
    {
        $story = Story::findOrFail($id);
        $story->update(['status' => 'final']);
        return response()->json($story);
    }

  // StoryController.php
  public function getChaptersByBook($bookId)
  {
      $chapters = Story::with(['author', 'book'])
          ->where('book_id', $bookId)
          ->get();
  
      if ($chapters->isEmpty()) {
          return response()->json(['message' => 'No chapters found for this book.'], 404);
      }
  
      $firstChapter = $chapters->first();
  
      return response()->json([
          'id' => $firstChapter->book->id,
          'title' => $firstChapter->book->title,
          'description' => $firstChapter->book->description,
          'coverImage' => $firstChapter->book->cover_image
              ? asset('storage/' . $firstChapter->book->cover_image)
              : null,
          'genre' => $firstChapter->book->genre,
          'language' => $firstChapter->book->language,
          'status' => $firstChapter->book->status,
          'isPublic' => $firstChapter->book->is_public,
          'isOwner' => auth()->check() && auth()->id() === $firstChapter->user_id,
          'authorName' => optional($firstChapter->author)->name ?? 'Unknown',
          'chapters' => $chapters->map(function ($chapter) {
              return [
                  'id' => $chapter->id,
                  'title' => $chapter->title,
                  'content' => $chapter->content,
                  'status' => $chapter->status,
                  'readingTime' => $chapter->reading_time ?? 5,
                  'updatedAt' => $chapter->updated_at->toISOString(),
                  'authorName' => optional($chapter->author)->name ?? 'Unknown',
              ];
          }),
      ]);
  }
  


  

}