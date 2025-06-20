<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Book; // Make sure to import the Book model

class Category extends Model
{
    protected $fillable = ['name']; // or any fields you use

    // A category has many books
    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
