<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class GoogleLoginController extends Controller
{
    public function loginGoogle(Request $request)
    {
        $data = $request->validate([
            'email'   => 'required|email',
            'name'    => 'required|string',
            'id'      => 'required|string', // Google ID
            'picture' => 'nullable|url',
        ]);

        // Find existing user by google_id or email
        $user = User::where('google_id', $data['id'])
                    ->orWhere('email', $data['email'])
                    ->first();

        if (!$user) {
            // Create user
            $user = User::create([
                'name'      => $data['name'],
                'email'     => $data['email'],
                'google_id' => $data['id'],
                'picture'   => $data['picture'] ?? null,
            ]);
        } else {
            // Update user data
            $user->update([
                'name'    => $data['name'],
                'picture' => $data['picture'] ?? $user->picture,
                'google_id' => $user->google_id ?? $data['id'], // Add google_id if previously missing
            ]);
        }

        // Auto login the user
        Auth::login($user);

        // Optionally create token (if using Sanctum or Passport)
        $token = $user->createToken('auth_token')->plainTextToken ?? null;

        return response()->json([
            'message' => 'User logged in successfully.',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

  
    
}