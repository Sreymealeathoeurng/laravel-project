<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a new review.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'booking_id' => 'required|integer|exists:bookings,id', // Ensure booking exists
            'comment' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
            'service_id' => 'required|integer|exists:services,id', // Ensure service exists
        ]);

        $user = Auth::user(); // Requires Sanctum or another authentication method

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Create the review
        $review = Review::create([
            'user_id' => $user->id,
            'booking_id' => $request->booking_id,
            'comment' => $request->comment,
            'rating' => $request->rating,
            'service_id' => $request->service_id,
        ]);

        return response()->json(['message' => 'Review submitted successfully', 'review' => $review], 201);
    }

    /**
     * Get all reviews.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $reviews = Review::with(['user', 'booking', 'service'])->get();
        return response()->json($reviews);
    }

    /**
     * Show a specific review.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $review = Review::with(['user', 'booking', 'service'])->find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        return response()->json($review);
    }

    /**
     * Update a specific review.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'comment' => 'sometimes|string|max:1000',
            'rating' => 'sometimes|integer|min:1|max:5',
        ]);

        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        // Update fields if present in request
        if ($request->has('comment')) {
            $review->comment = $request->comment;
        }
        if ($request->has('rating')) {
            $review->rating = $request->rating;
        }

        $review->save();

        return response()->json(['message' => 'Review updated successfully', 'review' => $review]);
    }

    /**
     * Delete a specific review.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}