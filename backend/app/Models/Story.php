<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    use HasFactory;

    // Specify the table name if it doesn't follow Laravel's naming convention
    protected $table = 'stories'; // Optional if the table is named 'stories'

    // Define which fields can be mass assigned
    protected $fillable = [
        'user_id',
        'book_id',
        'title',
        'content',
        'status',
        'summary',
        'notes',
        'last_saved',
    ];

    // Define relationships, if needed
    public function book()
    {
        return $this->belongsTo(Book::class); // Assuming you have a Book model
    }
    public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}


    public function author()
{
    return $this->belongsTo(User::class, 'user_id');
}
public function getReadingTimeAttribute()
{
    $words = str_word_count(strip_tags($this->content));
    return ceil($words / 200); // 200 words per minute
}

}