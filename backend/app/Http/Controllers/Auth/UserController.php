<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Ensure the user is authenticated
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Fetch user profile data
    public function profile(Request $request)
    {
        $user = $request->user(); // or Auth::user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_image' => $user->profile_image,
            'created_at' => $user->created_at,
        ]);
    }
    public function update(Request $request)
{
    $user = $request->user();

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'bio' => 'nullable|string',
    ]);

    $user->update($validatedData);

    return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
}
// In your UserController.php

public function uploadAvatar(Request $request)
{
    $user = $request->user();

    $request->validate([
        'avatar' => 'required|image|max:2048', // max 2MB
    ]);

    if ($user->profile_image) {
        Storage::delete($user->profile_image); // Delete old avatar if exists
    }

    $path = $request->file('avatar')->store('avatars');

    $user->profile_image = $path;
    $user->save();

    return response()->json(['avatar_url' => url(Storage::url($path))]);
}

public function removeAvatar(Request $request)
{
    $user = $request->user();

    if ($user->profile_image) {
        Storage::delete($user->profile_image);
        $user->profile_image = null;
        $user->save();
    }

    return response()->json(['message' => 'Avatar removed successfully']);
}


}
