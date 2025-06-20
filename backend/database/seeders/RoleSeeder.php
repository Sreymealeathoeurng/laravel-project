<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role; // Ensure this import is correct

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Define the roles you want to seed
        Role::create(['name' => 'Reader']);
        Role::create(['name' => 'Author']);
        Role::create(['name' => 'admin']);
        // Add more roles as needed
    }
}