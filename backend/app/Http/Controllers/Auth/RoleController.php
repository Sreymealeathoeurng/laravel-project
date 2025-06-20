<?php

namespace App\Http\Controllers\Auth;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller; // <== Make sure this is imported

class RoleController extends Controller
{
    public function saveUserRole(Request $request)
    {
        // Validate only the 'role' field
        $request->validate([
            'role' => 'required|string'
        ]);
    
        // Find user by email (no validation)
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        // Find role by name
        $role = Role::where('name', $request->role)->first();
        if (!$role) {
            return response()->json(['error' => 'Invalid role'], 400);
        }
    
        // Update user's role
        $user->role_id = $role->id;
        $user->save();
    
        return response()->json(['message' => 'Role updated successfully']);
    }
    
}
