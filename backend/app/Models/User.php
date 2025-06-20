<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // ✅ Add this!
use App\Models\Book; // ✅ Required for the books() relation

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'google_id',
        'picture',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function books(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'library')
                    ->withPivot(['status', 'progress'])
                    ->withTimestamps();
    }
}
