<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Foreign key to the books table
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            
            // Title of the story
            $table->string('title');
            
            // Content of the story
            $table->longText('content');
            
            // Status of the story
            $table->enum('status', ['draft', 'revising', 'final'])->default('draft');
            
            // Additional fields
            $table->text('summary')->nullable();
            $table->text('notes')->nullable();
            $table->dateTime('last_saved')->nullable();

            // Timestamps for created_at and updated_at
            $table->timestamps();

            // Ensure titles are unique per book
            $table->unique(['book_id', 'title']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};