<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // ✅ This line is required

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('categories')->insert([
            ['name' => 'Fantasy'],
            ['name' => 'Science Fiction'],
            ['name' => 'Mystery'],
            ['name' => 'Romance'],
            ['name' => 'Historical Fiction'],
            ['name' => 'Thriller'],
            ['name' => 'Horror'],
            ['name' => 'Biography'],
        ]);
    }
}
