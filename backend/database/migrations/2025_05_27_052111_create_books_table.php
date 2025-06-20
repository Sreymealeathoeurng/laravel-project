<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Author
            $table->string('cover_image')->nullable(); // Path to cover image
            $table->string('title');
            $table->string('slug')->unique()->index(); // Add index for better performance

            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null'); // Book category
            $table->text('description')->nullable();
            $table->date('publication_date')->nullable(); // Add publication date
            $table->string('language')->nullable(); // Add language
            $table->boolean('is_published')->default(false);
            $table->boolean('is_public')->default(true); 
            $table->timestamps();
        });
    
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books');
    }
}