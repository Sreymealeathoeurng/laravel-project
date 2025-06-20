<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Episode extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'story_episode',   // use snake_case matching DB column!
        'status',
        'pov',
        'mood',
        'summary',
        'notes',
        'last_saved',      // snake_case
    ];
    
    
}
