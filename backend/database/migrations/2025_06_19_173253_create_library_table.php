<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLibraryTable extends Migration
{
    public function up()
    {
        Schema::create('library', function (Blueprint $table) {
            $table->id();

            // User who owns this library entry
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Book referenced
            $table->foreignId('book_id')->constrained()->onDelete('cascade');

            // Status: reading, favorite, saved
            $table->enum('status', ['reading', 'favorite', 'saved'])->default('reading');

            // Progress in percentage (0-100)
            $table->unsignedTinyInteger('progress')->default(0);

            $table->timestamps();

            // To prevent duplicate entries of the same book for the same user with same status
            $table->unique(['user_id', 'book_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('library');
    }
}
