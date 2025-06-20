<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cover_image',
        'title',
        'category_id',
        'description',
        'publication_date',
        'language',
        'is_published',
        'is_public',
        'slug',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stories()
    {
        return $this->hasMany(Story::class);
    }

  /*public function readers()
    {
        return $this->belongsToMany(User::class, 'book_user_library')
                    ->withPivot('status')
                    ->withTimestamps();
    }
    */  
    public function books()
{
    return $this->belongsToMany(Book::class, 'library') // or your pivot table name
                ->withPivot(['status', 'progress'])
                ->withTimestamps();
}


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($book) {
            if (empty($book->slug)) {
                $book->slug = static::generateUniqueSlug($book->title);
            }
        });

        static::updating(function ($book) {
            if (empty($book->slug)) {
                $book->slug = static::generateUniqueSlug($book->title, $book->id);
            }
        });
    }

    protected static function generateUniqueSlug($title, $ignoreId = null)
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while (
            static::where('slug', $slug)
                ->when($ignoreId !== null, function ($query) use ($ignoreId) {
                    return $query->where('id', '!=', $ignoreId);
                })
                ->exists()
        ) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}
